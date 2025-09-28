import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { IoChevronBack, IoClose, IoAddCircleOutline } from "react-icons/io5";

// Font Awesome
import {
  FaArrowUp,
  FaArrowDown,
  FaThumbtack,
  FaMoneyCheckAlt,
} from "react-icons/fa";

import { TiThMenuOutline } from "react-icons/ti";

import { Dropdown, message } from "antd";

import NoteModal from "../../assets/Components/note_modal";
import Payment from "../../assets/Components/payment";
import { useUser } from "../../stores/userContext";
import api from "../../assets/Components/api";
import { FaThumbtackSlash } from "react-icons/fa6";

const Detail = ({ data }) => {
  const { user, setUser } = useUser();
  const [openDay, setOpenDay] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  const items = Array.isArray(data?.transactions) ? data.transactions : [];

  const money = (n) => `${(Number(n) || 0).toLocaleString("vi-VN")}đ`;
  const unitMoney = (n) => (Number(n) || 0).toLocaleString("vi-VN") + "đ";

  const { thuVe, chiRa, ton } = useMemo(() => {
    let inSum = 0,
      outSum = 0;
    for (const it of items) {
      const amount =
        Number(it?.sotien ?? (it?.soluong ?? 0) * (it?.dongia ?? 0)) || 0;
      const type = String(it?.phanloai || "").toLowerCase();
      if (type === "in") inSum += amount;
      else if (type === "out") outSum += amount;
    }
    return { thuVe: inSum, chiRa: outSum, ton: inSum - outSum };
  }, [items]);

  // Hàm ghim
  const handleGhim = async () => {
    try {
      const newValue = !data.ghim; // đảo trạng thái hiện tại
      const res = await api.patch(
        `/khachhang/${data.id}/`,
        { ghim: newValue },
        user?.token
      );

      setUser((old) => ({
        ...old,
        danhsachKH: old?.danhsachKH?.map((kh) =>
          String(kh.id) === String(data.id) ? { ...kh, ...res } : kh
        ),
      }));

      message.success(
        newValue ? "Đã ghim khách hàng" : "Đã bỏ ghim khách hàng"
      );
    } catch (err) {
      console.error("❌ Lỗi khi toggle ghim:", err);
      message.error("Không thể cập nhật trạng thái ghim");
    }
  };

  // Danh sách menu
  const menuItems = [
    {
      key: "ghim",
      label: (
        <div className="flex items-center gap-2" onClick={handleGhim}>
          {data?.ghim ? (
            <>
              <FaThumbtackSlash className="text-gray-500" /> Bỏ ghim
            </>
          ) : (
            <>
              <FaThumbtack className="text-blue-500" /> Ghim
            </>
          )}
        </div>
      ),
    },
    {
      key: "tattoan",
      label: (
        <Payment id={data?.id} sotien={ton}>
          <div className="flex items-center gap-2">
            <FaMoneyCheckAlt className="text-green-600" /> Tất toán (ẩn KH)
          </div>
        </Payment>
      ),
    },
  ];

  const groupedDays = useMemo(() => {
    const pickDate = (it) => it?.thoigian;
    const map = new Map();

    items.forEach((it) => {
      const raw = pickDate(it);
      const d = raw ? new Date(raw) : null;
      const key = d && !isNaN(d) ? d.toISOString().slice(0, 10) : "unknown";
      const label =
        d && !isNaN(d)
          ? `${String(d.getDate()).padStart(2, "0")}-${String(
              d.getMonth() + 1
            ).padStart(2, "0")}-${d.getFullYear()}`
          : "Không rõ ngày";
      const time = d && !isNaN(d) ? d.getTime() : 0;

      if (!map.has(key)) map.set(key, { label, time, list: [] });
      map.get(key).list.push(it);
    });

    const days = Array.from(map.entries())
      .map(([key, v]) => ({ key, ...v }))
      .sort((a, b) => b.time - a.time);

    days.forEach((day) => {
      day.list.sort((a, b) => {
        const ta = new Date(
          a.created_at || a.createdAt || a.ngay || a.date
        ).getTime();
        const tb = new Date(
          b.created_at || b.createdAt || b.ngay || b.date
        ).getTime();
        return (tb || 0) - (ta || 0);
      });
    });
    return days;
  }, [items]);

  // ---------------- Modal gộp trong file ----------------
  const DayTransactionsModal = ({ open, onClose, day }) => {
    if (!open || !day) return null;

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
              );
            })}
          </div>
        </div>
      </div>,
      document.body
    );
  };
  // ------------------------------------------------------

  return (
    <div className="relative !h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="items-center gap-3 px-4 py-3 shadow bg-white pt-12 z-10">
        <div className="flex justify-between">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow active:scale-95"
            aria-label="Trở lại"
          >
            <IoChevronBack className="text-xl" />
          </button>
          <div className="flex-1 text-center text-lg font-semibold">
            {data?.hoten || "No Name"}
          </div>

          {/* Dropdown Menu */}
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            open={openMenu}
            onOpenChange={(flag) => {
              if (flag) {
                setOpenMenu(true);
              }
            }}
          >
            <div
              onClick={() => setOpenMenu(!openMenu)}
              className="cursor-pointer hover:bg-gray-100 rounded-full p-1"
            >
              {openMenu ? (
                <IoClose className="w-7 h-7 text-[red]" />
              ) : (
                <TiThMenuOutline className="w-7 h-7" />
              )}
            </div>
          </Dropdown>
        </div>

        {/* Tổng hợp */}
        <div className="mt-3 grid grid-cols-3 gap-3 p-4 rounded-lg shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)]">
          <div className="text-center">
            <div className="text-sm text-gray-600">Thu về</div>
            <div className="text-emerald-600 font-semibold">{money(thuVe)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Chi ra</div>
            <div className="text-orange-500 font-semibold">{money(chiRa)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Tồn</div>
            <div className="text-blue-600 font-semibold">{money(ton)}</div>
          </div>
        </div>
      </div>

      {/* Chi tiết theo ngày */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 pb-24 z-5">
        {groupedDays.map((day) => (
          <div key={day.key} className="bg-white rounded-2xl shadow">
            <div className="flex items-center justify-between px-4 py-2">
              {/* Bên trái: Ngày + tổng tiền */}
              <div className="flex items-center gap-3">
                <span className="font-semibold">{day.label}</span>
                {(() => {
                  let sum = 0;
                  for (const it of day.list) {
                    const amount =
                      Number(
                        it?.sotien ?? (it?.soluong ?? 0) * (it?.dongia ?? 0)
                      ) || 0;
                    const type = String(it?.phanloai || "").toLowerCase();
                    if (type === "in") sum += amount;
                    else if (type === "out") sum -= amount;
                  }

                  if (sum > 0) {
                    return (
                      <span className="flex items-center font-medium text-[12px] text-gray-400">
                        <FaArrowUp className="mr-1  text-emerald-600" />{" "}
                        {money(sum)}
                      </span>
                    );
                  } else if (sum < 0) {
                    return (
                      <span className="flex items-center font-medium text-[12px] text-gray-400">
                        <FaArrowDown className="mr-1  text-rose-500" />{" "}
                        {money(Math.abs(sum))}
                      </span>
                    );
                  } else {
                    return (
                      <span className="flex items-center text-gray-400 font-medium text-[12px]">
                        {money(sum)}
                      </span>
                    );
                  }
                })()}
              </div>

              {/* Bên phải: nút thêm */}
              <NoteModal mode="add" data={{ ...data, thoigian: day.key }}>
                <div
                  className="!text-[#0084FF] !text-xl leading-none"
                  aria-label="Thêm"
                  title="Thêm bản ghi mới"
                >
                  +
                </div>
              </NoteModal>
            </div>

            {/* Preview 3 bản ghi - click mở modal */}
            <div className="cursor-pointer" onClick={() => setOpenDay(day)}>
              {day.list.slice(0, 3).map((it, idx) => {
                const soluong = Number(it?.soluong) || 0;
                const dongia = Number(it?.dongia) || 0;
                const amount = Number(it?.sotien ?? soluong * dongia) || 0;
                const isIn = String(it?.phanloai || "").toLowerCase() === "in";

                return (
                  <div
                    key={idx}
                    className="flex items-center px-4 py-1 text-sm ml-3 hover:bg-gray-50"
                  >
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
                );
              })}
              {day.list.length > 3 && (
                <div className="px-4 py-2 text-center text-blue-600 text-sm">
                  Xem thêm {day.list.length - 3} giao dịch...
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-15">
        <NoteModal mode="add" data={data}>
          <div className="!w-[95vw] py-3 rounded-xl bg-blue-500 !text-white font-semibold shadow-lg active:scale-95 flex items-center justify-center gap-2">
            <IoAddCircleOutline className="text-white w-6 h-6" />
            Thêm bản ghi mới
          </div>
        </NoteModal>
      </div>

      {/* Modal show toàn bộ giao dịch 1 ngày */}
      <DayTransactionsModal
        open={!!openDay}
        day={openDay}
        onClose={() => setOpenDay(null)}
      />
    </div>
  );
};

export default Detail;
