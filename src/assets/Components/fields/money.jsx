import React from "react";
import { AiOutlineDollarCircle } from "react-icons/ai";

const FieldMoney = ({ data, className }) => {
  if (data == null) return null;
  return (
    <div className={`flex items-center ${className}`}>
      <AiOutlineDollarCircle className="text-yellow-500 mr-[4px]" />
      <div className="">{Number(data).toLocaleString("vi-VN") + " ₫"}</div>
    </div>
  );
};

export default FieldMoney;
