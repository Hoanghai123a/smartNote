import { Button } from "antd";
import React, { useState } from "react";
import { CiStickyNote } from "react-icons/ci";
import { FaLock, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../assets/Components/api";
import { useUser } from "../stores/UserContext";

const Login_index = () => {
  const [inputdata, setInputdata] = useState({
    username: "",
    password: "",
  });
  const { user, setUser } = useUser();
  const passwordRef = React.useRef(null);
  const handleLogin = async () => {
    api
      .post(`/login/`, {
        username: inputdata.username,
        password: inputdata.password,
      })
      .then((res) => {
        api.setCookie("token", res.token, res.expires);
        setUser(res);
        window.location.href = "/";
      })
      .catch((e) => {
        api.error(e);
      });
  };
  return (
    <div className="min-h-[100vh] bg-white overflow-y-auto">
      <div className="flex flex-col items-center gap-1 fadeInTop">
        <div className="flex w-[90vw] justify-between mb-3 items-center p-3 shadow rounded-[10px] gap-1 text-[#0180f6] font-[500]">
          <CiStickyNote size={50} />
          <div className="flex flex-col items-end">
            <div className="flex text-[22px]">SmartNotes</div>
            <div className="flex">Sổ tay thông minh 4.0</div>
          </div>
        </div>
        <div className="flex font-[500] text-[28px] pb-1 mt-5">Hello!</div>
        <div className="flex text-[16px] justify-center whitespace-nowrap  relative">
          <div className="block w-full typewriter">
            Chào mừng bạn quay trở lại!
          </div>
        </div>
        <div className="flex flex-col gap-1 py-8 max-w-[80vw] w-[80vw]">
          <div className="flex items-center gap-1 font-[500]">Tài khoản</div>
          <div className="flex relative items-center w-full">
            <FaUser className="absolute left-4 text-[#c4c4c4]" />
            <input
              type="text"
              className="border-1 w-full !pl-10 !border-[#dbdbdb] rounded-[8px] !py-3 outline-none shadow"
              placeholder="Tên đăng nhập"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  passwordRef.current.focus();
                }
              }}
              value={inputdata.username}
              onChange={(e) => {
                setInputdata({ ...inputdata, username: e.target.value });
              }}
            />
          </div>
          <div className="flex items-center gap-1 font-[500] mt-2">
            Mật khẩu
          </div>
          <div className="flex relative items-center w-full">
            <FaLock className="absolute left-4 text-[#c4c4c4]" />
            <input
              ref={passwordRef}
              type="password"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
              value={inputdata.password}
              onChange={(e) => {
                setInputdata({ ...inputdata, password: e.target.value });
              }}
              className="border-1 w-full !pl-10 !border-[#dbdbdb] rounded-[8px] !py-3 outline-none shadow"
              placeholder="Tên đăng nhập"
            />
          </div>
          <div className="flex items-center mt-2 gap-1 text-[#999] text-[13px]">
            <input type="checkbox" className="mr-1 outline-[#999]" /> Nhớ mật
            khẩu
          </div>
          <Button type="primary" onClick={handleLogin} className="mt-2 !py-5">
            Đăng nhập
          </Button>
          <div className="text-center mt-2 text-[#999]">
            hoặc{" "}
            <Link to="/signup" className="text-[#0180f6]">
              Đăng ký tài khoản
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login_index;
