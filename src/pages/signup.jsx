import React, { useState } from "react";
import { FaUser, FaLock, FaPhone, FaStore } from "react-icons/fa";
import { DownOutlined } from "@ant-design/icons";
import api from "../assets/Components/api";
import { Button, message } from "antd";

const Signup_index = () => {
  const [expandStore, setExpandStore] = useState(false);
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // các field bổ sung
  const [fullname, setFullname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [storeName, setStoreName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      return message.warning("Vui lòng nhập tên đăng nhập và mật khẩu");
    }
    if (password !== confirm) {
      return message.error("Mật khẩu nhập lại không khớp");
    }

    await submitData();
  };

  const submitData = async () => {
    setLoading(true);
    try {
      const body = {
        username,
        password,
        isStore: expandStore,
      };

      if (expandStore) {
        body.thongtinthem = JSON.stringify({
          loaitaikhoan: "cửa hàng",
          fullname,
          birthday,
          storeName,
          address,
          phone,
        });
      }

      const res = await api.post("/register/", body);

      message.success("Đăng ký thành công!");
      console.log("Kết quả đăng ký:", res.data);

      // Sau khi đăng ký thành công có thể reset form
      setUsername("");
      setPassword("");
      setConfirm("");
      setFullname("");
      setBirthday("");
      setStoreName("");
      setAddress("");
      setPhone("");
      setExpandStore(false);
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      message.error("Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] bg-white overflow-y-auto">
      <div className="flex flex-col items-center gap-1 fadeInTop">
        <div className="flex font-[500] text-[28px] pb-1 mt-6 justify-center">
          Đăng ký tài khoản
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 py-8 max-w-[80vw] w-[80vw]"
        >
          {/* Username */}
          <div className="flex items-center gap-1 font-[500]">
            Tên đăng nhập
          </div>
          <div className="flex relative items-center w-full">
            <FaUser className="absolute left-4 text-[#c4c4c4]" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
              <div className="flex items-center gap-1 font-[500] mt-2">
                Tên đầy đủ
              </div>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="border-1 w-full !border-[#dbdbdb] rounded-[8px] !py-3 px-3 outline-none shadow"
                placeholder="Nhập tên đầy đủ của bạn"
              />

              <div className="flex items-center gap-1 font-[500] mt-2">
                Ngày tháng năm sinh
              </div>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="border-1 w-full !border-[#dbdbdb] rounded-[8px] !py-3 px-3 outline-none shadow"
              />

              <div className="flex items-center gap-1 font-[500]">
                Tên cửa hàng
              </div>
              <div className="flex relative items-center w-full">
                <FaStore className="absolute left-4 text-[#c4c4c4]" />
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="border-1 w-full !pl-10 !border-[#dbdbdb] rounded-[8px] !py-3 outline-none shadow"
                  placeholder="Tên cửa hàng của bạn"
                />
              </div>

              <div className="flex items-center gap-1 font-[500]">Địa điểm</div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border-1 w-full !border-[#dbdbdb] rounded-[8px] !py-3 px-3 outline-none shadow"
                placeholder="Địa chỉ cửa hàng"
              />

              <div className="flex items-center gap-1 font-[500]">
                Số điện thoại
              </div>
              <div className="flex relative items-center w-full">
                <FaPhone className="absolute left-4 text-[#c4c4c4]" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border-1 w-full !pl-10 !border-[#dbdbdb] rounded-[8px] !py-3 outline-none shadow"
                  placeholder="Số điện thoại liên hệ"
                />
              </div>
            </div>
          )}

          <Button
            type="primary"
            htmlType="submit"
            loading={loading} // antd sẽ tự disable + hiển thị spinner
            className="bg-[#0180f6] text-white font-[500] rounded-[8px] py-4 mt-5 shadow hover:bg-[#026cd1]"
          >
            Đăng ký
          </Button>

          <div className="flex flex-col gap-1 text-center mt-3 text-[#999]">
            Đã có tài khoản?
            <a href="/login" className="text-[#0180f6]">
              Đăng nhập
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup_index;
