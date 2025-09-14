import React, { useState } from "react";
import { FaUser, FaLock, FaPhone, FaStore } from "react-icons/fa";
import { DownOutlined } from "@ant-design/icons";

const Signup_index = () => {
  const [expandStore, setExpandStore] = useState(false);

  return (
    <div className="min-h-[100vh] bg-white overflow-y-auto">
      <div className="flex flex-col items-center gap-1 fadeInTop">
        {/* Title */}
        <div className="flex font-[500] text-[28px] pb-1 mt-6 justify-center">
          Đăng ký tài khoản
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3 py-8 max-w-[80vw] w-[80vw]">
          {/* Username */}
          <div className="flex items-center gap-1 font-[500]">
            Tên đăng nhập
          </div>
          <div className="flex relative items-center w-full">
            <FaUser className="absolute left-4 text-[#c4c4c4]" />
            <input
              type="text"
              className="border-1 w-full !pl-10 !border-[#dbdbdb] rounded-[8px] !py-3 outline-none shadow"
              placeholder="Nhập tên đăng nhập"
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-1 font-[500] mt-2">
            Mật khẩu
          </div>
          <div className="flex relative items-center w-full">
            <FaLock className="absolute left-4 text-[#c4c4c4]" />
            <input
              type="password"
              className="border-1 w-full !pl-10 !border-[#dbdbdb] rounded-[8px] !py-3 outline-none shadow"
              placeholder="Nhập mật khẩu"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex items-center gap-1 font-[500] mt-2">
            Nhập lại mật khẩu
          </div>
          <div className="flex relative items-center w-full">
            <FaLock className="absolute left-4 text-[#c4c4c4]" />
            <input
              type="password"
              className="border-1 w-full !pl-10 !border-[#dbdbdb] rounded-[8px] !py-3 outline-none shadow"
              placeholder="Nhập lại mật khẩu"
            />
          </div>

          {/* Toggle Cửa hàng */}
          <div
            className="flex items-center text-gray-400 gap-2 justify-end cursor-pointer mt-2"
            onClick={() => setExpandStore(!expandStore)}
          >
            <span className="text-sm">Tùy chọn cửa hàng</span>
            <DownOutlined
              className={`text-xs transition-transform ${
                expandStore ? "rotate-180" : ""
              }`}
            />
          </div>

          {expandStore && (
            <div className="flex flex-col gap-2 mt-2">
              {/* Full name */}
              <div className="flex items-center gap-1 font-[500] mt-2">
                Tên đầy đủ
              </div>
              <input
                type="text"
                className="border-1 w-full !border-[#dbdbdb] rounded-[8px] !py-3 px-3 outline-none shadow"
                placeholder="Nhập tên đầy đủ của bạn"
              />

              {/* Ngày sinh */}
              <div className="flex items-center gap-1 font-[500] mt-2">
                Ngày tháng năm sinh
              </div>
              <input
                type="date"
                className="border-1 w-full !border-[#dbdbdb] rounded-[8px] !py-3 px-3 outline-none shadow"
              />
              {/* Store Name */}
              <div className="flex items-center gap-1 font-[500]">
                Tên cửa hàng
              </div>
              <div className="flex relative items-center w-full">
                <FaStore className="absolute left-4 text-[#c4c4c4]" />
                <input
                  type="text"
                  className="border-1 w-full !pl-10 !border-[#dbdbdb] rounded-[8px] !py-3 outline-none shadow"
                  placeholder="Tên cửa hàng của bạn"
                />
              </div>

              {/* Location */}
              <div className="flex items-center gap-1 font-[500]">Địa điểm</div>
              <input
                type="text"
                className="border-1 w-full !border-[#dbdbdb] rounded-[8px] !py-3 px-3 outline-none shadow"
                placeholder="Địa chỉ cửa hàng"
              />

              {/* Phone */}
              <div className="flex items-center gap-1 font-[500]">
                Số điện thoại
              </div>
              <div className="flex relative items-center w-full">
                <FaPhone className="absolute left-4 text-[#c4c4c4]" />
                <input
                  type="tel"
                  className="border-1 w-full !pl-10 !border-[#dbdbdb] rounded-[8px] !py-3 outline-none shadow"
                  placeholder="Số điện thoại liên hệ"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <button className="bg-[#0180f6] text-white font-[500] rounded-[8px] py-4 mt-5 shadow hover:bg-[#026cd1] transition">
            Đăng ký
          </button>

          <div className="flex flex-col gap-1 text-center mt-3 text-[#999]">
            Đã có tài khoản?
            <a href="/login" className="text-[#0180f6]">
              Đăng nhập
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup_index;
