import { Outlet, NavLink } from "react-router-dom";
import React from "react";

const MyPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Outlet />
      <div className="flex-1 bg-gray-100 overflow-auto"></div>

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
            Tổng quan
          </NavLink>
          <NavLink
            to="/detail"
            className={({ isActive }) =>
              `menuitem px-4 py-2 rounded-md ${
                isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            Danh sách chi tiết
          </NavLink>
          <NavLink
            to="/notes"
            className={({ isActive }) =>
              `menuitem px-4 py-2 rounded-md ${
                isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            Ghi chú
          </NavLink>
          <NavLink
            to="/info"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md ${
                isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            Thông tin
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
