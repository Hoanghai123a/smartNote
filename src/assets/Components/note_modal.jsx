import React, { useState } from "react";
import { Modal, Form, message, Button } from "antd";
import dayjs from "dayjs";
import api from "./api";
import { useUser } from "../../stores/userContext";
import NoteForm from "./note_form";

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
  const [expandCalc, setExpandCalc] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [form] = Form.useForm();
  const { user, setUser } = useUser();

  const openModal = () => {
    if (mode === "edit") {
      form.setFieldsValue({
        userName: data.khachhang ? String(data.khachhang) : undefined,
        userPhone: data.sodienthoai ?? "",
        date: data.thoigian ? dayjs(data.thoigian) : null,
        group: data.loai ? String(data.loai) : undefined,
        category: data.phanloai ?? "in",
        money: data.sotien ?? 0,
        note: data.noidung ?? "",
      });
      console.log("data.khachhang:", data.khachhang);
      form.setFieldsValue({
        userName: data.khachhang ? String(data.khachhang) : undefined,
      });
    }
    setIsOpen(true);
  };

  const toggleExtra = () => {
    setExpandCalc((prev) => {
      if (prev) {
        const currentNote = form.getFieldValue("note") || "";
        const base = currentNote.replace(STRIP_QTY_PRICE, "").trim();
        form.setFieldsValue({ note: base });
      }
      return !prev;
    });
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
        loai: values.group ? Number(values.group) : null,
        phanloai: values.category,
        sotien: values.money ?? 0,
        noidung: values.note ?? "",
      };
      console.log("Form values:", values);

      let res;
      if (mode === "add") {
        res = await api.post("/notes/", payload, user?.token);
        setUser((old) => ({
          danhsachNote: [...(old?.danhsachNote || []), res, ...old],
        }));
        message.success("Thêm ghi chú thành công");
      } else {
        res = await api.patch(`/notes/${data.id}/`, payload, user?.token);
        setUser((old) => ({
          danhsachNote: (old?.danhsachNote || []).map(
            (n) => (n.id === res.id ? res : n),
            ...old
          ),
        }));
        message.success("Cập nhật thành công");
      }

      onSaved?.(res);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      message.error(mode === "add" ? "Không thể thêm ghi chú" : "Lưu thất bại");
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
      message.success("Đã xóa ghi chú");
      setIsOpen(false);
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
        title={mode === "add" ? "Thêm mới" : `Chỉnh sửa #${data?.id ?? ""}`}
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={
          mode === "add"
            ? [
                <Button key="cancel" onClick={() => setIsOpen(false)}>
                  Hủy
                </Button>,
                <Button
                  key="save"
                  type="primary"
                  loading={saving}
                  onClick={handleSave}
                >
                  Lưu
                </Button>,
              ]
            : [
                <Button key="cancel" onClick={() => setIsOpen(false)}>
                  Hủy
                </Button>,
                <Button
                  key="delete"
                  danger
                  loading={deleting}
                  onClick={() => setShowDelete(true)}
                >
                  Xóa
                </Button>,
                <Button
                  key="save"
                  type="primary"
                  loading={saving}
                  onClick={handleSave}
                >
                  Lưu
                </Button>,
              ]
        }
      >
        <NoteForm
          form={form}
          user={user}
          expandCalc={mode === "add" ? expandCalc : false}
          onToggleExpand={mode === "add" ? toggleExtra : undefined}
        />
      </Modal>

      {mode === "edit" && (
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
      )}
    </>
  );
};

export default NoteModal;
