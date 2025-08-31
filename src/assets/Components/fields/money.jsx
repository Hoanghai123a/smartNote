import React from "react";
import { AiOutlineDollarCircle } from "react-icons/ai";

const FieldMoney = ({ data, className }) => {
  if (!data) return null;
  return (
    <div className={`flex items-center ${className}`}>
      <AiOutlineDollarCircle className="text-yellow-500 mr-[4px]" />
      <div className="">{data}</div>đ
    </div>
  );
};

export default FieldMoney;
