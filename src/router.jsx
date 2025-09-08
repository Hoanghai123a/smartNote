import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login_index from "./pages/login";
import Signup_index from "./pages/signup";
import Overview from "./pages/page/overview";
import Info from "./pages/page/info";
import DetailList from "./pages/page/detail";
import Home from "./pages/index";
import Test from "./pages/test";

const App_router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="detail" element={<DetailList />} />
          <Route path="info" element={<Info />} />
          <Route path="test" element={<Test />} />
        </Route>

        <Route path="/login" element={<Login_index />}></Route>
        <Route path="/signup" element={<Signup_index />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App_router;
