import { Button, Modal } from "antd";
import React, { useEffect, useState, useMemo } from "react";
import Payment from "./payment";
import FieldMoney from "./fields/money";
import FieldDate from "./fields/date";
import FieldPhone from "./fields/phone";
import FieldNote from "./fields/note";
import dayjs from "dayjs";
import { useUser } from "../../stores/userContext";
import GetFieldFormID from "./get_fied";
import Fieldclass from "./fields/class";

const Groupcard = ({ children, idKH, className }) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { user } = useUser();
  const [list, setList] = useState([]);
  const [totalMoney, setTotalMoney] = useState(0);

  useEffect(() => {
    if (!isDetailModalOpen) return;
    const notes =
      user?.danhsachNote?.filter(
        (r) => r.khachhang == idKH && r.trangthai == "not"
      ) || [];

    setTotalMoney(
      notes.reduce(
        (acc, n) =>
          n.phanloai == "in"
            ? acc + (Number(n.sotien) || 0)
            : acc - (Number(n.sotien) || 0),
        0
      )
    );

    const sorted = notes.sort(
      (a, b) => dayjs(b.thoigian).valueOf() - dayjs(a.thoigian).valueOf()
    );
    setList(sorted);
  }, [isDetailModalOpen, user?.danhsachNote, idKH]);

  // === Group by ngày ===
  const groupedByDate = useMemo(() => {
    const map = new Map();
    list.forEach((r) => {
      const dateKey = dayjs(r.thoigian).format("YYYY-MM-DD");
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey).push(r);
    });
    return [...map.entries()]
      .sort((a, b) => new Date(b[0]) - new Date(a[0])) // ngày mới trước
      .map(([dateKey, rows]) => ({ dateKey, rows }));
  }, [list]);

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
        className={className}
        title={
          <div className="flex flex-col text-left items-start border-b border-gray-400">
            <div className="flex items-center gap-1">
              <GetFieldFormID
                id={idKH}
                getForm={user?.danhsachKH}
                findField="hoten"
                className="font-medium"
              />
              {totalMoney ? (
                <div className="text-gray-500">
                  {"( " + totalMoney.toLocaleString("vi-VN") + "đ )"}
                </div>
              ) : null}
            </div>
            <div className="flex items-center">
              <FieldPhone
                data={
                  <GetFieldFormID
                    id={idKH}
                    getForm={user?.danhsachKH}
                    findField="sodienthoai"
                  />
                }
                className="text-[12px] text-neutral-500"
              />
            </div>
          </div>
        }
        open={isDetailModalOpen}
        styles={{
          body: {
            maxHeight: "500px",
            overflowY: "auto",
            background: "#fff",
          },
        }}
        footer={
          <Payment id={idKH} sotien={-totalMoney}>
            <Button type="primary">Xóa toàn bộ</Button>
          </Payment>
        }
        style={{ top: 20 }}
        onCancel={() => setIsDetailModalOpen(false)}
      >
        <div className="flex flex-col gap-4">
          {groupedByDate.map((block) => (
            <div key={block.dateKey} className="relative pl-6">
              {/* Line dọc cho ngày */}
              <span className="pointer-events-none absolute left-0 top-3 bottom-3 border-l border-neutral-300" />
              {/* Nhánh ngang */}
              <span className="pointer-events-none absolute left-0 top-4 w-3 border-t border-neutral-300" />

              {/* Tiêu đề ngày */}
              <div className="font-semibold mb-2">
                <FieldDate data={dayjs(block.dateKey).format("DD-MM-YYYY")} />
              </div>

              <div className="flex flex-col gap-2">
                {block.rows.map((row) => (
                  <div key={row.id} className="relative pl-6">
                    {/* line cho card */}
                    <span className="pointer-events-none absolute left-0 top-3 bottom-3 border-l border-neutral-200" />
                    <span className="pointer-events-none absolute left-0 top-4 w-3 border-t border-neutral-200" />

                    <div className="rounded-lg p-2 border shadow-sm border-emerald-50">
                      <div className="flex items-center gap-3">
                        <Fieldclass
                          data={
                            <GetFieldFormID
                              id={row.loai}
                              findField="type"
                              getForm={user?.danhsachGroup}
                            />
                          }
                        />
                        <div
                          className={`ml-auto ${
                            row.phanloai == "in"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <FieldMoney data={row.sotien} />
                        </div>
                      </div>
                      {row.noidung && (
                        <div className="mt-1">
                          <FieldNote data={row.noidung} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default Groupcard;
