import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "antd";

const Info = () => {
  const { id_nguoidung } = useParams();
  useEffect(() => {
    console.log(id_nguoidung);
  }, [id_nguoidung]);
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-[auto_1fr] gap-y-2 gap-x-4">
        <div className="w-15">Họ tên: </div>
        <div>Chủ cửa hàng</div>

        <div className="w-15">SĐT: </div>
        <div>012345678</div>

        <div className="w-15">Địa chỉ: </div>
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
