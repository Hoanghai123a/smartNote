import React, { useMemo, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Detail from "./detail"; // component bạn đã viết
import { useUser } from "../../stores/userContext";
import api from "../../assets/Components/api";
import { Spin, message } from "antd";

const DetailPage = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);

  // lấy KH theo id trong context
  const KH = useMemo(() => {
    return (user?.danhsachKH || []).find((u) => String(u.id) === String(id));
  }, [user?.danhsachKH, id]);

  // fetch thêm nếu KH chưa có trong context
  useEffect(() => {
    const fetchKH = async () => {
      if (!id || KH) return;
      try {
        setLoading(true);
        const res = await api.get(`/khachhang/${id}/`, user?.token);
        if (res) {
          setUser((old) => ({
            ...old,
            danhsachKH: [...(old?.danhsachKH || []), res],
          }));
        }
      } catch (err) {
        console.error("❌ Lỗi load KH:", err);
        message.error("Không thể tải thông tin khách hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchKH();
  }, [id, KH, user?.token, setUser]);

  // transactions của KH
  const data = useMemo(() => {
    return {
      ...KH,
      transactions: (user?.danhsachNote || []).filter(
        (n) => String(n.khachhang) === String(id)
      ),
    };
  }, [KH, user?.danhsachNote, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  if (!KH) {
    return (
      // Container chính giữa màn hình (dùng h-screen thay vì h-full)
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-xl font-semibold text-gray-800 mb-2">
            Không tìm thấy khách hàng
          </div>
          <p className="text-gray-500 mb-6">
            Thông tin khách hàng này có thể đã bị xóa hoặc không tồn tại.
          </p>
          <button
            onClick={() => nav("/")} // Nút trở về trang Home
            className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 transition-colors"
          >
            Trở về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return <Detail data={data} onClose={() => nav(-1)} />;
};

export default DetailPage;
