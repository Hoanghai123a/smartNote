import FieldPhone from "./fields/phone";
import FieldName from "./fields/name";
import FieldMoney from "./fields/money";
import Fieldclass from "./fields/class";
import { FaRegEdit } from "react-icons/fa";
import FieldNote from "./fields/note";
import EditCardValue from "./edit_card";
import dayjs from "dayjs";

const Detailcard = ({ className, data }) => {
  return (
    <div className={className}>
      <>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-600">
            #{data.stt}
          </span>
          <div className="flex gap-2">
            <span className="text-xs text-gray-400">
              {dayjs(data.thoigian).format("DD-MM-YYYY")}
            </span>
            <EditCardValue data={data}>
              <FaRegEdit className="text-gray-400 " />
            </EditCardValue>
          </div>
        </div>

        <div className="space-y-1 text-sm">
          <div className="flex w-full">
            <div className="flex-1">
              <div className="flex items-center">
                <FieldName data={data.khachhang} />
              </div>
              <div className="flex items-center">
                <FieldPhone data={data.sdt} />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <Fieldclass data={data.loai} />
              </div>
              <div className="flex items-center">
                <FieldMoney data={data.sotien} />
              </div>
            </div>
          </div>
          <div className="flex items-start border-t border-gray-300 mt-[10px]">
            <div className="flex flex-col">
              <FieldNote data={data.tenghichu} />
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Detailcard;
