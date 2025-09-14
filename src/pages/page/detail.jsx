import React, { useEffect, useMemo, useState, useCallback } from "react";
import { DatePicker, Select, Spin } from "antd";
import dayjs from "dayjs";
import { LuClipboardList } from "react-icons/lu";
import { AiOutlinePlus } from "react-icons/ai";
import Detailcard from "../../assets/Components/detailcard";
import Groupcard from "../../assets/Components/group_card";
import { useUser } from "../../stores/userContext";
import { RiFilter3Line, RiArrowDownSLine } from "react-icons/ri";
import NoteModal from "../../assets/Components/note_modal";
import GetFieldFormID from "../../assets/Components/get_fied";

const normalizeVN = (s = "") =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim()
    .replace(/\s+/g, " ");

const DetailList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const [showFilName, setshowFilName] = useState(false);
  const [showDateRange, setshowDateRange] = useState(false);

  // Lọc theo tên (ID khách) & khoảng ngày
  const [nameFilter, setNameFilter] = useState(undefined);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startTime, endTime] = dateRange;
  useEffect(() => {
    //show mặc định
    const listNote = Array.isArray(user?.danhsachNote)
      ? user?.danhsachNote
      : [];
    if (!showFilName && !showDateRange) {
      setData(listNote);
      return;
    }

    //lọc ngày tháng
    if (showDateRange && startTime && endTime) {
      const fil = listNote.filter((row) => {
        const t = dayjs(row.thoigian);
        return (
          !t.isBefore(dateRange[0].startOf("day")) &&
          !t.isAfter(dateRange[1].endOf("day"))
        );
      });
      setData(fil);
    }
    //lọc tên
    if (showFilName && nameKey(nameFilter)) {
      const findName = listNote.find((row) => row.khachhang == nameFilter);
      const fil = findName?.hoten
        ? listNote.filter(
            (row) => nameKey(row.hoten) == nameKey(findName.hoten)
          )
        : [];
      if (!findName?.hoten) {
        setData();
        return;
      }

      setData(fil);
    }
  }, [
    user?.danhsachNote,
    startTime,
    endTime,
    nameFilter,
    showDateRange,
    showFilName,
  ]);

  const nameKey = useCallback((s = "") => normalizeVN(s), []);

  // Danh sách KH cho Select (value = id, label = hoten)
  const userOptions = useMemo(() => {
    const arr = Array.isArray(user?.danhsachKH) ? user.danhsachKH : [];
    const uniq = [
      ...new Map(
        arr
          .filter((u) => (u?.hoten ?? "").trim())
          .map((u) => [nameKey(u.hoten), u])
      ).values(),
    ];
    return uniq.map((u) => ({ label: u.hoten, value: String(u?.id ?? "") }));
  }, [user?.danhsachKH, nameKey]);

  return (
    <div className="flex flex-col gap-4 md:flex-row h-full relative">
      <NoteModal
        mode="add"
        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#24b8fc] hover:bg-blue-600 shadow-lg mr-[8px] absolute right-2 bottom-10"
      >
        <AiOutlinePlus size={20} className="text-white" />
      </NoteModal>

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
              className="flex bg-neutral-100 rounded-full border border-neutral-200 justify-center items-center px-2 h-7"
              onClick={(e) => {
                e.stopPropagation();
                setshowFilName(false);
                setshowDateRange((v) => !v);
              }}
            >
              <span className="select-none">
                {startTime && endTime
                  ? `${startTime.format("YYYY-MM-DD")} → ${endTime.format(
                      "YYYY-MM-DD"
                    )}`
                  : "Toàn thời gian"}
              </span>
              <RiArrowDownSLine className="text-neutral-500" size={16} />
            </div>
          </div>

          {showFilName && (
            <Select
              className="!mt-3 min-w-[180px] w-[220px]"
              allowClear
              showSearch
              placeholder="Lọc theo khách hàng"
              value={nameFilter}
              onChange={setNameFilter}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={userOptions}
            />
          )}

          {showDateRange && (
            <div className="flex mt-3 items-center min-w-[180px] gap-2 z-21 w-[500px]">
              <DatePicker
                className="ml-[15px]"
                allowClear
                value={startTime}
                onChange={(val) => {
                  const end =
                    endTime && val && endTime.isBefore(val, "day")
                      ? null
                      : endTime;
                  setDateRange([val, end]);
                }}
                format="YYYY-MM-DD"
              />
              <div>tới</div>
              <DatePicker
                disabled={!startTime}
                className="ml-[15px]"
                allowClear
                value={endTime}
                disabledDate={(d) =>
                  !startTime ? false : d && d.isBefore(startTime, "day")
                }
                onChange={(val) => {
                  setDateRange([startTime, val]);
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
            (data || []).map((item, index) => {
              return (
                <Groupcard key={item.id ?? index} idKH={Number(item.khachhang)}>
                  <Detailcard
                    data={{
                      ...item,
                      stt: index + 1,
                      hoten: (
                        <GetFieldFormID
                          id={item.khachhang}
                          findField="hoten"
                          getForm={user.danhsachKH}
                        />
                      ),
                      sodienthoai: (
                        <GetFieldFormID
                          id={item.khachhang}
                          findField="sodienthoai"
                          getForm={user.danhsachKH}
                        />
                      ),
                    }}
                    className="border rounded-lg shadow-sm p-3 bg-white border-[#c0cad3]"
                  />
                </Groupcard>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default DetailList;
