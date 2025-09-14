import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHandHoldingUsd, FaMoneyBillWave } from "react-icons/fa";
import GroupCard from "../../assets/Components/group_card";
import {
  AiOutlineDollarCircle,
  AiOutlinePhone,
  AiOutlineUser,
} from "react-icons/ai";
import { useUser } from "../../stores/userContext";
import FieldName from "../../assets/Components/fields/name";
import FieldPhone from "../../assets/Components/fields/phone";
import FieldMoney from "../../assets/Components/fields/money";

const Overview = () => {
  const [listThu, setListThu] = useState([]);
  const [listTra, setListTra] = useState([]);
  const [totalMoney, setTotalMoney] = useState(0);
  const [totalThu, setTotalThu] = useState(0);
  const [totalTra, setTotalTra] = useState(0);

  const { user } = useUser();

  useEffect(() => {
    if (!user?.danhsachNote) return;

    const notes = user.danhsachNote;

    // Tổng công nợ
    const tong = notes.reduce(
      (acc, n) =>
        n.phanloai === "in"
          ? acc + (Number(n.sotien) || 0)
          : acc - (Number(n.sotien) || 0),
      0
    );
    setTotalMoney(tong);

    // Tổng phải thu (in)
    const thu = notes
      .filter((n) => n.phanloai === "in")
      .reduce((acc, n) => acc + (Number(n.sotien) || 0), 0);
    setTotalThu(thu);

    // Tổng phải trả (out)
    const tra = notes
      .filter((n) => n.phanloai === "out")
      .reduce((acc, n) => acc + (Number(n.sotien) || 0), 0);
    setTotalTra(tra);

    // Top 5 phải thu
    const topThu = notes
      .filter((n) => n.phanloai === "in")
      .sort((a, b) => Number(b.sotien) - Number(a.sotien))
      .slice(0, 5)
      .map((n) => ({
        id: n.id,
        name: n.hoten,
        phone: n.sodienthoai,
        money: Number(n.sotien),
      }));
    setListThu(topThu);

    // Top 5 phải trả
    const topTra = notes
      .filter((n) => n.phanloai === "out")
      .sort((a, b) => Number(b.sotien) - Number(a.sotien))
      .slice(0, 5)
      .map((n) => ({
        id: n.id,
        name: n.hoten,
        phone: n.sodienthoai,
        money: Number(n.sotien),
      }));
    setListTra(topTra);
  }, [user]);

  return (
    <div className="p-4">
      <div className="rounded-b-3xl">
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
          <FieldMoney
            data={totalMoney}
            className="text-[30px] flex justify-end"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex flex-col flex-1 rounded-3xl p-3 mb-4 text-center font-medium shadow-lg bg-gray-50 gap-3">
            <div className="text-[20px] flex text-[#9f9f9f]">
              <div>
                <FaHandHoldingUsd />
              </div>
              <div className="ml-[5px] text-[20px]">Phải thu</div>
            </div>
            <FieldMoney
              data={totalThu}
              className="text-[20px]  flex justify-end text-right text-cyan-700"
            />
          </div>

          <div className="flex flex-col flex-1 rounded-3xl p-3 mb-4 text-center font-medium shadow-lg bg-gray-50 gap-3">
            <div className="text-[20px] flex text-[#9f9f9f]">
              <div>
                <FaMoneyBillWave />
              </div>
              <div className="ml-[5px] text-[20px]">Cần trả</div>
            </div>
            <FieldMoney
              data={totalTra}
              className="text-[20px]  flex justify-end text-right text-[#f34500]"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row mt-2">
        <div className="flex-1">
          <div className="text-[18px] text-left text-[#9f9f9f] font-semibold mb-2">
            Top 5 nợ cần thu
          </div>
          <div className="flex flex-col border border-gray-200 bg-[#fdfdfd] rounded-2xl">
            {listThu.map((row) => (
              <GroupCard data={row} key={row.id}>
                <div className="flex flex-1 rounded-lg text-center gap-2 p-2">
                  <div className="flex flex-1/3">
                    <FieldName data={row.name} />
                  </div>
                  <div className="flex flex-1/3">
                    <FieldPhone data={row.phone} />
                  </div>
                  <div className="flex flex-1/3 items-center">
                    <FieldMoney data={row.money} />
                  </div>
                </div>
              </GroupCard>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div className="text-[18px] text-left text-[#9f9f9f] font-semibold mb-2">
            Top 5 nợ cần trả
          </div>
          <div className="flex flex-col border border-gray-200 bg-[#fdfdfd] rounded-2xl">
            {listTra.map((row) => (
              <GroupCard data={row} key={row.id}>
                <div className="flex flex-1 rounded-lg p-2 text-center">
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
    </div>
  );
};

export default Overview;
