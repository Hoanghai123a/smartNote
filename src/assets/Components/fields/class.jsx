import { VscSymbolClass } from "react-icons/vsc";

const Fieldclass = ({ data, className }) => {
  if (!data) return null;
  return (
    <div className={`flex items-center ${className}`}>
      <VscSymbolClass className="text-blue-900-500 mr-[4px]" />
      <div className="">{data}</div>
    </div>
  );
};

export default Fieldclass;
