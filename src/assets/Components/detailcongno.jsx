import { Button, Modal } from "antd";
import React, { useState } from "react";
import Detailcard from "./detailcard";
import { FaDollarSign } from "react-icons/fa";
import Payment from "./payment";

const Detailcongno = ({ children, data, className }) => {
  console.log(data);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const handleClick = (e) => {
    if (
      e.target.closest("a[href^='tel:']") ||
      e.target.closest("[data-no-modal]")
    ) {
      return;
    }
    setIsDetailModalOpen(true);
  };
  return (
    <>
      <div onClick={handleClick}>{children}</div>

      <Modal
        className={className}
        title={
          <div className="flex items-center gap-2">
            <span>Lịch sử công nợ (hiện tổng tiền)</span>
            <FaDollarSign className="text-green-600" />
          </div>
        }
        open={isDetailModalOpen}
        styles={{
          body: {
            maxHeight: "70vh",
            overflowY: "auto",
            paddingTop: "16px",
          },
        }}
        footer={
          <Payment id={"1"}>
            <Button type="primary">Thanh toán</Button>
          </Payment>
        }
        onCancel={() => setIsDetailModalOpen(false)}
      >
        <Detailcard data={data} />
      </Modal>
    </>
  );
};

export default Detailcongno;
