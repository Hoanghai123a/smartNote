import React from "react";
import { createPortal } from "react-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const DetailDay = ({ open, onClose, day }) => {
  if (!open || !day) return null;

  const money = (n) => `${(Number(n) || 0).toLocaleString("vi-VN")}đ`;
  const unitMoney = (n) => (Number(n) || 0).toLocaleString("vi-VN") + "đ";

  return createPortal(
    <div className="fixed inset-0 bg-black/40 z-[9999] flex justify-center items-center">
      <div className="bg-white max-w-2xl w-full max-h-[90vh] rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">{day.label}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[75vh]">
          {day.list.length === 0 && (
            <div className="text-center text-gray-400 py-6">
              Không có giao dịch trong ngày này.
            </div>
          )}
          {day.list.map((it, idx) => {
            const soluong = Number(it?.soluong) || 0;
            const dongia = Number(it?.dongia) || 0;
            const amount = Number(it?.sotien ?? soluong * dongia) || 0;
            const isIn = String(it?.phanloai || "").toLowerCase() === "in";

            return (
              <div
                key={idx}
                className="flex items-center px-4 py-2 border-b last:border-0 text-sm"
              >
                {/* Cột 1: Lần */}
                <div className="basis-20 shrink-0 font-medium">
                  Lần {idx + 1}
                </div>

                {/* Cột 2: số lượng × đơn giá */}
                <div className="flex-1 text-gray-500 text-center">
                  {soluong} × {unitMoney(dongia)}
                </div>

                {/* Cột 3: số tiền */}
                <div className="basis-28 shrink-0 flex items-center justify-end gap-1">
                  {isIn ? (
                    <FaArrowUp className="text-emerald-600" />
                  ) : (
                    <FaArrowDown className="text-rose-500" />
                  )}
                  <div>{money(amount)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DetailDay;
