import { Outlet, NavLink, useNavigate } from "react-router-dom";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { HiHome } from "react-icons/hi";
import "antd/dist/reset.css";
import { FaUserLarge } from "react-icons/fa6";
import { IoInformationCircle, IoList } from "react-icons/io5";
import api from "../assets/Components/api";
import { useUser } from "../stores/UserContext";
import { useLocation } from "react-router-dom";
import { Spin } from "antd";

const Home = () => {
  const nav = useNavigate();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);

  const { pathname } = useLocation();
  const mountedRef = useRef(true);

  // Lấy cookie theo tên
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // Gom hàm check token + load dữ liệu
  const checkApi = async () => {
    setLoading(true);
    try {
      const token = getCookie("token");
      if (!token) {
        console.warn("Không tìm thấy token");
        nav("/login", { replace: true });
        return;
      }

      // 1) Lấy user
      const me = await api.get(`/user`, token);
      // 2) Lấy dữ liệu song song
      const [notesRes, khRes, groupRes] = await Promise.all([
        api.get(`/notes/?page_size=99999`, token),
        api.get(`/khachhang/`, token),
        api.get(`/loaighichu/`, token),
      ]);

      // 3) Cập nhật state một lần
      if (mountedRef.current) {
        setUser((old) => ({
          ...old,
          ...me,
          token,
          danhsachNote: notesRes?.results || [],
          danhsachKH: khRes?.results || [],
          danhsachGroup: groupRes?.results || [],
        }));
        console.log(user);
      }
    } catch (e) {
      console.error("checkApi error:", e);
    } finally {
      mountedRef.current && setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    checkApi();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-gray-100 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spin size="large" tip="">
              <div style={{ minHeight: 100 }} />
            </Spin>
          </div>
        ) : (
          <Outlet />
        )}
      </div>

      {/* Thanh menu cố định đáy mà không che nội dung */}
      <div className="sticky bottom-0 w-full border-t bg-white p-3 shadow-md">
        <div className="flex justify-around items-center gap-6">
          <NavLink
            to="/overview"
            className={({ isActive }) =>
              `menuitem px-4 py-2 rounded-md flex items-center justify-center ${
                isActive || pathname === "/"
                  ? "bg-blue-500 !text-white"
                  : "hover:bg-gray-200 text-gray-700"
              }`
            }
          >
            <HiHome className="w-6 h-6 text-inherit" />
          </NavLink>
          <NavLink
            to="/detail"
            className={({ isActive }) =>
              `menuitem px-4 py-2 rounded-md ${
                isActive ? "bg-blue-500 !text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <IoList className="w-6 h-6" />
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md ${
                isActive ? "bg-blue-500 !text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <FaUserLarge className="w-5 h-5" />
          </NavLink>
          <NavLink
            to="/info"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md ${
                isActive ? "bg-blue-500 !text-white" : "hover:bg-gray-200"
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
