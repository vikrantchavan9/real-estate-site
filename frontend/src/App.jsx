import PropTypes from "prop-types";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import {
  useUser,
  RedirectToSignIn,
  SignInButton,
  SignOutButton,
} from "@clerk/clerk-react";

// Import your pages
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Login from "./pages/Login";
import Register from "./pages/Signup"; // Ensure correct path
import PropertyList from "./components/PropertyList";

// ProtectedRoute: Only renders children if user is signed in; otherwise, redirects to sign-in.
const ProtectedRoute = ({ children }) => {
  const { isSignedIn } = useUser();
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// AdminRoute: Only renders children if user is signed in and has "admin" role.
const AdminRoute = ({ children }) => {
  const { isSignedIn, user } = useUser();
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }
  // Check admin role in publicMetadata. Adjust according to how you've stored your role.
  if (user?.publicMetadata?.role !== "admin") {
    return <Navigate to="/" />;
  }
  return children;
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const Homepage = () => {
  const { isSignedIn, user } = useUser();
  return (
    <div className="p-5 text-center">
      <h1 className="text-2xl">
        Welcome {isSignedIn ? user.firstName : "Guest"}
      </h1>
      {isSignedIn ? <SignOutButton /> : <SignInButton />}
      <PropertyList />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* Login and Register pages are accessible publicly */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Catch-all route: redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
