import { DownOutlined } from "@ant-design/icons";
import React, { useEffect, useMemo, useState } from "react";
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

const AddNote = ({ children, className, callback }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandCalc, setExpandCalc] = useState(false);
  const [form] = Form.useForm();
  const { user, setUser } = useUser();

  const formatPhone = (sdt) => {
    const d = String(sdt ?? "").replace(/\D/g, ""); // giữ lại số
    if (!d) return "";
    if (d.length <= 4) return d;
    if (d.length <= 7) return `${d.slice(0, 4)}-${d.slice(4)}`;
    return `${d.slice(0, 4)}-${d.slice(4, 7)}-${d.slice(7, 10)}`; // 4-3-3
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

  //lọc nhóm ghi chú
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

  const showModal = () => {
    setIsModalOpen(true);
    setExpandCalc(false);
    form.setFieldsValue({
      date: dayjs(),
      category: "in",
      isNewUser: false,
      money: null,
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
  const quantity = Form.useWatch("quantity", form);
  const unitPrice = Form.useWatch("unitPrice", form);

  // khi chọn người → auto phone
  const handleUserChange = async (val) => {
    const found = user?.danhsachKH?.find((u) => String(u.id) === String(val));
    form.setFieldsValue({
      userPhone: formatPhone(found?.sodienthoai) || undefined,
    });
    const values = await form.validateFields();
    console.log("ten: " + values.userName);
  };

  // sync tiền & note khi thay đổi số lượng/đơn giá (khi switch bật)
  const STRIP_QTY_PRICE =
    /\s*Số lượng:\s*\d+(?:[.,]\d+)?;\s*Đơn giá:\s*[\d.,]+₫\./;
  useEffect(() => {
    if (!expandCalc) return; // KHÔNG làm gì khi tắt tùy chọn

    const q = Number(quantity);
    const p = Number(unitPrice);
    if (!Number.isFinite(q) || !Number.isFinite(p)) return;

    const total = Math.max(0, q * p);

    // Lấy note hiện tại nhưng KHÔNG đưa vào deps để tránh loop
    const currentNote = form.getFieldValue("note") || "";
    const base = currentNote.replace(STRIP_QTY_PRICE, "");
    const extraNote = ` Số lượng: ${q}; Đơn giá: ${p.toLocaleString(
      "vi-VN"
    )}₫.`;

    // Chỉ set các field cần thiết, tránh ghi đè không cần thiết
    form.setFieldsValue({
      money: total,
      note: (base + extraNote).trim(),
    });
  }, [expandCalc, quantity, unitPrice, form]);

  const toggleExtra = () => {
    setExpandCalc((prev) => {
      const next = !prev;
      if (!next) {
        // vừa tắt: gỡ phần tự động khỏi note, KHÔNG đụng money
        const currentNote = form.getFieldValue("note") || "";
        const base = currentNote.replace(STRIP_QTY_PRICE, "").trim();
        form.setFieldsValue({ note: base });
      }
      return next;
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const isNew = !!values.isNewUser;

      // chuẩn hoá name/phone
      console.log("ten: " + values.userName);
      const newName = (values.newName || values.userName).trim();
      const newPhone = (values.newPhone || values.userPhone).trim();

      if (isNew) {
        const newName = (values.newName || "").trim();
        const newPhone = (values.newPhone || "").trim();
        //thêm người mới
        const newClient = {
          hoten: newName,
          sodienthoai: newPhone,
          description: "",
        };
        api.post(`/khachhang/`, newClient, user?.token);
      }

      const payload = {
        tenghichu: "test",
        khachhang: newName,
        sodienthoai: newPhone,
        thoigian: values.date
          ? dayjs(values.date).format("YYYY-MM-DDTHH:mm:ss")
          : undefined,
        phanloai: values.category, // in - out
        loai: values.group ? Number(values.group) : undefined,
        sotien: values.money ?? 0,
        noidung: values.note,
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
                <Form.Item label="Họ tên" name="userName">
                  <Select
                    showSearch
                    placeholder="Chọn họ tên"
                    options={nameSelect}
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
                  name={isNew ? "newPhone" : "userPhone"}
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
            <DatePicker showTime format="YYYY-MM-DD HH:mm" className="w-full" />
          </Form.Item>

          <Form.Item label="Nhóm" name="group" optionFilterProp="label">
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

          <div
            className="flex items-center justify-between select-none"
            style={{ marginLeft: 120, marginBottom: 8 }}
          >
            <button
              type="button"
              name="extra"
              onClick={toggleExtra}
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
            <Form.Item label="Số tiền" name="money">
              <InputNumber
                style={{ width: "80%" }}
                min={0}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(v) => v?.replace(/,/g, "")}
                disabled={expandCalc}
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
