import React from "react";
import { AiOutlinePhone } from "react-icons/ai";
import { Link } from "react-router-dom";

const FieldPhone = ({ data, className }) => {
  if (!data) return null;
  return (
    <div className={`flex items-center ${className}`}>
      <AiOutlinePhone className="text-green-500 mr-[4px]" />
      <Link to={"tel:" + data}>{data}</Link>
    </div>
  );
};

export default FieldPhone;
