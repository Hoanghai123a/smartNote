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
      <div className="flex flex-col bg-[#999] fixed w-full h-full"></div>
    </div>
  );
};

export default Home;
