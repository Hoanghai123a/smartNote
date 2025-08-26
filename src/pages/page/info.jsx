import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import { Image } from "antd";
import cuphong from "../../assets/img/cuphong.jpg";
import { HiOutlineKey } from "react-icons/hi";
import { VscSymbolClass } from "react-icons/vsc";
import { FaCamera } from "react-icons/fa";
import ChangePass from "../../assets/Components/change_pass";

const Info = () => {
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
      <div className="grid grid-cols-[auto_1fr] gap-y-2 gap-x-4 font-medium rounded-lg border-[1px] border-dashed bg-white py-[5px]">
        <div className="w-15  mx-2">Họ tên: </div>
        <div>Chủ cửa hàng</div>

        <div className="w-15  mx-2">SĐT: </div>
        <div>012345678</div>

        <div className="w-15  mx-2">Địa chỉ: </div>
        <div>Vinh Tiến - Bình Tuyền - Phú Thọ</div>
      </div>

      <div className="w-60 mx-auto flex flex-col gap-3">
        <ChangePass>
          <Button type="default" block>
            Đổi mật khẩu
            <HiOutlineKey />
          </Button>
        </ChangePass>
        <Button type="default" block>
          Danh sách phân loại
          <VscSymbolClass className="text-purple-500 mr-[4px]" />
        </Button>
      </div>
    </div>
  );
};

export default Info;
