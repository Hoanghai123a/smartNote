import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/Style/all.css";
import App_router from "./router";
import { DataProvider } from "./stores/dataContext";
import { UserProvider } from "./stores/userContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DataProvider>
      <UserProvider>
        <App_router />
      </UserProvider>
    </DataProvider>
  </StrictMode>
);
