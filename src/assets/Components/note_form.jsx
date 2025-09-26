import { useEffect, useState } from "react";
import { Form, Input, InputNumber, Button } from "antd";
import { DatePicker, Footer } from "antd-mobile";
import dayjs from "dayjs";
import { FaArrowDown, FaArrowLeft } from "react-icons/fa";
import { IoSaveOutline } from "react-icons/io5";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import ClientManager from "./client";
import CustomerSelect from "./customer_select";

const STRIP_QTY_PRICE = /\s*SL:\s*\d+(?:[.,]\d+)?;\s*ĐG:\s*[\d.,]+₫\./;

const NoteForm = ({ form, user, onSubmit }) => {
  const quantity = Form.useWatch("quantity", form);
  const unitPrice = Form.useWatch("unitPrice", form);
  const category = Form.useWatch("category", form);

  const [openDate, setOpenDate] = useState(false);

  // đồng bộ money + note khi bật expandCalc
  useEffect(() => {
    const q = Number(quantity);
    const p = Number(unitPrice);
    if (!Number.isFinite(q) || !Number.isFinite(p)) return;

    const total = q * p;
    const currentNote = form.getFieldValue("note") || "";
    const base = currentNote.replace(STRIP_QTY_PRICE, "");
    const extraNote = ` SL: ${q}; ĐG: ${p.toLocaleString("vi-VN")}₫.`;

    form.setFieldsValue({ money: total, note: (base + extraNote).trim() });
  }, [quantity, unitPrice, form]);

  return (
    <Form
      form={form}
      layout="horizontal"
      initialValues={{
        date: dayjs().toDate(),
        category: "in",
        money: null,
      }}
      onFinish={onSubmit}
      labelCol={{ xs: 6 }}
      wrapperCol={{ xs: 18 }}
      colon={false}
    >
      {/* Họ tên */}
      <Form.Item label="Họ tên" required>
        <div className="flex gap-2 items-center text-center">
          <ClientManager>
            <AiOutlineUsergroupAdd className="w-7 h-7 text-[#5f9ea0]" />
          </ClientManager>

          {/* 👇 Đây mới là phần control */}
          <Form.Item
            name="userName"
            noStyle
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <CustomerSelect customers={user?.danhsachKH || []} />
          </Form.Item>
        </div>
      </Form.Item>

      {/* Ngày */}
      <Form.Item label="Ngày" name="date" rules={[{ required: true }]}>
        <Input
          readOnly
          className="rounded-xl shadow-md text-center !w-45"
          value={
            form.getFieldValue("date")
              ? dayjs(form.getFieldValue("date")).format("DD-MM-YYYY")
              : ""
          }
          placeholder="Chọn ngày"
          onClick={() => setOpenDate(true)}
        />
        <DatePicker
          title="Chọn ngày"
          cancelText="Hủy"
          confirmText="Xác nhận"
          precision="day"
          visible={openDate}
          onClose={() => setOpenDate(false)}
          onConfirm={(val) => {
            // ép về VN timezone trước khi lưu
            const local = dayjs(val).startOf("day").toDate();
            form.setFieldsValue({ date: local });
            setOpenDate(false);
          }}
        />
      </Form.Item>

      {/* Loại hình toggle */}
      <Form.Item label="Loại hình" required>
        <Form.Item name="category" noStyle>
          <Button
            type="default"
            className={`min-w-25 ...`}
            onClick={() =>
              form.setFieldsValue({
                category: category === "in" ? "out" : "in",
              })
            }
          >
            <FaArrowDown
              className={`transition-transform duration-300 ${
                category === "in" ? "text-green-600" : "text-red-500 rotate-180"
              }`}
            />
            {category === "in" ? "Thu về" : "Chi ra"}
          </Button>
        </Form.Item>
      </Form.Item>

      {/* Số lượng */}
      <Form.Item label="Số lượng" name="quantity">
        <InputNumber className="!min-w-35 !max-w-50 rounded-lg shadow-md !text-center" />
      </Form.Item>

      {/* Đơn giá */}
      <Form.Item label="Đơn giá" name="unitPrice">
        <InputNumber
          className="!min-w-45 !max-w-50 rounded-xl shadow-md"
          formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
          parser={(v) => v.replace(/\./g, "")}
        />
      </Form.Item>

      {/* Thành tiền */}
      <Form.Item label="Thành tiền" name="money">
        <InputNumber
          disabled
          className="!min-w-45 !max-w-50 rounded-xl shadow-md"
          formatter={(v) => (v ? `${Number(v).toLocaleString("vi-VN")} đ` : "")}
          parser={(v) => v.replace(/\./g, "")}
        />
      </Form.Item>

      {/* Ghi chú */}
      <Form.Item
        label="Ghi chú"
        name="note"
        rules={[{ required: true, message: "Cần nhập ghi chú" }]}
      >
        <Input.TextArea
          rows={3}
          placeholder="Ghi chú của bạn..."
          className="!min-w-60 rounded-xl shadow-md ghichu"
        />
      </Form.Item>
    </Form>
  );
};

export default NoteForm;
