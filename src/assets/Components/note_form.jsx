import React, { useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Form, Input, InputNumber, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import CategoryManager from "./Category";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";
import ClientManager from "./client";

const STRIP_QTY_PRICE =
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
      userPhone: formatPhone(found?.sodienthoai) || undefined,
    });
  };

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
      <Form.Item label="Họ tên">
        <div className="flex items-center gap-2">
          <Form.Item name="userName" noStyle>
            <Select
              showSearch
              placeholder="Chọn họ tên"
              options={nameSelect}
              optionFilterProp="label"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={handleUserChange}
            />
          </Form.Item>
          <ClientManager>
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 rounded-md bg-white text-[#8c8c8c] hover:border-[#40a9ff] hover:text-[#40a9ff] transition-colors"
              aria-label="Thêm khách hàng"
            >
              <AiOutlineUserAdd className="text-[cadetblue]" size={23} />
            </button>
          </ClientManager>
        </div>
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

      <Form.Item label="Nhóm">
        <div className="flex items-center gap-2">
          <Form.Item name="group" noStyle>
            <Select options={groupSelect} placeholder="Chọn nhóm" />
          </Form.Item>
          <CategoryManager>
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 rounded-md bg-white text-[#8c8c8c] hover:border-[#40a9ff] hover:text-[#40a9ff] transition-colors"
              aria-label="Thêm nhóm"
            >
              <MdOutlinePlaylistAdd className="text-[cadetblue]" size={23} />
            </button>
          </CategoryManager>
        </div>
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
        <div
          className="flex items-center justify-center select-none"
          style={{ marginLeft: 120, marginBottom: 8 }}
        >
          <button
            type="button"
            onClick={onToggleExpand}
            className="w-full text-left text-gray-400 hover:text-gray-600 transition"
          >
            <div className="flex items-center text-gray-400 gap-2 justify-end">
              <span className="text-sm">Tùy chọn thêm</span>
              <DownOutlined
                className={`text-xs transition-transform ${
                  expandCalc ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>
        </div>
      )}

      {expandCalc && (
        <Form.Item colon={false}>
          <div className="flex gap-2 items-center justify-end">
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
