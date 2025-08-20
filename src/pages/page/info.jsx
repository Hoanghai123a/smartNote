import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import { Image } from "antd";
import cuphong from "../../assets/img/cuphong.jpg";

const Info = () => {
  const { id_nguoidung } = useParams();
  useEffect(() => {
    console.log(id_nguoidung);
  }, [id_nguoidung]);
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-center">
        <Image
          className="rounded-lg shadow-lg"
          width={150}
          alt="Avatar"
          src={cuphong}
        />
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-y-2 gap-x-4 font-medium rounded-lg border-[1px] border-dashed bg-white">
        <div className="w-15  mx-2">Họ tên: </div>
        <div>Chủ cửa hàng</div>

        <div className="w-15  mx-2">SĐT: </div>
        <div>012345678</div>

        <div className="w-15  mx-2">Địa chỉ: </div>
        <div>Vinh Tiến - Bình Tuyền - Phú Thọ</div>
      </div>

      <div className="w-60 mx-auto flex flex-col gap-3">
        <Button type="default" block>
          Đổi mật khẩu
        </Button>
        <Button type="default" block>
          Danh sách phân loại
        </Button>
      </div>
    </div>
  );
};

export default Info;
