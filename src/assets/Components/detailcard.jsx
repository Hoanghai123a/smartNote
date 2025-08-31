import FieldPhone from "./fields/phone";
import FieldName from "./fields/name";
import FieldMoney from "./fields/money";
import Fieldclass from "./fields/class";
import { FaRegEdit } from "react-icons/fa";
import FieldNote from "./fields/note";

const Detailcard = ({ className, data }) => {
  return (
    <div className={className}>
      <>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-600">
            #{data.stt}
          </span>
          <div className="flex gap-2">
            <span className="text-xs text-gray-400">{data.date}</span>
            <FaRegEdit className="text-gray-400 " />
          </div>
        </div>

        <div className="space-y-1 text-sm">
          <div className="flex w-full">
            <div className="flex-1">
              <div className="flex items-center">
                <FieldName data={data.name} />
              </div>
              <div className="flex items-center">
                <FieldPhone data={data.phone} />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <Fieldclass data={data.class} />
              </div>
              <div className="flex items-center">
                <FieldMoney data={data.money} />
              </div>
            </div>
          </div>
          <div className="flex items-start border-t border-gray-300 mt-[10px]">
            <div className="flex flex-col">
              <FieldNote data={data.note} />
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Detailcard;
