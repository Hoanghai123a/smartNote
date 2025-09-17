import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, message } from "antd";
import { Image } from "antd";
import cuphong from "../../assets/img/cuphong.jpg";
import { HiOutlineKey } from "react-icons/hi";
import { VscSymbolClass } from "react-icons/vsc";
import { FaCamera } from "react-icons/fa";
import ChangePass from "../../assets/Components/change_pass";
import { MdLogout } from "react-icons/md";
import { useUser } from "../../stores/userContext";
import ClientManager from "../../assets/Components/client.jsx";
import CategoryManager from "../../assets/Components/Category.jsx";

const Info = () => {
  const { user, setUser } = useUser();
  const nav = useNavigate();
  const { id_nguoidung } = useParams();

  useEffect(() => {
    console.log(id_nguoidung);
  }, [id_nguoidung]);

  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };
  const handleLogout = () => {
    try {
      document.cookie = "token=; Max-Age=0; path=/";
    } catch (e) {
      console.error("Clear cookie error:", e);
    }
    setUser(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    message.success("Đã đăng xuất");
    nav("/login", { replace: true });
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="p-6 space-y-6 h-full relative">
      <div className="flex justify-center">
        <div className="relative">
          <Image
            className="rounded-2xl shadow-amber-200"
            width={150}
            height={150}
            alt="Avatar"
            src={preview || cuphong}
          />

          <button
            type="button"
            onClick={handleClick}
            className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          >
            <FaCamera className="text-gray-700" />
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-y-2 gap-x-4 rounded-lg border-[1px] border-dashed bg-white py-[5px]">
        <div className="w-15  mx-2">Họ tên: </div>
        <div>{user?.username ? user?.username : "Hi Tech"}</div>

        <div className="w-15  mx-2">SĐT: </div>
        <div>{user?.userphone ? user?.phone : "0123-456-789"}</div>

        <div className="w-15  mx-2">Địa chỉ: </div>
        <div>
          {user?.address ? user?.address : "Vinh Tiến - Bình Tuyền - Phú Thọ"}
        </div>
      </div>
      <div className="w-full mx-auto flex flex-col gap-2 text-left">
        <ChangePass>
          <Button type="primary" className="!h-[40px]" block>
            Đổi mật khẩu
            <HiOutlineKey />
          </Button>
        </ChangePass>
        <CategoryManager>
          <Button type="primary" className="!h-[40px]" block>
            Danh sách các nhóm
            <VscSymbolClass className=" mr-[4px]" />
          </Button>
        </CategoryManager>

        <ClientManager>
          <Button
            type="primary"
            className="!h-[40px] mt-1 border !border-dashed"
            block
          >
            Danh sách khách hàng
          </Button>
        </ClientManager>

        <Button type="text" block onClick={handleLogout}>
          <span className="border-b-[#3d3d3d] border-b">Đăng xuất</span>
          <MdLogout className="text-[#295fff] mr-[4px]" />
        </Button>
      </div>
    </div>
  );
};

export default Info;
