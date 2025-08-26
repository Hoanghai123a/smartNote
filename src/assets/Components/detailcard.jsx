import { Button } from "antd";
import {
  AiOutlineDollarCircle,
  AiOutlinePhone,
  AiOutlineUser,
} from "react-icons/ai";
import { VscSymbolClass } from "react-icons/vsc";
import { Link } from "react-router-dom";

const Detailcard = ({ className, data }) => {
  return (
    <div className={className}>
      <>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-600">
            #{data.stt}
          </span>
          <span className="text-xs text-gray-400">{data.date}</span>
        </div>

        <div className="space-y-1 text-sm">
          <div className="flex w-full">
            <div className="flex-1">
              <div className="flex items-center">
                <AiOutlineUser className="text-blue-500 mr-[4px]" />
                <span className="font-medium text-gray-700"></span>
                <span className="ml-2">{data.name}</span>
              </div>
              <div className="flex items-center">
                <AiOutlinePhone className="text-green-500 mr-[4px]" />
                <span className="font-medium text-gray-700"></span>
                <Link to={"tel:" + data.phone}>{data.phone}</Link>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <VscSymbolClass className="text-purple-500 mr-[4px]" />
                <span className="font-medium text-gray-700"></span>
                <span className="ml-2">{data.classify}</span>
              </div>
              <div className="flex items-center">
                <AiOutlineDollarCircle className="text-yellow-500 mr-[4px]" />
                <span className="font-medium text-gray-700"> </span>
                <span className="text-green-600 font-semibold ml-2">
                  {data.money}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-start border-t border-gray-300 mt-[10px]">
            <div className="flex flex-col">
              <span className="font-medium text-gray-500 text-nowrap">
                Ghi chú:
              </span>
              <span className="ml-2 text-gray-500">{data.note}</span>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Detailcard;
