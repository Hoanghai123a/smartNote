import React from "react";
import { AiOutlineUser } from "react-icons/ai";

const FieldName = ({ data, className }) => {
  if (!data) return null;
  return (
    <div className={`flex items-center ${className}`}>
      <AiOutlineUser className="text-blue-500 mr-[4px]" />
      <div className="">{data}</div>
    </div>
  );
};

export default FieldName;
