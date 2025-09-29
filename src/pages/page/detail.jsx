import React, { useMemo, useState } from "react";
import { IoChevronBack, IoAddCircleOutline } from "react-icons/io5";
import {
  FaArrowUp,
  FaArrowDown,
  FaThumbtack,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { Dropdown, message } from "antd";
import { FaThumbtackSlash } from "react-icons/fa6";
import { FiMenu } from "react-icons/fi";
import { IoIosArrowDown, IoMdClose } from "react-icons/io";

import NoteModal from "../../assets/Components/note_modal";
import Payment from "../../assets/Components/payment";
import { useUser } from "../../stores/userContext";
import api from "../../assets/Components/api";
import FieldPhone from "../../assets/Components/fields/phone";
import { MdOutlineArrowDropDown } from "react-icons/md";

// ----------------- Component con cho từng ngày -----------------
const DayBlock = ({ day, data }) => {
  const [expanded, setExpanded] = useState(false);

  const renderList = expanded ? day.list : day.list.slice(0, 3);

  const money = (n) => `${(Number(n) || 0).toLocaleString("vi-VN")}đ`;
  const unitMoney = (n) => (Number(n) || 0).toLocaleString("vi-VN") + "đ";

  return (
    <div className="bg-white rounded-2xl shadow mb-4">
      {/* Header ngày */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold">{day.label}</span>
          {(() => {
            let sum = 0;
            for (const it of day.list) {
              const amount =
                Number(it?.sotien ?? (it?.soluong ?? 0) * (it?.dongia ?? 0)) ||
                0;
              const type = String(it?.phanloai || "").toLowerCase();
              if (type === "in") sum += amount;
              else if (type === "out") sum -= amount;
            }
            if (sum > 0) {
              return (
                <span className="flex items-center font-medium text-[12px] text-gray-400">
                  <FaArrowUp className="mr-1 text-emerald-600" /> {money(sum)}
                </span>
              );
            } else if (sum < 0) {
              return (
                <span className="flex items-center font-medium text-[12px] text-gray-400">
                  <FaArrowDown className="mr-1 text-rose-500" />{" "}
                  {money(Math.abs(sum))}
                </span>
              );
            } else {
              return (
                <span className="text-gray-400 font-medium text-[12px]">
                  {money(sum)}
                </span>
              );
            }
          })()}
        </div>

        {/* nút thêm */}
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

      {/* Danh sách bản ghi */}
      {renderList.map((it, idx) => {
        const soluong = Number(it?.soluong) || 0;
        const dongia = Number(it?.dongia) || 0;
        const amount = Number(it?.sotien ?? soluong * dongia) || 0;
        const isIn = String(it?.phanloai || "").toLowerCase() === "in";

        return (
          <NoteModal
            key={idx}
            className="w-[95%] px-4 py-2 text-sm ml-3 hover:bg-gray-50 rounded-md"
            mode="edit"
            data={{ ...it, thoigian: day.key, khachhang: data.hoten }}
          >
            {/* Dòng chính */}
            <div className="flex items-center">
              <div className="basis-20 shrink-0 font-medium">Lần {idx + 1}</div>
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

            {/* Dòng phụ: chỉ hiển thị nội dung */}
            {it?.noidung && (
              <div className="text-gray-400 italic mt-1 text-start ml-7">
                {it.noidung.replace(/SL:\s*[^;]*;\s*ĐG:\s*[^₫]*₫\.?\s*/g, "")}
              </div>
            )}
          </NoteModal>
        );
      })}

      {/* Nút mở rộng / thu gọn */}
      {day.list.length > 3 && (
        <div
          className="px-4 py-2 text-center text-[#43a4ff] text-sm cursor-pointer flex items-center justify-center gap-1"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <MdOutlineArrowDropDown className="transform rotate-180 text-lg" />
              <span>Thu gọn</span>
            </>
          ) : (
            <>
              <MdOutlineArrowDropDown className="text-lg" />
              <span>Xem thêm {day.list.length - 3} giao dịch</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
// ---------------------------------------------------------------

const Detail = ({ data }) => {
  const { user, setUser } = useUser();
  const [openMenu, setOpenMenu] = useState(false);

  const items = useMemo(() => {
    if (!Array.isArray(data?.transactions)) return [];
    return data.transactions.filter((it) => it?.trangthai === "not");
  }, [data?.transactions]);

  const money = (n) => `${(Number(n) || 0).toLocaleString("vi-VN")}đ`;

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

  // Hàm ghim KH
  const handleGhim = async () => {
    try {
      const newValue = !data.ghim;
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

  // menu dropdown
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

  // Gom giao dịch theo ngày
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
          <div className="flex-1 text-center">
            <div className="text-lg font-semibold">
              {data?.hoten || "No Name"}
            </div>
            <div className="flex justify-center mt-2">
              <FieldPhone data={data?.sodienthoai || ""} className="text-ml" />
            </div>
          </div>

          {/* Dropdown Menu */}
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            open={openMenu}
            onOpenChange={(flag) => {
              if (flag) setOpenMenu(true);
            }}
          >
            <div
              onClick={() => setOpenMenu(!openMenu)}
              className="cursor-pointer hover:bg-gray-100 rounded-full p-1"
            >
              {openMenu ? (
                <IoMdClose className="w-7 h-7 text-[red]" />
              ) : (
                <FiMenu className="w-7 h-7" />
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
            <div className="flex items-center justify-center font-semibold">
              {ton > 0 ? (
                <>
                  <FaArrowUp className="text-emerald-600 mr-1" />
                  <span>{money(ton)}</span>
                </>
              ) : ton < 0 ? (
                <>
                  <FaArrowDown className="text-rose-500 mr-1" />
                  <span>{money(Math.abs(ton))}</span>
                </>
              ) : (
                <span className="text-gray-500">{money(0)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chi tiết theo ngày */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 pb-24 z-5">
        {groupedDays.map((day) => (
          <DayBlock key={day.key} day={day} data={data} />
        ))}
      </div>

      {/* Floating Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-15">
        <NoteModal mode="add" data={data}>
          <div className="!w-[92vw] py-3 rounded-xl bg-blue-500 !text-white font-semibold shadow-lg active:scale-95 flex items-center justify-center gap-2">
            <IoAddCircleOutline className="text-white w-6 h-6" />
            Thêm bản ghi mới
          </div>
        </NoteModal>
      </div>
    </div>
  );
};

export default Detail;
