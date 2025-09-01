import { Button, Modal } from "antd";
import React, { useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import Payment from "./payment";
import { Link } from "react-router-dom";
import { AiOutlinePhone } from "react-icons/ai";
import FieldMoney from "./fields/money";
import FieldDate from "./fields/date";
import FieldPhone from "./fields/phone";
import FieldNote from "./fields/note";

const Groupcard = ({ children, data, className }) => {
  console.log(data);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const handleClick = (e) => {
    if (
      e.target.closest("a[href^='tel:']") ||
      e.target.closest("[data-no-modal]")
    ) {
      return;
    }
    if (
      e.target.closest(".ant-modal") ||
      e.target.closest(".ant-modal-root") ||
      e.target.closest(".ant-modal-mask") ||
      e.target.closest(".ant-dropdown") ||
      e.target.closest(".ant-picker-dropdown") ||
      e.target.closest(".ant-select-dropdown")
    ) {
      return;
    }
    setIsDetailModalOpen(true);
  };
  return (
    <>
      <div onClick={handleClick}>{children}</div>

      <Modal
        className={`${className}`}
        title={
          <div className="flex flex-col text-left items-start border-b border-gray-400">
            <div className="flex items-center gap-1">
              <span className="font-medium">{data.name}</span>
              <span className="text-gray-500">(hiện tổng tiền)</span>
              <FaDollarSign className="text-green-700" />
            </div>
            <div className="flex items-center">
              <FieldPhone
                data={data.phone}
                className="text-[12px] text-neutral-500"
              />
            </div>
          </div>
        }
        open={isDetailModalOpen}
        styles={{
          body: {
            maxHeight: "70vh",
            overflowY: "auto",
            background: "#fff",
          },
        }}
        footer={
          <Payment id={"1"}>
            <Button type="primary">Thanh toán</Button>
          </Payment>
        }
        onCancel={() => setIsDetailModalOpen(false)}
      >
        <div className="flex flex-col gap-2">
          {/* Card 1 */}
          <div className="rounded-lg p-3 border shadow-sm bg-emerald-50 border-emerald-50">
            <div className="flex items-center gap-4">
              <div className="text-neutral-500">#{data.stt}</div>
              <div className="flex flex-1 gap-2 items-center">
                <FieldDate data={data.date} />
              </div>
              <div className="flex items-center">
                <FieldMoney data={data.money} />
              </div>
            </div>
            <div className="mt-1">
              <FieldNote data={data.note} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Groupcard;
