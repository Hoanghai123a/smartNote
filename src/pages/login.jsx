import { Button, Input } from "antd";
import React, { useState } from "react";
import { CiStickyNote } from "react-icons/ci";
import { FaLock, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../assets/Components/api";
import { useUser } from "../stores/UserContext";
import { RiGeminiFill } from "react-icons/ri";

const Login_index = () => {
  const nav = useNavigate();
  const { user, setUser } = useUser();
  const [inputdata, setInputdata] = useState({
    username: "",
    password: "",
  });

  const passwordRef = React.useRef(null);
  const [loading, setLoading] = React.useState(false);

  const handleLogin = () => {
    setLoading(true);
    api
      .post(`/login/`, {
        username: inputdata.username,
        password: inputdata.password,
      })
      .then((res) => {
        api.setCookie("token", res?.access_token, res?.expires_in);
        api.saveToken(res?.data?.access_token);
        setUser(res);
        nav("/");
      })
      .catch((e) => {
        console.log(e);
        api.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="bg-white overflow-y-auto h-[100%]">
      <div className="flex flex-col items-center gap-1 fadeInTop">
        <div className="flex w-[90vw] relative justify-between mb-3 items-center p-3 shadow rounded-[10px] gap-1 text-[#0180f6] font-[500]">
          <CiStickyNote size={50} />
          <RiGeminiFill className="absolute top-[10px] left-2 text-[#a6bcf8]" />
          <div className="flex flex-col items-end">
            <div className="flex text-[22px]">SmartNotes</div>
            <div className="flex">Sổ tay thông minh 4.0</div>
          </div>
        </div>
        <div className="flex justify-center mt-5">
          <RiGeminiFill size={25} />
        </div>
        <div className="flex font-[500] text-[28px] pb-1 mt-2 justify-center">
          <div className="typewriter whitespace-nowrap">Hello!</div>
        </div>
        <div className="flex text-[16px] justify-center whitespace-nowrap relative">
          <div className="block w-full typewriter-delayed">
            Chào mừng bạn quay trở lại!
          </div>
        </div>
        <div className="flex flex-col gap-3 py-8 max-w-[80vw] w-[80vw]">
          <div className="flex items-center gap-1 font-[500]">Tài khoản</div>
          <Input
            placeholder="Tên đăng nhập"
            value={inputdata.username}
            onChange={(e) =>
              setInputdata((old) => ({ ...old, username: e.target.value }))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") passwordRef.current.focus();
            }}
            prefix={<FaUser className="text-[#c4c4c4]" />}
            className="border !border-[#dbdbdb] rounded-[8px] !py-3 shadow"
          />

          <div className="flex items-center gap-1 font-[500] mt-2">
            Mật khẩu
          </div>
          <Input.Password
            ref={passwordRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            value={inputdata.password}
            onChange={(e) => {
              setInputdata((old) => ({ ...old, password: e.target.value }));
            }}
            className="border w-full !border-[#dbdbdb] rounded-[8px] !py-3 outline-none shadow"
            placeholder="Mật khẩu"
            prefix={<FaLock className="text-[#c4c4c4]" />}
          />
          <div className="flex items-center mt-2 gap-1 text-[#999] text-[13px]">
            <input type="checkbox" className="mr-1 outline-[#999]" /> Nhớ mật
            khẩu
          </div>
          <Button
            type="primary"
            loading={loading}
            onClick={handleLogin}
            className="!mt-5 !py-5"
          >
            Đăng nhập
          </Button>
          <div className="flex flex-col gap-2 text-center mt-2 text-[#999]">
            hoặc
            <Link to="/signup" className="text-[#0180f6]">
              Tạo tài khoản
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login_index;
