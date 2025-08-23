import { Modal } from "antd";
import React, { useState } from "react";
import Detailcard from "./detailcard";

const Detailcongno = ({ children, data }) => {
  console.log(data);
  const [isModalOpen, setisModalOpen] = useState(false);
  return (
    <>
      <div onClick={() => setisModalOpen(true)}>{children}</div>
      <Modal
        className=""
        title="Lịch sử công nợ"
        open={isModalOpen}
        styles={{
          body: {
            maxHeight: "60vh",
            overflowY: "auto",
            padding: "16px",
          },
        }}
        footer={[]}
        onCancel={() => setisModalOpen(false)}
      >
        <Detailcard data={data} />
      </Modal>
    </>
  );
};

export default Detailcongno;
