import { CiCalendarDate } from "react-icons/ci";

const FieldDate = ({ data, className }) => {
  if (!data) return null;
  return (
    <div className={`flex items-center ${className}`}>
      <CiCalendarDate className="mr-[4px]" />
      <div className="">{data}</div>
    </div>
  );
};

export default FieldDate;
