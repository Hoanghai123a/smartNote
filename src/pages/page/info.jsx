import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const Info_page = () => {
  const { id_nguoidung } = useParams();
  useEffect(() => {
    console.log(id_nguoidung);
  }, [id_nguoidung]);
  return <div>Đây là trang thông tin người dùng {id_nguoidung}</div>;
};

export default Info_page;
