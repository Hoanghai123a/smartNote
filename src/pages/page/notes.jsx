import React, { useState } from "react";
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import {
  AiOutlinePlus,
  AiOutlineUser,
  AiOutlineDollarCircle,
  AiOutlineFileText,
} from "react-icons/ai";
import { LuClipboardList } from "react-icons/lu";

const { Option } = Select;

const Notes = () => {
  const [data, setData] = useState([
    {
      id: 1,
      stt: 1,
      user: "test1",
      name: "Nguyễn Văn A",
      date: "2025-08-19",
      classify: "None",
      money: "5,000,000",
      note: "Ghi chú mẫu",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [usedate, setUsedate] = useState(dayjs().format("YYYY-MM-DD"));

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const newItem = {
        id: Date.now(),
        stt: data.length + 1,
        name: values.name,
        date: values.date.format("YYYY-MM-DD"),
        classify: values.classify,
        money: values.money,
        note: values.note,
        type: "note",
        status: "ON",
      };

      setData([...data, newItem]);
      handleCancel();
    } catch (err) {
      console.log("Validation Failed:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {/* Header + filter */}
      <div className="p-2 sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between mb-2 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded">
          <div className="p-2 text-left text-2xl font-medium flex items-center gap-2">
            <LuClipboardList />
            Notes List
          </div>
          <Button
            onClick={showModal}
            type="primary"
            size="middle"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 shadow-md"
          >
            <AiOutlinePlus size={20} className="text-white" />
          </Button>
        </div>

        <div className="topitem flex mb-4 p-2">
          <Select
            className="w-[200px] !h-[40px]"
            showSearch
            placeholder="Lọc theo tên"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={data.map((row) => ({
              value: row.stt,
              label: row.name,
            }))}
          />
          <input
            type="date"
            value={usedate}
            onChange={(e) => setUsedate(e.target.value)}
            className="border rounded-md ml-[15px] px-4 py-2 w-[160px] bg-white shadow-sm !text-[#b5b5b5]"
          />
        </div>
      </div>

      {/* List */}
      <section className="md:flex-1 overflow-y-auto max-h-[70vh] mx-[10px]">
        <div className="space-y-3">
          {data.map((row) => (
            <div
              key={row.id}
              className="border rounded-lg shadow-sm p-3 bg-white"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-600">
                  #{row.stt}
                </span>
                <span className="text-xs text-gray-400">{row.date}</span>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex mt-0.5">
                  <AiOutlineUser className="text-blue-500 mr-[4px]" />
                  <span className="font-medium text-gray-700">Họ tên: </span>
                  <span>{row.name}</span>
                </div>
                <div className="flex mt-0.5">
                  <AiOutlineFileText className="text-purple-500 mr-[4px]" />
                  <span className="font-medium text-gray-700">Loại hình: </span>
                  <span>{row.classify}</span>
                </div>
                <div className="flex mt-0.5">
                  <AiOutlineDollarCircle className="text-yellow-500 mr-[4px]" />
                  <span className="font-medium text-gray-700">Số tiền: </span>
                  <span className="text-green-600 font-semibold">
                    {row.money}
                  </span>
                </div>
                {row.note && (
                  <div className="flex mt-0.5">
                    <AiOutlineFileText className="text-gray-500 mr-[4px]" />
                    <span className="font-medium text-gray-700">Ghi chú: </span>
                    <span>{row.note}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal thêm ghi chú */}
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
            initialValue={dayjs()}
          >
            <DatePicker format="YYYY-MM-DD" className="w-full" />
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
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Notes;
