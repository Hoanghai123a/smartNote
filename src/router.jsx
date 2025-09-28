import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login_index from "./pages/login";
import Signup_index from "./pages/signup";
import Overview from "./pages/page/overview";
import Home from "./pages/index";
import DetailPage from "./pages/page/detail_page.jsx";

const App_router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Overview />} />
        </Route>

        <Route path="/login" element={<Login_index />}></Route>
        <Route path="/signup" element={<Signup_index />}></Route>
        <Route path="/detail/:id" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App_router;
