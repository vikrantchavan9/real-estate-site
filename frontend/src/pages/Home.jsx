import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

const Dashboard = () => {
  return (
    <div className="p-5 text-center">
      <SignedIn>
        <h1 className="text-2xl">Welcome to the Dashboard</h1>
      </SignedIn>
      <SignedOut>
        <p>You need to log in first.</p>
        <SignInButton />
      </SignedOut>
    </div>
  );
};

export default Dashboard;
