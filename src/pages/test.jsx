import React, { useEffect, useMemo, useState } from "react";

// ===== API helpers (đổi URL theo backend thật của bạn) =====
async function apiGetItems() {
  const res = await fetch("/api/items"); // GET /api/items -> [{id, title, createdAt}, ...]
  if (!res.ok) throw new Error("GET failed");
  return res.json();
}

async function apiCreateItem(payload) {
  const res = await fetch("/api/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("POST failed");
  return res.json(); // -> {id, title, createdAt}
}

// (tuỳ chọn) nếu bạn muốn có sửa/xoá sau này:
// async function apiUpdateItem(id, patch) { ... }
// async function apiDeleteItem(id) { ... }

export default function SimpleCacheList() {
  // ======= BỘ NHỚ TẠM =======
  const [items, setItems] = useState([]); // nguồn dữ liệu "gốc" trong bộ nhớ
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ======= BỘ LỌC / SẮP XẾP (chỉ là trạng thái hiển thị) =======
  const [q, setQ] = useState(""); // lọc theo từ khoá tiêu đề
  const [sortBy, setSortBy] = useState("createdAt_desc"); // tiêu chí sắp xếp

  // 1) Lần đầu: tải về -> lưu vào bộ nhớ tạm
  useEffect(() => {
    setLoading(true);
    setError("");
    apiGetItems()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message || "Lỗi tải dữ liệu"))
      .finally(() => setLoading(false));
  }, []);

  // 2) Tính toán danh sách HIỂN THỊ từ bộ nhớ tạm + filter/sort
  const visible = useMemo(() => {
    let out = items;

    // LỌC (filter) trên bộ nhớ tạm
    if (q.trim()) {
      const key = q.trim().toLowerCase();
      out = out.filter((x) => x.title?.toLowerCase().includes(key));
    }

    // SẮP XẾP (sort) trên bộ nhớ tạm
    switch (sortBy) {
      case "createdAt_desc":
        out = [...out].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "createdAt_asc":
        out = [...out].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case "title_asc":
        out = [...out].sort((a, b) =>
          (a.title || "").localeCompare(b.title || "")
        );
        break;
      case "title_desc":
        out = [...out].sort((a, b) =>
          (b.title || "").localeCompare(a.title || "")
        );
        break;
      default:
        break;
    }

    return out;
  }, [items, q, sortBy]);

  // 3) THÊM MỚI (optimistic): cập nhật "chỗ mới đó" ngay vào bộ nhớ tạm
  const handleAdd = async () => {
    const payload = {
      title: `Item ${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // --- Optimistic UI ---
    const tempId = "temp-" + Date.now();
    const optimisticItem = { id: tempId, ...payload };
    setItems((prev) => [optimisticItem, ...prev]); // chèn ngay vào bộ nhớ tạm để UI mượt

    try {
      const saved = await apiCreateItem(payload); // gọi API tạo thật
      // thay "temp" bằng item thật từ server
      setItems((prev) => prev.map((it) => (it.id === tempId ? saved : it)));
    } catch (e) {
      // Nếu lỗi: rollback phần tử temp
      setItems((prev) => prev.filter((it) => it.id !== tempId));
      alert("Thêm thất bại!");
    }
  };

  // (tuỳ chọn) cập nhật 1 phần tử (không refetch all)
  // const handleUpdate = async (id, patch) => {
  //   setItems(prev => prev.map(it => it.id === id ? { ...it, ...patch } : it));
  //   await apiUpdateItem(id, patch).catch(() => {/* rollback nếu cần */});
  // };

  // (tuỳ chọn) xoá 1 phần tử (không refetch all)
  // const handleDelete = async (id) => {
  //   const backup = items;
  //   setItems(prev => prev.filter(it => it.id !== id));
  //   try { await apiDeleteItem(id); } catch { setItems(backup); }
  // };

  return (
    <div
      style={{
        padding: 16,
        maxWidth: 720,
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Danh sách (cache trong bộ nhớ tạm)</h2>

      {/* Thanh công cụ: lọc + sắp xếp + thêm mới */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <input
          placeholder="Tìm theo tiêu đề…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: 8 }}
        >
          <option value="createdAt_desc">Mới nhất</option>
          <option value="createdAt_asc">Cũ nhất</option>
          <option value="title_asc">Tiêu đề A→Z</option>
          <option value="title_desc">Tiêu đề Z→A</option>
        </select>
        <button onClick={handleAdd} style={{ padding: "8px 12px" }}>
          + Thêm mới
        </button>
      </div>

      {/* Trạng thái */}
      {loading && <div>Đang tải…</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Danh sách hiển thị (đã lọc/sắp xếp trên RAM) */}
      <ul style={{ marginTop: 8, paddingLeft: 18 }}>
        {visible.map((it) => (
          <li key={it.id} style={{ marginBottom: 6 }}>
            <b>{it.title}</b>{" "}
            <small style={{ color: "#888" }}>
              ({new Date(it.createdAt).toLocaleString()})
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
