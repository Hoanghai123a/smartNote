import { useNavigate } from "react-router-dom";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "antd/dist/reset.css";
import api from "../assets/Components/api";
import { Button, message, Select, Spin } from "antd";
import {
  FaPlus,
  FaRegUser,
  FaUsers,
  FaLock,
  FaInfoCircle,
  FaPowerOff,
  FaBookOpen,
} from "react-icons/fa";
import { TiThMenuOutline } from "react-icons/ti";
import { MdOutlinePushPin } from "react-icons/md";
import Detailcard from "../assets/Components/detailcard";
import { useEnrichedNotes } from "../assets/Components/add_field_note";
import { BsListCheck } from "react-icons/bs";
import NoteModal from "../assets/Components/note_modal";
import { IoMdClose } from "react-icons/io";
import { useUser } from "../stores/userContext";
import ClientManager from "../assets/Components/client";
import ChangePass from "../assets/Components/change_pass";
import About from "./page/info";
import Contact from "./page/contact";

const Home = () => {
  const nav = useNavigate();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);

  const mountedRef = useRef(true);
  const [nameFilter, setNameFilter] = useState(undefined);
  const [openMenu, setOpenMenu] = useState(false);
  const [isFil, setIsFil] = useState(false);

  // check token + load dữ liệu
  const checkApi = async () => {
    setLoading(true);
    try {
      const token = api.getCookie("token");
      if (!token) {
        nav("/login", { replace: true });
        return;
      }
      const me = await api.get(`/user`, token);
      const [notesRes, khRes, groupRes] = await Promise.all([
        api.get(`/notes/?page_size=99999`, token),
        api.get(`/khachhang/`, token),
        api.get(`/loaighichu/`, token),
      ]);
      if (mountedRef.current) {
        setUser((old) => ({
          ...old,
          ...me,
          token,
          danhsachNote: notesRes?.results || [],
          danhsachKH: khRes?.results || [],
          danhsachGroup: groupRes?.results || [],
        }));
        console.log("danhsachKH", khRes?.results);
      }
    } catch (e) {
      console.error("checkApi error:", e);
    } finally {
      mountedRef.current && setLoading(false);
    }
  };

  const normalizeVN = (s = "") =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .trim()
      .replace(/\s+/g, " ");

  const nameKey = useCallback((s = "") => normalizeVN(s), []);

  const userOptions = useMemo(() => {
    const arr = Array.isArray(user?.danhsachKH) ? user.danhsachKH : [];
    const uniq = [
      ...new Map(
        arr
          .filter((u) => (u?.hoten ?? "").trim())
          .map((u) => [nameKey(u.hoten), u])
      ).values(),
    ];
    return uniq.map((u) => ({ label: u.hoten, value: String(u?.id ?? "") }));
  }, [user?.danhsachKH]);

  const notes = useEnrichedNotes();

  // ✅ phân loại KH theo ghim
  const listByKH = useMemo(() => {
    if (
      !Array.isArray(user?.danhsachKH) ||
      !Array.isArray(user?.danhsachNote)
    ) {
      return { ghim: [], thuong: [], loc: [] };
    }

    const validNotes = notes.filter((n) => n.trangthai === "not");

    // nhóm notes theo KH
    const notesByKH = {};
    validNotes.forEach((n) => {
      const id = String(n.khachhang);
      if (!notesByKH[id]) notesByKH[id] = [];
      notesByKH[id].push(n);
    });

    const ghim = [];
    const thuong = [];
    const loc = [];

    (user?.danhsachKH || []).forEach((kh) => {
      const id = String(kh.id);
      const data = notesByKH[id] || [];

      if (kh.ghim) {
        ghim.push({ kh, data });
      } else {
        thuong.push({ kh, data });
      }

      if (nameFilter && String(kh.id) === String(nameFilter)) {
        loc.push(...data);
      }
    });

    return { ghim, thuong, loc };
  }, [notes, user?.danhsachKH, user?.danhsachNote, nameFilter]);

  useEffect(() => {
    setIsFil(!!nameFilter);
  }, [nameFilter]);

  useEffect(() => {
    mountedRef.current = true;
    checkApi();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleLogout = () => {
    try {
      document.cookie = "token=; Max-Age=0; path=/";
    } catch (e) {
      console.error("Clear cookie error:", e);
    }
    setUser(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    message.success("Đã đăng xuất");
    nav("/login", { replace: true });
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Menu panel (animate zoom) */}
      <div className="absolute right-4 top-19 z-55">
        <div
          className={[
            "mt-2 p-2 rounded-xl bg-white shadow-lg",
            "transform-gpu origin-top-right transition-all duration-200 ease-out",
            openMenu
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none",
          ].join(" ")}
        >
          {openMenu && (
            <ul className="py-2 gap-2 flex flex-col !mb-0 text-base">
              <ClientManager>
                <li className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer">
                  <FaUsers className="text-blue-500" /> Khách hàng
                </li>
              </ClientManager>

              <ChangePass>
                <li className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer">
                  <FaLock className="text-yellow-500" /> Đổi mật khẩu
                </li>
              </ChangePass>

              <About>
                <li className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer">
                  <FaInfoCircle className="text-cyan-500" /> Về chúng tôi
                </li>
              </About>

              <li
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                <FaPowerOff className="text-red-500" /> Đăng xuất
              </li>

              <li className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer">
                <FaBookOpen className="text-green-600" /> Hướng dẫn
              </li>
            </ul>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spin size="large">
            <div style={{ minHeight: 100 }} />
          </Spin>
        </div>
      ) : (
        <div>
          {/* Top */}
          <div className="sticky top-0 bg-white p-2 shadow-md">
            <div className="pt-10 pb-2 flex justify-around relative">
              <Contact>
                <div className="border rounded-[50%] shadow-md">
                  <FaRegUser className="w-9 h-9 p-2" />
                </div>
              </Contact>
              <div className="content-center">
                <Select
                  className="min-w-[180px] w-[220px] shadow-md"
                  allowClear
                  showSearch
                  placeholder="Nhập tên"
                  value={nameFilter}
                  onChange={setNameFilter}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={userOptions}
                />
              </div>
              {/* Menu */}
              <div className="content-center">
                <div
                  onClick={() => setOpenMenu(!openMenu)}
                  className="cursor-pointer hover:bg-gray-100 rounded-full p-1"
                >
                  {openMenu ? (
                    <IoMdClose className="w-7 h-7 text-[red]" />
                  ) : (
                    <TiThMenuOutline className="w-7 h-7" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="w-full overflow-y-auto relative">
            {openMenu && (
              <div
                className="absolute inset-0 bg-[#f0efef05] backdrop-blur-sm z-40"
                onClick={() => setOpenMenu(false)}
              />
            )}
            <div className="list_ghim pt-8 px-3">
              {!isFil ? (
                <div>
                  {/* --- GHIM --- */}
                  <div className="flex items-center border-b border-[#dfdfdf]">
                    <MdOutlinePushPin className="w-5 h-5" />
                    <div className="text-lg ml-2">Ghim</div>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2 p-2">
                    {listByKH.ghim.map(({ kh, data }) => (
                      <Detailcard
                        key={kh.id}
                        data={data}
                        KH={kh}
                        onClick={() => nav(`/detail/${kh.id}`)}
                      />
                    ))}
                  </div>

                  {/* --- DANH SÁCH --- */}
                  <div className="flex items-center mt-4 border-b border-[#dfdfdf]">
                    <BsListCheck className="w-5 h-5" />
                    <div className="text-lg ml-2">Danh sách</div>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2 p-2">
                    {listByKH.thuong.map(({ kh, data }) => (
                      <Detailcard
                        key={kh.id}
                        data={data}
                        KH={kh}
                        onClick={() => nav(`/detail/${kh.id}`)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <Detailcard data={listByKH.loc} />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-10 right-5 z-50">
        <NoteModal mode="add">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0084FF] !text-white shadow-lg hover:scale-110 transition-transform">
            <FaPlus className="w-6 h-6" />
          </div>
        </NoteModal>
      </div>
    </div>
  );
};

export default Home;
