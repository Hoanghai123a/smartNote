import React, { useState } from "react";
import { Modal, Button, Form, Input, message } from "antd";
import api from "../../assets/Components/api";
import { useUser } from "../../stores/UserContext";
const Add_note = ({ children, className, callback }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { user, setUser } = useUser();

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
        title="Thêm ghi chú mới"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tiêu đề"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Khách hàng"
            name="customer"
            rules={[{ required: true, message: "Vui lòng nhập khách hàng" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nội dung"
            name="content"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Add_note;
