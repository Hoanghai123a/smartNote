import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
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
              <GetFieldFormID
                id={idKH}
                getForm={user?.danhsachKH}
                findField="hoten"
                className="font-medium"
              />
              {totalMoney && (
                <div className="text-gray-500">
                  {"( " + totalMoney.toLocaleString("vi-VN") + "đ )"}
                </div>
              )}
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
          <Payment id={idKH}>
            <Button type="primary">Xóa toàn bộ</Button>
          </Payment>
        }
        style={{ top: 20 }}
        onCancel={() => setIsDetailModalOpen(false)}
      >
        <div className="flex flex-col gap-2">
          {list.map((row, stt) => (
            <div
              key={row.id}
              className="rounded-lg p-1 border shadow-sm border-emerald-50"
            >
              <div className="flex gap-3">
                <div className="max-w-[50px] text-neutral-500">#{stt + 1}</div>

                <div className="w-[100px] items-center">
                  <FieldDate data={dayjs(row.thoigian).format("DD-MM-YYYY")} />
                </div>

                <div className="flex items-center">
                  <Fieldclass
                    data={
                      <GetFieldFormID
                        id={row.loai}
                        findField="type"
                        getForm={user?.danhsachGroup}
                      />
                    }
                  />
                </div>

                <div
                  className={`flex ml-auto items-center ${
                    row.phanloai == "in" ? "text-[green]" : "text-[red]"
                  }`}
                >
                  <FieldMoney data={row.sotien} />
                </div>
              </div>

              <div className="mt-1">
                <FieldNote data={row.noidung} />
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default Groupcard;
