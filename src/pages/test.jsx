import { DatePicker } from "antd-mobile";
import viVN from "antd-mobile/es/locales/vi-VN";
import { useState } from "react";

const Test = () => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState();

  return (
    <>
      <button onClick={() => setVisible(true)}>
        {value ? value.toLocaleDateString("vi-VN") : "Chọn ngày"}
      </button>
      <DatePicker
        visible={visible}
        onClose={() => setVisible(false)}
        value={value}
        cancelText="Hủy"
        confirmText="Xác nhận"
        onConfirm={setValue}
        locale={viVN}
      />
    </>
  );
};

export default Test;
