import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import api from "./api";

const EditCardValue = ({ data, children, stopPropagation = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();

  const openModal = (e) => {
    if (stopPropagation) {
      e.stopPropagation();
      e.preventDefault?.();
    }
    form.setFieldsValue({
      ...data,
      date: data.date ? dayjs(data.date) : null,
    });
    setIsOpen(true);
    console.log({ data });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const newData = {
        ...data,
        ...values,
        date: values.date ? values.date.format("YYYY-MM-DD HH:mm") : null,
      };
      api.patch(`/notes/${data.id}`, newData);
      setIsOpen(false);
    } catch (err) {
      console.error("Validation failed:", err);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="cursor-pointer inline-flex items-center"
      >
        {children}
      </button>

      {/* modal edit */}
      <Modal
        title={`Chỉnh sửa #${data.id} ${data.name}`}
        open={isOpen}
        onOk={handleOk}
        onCancel={() => setIsOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ flex: "120px" }}
          wrapperCol={{ flex: 1 }}
          labelAlign="left"
        >
          <Form.Item label="Họ Tên" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="SĐT" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Ngày" name="date">
            <DatePicker showTime format="YYYY-MM-DD HH:mm" className="w-full" />
          </Form.Item>
          <Form.Item label="phân loại" name="class">
            <Select
              options={[
                { label: "Thu", value: "in" },
                { label: "Chi", value: "out" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Số tiền" name="money">
            <InputNumber
              className="w-full"
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => v.replace(/,/g, "")}
            />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditCardValue;
