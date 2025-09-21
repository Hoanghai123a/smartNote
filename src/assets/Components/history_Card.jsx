import React, { useState } from "react";
import { Modal, Button } from "antd";
import FieldMoney from "./fields/money";
import FieldDate from "./fields/date";
import FieldNote from "./fields/note";
import FieldPhone from "./fields/phone";
import Fieldclass from "./fields/class";
import GetFieldFormID from "./get_fied";
import Payment from "./payment";
import dayjs from "dayjs";
import { useUser } from "../../stores/userContext";
import FieldName from "./fields/name";

const History_Card = ({ data = [], children, className }) => {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className={className} onClick={() => setOpen(true)}>
        {children}
      </div>
    );
  }

  // Gom nhóm theo khách hàng (hoten + sodienthoai)
  const groupByCustomer = data.reduce((acc, row) => {
    const kh = row.khachhang;
    if (!acc[kh]) {
      acc[kh] = {
        hoten: row.hoten,
        sodienthoai: row.sodienthoai,
        records: [],
      };
    }
    acc[kh].records.push(row);
    return acc;
  }, {});

  return (
    <>
      {/* Trigger */}
      <div className={className} onClick={() => setOpen(true)}>
        {children}
      </div>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        style={{ top: 20 }}
        className={className}
        styles={{
          body: {
            maxHeight: "500px",
            overflowY: "auto",
            background: "#fff",
          },
        }}
        footer={null}
        title="Lịch sử"
      >
        <div className="flex flex-col gap-4">
          {Object.values(groupByCustomer).map((kh, idxKH) => {
            // Gom tiếp theo ngày
            const groupByDate = kh.records.reduce((acc, row) => {
              const dateKey = dayjs(row.thoigian).format("YYYY-MM-DD");
              if (!acc[dateKey]) acc[dateKey] = [];
              acc[dateKey].push(row);
              return acc;
            }, {});

            return (
              <div key={idxKH} className="pb-3">
                {/* Tiêu đề khách hàng */}
                <div className="flex flex-col border-b pb-2 mb-2">
                  <div className="flex items-center gap-2 font-medium">
                    <FieldName data={kh.hoten} />
                  </div>
                  <FieldPhone
                    data={kh.sodienthoai}
                    className="text-[12px] text-neutral-500"
                  />
                </div>

                {/* Danh sách ngày */}
                {Object.keys(groupByDate)
                  .sort((a, b) => new Date(b) - new Date(a)) // sắp xếp ngày mới → cũ
                  .map((dateKey, idxDate) => (
                    <div key={idxDate} className="mb-3 pl-3">
                      <div className="font-semibold mb-1">
                        <FieldDate data={dayjs(dateKey).format("DD-MM-YYYY")} />
                      </div>

                      <div className="flex flex-col gap-2">
                        {groupByDate[dateKey].map((row) => (
                          <div
                            key={row.id}
                            className="rounded-lg p-2 border shadow-sm border-emerald-50"
                          >
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
                                  row.phanloai === "in"
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
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
};

export default History_Card;
