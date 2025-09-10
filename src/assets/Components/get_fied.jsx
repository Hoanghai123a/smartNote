import React from "react";

const GetFieldFormID = ({ id, findField, getForm, className }) => {
  const field = getForm.find((res) => res?.id === id);
  if (!field) {
    return undefined;
  }
  const rowField = field[findField];
  return <div className={className}>{rowField}</div>;
};

export default GetFieldFormID;
