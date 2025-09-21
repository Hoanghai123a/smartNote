import React, { useEffect, useState } from "react";
import { DownOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Form, Input, InputNumber, Select, Button, Space } from "antd";
import { DatePicker } from "antd-mobile";
import dayjs from "dayjs";
import CategoryManager from "./Category";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";
import ClientManager from "./client";

const STRIP_QTY_PRICE =
  /\s*Số lượng:\s*\d+(?:[.,]\d+)?;\s*Đơn giá:\s*[\d.,]+₫\./g;

const NoteForm = ({ form, user, expandCalc, onToggleExpand }) => {
  const currentId = Form.useWatch("userName", form);
  const items = Form.useWatch("items", form) || [];

  const [openDate, setOpenDate] = useState(false);

  // === đồng bộ money + note từ danh sách items
  useEffect(() => {
    if (!expandCalc) {
      form.setFieldsValue({
        note: "", // reset ghi chú
        money: null, // reset số tiền luôn nếu muốn
      });
    }
    if (!Array.isArray(items)) return;

    let total = 0;
    const lines = [];

    items.forEach((item) => {
      const q = Number(item?.quantity);
      const p = Number(item?.unitPrice);
      if (!Number.isFinite(q) || !Number.isFinite(p)) return;
      total += q * p;
      lines.push(`Số lượng: ${q}; Đơn giá: ${p.toLocaleString("vi-VN")}₫.`);
    });

    const currentNote = form.getFieldValue("note") || "";
    const base = currentNote.replace(STRIP_QTY_PRICE, "").trim();

    form.setFieldsValue({
      money: total,
      note: [base, ...lines].filter(Boolean).join("\n"),
    });
  }, [expandCalc, items, form]);

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
    const d = String(sdt ?? "").replace(/\D/g, "");
    if (!d) return "";
    if (d.length <= 4) return d;
    if (d.length <= 7) return `${d.slice(0, 4)}-${d.slice(4)}`;
    return `${d.slice(0, 4)}-${d.slice(4, 7)}-${d.slice(7, 10)}`;
  };

  // khi chọn người → auto phone
  useEffect(() => {
    if (!currentId) {
      form.setFieldsValue({ userPhone: null });
      return;
    }
    const found = user?.danhsachKH?.find(
      (u) => String(u.id) === String(currentId)
    );
    form.setFieldsValue({
      userPhone: found?.sodienthoai ? formatPhone(found.sodienthoai) : null,
    });
  }, [form, user?.danhsachKH, currentId]);

  return (
    <Form
      form={form}
      layout="horizontal"
      labelCol={{ flex: "120px" }}
      wrapperCol={{ flex: 1 }}
      colon={false}
      style={{ maxWidth: 560 }}
      initialValues={{
        date: dayjs().toDate(),
        category: "in",
        money: null,
        items: [{ quantity: 0, unitPrice: 0 }],
      }}
    >
      {/* Họ tên */}
      <Form.Item label="Họ tên">
        <div className="flex items-center gap-2">
          <Form.Item name="userName" noStyle>
            <Select
              showSearch
              placeholder="Chọn họ tên"
              options={nameSelect}
              optionFilterProp="label"
            />
          </Form.Item>
          <ClientManager>
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 rounded-md bg-white"
            >
              <AiOutlineUserAdd className="text-[cadetblue]" size={23} />
            </button>
          </ClientManager>
        </div>
      </Form.Item>

      {/* SĐT */}
      <Form.Item label="SĐT" name="userPhone">
        <Input disabled />
      </Form.Item>

      {/* Ngày */}
      <Form.Item label="Ngày" name="date" rules={[{ required: true }]}>
        <>
          <Input
            readOnly
            value={
              form.getFieldValue("date")
                ? dayjs(form.getFieldValue("date")).format("YYYY-MM-DD")
                : ""
            }
            onClick={() => setOpenDate(true)}
          />
          <DatePicker
            title="Chọn ngày"
            visible={openDate}
            onClose={() => setOpenDate(false)}
            onConfirm={(val) => {
              form.setFieldsValue({ date: val });
              setOpenDate(false);
            }}
          />
        </>
      </Form.Item>

      {/* Nhóm */}
      <Form.Item label="Nhóm">
        <div className="flex items-center gap-2">
          <Form.Item name="group" noStyle>
            <Select options={groupSelect} placeholder="Chọn nhóm" />
          </Form.Item>
          <CategoryManager>
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 rounded-md bg-white"
            >
              <MdOutlinePlaylistAdd className="text-[cadetblue]" size={23} />
            </button>
          </CategoryManager>
        </div>
      </Form.Item>

      {/* Loại hình */}
      <Form.Item label="Loại hình" name="category" rules={[{ required: true }]}>
        <Select
          className="w-full"
          options={[
            { label: "Chờ thu", value: "in" },
            { label: "Cần trả", value: "out" },
          ]}
        />
      </Form.Item>

      {/* Toggle expand */}
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
            <div className="flex items-center gap-2 justify-end">
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

      {/* Danh sách nhiều dòng quantity × unitPrice */}
      {expandCalc && (
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <div className="flex flex-col ml-[100px] pb-2">
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, "quantity"]}
                    rules={[{ required: true, message: "Nhập số lượng" }]}
                  >
                    <InputNumber min={0} placeholder="Số lượng" />
                  </Form.Item>
                  <span>×</span>
                  <Form.Item
                    {...restField}
                    name={[name, "unitPrice"]}
                    rules={[{ required: true, message: "Nhập đơn giá" }]}
                  >
                    <InputNumber min={0} placeholder="Đơn giá" />
                  </Form.Item>
                  {fields.length > 1 && (
                    <DeleteOutlined
                      onClick={() => remove(name)}
                      className="text-red-500 cursor-pointer"
                    />
                  )}
                </Space>
              ))}
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                Thêm dòng
              </Button>
            </div>
          )}
        </Form.List>
      )}

      {/* Số tiền */}
      <Form.Item label="Số tiền" name="money">
        <InputNumber
          min={0}
          disabled={expandCalc}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/,/g, "")}
        />
      </Form.Item>

      {/* Ghi chú */}
      <Form.Item label="Ghi chú" name="note">
        <Input.TextArea rows={3} />
      </Form.Item>
    </Form>
  );
};

export default NoteForm;
