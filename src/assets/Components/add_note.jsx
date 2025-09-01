import { DownOutlined } from "@ant-design/icons";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  DatePicker,
  Select,
  Checkbox,
} from "antd";
import dayjs from "dayjs";
import api from "./api";
import { useUser } from "../../stores/userContext";

const AddNote = ({ children, className, callback, users = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandCalc, setExpandCalc] = useState(false);
  const [form] = Form.useForm();
  const { user, setUser } = useUser();

  const buildExtraNote = (q, p, enabled) => {
    if (!enabled) return "";
    const qty = Number(q || 0);
    const price = Number(p || 0);
    return ` Số lượng: ${qty}; Đơn giá: ${price.toLocaleString("vi-VN")}₫.`;
  };
  const mergeNote = (note, extra) => {
    // xoá đoạn cũ nếu có để tránh nhân đôi
    const base = (note || "").replace(
      /\s*Số lượng:\s*\d+;\s*Đơn giá:\s*[\d.,]+₫\./,
      ""
    );
    return (base + extra).trim();
  };

  const userOptions = useMemo(
    () => (users || []).map((u) => ({ label: u.name, value: String(u.id) })),
    [users]
  );

  const showModal = () => {
    setIsModalOpen(true);
    setExpandCalc(false);
    form.setFieldsValue({
      date: dayjs(),
      category: "in",
      isNewUser: false,
      money: 0,
      quantity: undefined,
      unitPrice: undefined,
      note: undefined,
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setExpandCalc(false);
    form.resetFields();
  };

  // khi chọn người → auto phone
  const handleUserChange = (val) => {
    const found = (users || []).find((u) => String(u.id) === String(val));
    form.setFieldsValue({ phone: found?.phone || undefined });
  };

  // sync tiền & note khi thay đổi số lượng/đơn giá (khi switch bật)
  const handleValuesChange = (_, all) => {
    if (!expandCalc) return;
    const q = Number(all.quantity || 0);
    const p = Number(all.unitPrice || 0);
    const total = Math.max(0, q * p);
    form.setFieldsValue({ money: total });

    const extra = buildExtraNote(q, p, true);
    form.setFieldsValue({ note: mergeNote(all.note, extra) });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const isNew = !!values.isNewUser;

      // chuẩn hoá name/phone
      const newName = (values.newName || "").trim();
      const newPhone = (values.newPhone || "").trim();

      if (isNew) {
        const newName = (values.newName || "").trim();
        const newPhone = (values.newPhone || "").trim();
        //thêm người mới
        const newClient = { name: newName, sdt: newPhone };
        api.post(`/client/`, newClient);
      }

      const qty = Number(values.quantity || 0);
      const price = Number(values.unitPrice || 0);
      const extraNote = buildExtraNote(qty, price, expandCalc);
      const noteFinal = mergeNote(values.note, extraNote);

      const payload = {
        tenghichu: "test",
        khachhang: newName,
        sdt: newPhone,
        thoigian: values.date ? dayjs(values.date) : undefined,
        phanloai: values.category, // in - out
        loai: values.category,
        sotien: values.money ?? 0,
        noidung: noteFinal,
      };
      console.log(payload);
      api
        .post("/notes/", payload, user.token)
        .then((respon) => {
          console.log(respon);
          message.success("Thêm ghi chú thành công!");
          callback?.(payload);
          handleCancel();
        })
        .catch((err) => {
          console.log(err);
          message.error("Không thể thêm ghi chú.");
        });
    } catch (err) {
      console.error("Lỗi thêm ghi chú:", err);
      message.error("Không thể thêm ghi chú.");
    }
  };

  return (
    <>
      <div
        className={className}
        onClick={showModal}
        style={{ cursor: "pointer" }}
      >
        {children}
      </div>

      <Modal
        title="Thêm mới"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ flex: "120px" }}
          wrapperCol={{ flex: 1 }}
          labelAlign="left"
          colon={false}
          style={{ maxWidth: 560 }}
          onValuesChange={handleValuesChange}
        >
          {/* Người mới? */}
          <Form.Item name="isNewUser" valuePropName="checked" label="Người mới">
            <Checkbox>Thêm người mới</Checkbox>
          </Form.Item>

          {/* Họ tên (Select hoặc Input) */}
          <Form.Item
            noStyle
            shouldUpdate={(p, c) => p.isNewUser !== c.isNewUser}
          >
            {({ getFieldValue }) =>
              getFieldValue("isNewUser") ? (
                <Form.Item
                  label="Họ tên (mới)"
                  name="newName"
                  rules={[{ required: true, message: "Vui lòng nhập SĐT" }]}
                >
                  <Input />
                </Form.Item>
              ) : (
                <Form.Item label="Họ tên" name="userId">
                  <Select
                    showSearch
                    placeholder="Chọn họ tên"
                    options={userOptions}
                    optionFilterProp="label"
                    onChange={handleUserChange}
                  />
                </Form.Item>
              )
            }
          </Form.Item>

          {/* SĐT */}
          <Form.Item
            noStyle
            shouldUpdate={(p, c) => p.isNewUser !== c.isNewUser}
          >
            {({ getFieldValue }) => {
              const isNew = getFieldValue("isNewUser");
              return (
                <Form.Item
                  label={isNew ? "SĐT (mới)" : "SĐT"}
                  name={isNew ? "newPhone" : "phone"}
                  rules={
                    isNew
                      ? [{ required: true, message: "Vui lòng nhập SĐT" }]
                      : []
                  }
                >
                  <Input disabled={!isNew} />
                </Form.Item>
              );
            }}
          </Form.Item>

          <Form.Item
            label="Ngày"
            name="date"
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <DatePicker format="YYYY-MM-DD   HH:mm" className="w-full" />
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

          {/* Hàng "Tùy chọn thêm" căn thẳng với wrapper (labelCol = 120px) */}
          <div
            className="flex items-center justify-between select-none"
            style={{ marginLeft: 120, marginBottom: 8 }}
          >
            <button
              type="button"
              onClick={() => {
                const next = !expandCalc;
                setExpandCalc(next);
                const all = form.getFieldsValue();
                // cập nhật ghi chú khi mở/đóng
                const extra = buildExtraNote(all.quantity, all.unitPrice, next);
                form.setFieldsValue({ note: mergeNote(all.note, extra) });
                // nếu mở và đã có quantity/unitPrice → sync luôn money
                if (next) {
                  const q = Number(all.quantity || 0);
                  const p = Number(all.unitPrice || 0);
                  form.setFieldsValue({ money: Math.max(0, q * p) });
                }
              }}
              className="w-full text-left text-gray-400 hover:text-gray-600 transition"
              aria-expanded={expandCalc}
            >
              <div className="flex items-center text-gray-400 gap-2 justify-end">
                <span className="text-sm ">Tùy chọn thêm</span>
                <DownOutlined
                  className={`text-xs transition-transform ${
                    expandCalc ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>
          </div>

          {expandCalc && (
            <>
              {/* Số lượng × Đơn giá cùng 1 dòng, canh wrapper */}
              <Form.Item colon={false} label=" ">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Form.Item
                      name="quantity"
                      noStyle
                      rules={[{ required: true, message: "Nhập số lượng" }]}
                    >
                      <InputNumber
                        className="w-full"
                        min={0}
                        placeholder="Số lượng"
                        formatter={(v) =>
                          `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />
                    </Form.Item>
                  </div>

                  <span className="select-none text-base font-medium">×</span>

                  <div className="flex-1">
                    <Form.Item
                      name="unitPrice"
                      noStyle
                      rules={[{ required: true, message: "Nhập đơn giá" }]}
                    >
                      <InputNumber
                        className="w-full"
                        min={0}
                        placeholder="Đơn giá"
                        formatter={(v) =>
                          `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(v) => v?.replace(/,/g, "")}
                      />
                    </Form.Item>
                  </div>
                </div>
              </Form.Item>
            </>
          )}

          <div className="flex">
            <Form.Item
              label="Số tiền"
              name="money"
              rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
            >
              <InputNumber
                style={{ width: "80%" }}
                min={0}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(v) => v?.replace(/,/g, "")}
              />
            </Form.Item>
          </div>

          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddNote;
