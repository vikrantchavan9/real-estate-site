import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";

// Import components
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  const [user, setUser] = useState(null);
  const handleLogin = (userData) => {
    setUser(userData);
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/user");
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/customer"
          element={user ? <CustomerDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={
            user?.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* 404 Page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
