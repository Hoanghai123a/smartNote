// src/components/CategoryManager.jsx
import React, { useEffect, useState } from "react";
import { Button, Input, Modal, message, Spin } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { FaRegEdit } from "react-icons/fa";
import api from "./api"; // helper api bạn đang dùng

const normalize = (s) => (s ?? "").toString().trim();

const CategoryManager = ({
  baseUrl = "/categories",
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
    api
      .get(baseUrl)
      .then((res) => {
        const seen = new Set();
        const list = [];
        (res || []).forEach((item) => {
          const v = normalize(item?.name);
          if (v && !seen.has(v.toLowerCase())) {
            seen.add(v.toLowerCase());
            list.push({ id: item.id, name: v });
          }
        });
        setCategories(list);
      })
      .catch((err) => {
        console.error(err);
        message.error("Không thể tải danh sách phân loại.");
      })
      .finally(() => setLoading(false));
  }, [isOpen, baseUrl]);

  // thêm
  const handleAddConfirm = () => {
    const v = normalize(inputVal);
    if (!v) return message.warning("Nhập tên phân loại trước đã.");
    if (exists(v)) return message.warning("Phân loại đã tồn tại.");

    api
      .post(baseUrl, { name: v })
      .then((created) => {
        setCategories((prev) => [
          ...prev,
          { id: created.id, name: normalize(created.name || v) },
        ]);
        message.success("Đã thêm phân loại.");
        setAdding(false);
        setInputVal("");
      })
      .catch((err) => {
        console.error(err);
        message.error("Không thể thêm phân loại.");
      });
  };

  // xoá
  const handleRemove = (item) => {
    api
      .delete(`${baseUrl}/${item.id}`)
      .then(() => {
        setCategories((prev) => prev.filter((x) => x.id !== item.id));
        message.success("Đã xoá phân loại.");
      })
      .catch((err) => {
        console.error(err);
        message.error("Không thể xoá phân loại.");
      });
  };

  // sửa
  const handleEditConfirm = () => {
    const v = normalize(editVal);
    if (!v) return message.warning("Nhập tên phân loại trước đã.");
    if (exists(v, editingId)) return message.warning("Phân loại đã tồn tại.");

    api
      .patch(`${baseUrl}/${editingId}`, { name: v })
      .then(() => {
        setCategories((prev) =>
          prev.map((c) => (c.id === editingId ? { ...c, name: v } : c))
        );
        message.success("Đã sửa phân loại.");
        setEditingId(null);
        setEditVal("");
      })
      .catch((err) => {
        console.error(err);
        message.error("Không thể sửa phân loại.");
      });
  };

  // save
  const handleSave = () => {
    onSave?.(categories);
    message.success("Đã lưu danh sách phân loại.");
    setIsOpen(false);
  };

  return (
    <div className={className}>
      <div onClick={() => setIsOpen(true)} data-no-modal>
        {children}
      </div>

      <Modal
        className="!max-w-[420px]"
        title="Danh sách phân loại"
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
                    <span className="text-sm text-gray-800">{item.name}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditVal(item.name);
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
                <span>Thêm phân loại</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  autoFocus
                  placeholder="Nhập tên phân loại..."
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
