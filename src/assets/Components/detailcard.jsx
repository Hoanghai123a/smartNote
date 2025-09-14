import FieldPhone from "./fields/phone";
import FieldName from "./fields/name";
import FieldMoney from "./fields/money";
import Fieldclass from "./fields/class";
import { FaRegEdit } from "react-icons/fa";
import FieldNote from "./fields/note";
import dayjs from "dayjs";
import { useUser } from "../../stores/userContext";
import { useMemo } from "react";
import NoteModal from "./note_modal";

const Detailcard = ({ className, data }) => {
  const { user } = useUser();

  // Tìm group theo id (hỗ trợ data.loai là số, chuỗi, hoặc object {id,...})
  const group = useMemo(() => {
    const groups = Array.isArray(user?.danhsachGroup) ? user.danhsachGroup : [];
    const id = String(data?.loai?.id ?? data?.loai ?? "");
    if (!id) return undefined;
    return groups.find((g) => String(g?.id) === id);
  }, [user?.danhsachGroup, data?.loai]);

  const dateStr = useMemo(() => {
    const d = dayjs(data?.thoigian);
    return d.isValid() ? d.format("DD-MM-YYYY") : "";
  }, [data?.thoigian]);

  const moneyStr = useMemo(() => {
    const n = Number(data?.sotien ?? 0);
    return Number.isFinite(n) ? n.toLocaleString("vi-VN") : "0";
  }, [data?.sotien]);

  return (
    <div className={className}>
      <>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-600">
            #{data?.stt ?? ""}
          </span>
          <div className="flex gap-2">
            <span className="text-xs text-gray-400">{dateStr}</span>
            <NoteModal mode="edit" data={data} className="ant-modal">
              <FaRegEdit className="text-gray-400 " />
            </NoteModal>
          </div>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex w-full">
            <div className="flex-1">
              <div className="flex items-center">
                <FieldName data={data?.hoten ?? ""} />
              </div>
              <div className="flex items-center">
                <FieldPhone data={data?.sodienthoai ?? ""} />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center">
                {/* Nếu Fieldclass cần text, dùng group?.type; 
                   nếu nó nhận object, để group như cũ */}
                <Fieldclass data={group?.type ?? ""} />
              </div>

              <div
                className={`flex items-center ${
                  data?.phanloai === "in" ? " text-[green]" : " text-[red]"
                }`}
              >
                <FieldMoney data={moneyStr} />
              </div>
            </div>
          </div>

          <div className="flex items-start border-t border-gray-300 mt-[10px]">
            <div className="flex flex-col">
              <FieldNote data={data?.noidung ?? ""} />
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Detailcard;
