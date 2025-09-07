import React, { useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  message,
  Button,
} from "antd";
import dayjs from "dayjs";
import api from "./api";
import { useUser } from "../../stores/userContext";

const EditCardValue = ({
  data = {},
  children,
  stopPropagation = true,
  onSaved,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const { user } = useUser();

  const openModal = (e) => {
    if (stopPropagation) {
      e.stopPropagation();
      e.preventDefault?.();
    }
    // map linh hoạt các field từ data
    form.setFieldsValue({
      name: data.name ?? data.hoten ?? "",
      phone: data.phone ?? data.sodienthoai ?? "",
      date: data.date
        ? dayjs(data.date)
        : data.thoigian
        ? dayjs(data.thoigian)
        : null,
      class: data.class ?? data.phanloai ?? undefined,
      money: data.money ?? data.sotien ?? 0,
      note: data.note ?? data.noidung ?? "",
    });
    setIsOpen(true);
  };

  const handleOk = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();

      const payload = {
        ...data,
        ...values,
        // chuẩn hoá ngày gửi lên server
        date: values.date ? values.date.format("YYYY-MM-DDTHH:mm:ss") : null,
      };

      await api.patch(`/notes/${data.id}/`, payload, user?.token);
      message.success("Đã lưu");
      setIsOpen(false);
      onSaved?.(payload);
    } catch (err) {
      console.error("Lưu thất bại:", err);
      message.error("Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/notes/${data.id}/`, user?.token);
      message.success("Đã xóa ghi chú");
      setIsOpen(false);
    } catch (e) {
      console.error(e);
      message.error("Xóa thất bại");
    } finally {
      setDeleting(false);
      setShowDelete(false);
    }
  };

  const fmt = (v) => {
    if (v === undefined || v === null || v === "") return "";
    const s = String(v).replace(/,/g, "");
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const parse = (v) => {
    if (v === undefined || v === null || v === "") return "";
    return String(v).replace(/,/g, "");
  };
  const groupSelect = useMemo(() => {
    const arr = Array.isArray(user?.danhsachGroup) ? user.danhsachGroup : [];

    // loại phần tử rỗng và khử trùng lặp theo type (không phân biệt hoa/thường)
    const seen = new Set();
    const uniq = [];
    for (const g of arr) {
      const t = String(g?.type ?? "").trim();
      if (!t) continue;
      const key = t.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      uniq.push(g);
    }

    // label = type (hiển thị), value = id (dùng post)
    return uniq.map((g) => ({ label: g.type, value: String(g.id) }));
  }, [user?.danhsachGroup]);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="cursor-pointer inline-flex items-center"
      >
        {children}
      </button>

      {/* Modal chỉnh sửa */}
      <Modal
        title={`Chỉnh sửa #${data?.id ?? ""} ${
          data?.hoten ?? data?.name ?? ""
        }`}
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>,
          <Button
            key="delete"
            danger
            loading={deleting}
            onClick={() => setShowDelete(true)} // mở modal xác nhận xóa
          >
            Xóa
          </Button>,
          <Button key="save" type="primary" loading={saving} onClick={handleOk}>
            Lưu
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ flex: "120px" }}
          wrapperCol={{ flex: 1 }}
          labelAlign="left"
        >
          <Form.Item
            label="Họ Tên"
            name="name"
            rules={[{ required: true, message: "Nhập họ tên" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="SĐT" name="phone">
            <Input />
          </Form.Item>

          <Form.Item label="Ngày" name="date">
            <DatePicker showTime format="YYYY-MM-DD HH:mm" className="w-full" />
          </Form.Item>

          <Form.Item label="Phân nhóm" name="class">
            <Select options={groupSelect} />
          </Form.Item>

          <Form.Item
            label="Loại hình"
            name="category"
            rules={[{ required: true, message: "Vui lòng chọn loại hình" }]}
          >
            <Select
              options={[
                { label: "Thu", value: "in" },
                { label: "Chi", value: "out" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Số tiền" name="money">
            <InputNumber
              className="w-full"
              min={0}
              formatter={fmt}
              parser={parse}
            />
          </Form.Item>

          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
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

export default EditCardValue;
