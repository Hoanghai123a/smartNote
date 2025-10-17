import React, { useState } from "react";
import { Modal, Form, message, Button } from "antd";
import dayjs, { Dayjs } from "dayjs";
import api from "./api";
import { useUser } from "../../stores/userContext";
import NoteForm from "./note_form";
import { IoSaveOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";

const STRIP_QTY_PRICE =
  /\s*Số lượng:\s*\d+(?:[.,]\d+)?;\s*Đơn giá:\s*[\d.,]+₫\./;

const NoteModal = ({
  mode = "add",
  data = {},
  children,
  className,
  onSaved,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [form] = Form.useForm();
  const { user, setUser } = useUser();

  const openModal = () => {
    console.log(data);
    form.setFieldsValue({
      userName:
        data?.id != null
          ? String(data.id)
          : data?.khachhang != null
          ? String(data.khachhang)
          : undefined,

      userPhone: data.sodienthoai ?? "",
      date: data.thoigian ? dayjs(data.thoigian) : dayjs(),
    });
    if (mode === "edit") {
      form.setFieldsValue({
        phanloai: data.phanloai ?? "in",
        soluong: data.soluong ?? 0,
        dongia: data.dongia ?? 0,
        money: data.sotien ?? 0,
        note: data.noidung ?? "",
      });
      form.setFieldsValue({
        userName: data.khachhang ? String(data.khachhang) : undefined,
      });
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    form.resetFields();
    setIsOpen(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();
      const payload = {
        tenghichu: "test",
        khachhang: values.userName ? String(values.userName) : null,
        thoigian: values.date
          ? dayjs(values.date).format("YYYY-MM-DDTHH:mm:ss")
          : null,
        phanloai: values.phanloai,
        soluong: values.soluong ?? 0,
        dongia: values.dongia ?? 0,
        sotien: values.money ?? 0,
        noidung: values.note ?? "",
      };

      let res;
      if (mode === "add") {
        res = await api.post("/notes/", payload, user?.token);
        setUser((old) => ({
          ...old,
          danhsachNote: [...(old?.danhsachNote || []), res],
        }));
        message.success("Thêm ghi chú thành công");
      } else {
        res = await api.patch(`/notes/${data.id}/`, payload, user?.token);
        setUser((old) => ({
          ...old,
          danhsachNote: (old?.danhsachNote || []).map((n) =>
            n.id === res.id ? res : n
          ),
        }));
        message.success("Cập nhật thành công");
      }

      onSaved?.(res);
      closeModal();
    } catch (err) {
      console.error(err);
      message.error(mode === "add" ? "Không thể thêm" : "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/notes/${data.id}/`, user?.token);
      setUser((old) => ({
        ...old,
        danhsachNote: (old?.danhsachNote || []).filter((n) => n.id !== data.id),
      }));
      message.success("Đã xóa");
      closeModal();
    } catch (err) {
      console.error(err);
      message.error("Xóa thất bại");
    } finally {
      setDeleting(false);
      setShowDelete(false);
    }
  };

  return (
    <>
      <button type="button" onClick={openModal} className={className}>
        {children}
      </button>
      <Modal
        open={isOpen}
        onCancel={() => closeModal}
        closable={false}
        footer={
          <div className="flex flex-col gap-1">
            <Button
              htmlType="button"
              loading={saving}
              disabled={saving}
              onClick={() => form.submit()}
              className={`w-full !h-11 rounded-xl font-medium !text-lg flex items-center justify-center shadow-md transition-transform
              ${
                saving
                  ? "!bg-gray-400 !cursor-not-allowed"
                  : "!bg-[#0084FF] !text-white hover:scale-[1.02]"
              }`}
            >
              {!saving && <IoSaveOutline className="w-6 h-6 mr-2" />}
              {saving ? "Đang lưu..." : "Lưu lại"}
            </Button>
            <Button
              variant="filled"
              color="danger"
              onClick={() => setShowDelete(true)}
            >
              Xóa
            </Button>
          </div>
        }
      >
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={closeModal}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-md hover:bg-gray-100 transition"
          >
            <FaArrowLeft className="text-gray-700" />
          </button>
          <div className="text-[16px] font-semibold border-b-amber-100">
            {mode === "add" ? "Thêm mới" : `Chỉnh sửa #${data?.hoten ?? ""}`}
          </div>
          <div className="w-10" /> {/* giữ cân đối */}
        </div>
        <NoteForm form={form} user={user} onSubmit={handleSave} />
      </Modal>
      <Modal
        title="Xóa ghi chú?"
        open={showDelete}
        onCancel={() => setShowDelete(false)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: deleting }}
        onOk={handleDelete}
      >
        Hành động này không thể hoàn tác.
      </Modal>
    </>
  );
};

export default NoteModal;
