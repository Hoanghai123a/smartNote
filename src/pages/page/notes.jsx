import React, { useState } from "react";
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";

const { Option } = Select;

const Notes = () => {
  const [data, setdata] = useState([
    {
      stt: 1,
      name: "Nguyễn Văn A",
      date: "2025-08-19",
      classify: "None",
      money: "5,000,000",
      note: "Ghi chú",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const newEntry = {
        stt: data.length + 1,
        name: values.name,
        date: values.date.format("YYYY-MM-DD"),
        classify: values.classify,
        money: values.money,
        note: values.note,
        type: "note",
        status: "ON",
      };

      setdata([...data, newEntry]);
      handleCancel();
    });
  };

  return (
    <div className="p-4">
      <div className="topitem flex gap-2 mb-4">
        <input
          placeholder="Lọc theo ngày"
          className="border rounded-md px-4 py-2 bg-white shadow-sm hover:bg-gray-100"
        />
        <input
          placeholder="Lọc theo tên"
          className="border rounded-md px-4 py-2 bg-white shadow-sm hover:bg-gray-100"
        />
        <Button onClick={showModal}>+</Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <section className="w-full md:flex-1">
          <div className="border rounded-md p-2 text-center text-lg font-medium mb-2">
            Danh sách ghi chú cá nhân
          </div>

          <div className="border rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1">STT</th>
                    <th className="border px-2 py-1">Ngày</th>
                    <th className="border px-2 py-1">Họ Tên</th>
                    <th className="border px-2 py-1">Loại hình</th>
                    <th className="border px-2 py-1">Số tiền</th>
                    <th className="border px-2 py-1">Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.stt}>
                      <td className="border px-2 py-1 text-center">
                        {row.stt}
                      </td>
                      <td className="border px-2 py-1">{row.date}</td>
                      <td className="border px-2 py-1">{row.name}</td>
                      <td className="border px-2 py-1">{row.classify}</td>
                      <td className="border px-2 py-1">{row.money}</td>
                      <td className="border px-2 py-1">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      <Modal
        title="Thêm ghi chú mới"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Họ Tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ngày"
            name="date"
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            label="Loại hình"
            name="classify"
            rules={[{ required: true, message: "Vui lòng chọn loại hình" }]}
          >
            <Select>
              <Option value="None">None</Option>
              <Option value="Thu">Thu</Option>
              <Option value="Chi">Chi</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Số tiền"
            name="money"
            rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Notes;
