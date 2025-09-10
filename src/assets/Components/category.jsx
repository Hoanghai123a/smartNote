// src/components/CategoryManager.jsx
import React, { useState } from "react";
import { Button, Input, Modal, message, Spin, Empty, Popconfirm } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { FaRegEdit } from "react-icons/fa";
import api from "./api";
import { useUser } from "../../stores/userContext";

const normalize = (s) => (s ?? "").toString().trim();

const CategoryManager = ({
  baseUrl = "/loaighichu/",
  children,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [adding, setAdding] = useState(false);
  const [inputVal, setInputVal] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editVal, setEditVal] = useState("");
  const { user, setUser } = useUser();

  // chuẩn hoá list phân nhóm
  const list = Array.isArray(user?.danhsachGroup) ? user.danhsachGroup : [];

  const exists = (label, exceptId = null) => {
    const key = normalize(label).toLowerCase();
    return list.some(
      (c) => c.id !== exceptId && normalize(c.type).toLowerCase() === key
    );
  };

  // thêm
  const handleAddConfirm = () => {
    const v = normalize(inputVal);
    if (!v) return message.warning("Nhập tên phân nhóm trước đã.");
    if (exists(v)) return message.warning("Phân nhóm đã tồn tại.");

    setLoading(true);
    api
      .post(baseUrl, { type: v, description: null }, user?.token)
      .then((created) => {
        if (!created?.id) {
          // fallback: re-fetch
          return api.get(baseUrl, user?.token).then((list) => {
            setUser((old) => ({
              ...old,
              danhsachGroup: Array.isArray(list) ? list : [],
            }));
          });
        }
        setUser((old) => ({
          ...old,
          danhsachGroup: [
            ...(Array.isArray(old?.danhsachGroup) ? old.danhsachGroup : []),
            created,
          ],
        }));
        message.success("Đã thêm phân nhóm.");
        setInputVal("");
        setAdding(false);
      })
      .catch((err) => {
        console.error(err);
        message.error("Không thể thêm phân nhóm.");
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
          danhsachGroup: (Array.isArray(old?.danhsachGroup)
            ? old.danhsachGroup
            : []
          ).filter((x) => x.id !== item.id),
        }));
        message.success("Đã xoá phân nhóm.");
      })
      .catch((err) => {
        console.error(err);
        message.error("Không thể xoá phân nhóm.");
      })
      .finally(() => setLoading(false));
  };

  // sửa
  const handleEditConfirm = () => {
    const v = normalize(editVal);
    if (!v) return message.warning("Nhập tên phân nhóm trước đã.");
    if (exists(v, editingId)) return message.warning("Phân nhóm đã tồn tại.");
    if (!user?.token) return message.error("Thiếu token.");

    setLoading(true);
    api
      .patch(`${baseUrl}${editingId}/`, { type: v }, user?.token)
      .then((res) => {
        if (!res?.id) {
          // fallback: re-fetch
          return api.get(baseUrl, user?.token).then((list) => {
            setUser((old) => ({
              ...old,
              danhsachGroup: Array.isArray(list) ? list : [],
            }));
          });
        }
        setUser((old) => ({
          ...old,
          danhsachGroup: (Array.isArray(old?.danhsachGroup)
            ? old.danhsachGroup
            : []
          ).map((c) => (c.id === editingId ? res : c)),
        }));
        message.success("Đã sửa phân nhóm.");
      })
      .catch((err) => {
        console.error(err);
        message.error("Không thể sửa phân nhóm.");
      })
      .finally(() => {
        setEditingId(null);
        setEditVal("");
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
        title="Danh sách phân nhóm"
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={[]}
      >
        <Spin spinning={loading}>
          <div className="flex flex-col gap-2">
            {list.length === 0 && !adding ? (
              <Empty description="Chưa có phân nhóm" />
            ) : null}

            {list.map((item) => (
              <div
                key={item.id}
                className="min-h-11 px-3 py-2 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 shadow-sm"
              >
                {editingId === item.id ? (
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      autoFocus
                      value={editVal}
                      onChange={(e) => setEditVal(e.target.value)}
                      onPressEnter={handleEditConfirm}
                      disabled={loading}
                    />
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
                        setEditVal("");
                      }}
                      disabled={loading}
                    >
                      Hủy
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm text-gray-800">{item.type}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditVal(item.type);
                        }}
                        className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-gray-100 active:scale-95 transition"
                        disabled={loading}
                      >
                        <FaRegEdit className="text-gray-500 text-sm" />
                      </button>
                      <Popconfirm
                        title="Xoá phân nhóm?"
                        description={`Bạn chắc chắn xoá "${item.type}"?`}
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
                <span>Thêm phân nhóm</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  autoFocus
                  placeholder="Nhập tên phân nhóm..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onPressEnter={handleAddConfirm}
                  className="h-11"
                  disabled={loading}
                />
                <Button
                  onClick={() => {
                    setAdding(false);
                    setInputVal("");
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
            )}
          </div>
        </Spin>
      </Modal>
    </div>
  );
};

export default CategoryManager;
