import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Ensure the script runs after the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    console.error(
      "Root element not found. Make sure index.html has <div id='root'></div>"
    );
    return;
  }

  ReactDOM.createRoot(rootElement).render(
    <ClerkProvider publishableKey={clerkKey}>
      <App />
    </ClerkProvider>
  );
});
