// src/components/CategoryManager.jsx
import React, { useMemo, useState } from "react";
import { Button, Input, Modal, message } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";

const DEFAULTS = ["Thu", "Chi", "Không"];

const CategoryManager = ({
  initial = [],
  onSave,
  children,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Ghép mặc định + initial (lọc trùng, ưu tiên DEFAULTS trước)
  const initialList = useMemo(() => {
    const norm = (s) => (s ?? "").toString().trim();
    const set = new Set(DEFAULTS.map(norm));
    const extra = (initial || [])
      .map(norm)
      .filter((x) => x && !set.has(x) && !DEFAULTS.map(norm).includes(x));
    return [...DEFAULTS, ...extra];
  }, [initial]);

  const [categories, setCategories] = useState(initialList);
  const [adding, setAdding] = useState(false);
  const [inputVal, setInputVal] = useState("");

  const isDefault = (label) =>
    DEFAULTS.map((s) => s.toLowerCase()).includes(label.toLowerCase());

  const exists = (label) =>
    categories.map((s) => s.toLowerCase()).includes(label.toLowerCase());

  const handleAddStart = () => {
    setAdding(true);
    setInputVal("");
  };

  const handleAddCancel = () => {
    setAdding(false);
    setInputVal("");
  };

  const handleAddConfirm = () => {
    const v = (inputVal || "").trim();
    if (!v) return message.warning("Nhập tên phân loại trước đã.");
    if (exists(v)) return message.warning("Phân loại đã tồn tại.");

    setCategories((prev) => [...prev, v]);
    setAdding(false);
    setInputVal("");
    message.success("Đã thêm phân loại.");
  };

  const handleRemove = (label) => {
    if (isDefault(label)) return;
    setCategories((prev) => prev.filter((x) => x !== label));
  };

  const handleSave = () => {
    onSave?.(categories);
    message.success("Đã lưu danh sách phân loại.");
    setIsOpen(false);
  };

  return (
    <div className={className}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(true)} data-no-modal>
        {children}
      </div>

      {/* Modal quản lý phân loại */}
      <Modal
        className="!max-w-[400px]"
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
        <div className="flex flex-col gap-2">
          {categories.map((label) => (
            <div
              key={label}
              className="min-h-11 px-3 py-2 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 shadow-sm"
            >
              <span className="text-sm text-gray-800">{label}</span>
              {!isDefault(label) && (
                <button
                  type="button"
                  onClick={() => handleRemove(label)}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-gray-100 active:scale-95 transition"
                >
                  <CloseOutlined className="text-gray-500 text-xs" />
                </button>
              )}
            </div>
          ))}

          {/* Hàng dấu cộng */}
          {!adding ? (
            <button
              type="button"
              onClick={handleAddStart}
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
              <Button onClick={handleAddCancel}>Hủy</Button>
              <Button type="primary" onClick={handleAddConfirm}>
                Thêm
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CategoryManager;
