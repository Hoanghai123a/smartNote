// src/components/CategoryManager.jsx
import React, { useEffect, useState } from "react";
import { Button, Input, Modal, message, Spin } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { FaRegEdit } from "react-icons/fa";
import api from "./api"; // helper api bạn đang dùng
import { useUser } from "../../stores/userContext";

const normalize = (s) => (s ?? "").toString().trim();

const CategoryManager = ({
  baseUrl = "/loaighichu/",
  onSave,
  children,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [adding, setAdding] = useState(false);
  const [inputVal, setInputVal] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editVal, setEditVal] = useState("");
  const { user, setUser } = useUser();
  const exists = (label, exceptId = null) => {
    const key = normalize(label).toLowerCase();
    return categories.some(
      (c) => c.id !== exceptId && normalize(c.name).toLowerCase() === key
    );
  };

  // tải từ API khi mở modal
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setCategories(user?.danhsachGroup);
    setLoading(false);
  }, [isOpen, baseUrl]);

  // thêm
  const handleAddConfirm = () => {
    const v = normalize(inputVal);
    if (!v) return message.warning("Nhập tên phân nhóm trước đã.");
    if (exists(v)) return message.warning("phân nhóm đã tồn tại.");

    api
      .post(baseUrl, { type: v, description: null }, user.token)
      .then((created) => {
        setCategories((prev) => [
          ...prev,
          { type: created.type, name: normalize(created.type || v) },
        ]);
        message.success("Đã thêm phân nhóm.");
        setAdding(false);
        setInputVal("");
      })
      .catch((err) => {
        console.error(err);
        message.error("Không thể thêm phân nhóm.");
      });
  };

  // xoá
  const handleRemove = (item) => {
    api
      .delete(`${baseUrl}${item.id}/`, user.token)
      .then(() => {
        setCategories((prev) => prev.filter((x) => x.id !== item.id));
        message.success("Đã xoá phân nhóm.");
      })
      .catch((err) => {
        console.error(err);
        message.error("Không thể xoá phân nhóm.");
      });
  };

  // sửa
  const handleEditConfirm = () => {
    const v = normalize(editVal);
    if (!v) return message.warning("Nhập tên phân nhóm trước đã.");
    if (exists(v, editingId)) return message.warning("phân nhóm đã tồn tại.");

    api
      .patch(`${baseUrl}${editingId}/`, { type: v }, user.token)
      .then((res) => {
        setCategories((prev) =>
          prev.map((c) => (c.id === editingId ? res : c))
        );
        message.success("Đã sửa phân nhóm.");
        setEditingId(null);
        setEditVal("");
      })
      .catch((err) => {
        console.error(err);
        message.error("Không thể sửa phân nhóm.");
      });
  };

  // save
  const handleSave = () => {
    onSave?.(categories);
    message.success("Đã lưu danh sách phân nhóm.");
    setIsOpen(false);
  };

  return (
    <div className={className}>
      <div onClick={() => setIsOpen(true)} data-no-modal>
        {children}
      </div>

      <Modal
        className="!max-w-[420px]"
        title="Danh sách phân nhóm"
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Lưu
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <div className="flex flex-col gap-2">
            {categories.map((item) => (
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
                    />
                    <Button
                      size="small"
                      type="primary"
                      onClick={handleEditConfirm}
                    >
                      OK
                    </Button>
                    <Button size="small" onClick={() => setEditingId(null)}>
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
                      >
                        <FaRegEdit className="text-gray-500 text-sm" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(item)}
                        className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-gray-100 active:scale-95 transition"
                      >
                        <CloseOutlined className="text-gray-500 text-xs" />
                      </button>
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
                />
                <Button onClick={() => setAdding(false)}>Hủy</Button>
                <Button type="primary" onClick={handleAddConfirm}>
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
