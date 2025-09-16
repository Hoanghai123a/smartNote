import { CiStickyNote } from "react-icons/ci";

const FieldNote = ({ data, className }) => {
  if (!data) return null;

  return (
    <div className={`text-sm text-neutral-500 font-normal pt-2 ${className}`}>
      <div>{data || "--"}</div>
    </div>
  );
};

export default FieldNote;
