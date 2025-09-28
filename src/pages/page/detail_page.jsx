import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Detail from "./detail"; // component bạn đã viết

import { useUser } from "../../stores/userContext";

const DetailPage = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useUser();

  // lấy KH theo id
  const KH = useMemo(
    () => (user?.danhsachKH || []).find((u) => String(u.id) === String(id)),
    [user, id]
  );

  // lấy transactions (nếu có)
  const data = useMemo(() => {
    return {
      ...KH,
      transactions: (user?.danhsachNote || []).filter(
        (n) => String(n.khachhang) === String(id)
      ),
    };
  }, [KH, user, id]);

  if (!KH) return <div className="p-4">Không tìm thấy khách hàng</div>;

  return <Detail data={data} onClose={() => nav(-1)} />;
};

export default DetailPage;
