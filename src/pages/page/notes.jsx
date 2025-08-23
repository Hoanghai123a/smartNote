import React, { useState } from "react";
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";
import { AiOutlinePlus } from "react-icons/ai";
import { LuClipboardList } from "react-icons/lu";
import Detailcard from "../../assets/Components/detailcard";
import Add_note from "../../assets/Components/add_note";
import dayjs from "dayjs";

const { Option } = Select;

const Notes = () => {
  const [data, setData] = useState([
    {
      id: 1,
      stt: 1,
      user: "test1",
      name: "Nguyễn Văn A",
      date: "2025-08-19",
      classify: "None",
      money: "5,000,000",
      note: "Ghi chú mẫu",
    },
  ]);
  const [usedate, setUsedate] = useState(dayjs());

  return (
    <div className="flex flex-col gap-4 md:flex-row h-full">
      {/* Header + filter */}
      <div className="p-2 sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between mb-2 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded">
          <div className="p-2 text-left text-2xl font-medium flex items-center gap-2">
            <LuClipboardList />
            Notes List
          </div>

          <Add_note
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#24b8fc] hover:bg-blue-600 shadow-lg"
            callback={(newNote) =>
              setData([...data, { ...newNote, stt: data.length + 1 }])
            }
          >
            <AiOutlinePlus size={20} className="text-white" />
          </Add_note>
        </div>

        <div className="topitem flex mb-4 p-2 gap-2">
          <Select
            className="flex-2/3 !h-[40px]"
            showSearch
            placeholder="Lọc theo tên"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={data.map((row) => ({
              value: row.stt,
              label: row.name,
            }))}
          />
          <input
            type="date"
            value={usedate}
            onChange={(e) => setUsedate(e.target.value)}
            className="flex-1/3 border rounded-md ml-[15px] px-4 py-2 bg-white shadow-sm !text-[#b5b5b5]"
          />
        </div>
      </div>
      <section className="md:flex-1 overflow-y-auto h-full mx-[10px]">
        <div className="space-y-3">
          {data.map((row) => (
            <Detailcard
              data={row}
              key={row.id}
              className="border rounded-lg shadow-sm p-3 bg-white border-[#c0cad3]"
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Notes;
