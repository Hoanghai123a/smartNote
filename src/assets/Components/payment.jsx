import { Modal, message } from "antd";
import { useUser } from "../../stores/userContext";
import api from "./api";

const Payment = ({ children, id }) => {
  const { user, setUser } = useUser();

  const handleClick = () => {
    Modal.confirm({
      title: "Đã hoàn tất công nợ?",
      okText: "OK",
      cancelText: "Hủy",
      async onOk() {
        try {
          // Lấy danh sách note
          const updatedNotes =
            user?.danhsachNote?.map((n) =>
              String(n.khachhang) === String(id)
                ? { ...n, trangthai: "hide" }
                : n
            ) || [];

          // Gọi API để cập nhật backend (ví dụ PATCH hoặc POST hàng loạt)
          const notesToUpdate = user?.danhsachNote?.filter(
            (n) => String(n.khachhang) === String(id)
          );

          if (notesToUpdate?.length) {
            // push từng bản ghi hoặc viết 1 API batch
            for (const note of notesToUpdate) {
              await api.patch(
                `/notes/${note.id}/`,
                {
                  ...note,
                  trangthai: "done",
                },
                user?.token
              );
            }
          }

          // Update local state
          setUser((old) => ({
            ...old,
            danhsachNote: updatedNotes,
          }));

          message.success("Đã hoàn tất công nợ");
        } catch (err) {
          console.error(err);
          message.error("Có lỗi xảy ra khi cập nhật công nợ");
        }
      },
    });
  };

  return <div onClick={handleClick}>{children}</div>;
};

export default Payment;
