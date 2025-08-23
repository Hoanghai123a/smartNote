import React, { useState } from "react";
import { Link } from "react-router-dom";
import Detailcongno from "../../assets/Components/detailcongno";

const Overview = () => {
  const [dataThu, setdataThu] = useState([
    {
      id: 1,
      stt: 1,
      name: "Nguyễn Văn A",
      phone: "0123456789",
      money: "5,000,000",
      date: "2025-05-25",
    },
    {
      id: 2,
      stt: 1,
      name: "Nguyễn Văn B",
      phone: "0123456789",
      money: "5,000,000",
      date: "2025-05-15",
    },
    {
      id: 3,
      stt: 1,
      name: "Nguyễn Văn C",
      phone: "0123456789",
      money: "5,000,000",
      date: "2025-07-23",
    },
  ]);
  const [dataTra, setdataTra] = useState([
    {
      id: 1,
      stt: 1,
      name: "Trần Thị B",
      phone: "0987654321",
      money: "3,000,000",
      date: "2025-07-23",
    },
  ]);

  return (
    <div className="p-4">
      <div className="rounded-lg p-3 mb-4 text-center font-medium shadow-lg bg-gray-50">
        <div className="text-left">
          <div className="text-[24px]">Công nợ</div>
          <div>Tổng công nợ từ trước tới nay</div>
        </div>
        <div className="text-[30px] text-right">
          {(200000).toLocaleString()}đ
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col flex-1 rounded-lg p-3 mb-4 text-center font-medium shadow-lg bg-gray-50">
          <div className="text-left">
            <div className="text-[20px]">Cần thu</div>
          </div>
          <div className="text-[24px] text-right">
            {(200000).toLocaleString()}đ
          </div>
        </div>
        <div className="flex flex-col flex-1 rounded-lg p-3 mb-4 text-center font-medium shadow-lg bg-gray-50">
          <div className="text-left">
            <div className="text-[20px]">Cần trả</div>
          </div>
          <div className="text-[24px] text-right">
            {(200000).toLocaleString()}đ
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="text-[20px] text-left">Top 5 nợ cần thu</div>
        <div className="flex flex-col gap-2">
          {dataThu.map((row) => (
            <Detailcongno data={row} key={row.id}>
              <div className="flex flex-1 rounded-lg p-3 text-center shadow-lg bg-gray-50">
                <div className="flex flex-1/3">{row.name}</div>
                <div className="flex flex-1/3">
                  <Link
                    to={"tel:" + row.phone}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {row.phone}
                  </Link>
                </div>
                <div className="flex flex-1/3">
                  {row.money.toLocaleString()}đ
                </div>
              </div>
            </Detailcongno>
          ))}
        </div>
        <div className="text-[20px] text-left">Top 5 nợ cần trả</div>
        <div className="flex flex-col gap-2">
          {dataTra.map((row) => (
            <Detailcongno data={row} key={row.id}>
              <div className="flex flex-1 rounded-lg p-3 text-center shadow-lg bg-gray-50">
                <div className="flex flex-1/3">{row.name}</div>
                <div className="flex flex-1/3">
                  <Link to={"tel:" + row.phone}>{row.phone}</Link>
                </div>
                <div className="flex flex-1/3">
                  {row.money.toLocaleString()}đ
                </div>
              </div>
            </Detailcongno>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
