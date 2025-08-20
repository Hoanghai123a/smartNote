import { Outlet, NavLink } from "react-router-dom";
import React from "react";
import { HiHome } from "react-icons/hi";
import { FaRegNoteSticky } from "react-icons/fa6";
import { IoInformationCircle, IoList } from "react-icons/io5";

const MyPage = () => {
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
            <HiHome />
          </NavLink>
          <NavLink
            to="/detail"
            className={({ isActive }) =>
              `menuitem px-4 py-2 rounded-md ${
                isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <IoList />
          </NavLink>
          <NavLink
            to="/notes"
            className={({ isActive }) =>
              `menuitem px-4 py-2 rounded-md w-10 h-10 flex items-center justify-center ${
                isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <FaRegNoteSticky size={18} />
          </NavLink>
          <NavLink
            to="/info"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md ${
                isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <IoInformationCircle />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
