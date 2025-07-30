import React, { useEffect, useState } from "react";
import { useUser } from "../stores/UserContext";
import api from "../assets/Components/api";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import { CiStickyNote } from "react-icons/ci";
import { RiGeminiFill } from "react-icons/ri";
import { FaNoteSticky } from "react-icons/fa6";

const Home = () => {
  const { user, setUser } = useUser();
  const [checkauthfade, setCheckauthfade] = useState(false);
  const [checkauth, setCheckauth] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const token = api.getCookie("token");
    if (token) {
      console.log("Có token:", token);
      api
        .get("/user/", token)
        .then(async (res) => {
          if (!res?.id) navigate("/login");
          setTimeout(() => {
            setCheckauthfade(true);
            setTimeout(() => {
              setCheckauth(false);
            }, 400);
          }, 600);
        })
        .catch((error) => {
          message.error("Lấy dữ liệu người dùng thất bại!");
          console.log(error);
          navigate("/login");
        });
    } else {
      console.log("Không tìm thấy token!");
      navigate("/login");
    }
  }, []);
  return (
    <div className="flex flex-col">
      <div className="flex justify-between mb-3 items-center p-3 shadow rounded-[10px] gap-1 text-[#0180f6] font-[500]">
        <div className="flex gap-1">
          <FaNoteSticky size={24} /> SmartNotes
        </div>
        <div
          className="flex items-center justify-center text-[14px] font-[500] text-[#0180f6] cursor-pointer"
          onClick={() => {
            api.removeCookie("token");
            setUser(null);
            navigate("/login");
          }}
        >
          Đăng xuất
        </div>
      </div>
      <div className="main-body p-5 text-center fadeInTop">Trang chủ</div>
    </div>
  );
};
export default Home;
