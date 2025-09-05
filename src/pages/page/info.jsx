import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, message } from "antd";
import { Image } from "antd";
import cuphong from "../../assets/img/cuphong.jpg";
import { HiOutlineKey } from "react-icons/hi";
import { VscSymbolClass } from "react-icons/vsc";
import { FaCamera } from "react-icons/fa";
import ChangePass from "../../assets/Components/change_pass";
import CategoryManager from "../../assets/Components/useclass";
import { MdLogout } from "react-icons/md";
import { useUser } from "../../stores/userContext";
import api from "../../assets/Components/api";

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
    <div className="p-6 space-y-6">
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
        <div>Chủ cửa hàng</div>

        <div className="w-15  mx-2">SĐT: </div>
        <div>012345678</div>

        <div className="w-15  mx-2">Địa chỉ: </div>
        <div>Vinh Tiến - Bình Tuyền - Phú Thọ</div>
      </div>

      <span className="border-b-[1px] border-dashed text-[darkblue] font-medium">
        Danh sách chức năng
      </span>
      <div className="gap-x-4 font-medium p-2">
        <div className="w-full mx-auto flex flex-col gap-1 text-left">
          <ChangePass>
            <Button type="default" block>
              Đổi mật khẩu
              <HiOutlineKey />
            </Button>
          </ChangePass>
          <CategoryManager>
            <Button type="default" block>
              Danh sách các nhóm
              <VscSymbolClass className="text-purple-500 mr-[4px]" />
            </Button>
          </CategoryManager>
          <Button type="default" block onClick={handleLogout}>
            Đăng xuất
            <MdLogout className="text-[#295fff] mr-[4px]" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Info;
