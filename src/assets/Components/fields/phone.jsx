import React from "react";
import { AiOutlinePhone } from "react-icons/ai";

const FieldPhone = ({ data, className }) => {
  if (!data) return null;
  return (
    <div className={`flex items-center ${className}`}>
      <AiOutlinePhone className="text-green-500 mr-[4px]" />
      <div className="">{data}</div>
    </div>
  );
};

export default FieldPhone;
