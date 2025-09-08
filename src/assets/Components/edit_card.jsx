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
    console.log(data);
    if (stopPropagation) {
      e.stopPropagation();
      e.preventDefault?.();
    }
    // map linh hoạt các field từ data
    form.setFieldsValue({
      name: data.hoten ?? "",
      phone: data.sodienthoai ?? "",
      date: data.thoigian ? dayjs(data.thoigian) : null,
      group: data.loai ?? undefined,
      category: data.phanloai ?? "Thu",
      money: data.sotien ?? 0,
      note: data.noidung ?? "",
    });
    setIsOpen(true);
  };
  const nameKey = (s = "") =>
    s
      .normalize("NFD") // tách dấu
      .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " "); // gộp khoảng trắng

  //lọc tên
  const nameSelect = useMemo(() => {
    const arr = Array.isArray(user?.danhsachKH) ? user.danhsachKH : [];
    const uniq = [
      ...new Map(
        arr
          .filter((u) => (u?.hoten ?? "").trim()) // bỏ tên rỗng
          .map((u) => [nameKey(u.hoten), u]) // dùng key đã chuẩn hoá
      ).values(),
    ];

    return uniq.map((u) => ({ label: u.hoten, value: String(u?.id ?? "") }));
  }, [user?.danhsachKH]);

  const formatPhone = (sdt) => {
    const d = String(sdt ?? "").replace(/\D/g, ""); // giữ lại số
    if (!d) return "";
    if (d.length <= 4) return d;
    if (d.length <= 7) return `${d.slice(0, 4)}-${d.slice(4)}`;
    return `${d.slice(0, 4)}-${d.slice(4, 7)}-${d.slice(7, 10)}`; // 4-3-3
  };

  // khi chọn người → auto phone
  const handleUserChange = async (val) => {
    const found = user?.danhsachKH?.find((u) => String(u.id) === String(val));
    form.setFieldsValue({
      phone: formatPhone(found?.sodienthoai) || undefined,
    });
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
          <Form.Item label="Họ tên" name="name">
            <Select
              showSearch
              placeholder="Chọn họ tên"
              options={nameSelect}
              optionFilterProp="label"
              onChange={handleUserChange}
            />
          </Form.Item>

          <Form.Item label={"SĐT"} name={"phone"}>
            <Input disabled={true} />
          </Form.Item>

          <Form.Item label="Ngày" name="date">
            <DatePicker showTime format="YYYY-MM-DD HH:mm" className="w-full" />
          </Form.Item>

          <Form.Item label="Phân nhóm" name="group">
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
