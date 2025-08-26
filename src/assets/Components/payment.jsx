import { Button, Modal } from "antd";
import React, { useState } from "react";
import Detailcard from "./detailcard";
import { FaDollarSign } from "react-icons/fa";

const Payment = ({ children, id }) => {
  console.log(id);
  const maxMoney = 1000000;
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");

  const handlePayment = () => {
    setIsPaymentModalOpen(true);
  };
  const handleChange = (e) => {
    let rawValue = e.target.value.replace(/\D/g, "");

    let numValue = parseInt(rawValue || "0", 10);

    if (numValue > maxMoney) {
      numValue = maxMoney;
    }

    const formatted = numValue.toLocaleString("vi-VN");

    setPaymentAmount(formatted);
  };
  return (
    <>
      <div onClick={handlePayment} data-no-modal>
        {children}
      </div>
      <Modal
        title="Thanh toán công nợ"
        open={isPaymentModalOpen}
        onCancel={() => setIsPaymentModalOpen(false)}
        footer={
          <div className="">
            <Button //chính là số tiền tổng công nợ
              type="primary"
              onClick={() => {
                setIsPaymentModalOpen(false);
              }}
            >
              Toàn bộ
            </Button>
            <Button
              type="primary"
              className="!ml-[10px]"
              onClick={() => {
                setIsPaymentModalOpen(false);
              }}
            >
              Xác nhận
            </Button>
          </div>
        }
      >
        <div style={{ padding: "20px 0" }}>
          <input
            type="text"
            placeholder="Nhập số tiền"
            value={paymentAmount}
            onChange={handleChange}
            min={0}
            max={maxMoney} //chính là số tiền tổng công nợ
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #d9d9d9",
            }}
          />
          <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}></div>
        </div>
      </Modal>
    </>
  );
};

export default Payment;
