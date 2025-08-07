import React, { useEffect, useState } from "react";
import { useUser } from "../stores/UserContext";
import api from "../assets/Components/api";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Input, message, Tooltip } from "antd";
import { CiStickyNote } from "react-icons/ci";
import { RiGeminiFill } from "react-icons/ri";
import { FaNoteSticky } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import Add_note from "./page/add_note";

const Home = () => {
  const { user, setUser } = useUser();
  const [checkauthfade, setCheckauthfade] = useState(false);
  const [checkauth, setCheckauth] = useState(true);
  const navigate = useNavigate();
  const [data, setData] = useState([
    {
      id: 1,
      name: "test note",
      content: "Nội dung note",
      customer: "Hùng",
      created_at: "2025-08-04 22:05:00",
    },
    {
      id: 2,
      name: "test note 2",
      content: "Nội dung note",
      customer: "Thọ",
      created_at: "2025-08-04 22:05:00",
    },
    {
      id: 3,
      name: "test note 3",
      content: "Nội dung note",
      customer: "Hoàng",
      created_at: "2025-08-04 22:05:00",
    },
  ]);
  useEffect(() => {
    const token = api.getCookie("token");
    if (token) {
      console.log("Có token:", token);
      api
        .get("/user/", token)
        .then(async (res) => {
          if (!res?.id && !res?.username) navigate("/login");
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
          navigate("/login");
        });
    } else {
      console.log("Không tìm thấy token!");
      navigate("/login");
    }
  }, []);
  const filter = data
    .filter((item) => item)
    .sort((a, b) => {
      return b.id - a.id;
    });
  return (
    <div className="min-h-[100vh] bg-[#dfe8e9]">
      <div className="flex flex-col">
        <div
          className="flex bg-[white] justify-between mb-2 
          items-center p-3 shadow
          gap-1 text-[#0180f6] font-[500]"
        >
          <div className="flex gap-1">
            <FaNoteSticky size={24} /> SmartNotes
          </div>
          <div
            className="flex items-center justify-center text-[14px] font-[500] text-[#0180f6] cursor-pointer"
            onClick={() => {
              api.removeCookie("token");
              setUser(null);
              navigate("/login");
            }}
          >
            Đăng xuất
          </div>
        </div>
        <div className="flex flex-col gap-1 fadeInTop px-2">
          <div className="flex justify-between gap-2">
            <div className="flex">
              <Input placeholder="Tìm kiếm..." />
            </div>
            <Tooltip
              trigger="click"
              color="white"
              placement="right"
              title={
                <div className="flex text-[#000] flex-col gap-1">
                  <Add_note
                    callback={(values) => {
                      setData((old) => [
                        ...old,
                        {
                          id: old.length + 1,
                          ...values,
                          created_at: new Date().toLocaleString(),
                        },
                      ]);
                      message.success("Thêm ghi chú thành công!");
                    }}
                  >
                    <Button icon={<FaPlus />} type="primary">
                      Thêm ghi chú
                    </Button>
                  </Add_note>
                  <Button icon={<FaPlus />} type="primary">
                    Thêm khoản nợ
                  </Button>
                </div>
              }
            >
              <Button icon={<FaPlus />} type="primary" />
            </Tooltip>
          </div>
          <div className="flex flex-col gap-1 mt-1">
            {filter.map((item) => (
              <div key={item.id} className="item p-2 bg-[white] rounded-[8px]">
                <div className="name">{item.name}</div>
                <div className="content text-[#999]">{item.content}</div>
                <div className="flex justify-between text-[11px] text-[#24242e]">
                  <div className="flex mt-1">
                    <div className="bg-[#999] text-[white] rounded-[4px] px-2">
                      {item.customer}
                    </div>
                  </div>
                  <div className="flex">{item.created_at}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
