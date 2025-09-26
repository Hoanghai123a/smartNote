import React, { useMemo } from "react";
import { Select } from "antd";

const CustomerSelect = ({ value, onChange, customers = [] }) => {
  // options cho Select
  const options = useMemo(() => {
    return customers.map((u) => ({
      label: u.hoten,
      value: String(u?.id ?? ""),
    }));
  }, [customers]);

  return (
    <Select
      className="min-w-[180px] w-[220px] shadow-md"
      allowClear
      showSearch
      placeholder="Nhập tên"
      value={value}
      onChange={onChange}
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      options={options}
    />
  );
};

export default CustomerSelect;
