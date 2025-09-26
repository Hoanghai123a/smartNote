import { useMemo } from "react";
import { useUser } from "../../stores/UserContext";

export const useEnrichedNotes = () => {
  const { user } = useUser();

  const enriched = useMemo(() => {
    const notes = Array.isArray(user?.danhsachNote) ? user.danhsachNote : [];
    const customers = Array.isArray(user?.danhsachKH) ? user.danhsachKH : [];

    return notes.map((note) => {
      const id = Number(note?.khachhang);
      const customer = customers.find((c) => Number(c?.id) === id);

      return {
        ...note,
        hoten: customer?.hoten ?? "—",
        sodienthoai: customer?.sodienthoai ?? "—",
      };
    });
  }, [user?.danhsachNote, user?.danhsachKH]);

  return enriched;
};
