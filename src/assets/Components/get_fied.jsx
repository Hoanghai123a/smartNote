import React from "react";

const GetFieldFormID = ({ id, findField, getForm = [], className }) => {
  // đảm bảo getForm luôn là mảng

  const field = Array.isArray(getForm)
    ? getForm.find((res) => Number(res?.id) === Number(id))
    : null;
  if (!field) {
    return <span className={className}>-</span>;
  }

  const rowField = field?.[findField];
  return <div className={className}>{rowField || "—"}</div>;
};

export default GetFieldFormID;
