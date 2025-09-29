import React, { useEffect, useRef } from "react";
import { Modal } from "antd";
import { FaArrowUp, FaArrowDown, FaPlus } from "react-icons/fa";
import NoteModal from "./note_modal";

const DayModal = ({ day, khachhang, onClose, autoOpenAdd = false }) => {
  if (!day) return null;

  const money = (n) => `${(Number(n) || 0).toLocaleString("vi-VN")}đ`;
  const unitMoney = (n) => (Number(n) || 0).toLocaleString("vi-VN") + "đ";

  // ref để auto bấm nút + trong modal
  const addBtnRef = useRef(null);
  useEffect(() => {
    if (autoOpenAdd && addBtnRef.current) {
      // chờ render xong rồi click
      const t = setTimeout(() => addBtnRef.current.click(), 0);
      return () => clearTimeout(t);
    }
  }, [autoOpenAdd]);

  return (
    <Modal
      open={!!day}
      onCancel={onClose}
      footer={null}
      width="90vw"
      style={{ maxHeight: "80vh", overflowY: "auto", paddingBottom: 12 }}
      title={
        <div className="flex items-center">
          <div className="font-semibold">
            Chi tiết giao dịch ngày {day.label}
          </div>

          {/* Nút + nhỏ (trigger NoteModal) */}
          <NoteModal mode="add" data={{ ...khachhang, thoigian: day.key }}>
            <div
              ref={addBtnRef}
              className="w-8 h-8 flex items-center justify-center rounded-full text-[#0084FF] hover:scale-105 active:scale-95"
              title="Thêm bản ghi mới"
            >
              <FaPlus />
            </div>
          </NoteModal>
        </div>
      }
    >
      {day ? <div></div> : null}

      {day.list.map((it, idx) => {
        const soluong = Number(it?.soluong) || 0;
        const dongia = Number(it?.dongia) || 0;
        const amount = Number(it?.sotien ?? soluong * dongia) || 0;
        const isIn = String(it?.phanloai || "").toLowerCase() === "in";

        return (
          <NoteModal
            key={idx}
            className="block w-full p-2 text-sm hover:bg-gray-50 rounded-md mb-2 cursor-pointer"
            mode="edit"
            data={{ ...it, thoigian: day.key, khachhang: khachhang?.hoten }}
          >
            <div>
              <div className="flex items-center">
                <div className="basis-20 shrink-0 font-medium">
                  Lần {idx + 1}
                </div>
                <div className="flex-1 text-gray-500 text-center">
                  {soluong} × {unitMoney(dongia)}
                </div>
                <div className="basis-28 shrink-0 flex items-center justify-end gap-1">
                  {isIn ? (
                    <FaArrowUp className="text-emerald-600" />
                  ) : (
                    <FaArrowDown className="text-rose-500" />
                  )}
                  <div>{money(amount)}</div>
                </div>
              </div>

              {it?.noidung && (
                <div className="text-gray-400 italic mt-1 text-start ml-7">
                  {it.noidung.replace(/SL:\s*[^;]*;\s*ĐG:\s*[^₫]*₫\.?\s*/g, "")}
                </div>
              )}
            </div>
          </NoteModal>
        );
      })}
    </Modal>
  );
};

export default DayModal;
