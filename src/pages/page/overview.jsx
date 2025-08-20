import React, { useState } from "react";

const Overview = () => {
  const [dataThu, setdataThu] = useState([
    { stt: 1, name: "Nguyễn Văn A", phone: "0123456789", money: "5,000,000" },
  ]);
  const [dataTra, setdataTra] = useState([
    { stt: 1, name: "Trần Thị B", phone: "0987654321", money: "3,000,000" },
  ]);

  return (
    <div className="p-4">
      {/* Nút lọc */}
      <div className="mb-4">
        <input
          placeholder="Lọc theo ngày"
          className="border rounded-md px-4 py-2 bg-white shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Công nợ */}
      <div className="border rounded-md p-3 mb-4 text-center font-medium shadow-sm bg-gray-50">
        Công nợ = Khoản cần thu - Khoản cần trả
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        {/* Top cần thu */}
        <section className="w-full md:flex-1">
          <div className="border rounded-md p-2 text-center text-lg font-medium mb-2 bg-blue-50 shadow-sm">
            Top cần thu
          </div>

          <div className="border rounded-md overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed border-collapse text-sm">
                <colgroup>
                  <col className="w-12" />
                  <col />
                  <col className="w-32" />
                  <col />
                </colgroup>
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="border px-2 py-1">STT</th>
                    <th className="border px-2 py-1 text-left">Họ Tên</th>
                    <th className="border px-2 py-1">SĐT</th>
                    <th className="border px-2 py-1 text-right">Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {dataThu.map((row) => (
                    <tr key={`thu-${row.stt}`} className="hover:bg-gray-50">
                      <td className="border px-2 py-1 text-center">
                        {row.stt}
                      </td>
                      <td className="border px-2 py-1">{row.name}</td>
                      <td className="border px-2 py-1">{row.phone}</td>
                      <td className="border px-2 py-1 text-right">
                        {row.money}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Top cần trả */}
        <section className="w-full md:flex-1">
          <div className="border rounded-md p-2 text-center text-lg font-medium mb-2 bg-red-50 shadow-sm">
            Top cần trả
          </div>

          <div className="border rounded-md overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed border-collapse text-sm">
                <colgroup>
                  <col className="w-12" />
                  <col />
                  <col className="w-32" />
                  <col />
                </colgroup>
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="border px-2 py-1">STT</th>
                    <th className="border px-2 py-1 text-left">Họ Tên</th>
                    <th className="border px-2 py-1">SĐT</th>
                    <th className="border px-2 py-1 text-right">Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {dataTra.map((row) => (
                    <tr key={`tra-${row.id}`} className="hover:bg-gray-50">
                      <td className="border px-2 py-1 text-center">{row.id}</td>
                      <td className="border px-2 py-1">{row.name}</td>
                      <td className="border px-2 py-1">{row.phone}</td>
                      <td className="border px-2 py-1 text-right">
                        {row.money}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Overview;
