import React, { useState } from "react";
import { Button, Input, Modal, message, Spin, Empty, Popconfirm } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { FaRegEdit } from "react-icons/fa";
import api from "./api";
import { useUser } from "../../stores/userContext";
import FieldPhone from "./fields/phone";

const normalize = (s) => (s ?? "").toString().trim();

const ClientManager = ({
  baseUrl = "/khachhang/",
  children,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [adding, setAdding] = useState(false);
  const [newHoten, setNewHoten] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editHoten, setEditHoten] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const { user, setUser } = useUser();

  const list = Array.isArray(user?.danhsachKH) ? user.danhsachKH : [];

  const exists = (hoten, phone, exceptId = null) => {
    const keyName = normalize(hoten).toLowerCase();
    const keyPhone = normalize(phone);
    return user?.danhsachKH.some(
      (c) =>
        c.id !== exceptId &&
        normalize(c.hoten).toLowerCase() === keyName &&
        normalize(c.sodienthoai) === keyPhone
    );
  };

  // thêm
  const handleAddConfirm = () => {
    const hoten = normalize(newHoten);
    const phone = normalize(newPhone);
    if (!hoten) return message.warning("Nhập họ tên.");
    if (!phone) return message.warning("Nhập số điện thoại.");
    if (exists(hoten, phone)) return message.warning("Khách hàng đã tồn tại.");

    setLoading(true);
    api
      .post(baseUrl, { hoten, sodienthoai: phone }, user?.token)
      .then((created) => {
        message.success("Đã thêm.");
        setUser((old) => ({
          ...old,
          danhsachKH: [...(old?.danhsachKH || []), created],
        }));
        setNewHoten("");
        setNewPhone("");
        setAdding(false);
      })
      .catch((err) => {
        console.error(err);
        message.error("Không thể thêm.");
      })
      .finally(() => setLoading(false));
  };

  // xoá
  const handleRemove = (item) => {
    if (!user?.token) return message.error("Thiếu token.");
    setLoading(true);
    api
      .delete(`${baseUrl}${item.id}/`, user?.token)
      .then(() => {
        setUser((old) => ({
          ...old,
          danhsachKH: old?.danhsachKH.filter((x) => x.id !== item.id),
        }));

        message.success("Đã xoá.");
      })
      .catch((err) => {
        console.error(err);
        message.error("Không thể xoá.");
      })
      .finally(() => setLoading(false));
  };

  // sửa
  const handleEditConfirm = () => {
    const hoten = normalize(editHoten);
    const phone = normalize(editPhone);
    if (!hoten) return message.warning("Nhập họ tên.");
    if (!phone) return message.warning("Nhập số điện thoại.");
    if (exists(hoten, phone, editingId)) return message.warning("Đã tồn tại.");
    if (!user?.token) return message.error("Thiếu token.");

    setLoading(true);
    api
      .patch(
        `${baseUrl}${editingId}/`,
        { hoten, sodienthoai: phone },
        user?.token
      )
      .then((res) => {
        setUser((old) => ({
          ...old,
          danhsachKH: old?.danhsachKH.map((r) => (r.id === res.id ? res : r)),
        }));

        message.success("Đã sửa.");
      })
      .catch((err) => {
        console.error(err);
        message.error("Không thể sửa.");
      })
      .finally(() => {
        setEditingId(null);
        setEditHoten("");
        setEditPhone("");
        setLoading(false);
      });
  };

  return (
    <div className={className}>
      <div onClick={() => setIsOpen(true)} data-no-modal>
        {children}
      </div>

      <Modal
        className="!max-w-[350px]"
        title="Danh sách khách hàng"
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={[]}
      >
        <Spin spinning={loading}>
          <div className="flex flex-col gap-2">
            {list.length === 0 && !adding ? (
              <Empty description="Chưa có" />
            ) : null}

            {list.map((item) => (
              <div
                key={item.id}
                className="min-h-11 px-3 py-2 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 shadow-sm"
              >
                {editingId === item.id ? (
                  <div className="flex flex-1 flex-col gap-2">
                    <Input
                      autoFocus
                      placeholder="Họ tên"
                      value={editHoten}
                      onChange={(e) => setEditHoten(e.target.value)}
                      disabled={loading}
                    />
                    <Input
                      placeholder="Số điện thoại"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      onPressEnter={handleEditConfirm}
                      disabled={loading}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="small"
                        type="primary"
                        onClick={handleEditConfirm}
                        loading={loading}
                      >
                        OK
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          setEditingId(null);
                          setEditHoten("");
                          setEditPhone("");
                        }}
                        disabled={loading}
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-sm text-gray-800">
                      <div>{item.hoten}</div>
                      <div className="pl-3">
                        <FieldPhone data={item.sodienthoai} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditHoten(item.hoten);
                          setEditPhone(item.sodienthoai);
                        }}
                        className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-gray-100 active:scale-95 transition"
                        disabled={loading}
                      >
                        <FaRegEdit className="text-gray-500 text-sm" />
                      </button>
                      <Popconfirm
                        title="Xoá khách hàng?"
                        description={`Bạn chắc chắn xoá "${item.hoten}"?`}
                        okText="Xoá"
                        cancelText="Hủy"
                        onConfirm={() => handleRemove(item)}
                        okButtonProps={{ danger: true, loading }}
                      >
                        <button
                          type="button"
                          className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-gray-100 active:scale-95 transition"
                          disabled={loading}
                        >
                          <CloseOutlined className="text-gray-500 text-xs" />
                        </button>
                      </Popconfirm>
                    </div>
                  </>
                )}
              </div>
            ))}

            {!adding ? (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="h-11 w-full rounded-lg border border-dashed border-gray-300 text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-500 active:scale-95 transition inline-flex items-center justify-center gap-2"
                disabled={loading}
              >
                <PlusOutlined />
                <span>Thêm khách hàng</span>
              </button>
            ) : (
              <div className="items-center">
                <div className="flex flex-col gap-2">
                  <Input
                    autoFocus
                    placeholder="Họ tên"
                    value={newHoten}
                    onChange={(e) => setNewHoten(e.target.value)}
                    className="h-11"
                    disabled={loading}
                  />
                  <Input
                    placeholder="Số điện thoại"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    onPressEnter={handleAddConfirm}
                    className="h-11"
                    disabled={loading}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    onClick={() => {
                      setAdding(false);
                      setNewHoten("");
                      setNewPhone("");
                    }}
                    disabled={loading}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    onClick={handleAddConfirm}
                    loading={loading}
                  >
                    Thêm
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Spin>
      </Modal>
    </div>
  );
};

export default ClientManager;
