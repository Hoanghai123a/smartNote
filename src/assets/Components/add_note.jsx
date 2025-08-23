import React, { useState } from "react";
import { Modal, Form, Input, message, DatePicker, Select } from "antd";
import api from "./api";
import dayjs from "dayjs";
const Add_note = ({ children, className, callback }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const create = await api.post("/api/notes/", values);
      console.log(create);
      message.success("Thêm ghi chú thành công!");
      callback(values);
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Lỗi thêm ghi chú:", error);
      message.error("Không thể thêm ghi chú.");
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
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
          labelCol={{ flex: "100px" }}
          wrapperCol={{ flex: 1 }}
          labelAlign="left"
          colon={false}
          style={{ maxWidth: 540 }}
        >
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="SĐT"
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ngày"
            name="date"
            initialValue={dayjs()}
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            label="Loại hình"
            name="classify"
            rules={[{ required: true, message: "Vui lòng chọn loại hình" }]}
          >
            <Select
              options={[
                { label: "None", value: "None" },
                { label: "Thu", value: "Thu" },
                { label: "Chi", value: "Chi" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Số tiền"
            name="money"
            rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Add_note;
