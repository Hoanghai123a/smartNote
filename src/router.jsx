import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages";
import Login_index from "./pages/login";
import Info_page from "./pages/page/info";
import Signup_index from "./pages/signup";

const App_router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Home />}></Route>
        <Route path="/login" element={<Login_index />}></Route>
        <Route path="/signup" element={<Signup_index />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App_router;
