import React, { useEffect } from "react";
import { Form, Input, InputNumber, DatePicker, Select } from "antd";
import dayjs from "dayjs";

export const STRIP_QTY_PRICE =
  /\s*Số lượng:\s*\d+(?:[.,]\d+)?;\s*Đơn giá:\s*[\d.,]+₫\./;

const NoteForm = ({ form, user, expandCalc, onToggleExpand }) => {
  const quantity = Form.useWatch("quantity", form);
  const unitPrice = Form.useWatch("unitPrice", form);

  // đồng bộ money + note khi bật expandCalc
  useEffect(() => {
    if (!expandCalc) return;
    const q = Number(quantity);
    const p = Number(unitPrice);
    if (!Number.isFinite(q) || !Number.isFinite(p)) return;

    const total = q * p;
    const currentNote = form.getFieldValue("note") || "";
    const base = currentNote.replace(STRIP_QTY_PRICE, "");
    const extraNote = ` Số lượng: ${q}; Đơn giá: ${p.toLocaleString(
      "vi-VN"
    )}₫.`;

    form.setFieldsValue({ money: total, note: (base + extraNote).trim() });
  }, [expandCalc, quantity, unitPrice, form]);

  // options
  const nameSelect = (user?.danhsachKH || []).map((u) => ({
    label: u.hoten,
    value: String(u.id),
  }));
  const groupSelect = (user?.danhsachGroup || []).map((g) => ({
    label: g.type,
    value: String(g.id),
  }));

  return (
    <Form
      form={form}
      layout="horizontal"
      labelCol={{ flex: "120px" }}
      wrapperCol={{ flex: 1 }}
      colon={false}
      style={{ maxWidth: 560 }}
      initialValues={{
        date: dayjs(),
        category: "in",
        money: null,
      }}
    >
      <Form.Item
        label="Họ tên"
        name="userName"
        rules={[{ required: true, message: "Chọn khách hàng" }]}
      >
        <Select
          options={nameSelect}
          showSearch
          optionFilterProp="label"
          placeholder="Chọn khách hàng"
        />
      </Form.Item>

      <Form.Item label="SĐT" name="userPhone">
        <Input disabled />
      </Form.Item>

      <Form.Item
        label="Ngày"
        name="date"
        rules={[{ required: true, message: "Chọn ngày" }]}
      >
        <DatePicker showTime format="YYYY-MM-DD HH:mm" className="w-full" />
      </Form.Item>

      <Form.Item label="Nhóm" name="group">
        <Select options={groupSelect} placeholder="Chọn nhóm" />
        <CategoryManager>
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-md bg-white text-[#8c8c8c] hover:border-[#40a9ff] hover:text-[#40a9ff] transition-colors"
            aria-label="Thêm nhóm"
          >
            <MdOutlinePlaylistAdd className="text-[cadetblue]" size={23} />
          </button>
        </CategoryManager>
      </Form.Item>

      <Form.Item
        label="Loại hình"
        name="category"
        rules={[{ required: true, message: "Chọn loại hình" }]}
      >
        <Select
          options={[
            { label: "Thu", value: "in" },
            { label: "Chi", value: "out" },
          ]}
        />
      </Form.Item>

      {onToggleExpand && (
        <div style={{ marginLeft: 120, marginBottom: 8 }}>
          <button type="button" onClick={onToggleExpand}>
            Tùy chọn thêm
          </button>
        </div>
      )}

      {expandCalc && (
        <Form.Item colon={false}>
          <div className="flex gap-2 items-center">
            <Form.Item
              name="quantity"
              noStyle
              rules={[{ required: true, message: "Nhập số lượng" }]}
            >
              <InputNumber min={0} placeholder="Số lượng" />
            </Form.Item>
            <span>×</span>
            <Form.Item
              name="unitPrice"
              noStyle
              rules={[{ required: true, message: "Nhập đơn giá" }]}
            >
              <InputNumber min={0} placeholder="Đơn giá" />
            </Form.Item>
          </div>
        </Form.Item>
      )}

      <Form.Item label="Số tiền" name="money">
        <InputNumber min={0} disabled={expandCalc} />
      </Form.Item>

      <Form.Item label="Ghi chú" name="note">
        <Input.TextArea rows={3} />
      </Form.Item>
    </Form>
  );
};

export default NoteForm;
