// src/components/CategoryManager.jsx
import React, { useMemo, useState } from "react";
import { Button, Input, Modal, message } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { FaRegEdit } from "react-icons/fa";

const DEFAULTS = ["Thu", "Chi", "Không"];

const CategoryManager = ({
  initial = [],
  onSave,
  children,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

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

  const [editingIndex, setEditingIndex] = useState(null);
  const [editVal, setEditVal] = useState("");

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

  const handleEditStart = (index, oldVal) => {
    setEditingIndex(index);
    setEditVal(oldVal);
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditVal("");
  };

  const handleEditConfirm = (index) => {
    const v = (editVal || "").trim();
    if (!v) return message.warning("Nhập tên phân loại trước đã.");
    if (
      categories.some(
        (c, i) => i !== index && c.toLowerCase() === v.toLowerCase()
      )
    ) {
      return message.warning("Phân loại đã tồn tại.");
    }

    setCategories((prev) => prev.map((c, i) => (i === index ? v : c)));
    setEditingIndex(null);
    setEditVal("");
    message.success("Đã sửa phân loại.");
  };

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
          {categories.map((label, idx) => (
            <div
              key={`${label}-${idx}`}
              className="min-h-11 px-3 py-2 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 shadow-sm"
            >
              {editingIndex === idx ? (
                <div className="flex flex-1 items-center gap-2">
                  <Input
                    autoFocus
                    value={editVal}
                    onChange={(e) => setEditVal(e.target.value)}
                    onPressEnter={() => handleEditConfirm(idx)}
                  />
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => handleEditConfirm(idx)}
                  >
                    OK
                  </Button>
                  <Button size="small" onClick={handleEditCancel}>
                    Hủy
                  </Button>
                </div>
              ) : (
                <>
                  <span className="text-sm text-gray-800">{label}</span>
                  <div className="flex items-center gap-1">
                    {!isDefault(label) && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleEditStart(idx, label)}
                          className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-gray-100 active:scale-95 transition"
                          aria-label={`Sửa ${label}`}
                        >
                          <FaRegEdit className="text-gray-500 text-sm" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(label)}
                          className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-gray-100 active:scale-95 transition"
                          aria-label={`Xoá ${label}`}
                        >
                          <CloseOutlined className="text-gray-500 text-xs" />
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}

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
