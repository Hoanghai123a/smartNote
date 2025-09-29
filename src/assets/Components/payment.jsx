import { Modal, message } from "antd";
import { useUser } from "../../stores/userContext";
import api from "./api";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const Payment = ({ children, id, sotien = 0 }) => {
  const { user, setUser } = useUser();
  const nav = useNavigate();

  const handleClick = () => {
    Modal.confirm({
      title: "Đã hoàn tất công nợ?",
      okText: "OK",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          // === 1. Update tất cả notes về trạng thái "done"
          const notesToUpdate = user?.danhsachNote?.filter(
            (n) => String(n.khachhang) === String(id) && n.trangthai === "not"
          );

          if (notesToUpdate?.length) {
            const promises = notesToUpdate.map((note) =>
              api.patch(
                `/notes/${note.id}/`,
                { ...note, trangthai: "done" },
                user?.token
              )
            );
            const results = await Promise.all(promises);
            const updatedMap = new Map(results.map((res) => [res.id, res]));
            setUser((old) => ({
              ...old,
              danhsachNote: old.danhsachNote.map((n) =>
                updatedMap.has(n.id) ? { ...n, ...updatedMap.get(n.id) } : n
              ),
            }));
          }

          // === 2. Thêm bản ghi tất toán
          const payload = {
            tenghichu: "test",
            khachhang: id,
            thoigian: dayjs().toISOString(),
            loai: null,
            phanloai: Number(sotien) < 0 ? "in" : "out",
            soluong: 1,
            dongia: Math.abs(Number(sotien)) || 0,
            sotien: Math.abs(Number(sotien)) || 0,
            trangthai: "done",
            noidung: "tất toán",
          };

          const res = await api.post("/notes/", payload, user?.token);

          setUser((old) => ({
            ...old,
            danhsachNote: [...(old?.danhsachNote || []), res],
          }));

          message.success("Đã hoàn tất công nợ");
          nav("/", { replace: true });
        } catch (err) {
          console.error("❌ Lỗi khi xử lý công nợ:", err);
          message.error("Có lỗi xảy ra khi cập nhật công nợ");
          throw err; // để Modal không đóng khi lỗi
        }
      },
    });
  };

  return <div onClick={handleClick}>{children}</div>;
};

export default Payment;
