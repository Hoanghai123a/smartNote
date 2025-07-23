import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/Style/all.css";
import Login_index from "./pages/login";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SignUp_index />
    <Login_index />
  </StrictMode>
);
