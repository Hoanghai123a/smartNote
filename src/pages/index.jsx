import { Outlet, NavLink, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { HiHome } from "react-icons/hi";
import "antd/dist/reset.css";
import { FaRegNoteSticky } from "react-icons/fa6";
import { IoInformationCircle, IoList } from "react-icons/io5";
import api from "../assets/Components/api";
import { useUser } from "../stores/userContext";

const Home = () => {
  const nav = useNavigate();
  const { user, setUser } = useUser();
  // Hàm lấy cookie theo tên
  const getCookie = (token) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${token}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // Hàm check token
  const checkApi = () => {
    const token = getCookie("token");
    if (!token) {
      console.warn("Không tìm thấy token");
      nav(`/login`);
      return null;
    }
    api.get(`/user`, token).then((respon) => {
      console.log(respon);
      respon.token = token;
      setUser(respon);
    });
    console.log(token);
  };
  useEffect(() => {
    checkApi();
  }, []);
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 bg-gray-100 overflow-hidden">
        <Outlet />
      </div>

      {/* Menu */}
      <div className="shadow-md border-t bg-white p-3">
        <div className="flex justify-around items-center gap-6">
          <NavLink
            to="/overview"
            className={({ isActive }) =>
              `menuitem px-4 py-2 rounded-md ${
                isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <HiHome className="w-6 h-6" />
          </NavLink>
          <NavLink
            to="/detail"
            className={({ isActive }) =>
              `menuitem px-4 py-2 rounded-md ${
                isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <IoList className="w-6 h-6" />
          </NavLink>
          <NavLink
            to="/info"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md ${
                isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <IoInformationCircle className="w-6 h-6" />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Home;
