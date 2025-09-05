import React, { useState } from "react";
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
      name: data.name ?? data.khachhang ?? "",
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
        date: values.date ? values.date.format("YYYY-MM-DD HH:mm") : null,
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
          data?.khachhang ?? data?.name ?? ""
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

          <Form.Item label="Phân loại" name="class">
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
