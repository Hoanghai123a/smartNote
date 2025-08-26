import { Button, Form, Input, Modal, message } from "antd";
import React, { useState } from "react";

const ChangePass = ({ children, className }) => {
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleOpen = () => setIsChangePassModalOpen(true);

  const handleClose = () => {
    setIsChangePassModalOpen(false);
    form.resetFields();
  };

  const handleFinish = (values) => {
    const { currentPass, newPass, confirmnewPass } = values;

    if (newPass !== confirmnewPass) {
      message.error("Mật khẩu nhập lại không khớp!");
      return;
    }

    // TODO: call API đổi mật khẩu
    console.log("Submit data:", values);

    message.success("Đổi mật khẩu thành công!");
    handleClose();
  };

  return (
    <div className={className}>
      <div onClick={handleOpen} data-no-modal>
        {children}
      </div>

      <Modal
        className="!max-w-[350px]"
        title="Thay đổi mật khẩu"
        open={isChangePassModalOpen}
        onCancel={handleClose}
        footer={[
          <Button key="cancel" onClick={handleClose}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Xác nhận
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ flex: "200px" }}
          colon={false}
          onFinish={handleFinish}
        >
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPass"
            rules={[{ required: true, message: "Không để trống" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPass"
            rules={[{ required: true, message: "Không để trống" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Nhập lại mật khẩu mới"
            name="confirmnewPass"
            dependencies={["newPass"]}
            rules={[
              { required: true, message: "Không để trống" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPass") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu nhập lại không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChangePass;
