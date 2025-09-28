// Contact.jsx
import { useRef, useState, useMemo } from "react";
import { Modal, Image } from "antd";
import cuphong from "../../assets/img/cuphong.jpg";
import { FaCamera } from "react-icons/fa";
import { useUser } from "../../stores/userContext.jsx";

const Contact = ({ children }) => {
  const { user } = useUser();
  const [preview, setPreview] = useState(null);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);

  const countKH = useMemo(() => {
    if (!Array.isArray(user?.danhsachNote)) return 0;
    const filtered = user.danhsachNote.filter((n) => n.trangthai === "not");
    const uniqueIds = new Set(filtered.map((n) => n.khachhang));
    return uniqueIds.size;
  }, [user?.danhsachNote]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      {/* Trigger */}
      <div
        onClick={() => setOpen(true)}
        className="inline-block cursor-pointer"
      >
        {children}
      </div>

      {/* Modal */}
      <Modal
        title="Thông tin cá nhân"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={600}
        styles={{
          body: {
            maxHeight: "80vh",
            overflowY: "auto",
          },
          header: {
            borderBottom: "1px solid #eee",
          },
          footer: {
            display: "none",
          },
        }}
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Image
                className="rounded-2xl shadow-xl"
                width={150}
                height={150}
                alt="Avatar"
                src={preview || cuphong}
              />
              <button
                type="button"
                onClick={handleClick}
                className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              >
                <FaCamera className="text-gray-700" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="rounded-lg shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] bg-white py-[10px]">
            <div className="mx-2 font-medium">Họ tên:</div>
            <div className="pl-10">
              {user?.username ? user?.username : "Hi Tech"}
            </div>

            <div className="mx-2 font-medium">SĐT:</div>
            <div className="pl-10">
              {user?.thongtinthem?.phone ?? "0123-456-789"}
            </div>

            <div className="mx-2 font-medium">Địa chỉ:</div>
            <div className="pl-10">
              {user?.thongtinthem?.address ??
                "Vinh Tiến - Bình Tuyền - Phú Thọ"}
            </div>

            <div className="mx-2 mt-4">
              Số lượng KH còn giao dịch: {countKH}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Contact;
