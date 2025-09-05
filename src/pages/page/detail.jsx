import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Spin,
  message,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { LuClipboardList } from "react-icons/lu";
import { AiOutlinePlus } from "react-icons/ai";
import Detailcard from "../../assets/Components/detailcard";
import Add_note from "../../assets/Components/add_note";
import Groupcard from "../../assets/Components/group_card";
import api from "../../assets/Components/api";
import { useUser } from "../../stores/userContext";
import { RiFilter3Line, RiArrowDownSLine } from "react-icons/ri";

const DetailList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useUser();
  const [showFilName, setshowFilName] = useState(false);
  const [showDateRange, setshowDateRange] = useState(false);

  // Lọc theo tên & khoảng ngày
  const [nameFilter, setNameFilter] = useState(undefined);
  const [dateRange, setDateRange] = useState([null, null]); // [dayjs|null, dayjs|null]
  const [start, end] = dateRange;
  const nameKey = (s = "") =>
    s
      .normalize("NFD") // tách dấu
      .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " "); // gộp khoảng trắng

  //lọc tên
  const userOptions = useMemo(() => {
    const arr = Array.isArray(user?.danhsachKH) ? user.danhsachKH : [];
    const uniq = [
      ...new Map(
        arr
          .filter((u) => (u?.hoten ?? "").trim()) // bỏ tên rỗng
          .map((u) => [nameKey(u.hoten), u]) // dùng key đã chuẩn hoá
      ).values(),
    ];

    return uniq.map((u) => ({ label: u.hoten, value: String(u?.id ?? "") }));
  }, [user?.danhsachKH]);

  const buildNotesUrl = ({ start, end, name }) => {
    const qs = new URLSearchParams();
    if (name) qs.set("khachhang", name);
    if (start) qs.set("created_at_from", start.format("YYYY-MM-DD"));
    if (end) qs.set("created_at_to", end.format("YYYY-MM-DD"));
    const s = qs.toString();
    return `/notes/${s ? `?${s}` : ""}`;
  };
  const fetchData = () => {
    setLoading(true);
    const url = buildNotesUrl({ start, end, name: nameFilter });
    api
      .get(url, user?.token)
      .then((res) => {
        setData(res?.results);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  // Lần đầu load
  useEffect(() => {
    if (user?.token) fetchData();
  }, [user, dateRange, nameFilter]);

  return (
    <div className="flex flex-col gap-4 md:flex-row h-full relative">
      <Add_note
        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#24b8fc] hover:bg-blue-600 shadow-lg mr-[8px] absolute right-2 bottom-10"
        callback={fetchData}
      >
        <AiOutlinePlus size={20} className="text-white" />
      </Add_note>
      <div className="p-2 sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between mb-2 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded">
          <div className="p-2 text-left text-2xl font-medium flex items-center gap-2">
            <LuClipboardList />
            Detail List
          </div>
        </div>

        <div className="topitem p-2 gap-2 items-center relative">
          <div className="flex gap-3" role="button" tabIndex={0}>
            <RiFilter3Line
              className="text-neutral-500 bg-neutral-100 rounded-full border border-neutral-200 w-7 h-7 p-0.5"
              size={16}
              onClick={(e) => {
                e.stopPropagation();
                setshowFilName((v) => !v);
                setshowDateRange(false);
              }}
            />

            <div
              className="flex bg-neutral-100 rounded-full border border-neutral-200 justify-center items-center w-30 h-7"
              onClick={(e) => {
                e.stopPropagation();
                setshowFilName(false);
                setshowDateRange((v) => !v);
              }}
            >
              <span className="select-none">Toàn thời gian</span>
              <RiArrowDownSLine className="text-neutral-500" size={16} />
            </div>
          </div>
          {showFilName && (
            <Select
              className="!mt-3 min-w-[180px] w-[200px] "
              allowClear
              showSearch
              placeholder="Lọc tên"
              value={nameFilter}
              onChange={setNameFilter}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={userOptions}
              // getPopupContainer={(trigger) => trigger.parentElement}
            />
          )}
          {showDateRange && (
            <div className="flex mt-3 items-center min-w-[180px] gap-2 z-21 w-[500px]">
              <DatePicker
                className="ml-[15px]"
                allowClear={false}
                value={start}
                onChange={(val) => {
                  setDateRange([val, end]);
                }}
                format="YYYY-MM-DD"
              />
              <div>tới</div>
              <DatePicker
                disabled={!start}
                minDate={start}
                className="ml-[15px]"
                allowClear={false}
                value={end}
                onChange={(val) => {
                  setDateRange([start, val]);
                }}
                format="YYYY-MM-DD"
              />
            </div>
          )}
        </div>
      </div>

      <section className="md:flex-1 overflow-y-auto h-full mx-[10px]">
        <div className="space-y-3 pb-3">
          {loading ? (
            <div className="flex justify-center py-10">
              <Spin />
            </div>
          ) : (
            (data || [])?.map((item, index) => (
              <Groupcard key={item.id} data={{ ...item, stt: index + 1 }}>
                <Detailcard
                  data={{ ...item, stt: index + 1 }}
                  className="border rounded-lg shadow-sm p-3 bg-white border-[#c0cad3]"
                />
              </Groupcard>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default DetailList;
