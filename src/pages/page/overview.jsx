import React, { useState } from "react";
import { Link } from "react-router-dom";
import Detailcongno from "../../assets/Components/detailcongno";
import { FaHandHoldingUsd, FaMoneyBillWave } from "react-icons/fa";
import GroupCard from "../../assets/Components/group_card";
import {
  AiOutlineDollarCircle,
  AiOutlinePhone,
  AiOutlineUser,
} from "react-icons/ai";
import FieldPhone from "../../assets/Components/Fields/phone";
import FieldName from "../../assets/Components/Fields/name";
import FieldMoney from "../../assets/Components/Fields/money";

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
      <div className=" rounded-b-3xl">
        <div className="rounded-lg p-3 mb-4 text-center font-medium shadow-lg bg-gray-50">
          <div className="text-left">
            <div className="text-[24px]">Dư nợ</div>
            <div
              style={{ fontStyle: "italic" }}
              className="mt-[3px] text-[#a9a9a9]"
            >
              Tổng công nợ từ trước tới nay
            </div>
          </div>
          <div className="text-[30px] text-right">
            {(300000).toLocaleString()}đ
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col flex-1 rounded-3xl p-3 mb-4 text-center font-medium shadow-lg bg-gray-50 gap-3">
            <div className="text-[20px] flex text-[#9f9f9f]">
              <div>
                <FaHandHoldingUsd />
              </div>
              <div className="ml-[5px] text-[20px]">Phải thu</div>
            </div>
            <div className="text-[24px] text-right text-cyan-700">
              {(500000).toLocaleString()} đ
            </div>
          </div>
          <div className="flex flex-col flex-1 rounded-3xl p-3 mb-4 text-center font-medium shadow-lg bg-gray-50 gap-3">
            <div className="text-[20px] flex text-[#9f9f9f]">
              <div>
                <FaMoneyBillWave />
              </div>
              <div className="ml-[5px] text-[20px]">Cần trả</div>
            </div>
            <div className="text-[24px] text-right text-[#f34500]">
              {(200000).toLocaleString()} đ
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row mt-2">
        <div className="text-[18px] text-left text-[#9f9f9f] font-semibold">
          Top 5 nợ cần thu
        </div>
        <div className="flex flex-col gap-3 border border-gray-200 bg-[#fdfdfd] rounded-2xl">
          {dataThu.map((row) => (
            <GroupCard data={row} key={row.id}>
              <div className="flex flex-1 rounded-lg text-center gap-2 p-2">
                <div className="flex flex-1/3">
                  <AiOutlineUser className="text-blue-500 mr-[4px]" />
                  <div className="">{row.name}</div>
                </div>
                <div className="flex flex-1/3 items-center">
                  <AiOutlinePhone className="text-green-500 mr-[4px]" />
                  <span className="font-medium text-gray-700"></span>
                  <Link to={"tel:" + row.phone}>{row.phone}</Link>
                </div>
                <div className="flex flex-1/3 items-center">
                  <AiOutlineDollarCircle className="text-yellow-500 mr-[4px]" />
                  <span className="text-green-600 font-semibold">
                    {row.money}
                  </span>
                </div>
              </div>
            </GroupCard>
          ))}
        </div>
        <div className="text-[18px] text-left text-[#9f9f9f] font-semibold">
          Top 5 nợ cần trả
        </div>
        <div className="flex flex-col gap-3 border border-gray-200 bg-[#fdfdfd] rounded-2xl">
          {dataTra.map((row) => (
            <GroupCard data={row} key={row.id}>
              <div className="flex flex-1 rounded-lg p-3 text-center">
                <div className="flex flex-1/3">
                  <FieldName data={row.name} />
                </div>
                <div className="flex flex-1/3">
                  <FieldPhone data={row.phone} />
                </div>
                <div className="flex flex-1/3">
                  <FieldMoney data={row.money} />
                </div>
              </div>
            </GroupCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
