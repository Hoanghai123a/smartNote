import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/Style/all.css";
import Login_index from "./pages/login";
import SignUp_index from "./pages/sing_up";
import App_router from "./router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App_router />
  </StrictMode>
);
