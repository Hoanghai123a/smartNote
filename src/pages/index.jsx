import React, { useEffect, useState } from "react";
import { useUser } from "../stores/UserContext";
import api from "../assets/Components/api";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";

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
          if (!res?.id) navigate("/login/");
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
          navigate("/login/");
        });
    } else {
      console.log("Không tìm thấy token!");
      navigate("/login");
    }
  }, []);
  return <div className="home">Trang chủ</div>;
};
export default Home;
