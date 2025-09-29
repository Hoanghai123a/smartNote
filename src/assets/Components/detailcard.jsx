import { FaArrowDown, FaPlus } from "react-icons/fa";
import React, { useMemo, useState } from "react";
import NoteModal from "./note_modal";
import dayjs from "dayjs";
import DayModal from "./day_modal";
import { useNavigate } from "react-router-dom";

// Hàm cắt ngày UTC từ ISO string
const toUTCDateKey = (iso) => {
  if (!iso) return "unknown";
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(iso);
  return m ? m[1] : "unknown";
};

const Detailcard = ({ data = [], KH = [] }) => {
  if (!data || data.length === 0) return null;
  const nav = useNavigate();
  const [openDay, setOpenDay] = useState(null);
  const [autoOpenAdd, setAutoOpenAdd] = useState(false);

  const grouped = useMemo(() => {
    const map = {};
    data.forEach((n) => {
      const key = toUTCDateKey(n.thoigian);
      if (!map[key]) map[key] = { key, total: 0, list: [] };
      const val = Number(n.sotien) || 0;
      map[key].total += n.phanloai === "in" ? val : -val;
      map[key].list.push(n);
    });
    return Object.values(map)
      .sort((a, b) => new Date(b.key) - new Date(a.key)) // sort desc
      .slice(0, 3)
      .map((g) => ({
        ...g,
        label: g.key !== "unknown" ? dayjs(g.key).format("DD/MM") : "??/??",
      }));
  }, [data]);

  return (
    <div className="bg-white rounded-2xl flex flex-col gap-2 py-3 px-3 shadow">
      {/* Header */}
      <div className="flex justify-between items-center pb-2">
        <div className="font-semibold text-lg">{KH.hoten}</div>
        <NoteModal mode="add" data={KH}>
          <FaPlus className="text-[#0084FF]" />
        </NoteModal>
      </div>

      {/* Body: các ngày */}
      {grouped.map((g) => (
        <div
          key={g.key}
          className="flex items-center justify-between px-1 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
        >
          {/* click vùng này -> mở modal xem */}
          <div
            className="flex-1 flex justify-between cursor-pointer"
            onClick={() => {
              setOpenDay(g);
              setAutoOpenAdd(false);
            }}
          >
            <div>{g.label}</div>
            <div
              className={`flex items-center gap-1 font-medium ${
                g.total > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              <FaArrowDown className={g.total > 0 ? "rotate-180" : ""} />
              <span className="text-black">
                {Math.abs(g.total).toLocaleString()}đ
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="pt-2 mt-auto flex justify-end">
        <button
          className="!text-[#43a4ff] text-xs"
          onClick={() => nav(`/detail/${KH.id}`)}
        >
          Xem thêm &gt;&gt;
        </button>
      </div>

      {/* Modal chi tiết ngày */}
      <DayModal
        day={openDay}
        khachhang={KH}
        autoOpenAdd={autoOpenAdd}
        onClose={() => setOpenDay(null)}
      />
    </div>
  );
};

export default React.memo(Detailcard);
