import React, { useEffect } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

const Home = () => {
  const { id_nguoidung } = useParams();
  const navigate = useNavigate();
  const handleClick = () => {
    // xử lý api đăng nhập
    navigate("/");
  };
  useEffect(() => {
    console.log(id_nguoidung);
  }, [id_nguoidung]);
  return (
    <div className="homepage">
      <div className="top-nav">
        <Link to="/info">Info</Link>
        <Link to="/info/hung">Hung</Link>
        <Link to="/info/hai">Hải</Link>
        <div className="a" onClick={handleClick}>
          Hoàng
        </div>
      </div>
      <div className="body">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
