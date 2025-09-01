import React, { useState } from "react";
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { LuClipboardList } from "react-icons/lu";
import { AiOutlinePlus } from "react-icons/ai";
import Detailcard from "../../assets/Components/detailcard";
import Add_note from "../../assets/Components/add_note";
import Groupcard from "../../assets/Components/group_card";

const DetailList = () => {
  const [data, setData] = useState([
    {
      id: 1,
      user: "test1",
      name: "Nguyễn Văn A",
      phone: "0123456789",
      date: "2025-08-19",
      class: "Thu",
      money: "5,000,000",
      note: "Bạn đang map data để truyền vào component Detailcard, và bạn muốn có thêm STT",
    },
    {
      id: 2,
      user: "test2",
      name: "Nguyễn Văn B",
      phone: "0123456789",
      date: "2025-08-19",
      class: "Thu",
      money: "5,000,000",
      note: null,
    },
    {
      id: 3,
      user: "test2",
      name: "Nguyễn Văn B",
      phone: "0123456789",
      date: "2025-08-19",
      class: "Chi",
      money: "5,000,000",
      note: "Ghi chú",
    },
    {
      id: 4,
      user: "test2",
      name: "Nguyễn Văn B",
      phone: "0123456789",
      date: "2025-08-19",
      class: "Thu",
      money: "2,000,000",
      note: "Ghi chú",
    },
    {
      id: 5,
      user: "test2",
      name: "Nguyễn Văn B",
      phone: "0123456789",
      date: "2025-08-19",
      class: "Chi",
      money: "3,000,000",
      note: "abc",
    },
    {
      id: 6,
      user: "test2",
      name: "Nguyễn Văn B",
      phone: "0123456789",
      date: "2025-08-19",
      class: "Thu",
      money: "5,000,000",
      note: "",
    },
  ]);

  const [usedate, setusedate] = useState(dayjs().format("YYYY-MM-DD"));
  return (
    <div className="flex flex-col gap-4 md:flex-row h-full">
      <div className="p-2 sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between mb-2 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded">
          <div className="p-2 text-left text-2xl font-medium flex items-center gap-2">
            <LuClipboardList className="" />
            Detail List
          </div>
          <Add_note
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#24b8fc] hover:bg-blue-600 shadow-lg mr-[8px]"
            callback={(newNote) =>
              setData([...data, { ...newNote, stt: data.length + 1 }])
            }
          >
            <AiOutlinePlus size={20} className="text-white" />
          </Add_note>
        </div>

        <div className="topitem flex mb-4 p-2 gap-2">
          <Select
            className="!h-[40px] flex-2/3"
            showSearch
            placeholder="Lọc tên"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={data.map((key) => ({ value: key.stt, label: key.name }))}
          />

          <input
            type="date"
            value={usedate}
            onChange={(e) => setusedate(e.target.value)}
            className="flex-1/3 border rounded-md ml-[15px] px-4 py-2  bg-white shadow-sm !text-[#b5b5b5]"
          />
        </div>
      </div>
      <section className="md:flex-1 overflow-y-auto h-full mx-[10px]">
        <div className="space-y-3 pb-3">
          {data.map((key, index) => (
            <Groupcard key={key.id} data={{ ...key, stt: index + 1 }}>
              <Detailcard
                data={{ ...key, stt: index + 1 }}
                className="border rounded-lg shadow-sm p-3 bg-white border-[#c0cad3]"
              />
            </Groupcard>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DetailList;
