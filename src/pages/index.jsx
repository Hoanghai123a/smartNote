import { Outlet, NavLink } from "react-router-dom";
import React from "react";
import { HiHome } from "react-icons/hi";
import "antd/dist/reset.css";
import { FaRegNoteSticky } from "react-icons/fa6";
import { IoInformationCircle, IoList } from "react-icons/io5";

const Home = () => {
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
