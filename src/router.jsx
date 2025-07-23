import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages";
import Login_index from "./pages/login";
import SignUp_index from "./pages/sing_up";
import Info_page from "./pages/page/info";

const App_router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Home />}>
          <Route path="/info" element={<Info_page />} />
          <Route path="/info/:id_nguoidung" element={<Info_page />} />
        </Route>
        <Route path="/login" element={<Login_index />}></Route>
        <Route path="/signup" element={<SignUp_index />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App_router;
