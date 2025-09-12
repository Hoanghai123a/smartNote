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
} from "antd";
import dayjs from "dayjs";
import api from "./api";
import { useUser } from "../../stores/userContext";
import ClientManager from "./client";
import { AiOutlinePlus, AiOutlineUserAdd } from "react-icons/ai";
import CategoryManager from "./Category";
import { MdOutlinePlaylistAdd } from "react-icons/md";

const AddNote = ({ children, className }) => {
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

  // state loading khi lưu
  const [saving, setSaving] = useState(false);

  // mở modal: chỉ set cờ, KHÔNG setFieldsValue
  const showModal = () => {
    setExpandCalc(false);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setExpandCalc(false);
  };
  const quantity = Form.useWatch("quantity", form);
  const unitPrice = Form.useWatch("unitPrice", form);

  // khi chọn người → auto phone
  const handleUserChange = async (val) => {
    const found = user?.danhsachKH?.find((u) => String(u.id) === String(val));
    form.setFieldsValue({
      userPhone: formatPhone(found?.sodienthoai) || undefined,
    });
  };

  // sync tiền & note khi thay đổi số lượng/đơn giá (khi switch bật)
  const STRIP_QTY_PRICE =
    /\s*Số lượng:\s*\d+(?:[.,]\d+)?;\s*Đơn giá:\s*[\d.,]+₫\./;

  useEffect(() => {
    if (!expandCalc) return;

    const q = Number(quantity);
    const p = Number(unitPrice);
    if (!Number.isFinite(q) || !Number.isFinite(p)) return;

    const total = Math.max(0, q * p);

    const currentNote = form.getFieldValue("note") || "";
    const base = currentNote.replace(STRIP_QTY_PRICE, "");
    const extraNote = ` Số lượng: ${q}; Đơn giá: ${p.toLocaleString(
      "vi-VN"
    )}₫.`;
    const nextNote = (base + extraNote).trim();

    const { money: curMoney, note: curNote } = form.getFieldsValue([
      "money",
      "note",
    ]);
    if (curMoney !== total || (curNote || "").trim() !== nextNote) {
      form.setFieldsValue({ money: total, note: nextNote });
    }
  }, [expandCalc, quantity, unitPrice, form]);

  const toggleExtra = () => {
    setExpandCalc((prev) => {
      const next = !prev;
      if (!next) {
        const currentNote = form.getFieldValue("note") || "";
        const base = currentNote.replace(STRIP_QTY_PRICE, "").trim();
        form.setFieldsValue({ note: base });
      }
      return next;
    });
  };

  const handleOk = async () => {
    setSaving(true);
    const values = await form.validateFields();

    const payload = {
      tenghichu: "test",
      khachhang: values.userName, // value của Select là id đã OK
      thoigian: values.date
        ? dayjs(values.date).format("YYYY-MM-DDTHH:mm:ss")
        : undefined,
      phanloai: values.category, // in - out
      loai: values.group ? Number(values.group) : undefined,
      sotien: values.money ?? 0,
      noidung: values.note,
    };

    api
      .post("/notes/", payload, user.token)
      .then((res) => {
        console.log("payload", payload);
        setUser((val) => ({
          ...val,
          danhsachNote: [...(val?.danhsachNote || []), res],
        }));
        message.success("Thêm ghi chú thành công!");
      })
      .catch((err) => {
        console.error("Lỗi thêm ghi chú:", err),
          message.error("Không thể thêm ghi chú.");
      })
      .finally(() => handleCancel(), setSaving(false));
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
        destroyOnHidden
        confirmLoading={saving}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ flex: "120px" }}
          wrapperCol={{ flex: 1 }}
          labelAlign="left"
          colon={false}
          style={{ maxWidth: 560 }}
          initialValues={{
            date: dayjs(),
            category: "in",
            money: null,
            quantity: undefined,
            unitPrice: undefined,
            note: undefined,
            userPhone: undefined,
          }}
        >
          <Form.Item label="Họ tên">
            <div className="flex items-center gap-2">
              <Form.Item
                name="userName"
                noStyle
                rules={[
                  { required: true, message: "Vui lòng chọn khách hàng" },
                ]}
              >
                <Select
                  className="flex-1"
                  showSearch
                  placeholder="Chọn họ tên"
                  options={nameSelect} // value = id, label = hoten
                  optionFilterProp="label"
                  popupMatchSelectWidth={false}
                  listHeight={256}
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
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" className="w-full" />
          </Form.Item>

          <Form.Item label="Nhóm">
            <div className="flex items-center gap-2">
              <Form.Item
                name="group"
                noStyle
                rules={[{ required: true, message: "Vui lòng chọn nhóm" }]}
              >
                <Select options={groupSelect} optionFilterProp="label" />
              </Form.Item>

              <CategoryManager>
                <button
                  type="button"
                  className="flex items-center justify-center w-8 h-8 rounded-md bg-white text-[#8c8c8c] hover:border-[#40a9ff] hover:text-[#40a9ff] transition-colors"
                  aria-label="Thêm nhóm"
                >
                  <MdOutlinePlaylistAdd
                    className="text-[cadetblue]"
                    size={23}
                  />
                </button>
              </CategoryManager>
            </div>
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
            <Form.Item colon={false}>
              <div className="flex justify-end items-center gap-2 max-sm:items-stretch">
                <Form.Item
                  name="quantity"
                  noStyle
                  rules={[{ required: true, message: "Nhập số lượng" }]}
                >
                  <InputNumber
                    className="w-[140px] max-sm:w-full"
                    min={0}
                    placeholder="Số lượng"
                    formatter={(v) =>
                      `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>

                <span className="select-none text-base font-medium shrink-0">
                  ×
                </span>

                <Form.Item
                  name="unitPrice"
                  noStyle
                  rules={[{ required: true, message: "Nhập đơn giá" }]}
                >
                  <InputNumber
                    className="w-[180px] max-sm:w-full"
                    min={0}
                    placeholder="Đơn giá"
                    formatter={(v) =>
                      `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(v) => v?.replace(/,/g, "")}
                  />
                </Form.Item>
              </div>
            </Form.Item>
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
