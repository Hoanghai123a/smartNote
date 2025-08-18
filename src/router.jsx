import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login_index from "./pages/login";
import Signup_index from "./pages/signup";
import MyHome from "./pages/myindex";
import Notes from "./pages/page/notes";
import Overview from "./pages/page/overview";
import Info from "./pages/page/info";
import DetailList from "./pages/page/detail";
import MyPage from "./pages/myindex";

const App_router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MyPage />}>
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="detail" element={<DetailList />} />
          <Route path="notes" element={<Notes />} />
          <Route path="info" element={<Info />} />
        </Route>

        <Route path="/login" element={<Login_index />}></Route>
        <Route path="/signup" element={<Signup_index />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App_router;
