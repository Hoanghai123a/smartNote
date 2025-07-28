import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/Style/all.css";
import Login_index from "./pages/login";
import SignUp_index from "./pages/signup";
import App_router from "./router";
import { UserProvider } from "./stores/UserContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <App_router />
    </UserProvider>
  </StrictMode>
);
