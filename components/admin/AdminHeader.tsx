"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Search,
  Mail,
  Bell,
  Menu,
  FileText,
  Moon,
  Sun,
  User,
  LogOut,
  Star,
  CheckCircle2,
} from "lucide-react";
import LogoutModal from "./LogoutModal";

export type HeaderNotification = {
  id: number;
  ref: string;
  pengirim: string;
  tipe: "permohonan" | "surat";
};

// Mapping role DB -> Label UI resmi
const ROLE_LABELS: Record<string, string> = {
  superadmin: "Super Admin",
  admin: "Administrator",
  data_admin: "Pengelola Data",
  data_verifikator: "Verifikator Data",
  content_admin: "Pengelola Konten",
  service_admin: "Pengelola Layanan",
};

type Props = {
  nama: string;
  username: string;
  role: string; // Tipe string fleksibel agar menerima seluruh enum role
  countPermohonan: number;
  countSurat: number;
  recentNotif: HeaderNotification[];
  onToggleMobileMenu: () => void;
};

const THEME_KEY = "admin-theme";

export default function AdminHeader({
  nama,
  username,
  role,
  countPermohonan,
  countSurat,
  recentNotif,
  onToggleMobileMenu,
}: Props) {
  const router = useRouter();
  const [openSurat, setOpenSurat] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const suratRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const totalNotif = countPermohonan + countSurat;
  const displayName = nama || username;
  const displayRole = ROLE_LABELS[role] || role;

  // Baca tema tersimpan setelah mount
  useEffect(() => {
    const dark = localStorage.getItem(THEME_KEY) === "dark";
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (suratRef.current && !suratRef.current.contains(e.target as Node)) {
        setOpenSurat(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setOpenNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setOpenProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(THEME_KEY, next ? "dark" : "light");
  };

  async function handleConfirmLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("[admin/logout]", err);
      setShowLogoutModal(false);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 h-16 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-colors">
        <div className="flex h-full items-center justify-between px-4 sm:px-6">
          {/* Tombol Hamburger Mobile + Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="p-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 md:hidden"
              aria-label="Toggle menu"
            >
              <Menu size={22} />
            </button>

            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <ShieldCheck className="text-[#b8860b]" size={26} />
              <span className="font-bold text-base sm:text-lg text-zinc-900 dark:text-zinc-100 tracking-tight">
                Admin IPK
              </span>
            </Link>
          </div>

          {/* Input Search Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="search"
                placeholder="Cari data..."
                className="w-full pl-10 pr-4 py-1.5 text-sm rounded-full bg-zinc-100 dark:bg-zinc-800/70 border-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#b8860b]/40"
              />
            </div>
          </div>

          {/* Aksi Kanan (Surat, Lonceng, Profil) */}
          <div className="flex items-center gap-2">
            {/* Dropdown Surat Masuk */}
            <div className="relative" ref={suratRef}>
              <button
                type="button"
                onClick={() => {
                  setOpenSurat(!openSurat);
                  setOpenNotif(false);
                  setOpenProfile(false);
                }}
                className="relative p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                aria-label="Surat Masuk"
              >
                <Mail size={20} />
                {countSurat > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[10px] font-bold text-white bg-red-600 rounded-full border-2 border-white dark:border-zinc-900">
                    {countSurat > 99 ? "99+" : countSurat}
                  </span>
                )}
              </button>

              {openSurat && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden z-50">
                  <div className="p-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Surat Masuk</span>
                    {countSurat > 0 ? (
                      <span className="text-xs px-2 py-0.5 font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-full">
                        {countSurat} baru
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-400">Inbox kosong</span>
                    )}
                  </div>
                  <div className="p-2 space-y-1">
                    <Link
                      href="/admin/surat-masuk"
                      onClick={() => setOpenSurat(false)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          <Mail size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Buka Surat Masuk</div>
                          <div className="text-[11px] text-zinc-500">Kelola surat dan pesan kontak</div>
                        </div>
                      </div>
                      {countSurat > 0 && (
                        <span className="text-xs font-bold text-white bg-red-600 px-2 py-0.5 rounded-full">
                          {countSurat}
                        </span>
                      )}
                    </Link>

                    {countPermohonan > 0 && (
                      <Link
                        href="/admin/permohonan-data"
                        onClick={() => setOpenSurat(false)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <FileText size={16} />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Permohonan Data</div>
                            <div className="text-[11px] text-zinc-500">Ada antrean baru di modul data</div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full">
                          {countPermohonan}
                        </span>
                      </Link>
                    )}
                  </div>
                  <Link
                    href="/admin/surat-masuk"
                    onClick={() => setOpenSurat(false)}
                    className="block p-2.5 text-center text-xs font-semibold text-[#b8860b] border-t border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    Lihat semua surat
                  </Link>
                </div>
              )}
            </div>

            {/* Dropdown Notifikasi (Lonceng) */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => {
                  setOpenNotif(!openNotif);
                  setOpenSurat(false);
                  setOpenProfile(false);
                }}
                className="relative p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                aria-label="Notifikasi"
              >
                <Bell size={20} />
                {totalNotif > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[10px] font-bold text-white bg-red-600 rounded-full border-2 border-white dark:border-zinc-900">
                    {totalNotif > 99 ? "99+" : totalNotif}
                  </span>
                )}
              </button>

              {openNotif && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden z-50">
                  <div className="p-3.5 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Notifikasi</span>
                      {totalNotif > 0 ? (
                        <span className="text-xs px-2 py-0.5 font-semibold bg-red-500/15 text-red-600 dark:text-red-400 rounded-full">
                          {totalNotif} baru
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">Tidak ada yang baru</span>
                      )}
                    </div>
                    {totalNotif > 0 && (
                      <div className="flex gap-2.5 mt-2 text-xs text-zinc-500">
                        {countPermohonan > 0 && <span>• {countPermohonan} permohonan</span>}
                        {countSurat > 0 && <span>• {countSurat} surat</span>}
                      </div>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto p-2 divide-y divide-zinc-100 dark:divide-zinc-800/60">
                    {recentNotif.length === 0 ? (
                      <div className="py-6 text-center text-xs text-zinc-400">
                        Belum ada notifikasi baru.
                      </div>
                    ) : (
                      recentNotif.map((n) => {
                        const isPermohonan = n.tipe === "permohonan";
                        return (
                          <Link
                            key={`${n.tipe}-${n.id}`}
                            href={isPermohonan ? "/admin/permohonan-data" : "/admin/surat-masuk"}
                            onClick={() => setOpenNotif(false)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition"
                          >
                            <div
                              className={`p-2 rounded-xl shrink-0 ${
                                isPermohonan
                                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              }`}
                            >
                              {isPermohonan ? <FileText size={16} /> : <Mail size={16} />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                {n.pengirim}
                              </div>
                              <div className="text-[11px] text-zinc-500 truncate">
                                {isPermohonan ? "Permohonan Data" : "Surat Masuk"} · {n.ref}
                              </div>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Separator Garis Vertikal */}
            <div className="hidden md:block w-[1px] h-8 bg-zinc-200 dark:bg-zinc-800 mx-1" />

            {/* Dropdown Menu User */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setOpenProfile(!openProfile);
                  setOpenSurat(false);
                  setOpenNotif(false);
                }}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center font-bold text-sm uppercase">
                  {displayName.charAt(0)}
                </div>
                <div className="hidden md:flex flex-col text-left leading-tight pr-1">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[120px]">
                    {displayName}
                  </span>
                  {role === "superadmin" ? (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-0.5">
                      <Star size={10} fill="currentColor" /> Super Admin
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#b8860b] dark:text-[#f0c14b] font-semibold">
                      {displayRole}
                    </span>
                  )}
                </div>
              </button>

              {openProfile && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden z-50 p-2">
                  <div className="text-center py-3">
                    <div className="w-14 h-14 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 font-bold text-lg mb-2">
                      {displayName.charAt(0)}
                    </div>
                    <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate px-2">
                      {displayName}
                    </div>
                    {role === "superadmin" ? (
                      <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#f0c14b] text-[#5c3d00] border border-[#c9a227]">
                        <CheckCircle2 size={11} /> Super Admin
                      </span>
                    ) : (
                      <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/15 text-[#b8860b] dark:text-[#f0c14b] border border-[#b8860b]/30">
                        {displayRole}
                      </span>
                    )}
                  </div>

                  <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                  {/* Switch Mode Gelap */}
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <span className="flex items-center gap-2">
                      {isDark ? <Sun size={15} className="text-amber-500" /> : <Moon size={15} />}
                      Mode Gelap
                    </span>
                    <div className={`w-8 h-4 rounded-full transition-colors relative ${isDark ? "bg-[#b8860b]" : "bg-zinc-300"}`}>
                      <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${isDark ? "right-0.5" : "left-0.5"}`} />
                    </div>
                  </button>

                  <Link
                    href="/admin/profil"
                    onClick={() => setOpenProfile(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <User size={15} /> Pengaturan Akun
                  </Link>

                  <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setOpenProfile(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        userName={displayName}
      />
    </>
  );
}