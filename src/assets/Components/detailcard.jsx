import { FaArrowDown, FaPlus } from "react-icons/fa";
import React, { useMemo } from "react";
import NoteModal from "./note_modal";

import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const Detailcard = ({ data = [], KH = [] }) => {
  if (!data || data.length === 0) return null;
  console.log("data", data);
  const nav = useNavigate();
  // Gom nhóm theo ngày (yyyy-MM-dd)
  const grouped = useMemo(() => {
    const map = {};

    data.forEach((n) => {
      const d = dayjs(n.thoigian).format("YYYY-MM-DD");
      if (!map[d]) map[d] = { date: dayjs(d), total: 0 };
      const val = Number(n.sotien) || 0;
      map[d].total += n.phanloai === "in" ? val : -val;
    });

    // Lấy top 3 ngày gần nhất có dữ liệu
    return Object.values(map)
      .sort((a, b) => b.date.valueOf() - a.date.valueOf()) // sort desc
      .slice(0, 3)
      .map((g) => ({
        ...g,
        label: g.date.format("DD/MM"), // label theo ngày/tháng
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

      {/* Body: 3 ngày gần nhất */}
      {grouped.map((g) => (
        <div
          key={g.label}
          className="flex justify-between items-center px-1 py-1 text-gray-600"
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
    </div>
  );
};

export default React.memo(Detailcard);
