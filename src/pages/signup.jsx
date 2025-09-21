import React, { useState } from "react";
import { FaUser, FaLock, FaPhone, FaStore } from "react-icons/fa";
import { DownOutlined } from "@ant-design/icons";
import api from "../assets/Components/api";
import { Button, message, Input, Form } from "antd";
import { DatePicker, ConfigProvider } from "antd-mobile";
import viVN from "antd-mobile/es/locales/vi-VN";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import { CiStickyNote } from "react-icons/ci";
import { RiGeminiFill } from "react-icons/ri";

const Signup_index = () => {
  const [expandStore, setExpandStore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const [birthday, setBirthday] = useState("");

  const [form] = Form.useForm();
  const nav = useNavigate();

  const handleSubmit = async (values) => {
    const { username, password, confirm, fullname, storeName, address, phone } =
      values;

    if (password !== confirm) {
      return message.error("Mật khẩu nhập lại không khớp");
    }

    const body = {
      username,
      password,
      isStore: expandStore,
    };

    if (expandStore) {
      body.thongtinthem = JSON.stringify({
        loaitaikhoan: "cửa hàng",
        fullname,
        birthday,
        storeName,
        address,
        phone,
      });
    }

    try {
      setLoading(true);
      const res = await api.post("/register/", body);
      message.success("Đăng ký thành công!");
      nav("/login");

      form.resetFields();
      setExpandStore(false);
      setBirthday("");
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      message.error("Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Header cố định */}

      <div className="flex flex-col items-center gap-1 fadeInTop">
        <div className="flex w-[90vw] relative justify-between mb-3 items-center p-3 shadow rounded-[10px] gap-1 text-[#0180f6] font-[500]">
          <CiStickyNote size={50} />
          <RiGeminiFill className="absolute top-[10px] left-2 text-[#a6bcf8]" />
          <div className="flex flex-col items-end">
            <div className="flex text-[22px]">SmartNotes</div>
            <div className="flex">Sổ tay thông minh 4.0</div>
          </div>
        </div>
        <div className="flex font-[400] text-[28px] py-3 justify-center">
          Đăng ký tài khoản
        </div>
      </div>

      {/* Form scroll */}
      <div className="flex-1 overflow-y-auto px-8">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="flex flex-col items-center py-6"
          style={{ maxWidth: "400px", margin: "0 auto" }}
        >
          {/* Username */}
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
            className="w-full"
          >
            <Input
              prefix={<FaUser className="text-[#c4c4c4]" />}
              placeholder="Nhập tên đăng nhập"
              className="rounded-[8px] !py-3 shadow"
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            className="w-full"
          >
            <Input.Password
              prefix={<FaLock className="text-[#c4c4c4]" />}
              placeholder="Nhập mật khẩu"
              className="rounded-[8px] !py-3 shadow"
            />
          </Form.Item>

          {/* Confirm Password */}
          <Form.Item
            label="Nhập lại mật khẩu"
            name="confirm"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng nhập lại mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu nhập lại không khớp")
                  );
                },
              }),
            ]}
            className="w-full"
          >
            <Input.Password
              prefix={<FaLock className="text-[#c4c4c4]" />}
              placeholder="Nhập lại mật khẩu"
              className="rounded-[8px] !py-3 shadow"
            />
          </Form.Item>

          {/* Toggle Cửa hàng */}
          <div
            className="flex items-center text-gray-400 gap-2 justify-end cursor-pointer w-full"
            onClick={() => setExpandStore(!expandStore)}
          >
            <span className="text-sm">Tùy chọn cửa hàng</span>
            <DownOutlined
              className={`text-xs transition-transform ${
                expandStore ? "rotate-180" : ""
              }`}
            />
          </div>

          {expandStore && (
            <>
              <Form.Item
                label="Tên đầy đủ"
                name="fullname"
                className="w-full"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input
                  placeholder="Nhập tên đầy đủ của bạn"
                  className="rounded-[8px] !py-3 shadow"
                />
              </Form.Item>

              <Form.Item label="Ngày sinh" name="birthday" className="w-full">
                <ConfigProvider locale={viVN}>
                  <DatePicker
                    precision="day"
                    visible={visible}
                    min={new Date(1900, 0, 1)}
                    onClose={() => setVisible(false)}
                    value={birthday ? new Date(birthday) : undefined}
                    onConfirm={(val) => {
                      const dateStr = dayjs(val).format("YYYY-MM-DD");
                      setBirthday(dateStr);
                      form.setFieldValue("birthday", dateStr); // cập nhật Form
                    }}
                  />
                </ConfigProvider>

                {/* Trigger mở popup */}
                <div
                  onClick={() => setVisible(true)}
                  className="w-full rounded-[8px] border border-[#dbdbdb] py-3 px-3 shadow cursor-pointer text-gray-400"
                >
                  {birthday
                    ? dayjs(birthday).format("DD/MM/YYYY")
                    : "Chọn ngày sinh"}
                </div>
              </Form.Item>

              <Form.Item
                label="Tên cửa hàng"
                name="storeName"
                className="w-full"
              >
                <Input
                  prefix={<FaStore className="text-[#c4c4c4]" />}
                  placeholder="Tên cửa hàng của bạn"
                  className="rounded-[8px] !py-3 shadow"
                />
              </Form.Item>

              <Form.Item label="Địa điểm" name="address" className="w-full">
                <Input
                  placeholder="Địa chỉ cửa hàng"
                  className="rounded-[8px] !py-3 shadow"
                />
              </Form.Item>

              <Form.Item label="Số điện thoại" name="phone" className="w-full">
                <Input
                  prefix={<FaPhone className="text-[#c4c4c4]" />}
                  placeholder="Số điện thoại liên hệ"
                  className="rounded-[8px] !py-3 shadow"
                />
              </Form.Item>
            </>
          )}

          {/* Footer cố định */}
          <div className="p-4">
            <Button
              type="primary"
              loading={loading}
              onClick={() => form.submit()}
              className="w-full bg-[#0180f6] text-white font-[500] rounded-[8px] py-4 shadow hover:bg-[#026cd1]"
            >
              Đăng ký
            </Button>
            <div className="flex flex-col gap-2 text-center mt-2 text-[#999]">
              Đã có tài khoản?
              <a href="/login" className="text-[#0180f6]">
                Đăng nhập
              </a>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Signup_index;
