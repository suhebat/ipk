"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  MapPin,
  Layers,
  BookOpen,
  HelpCircle,
  Scale,
  FileText,
  Mail,
  Download,
  Users,
  ShieldCheck,
  ChevronRight,
  X,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import pkg from "@/package.json";

const SIMULATION_ROLES = [
  { value: "superadmin", label: "Super Admin (Penuh)" },
  { value: "data_admin", label: "Pengelola Data" },
  { value: "data_verifikator", label: "Verifikator Data" },
  { value: "content_admin", label: "Pengelola Konten" },
  { value: "service_admin", label: "Pengelola Layanan" },
  { value: "admin", label: "Administrator" },
];

type Props = {
  role: string;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  countPermohonan?: number;
  countSurat?: number;
  isImpersonating?: boolean;
  realRole?: string;
};

export default function AdminSidebar({
  role,
  mobileOpen = false,
  onCloseMobile,
  countPermohonan = 0,
  countSurat = 0,
  isImpersonating = false,
  realRole = "admin",
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [loadingSwitch, setLoadingSwitch] = useState(false);

  const isSuper = role === "superadmin";
  const isAdmin = role === "admin" || isSuper;
  const isData = role === "data_admin" || role === "data_verifikator" || isAdmin;
  const isContent = role === "content_admin" || isAdmin;

  // Hanya Super Admin asli yang berhak melihat widget switch role
  const canSimulate = realRole === "superadmin" || isSuper;

  const isActive = (href: string) => {
    if (href === "/admin/dashboard" || href === "/admin") {
      return pathname === "/admin/dashboard" || pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  async function handleSwitchRole(targetRole: string) {
    try {
      setLoadingSwitch(true);
      await fetch("/api/admin/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole }),
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSwitch(false);
    }
  }

  return (
    <>
      {/* Backdrop mobile dengan z-index z-50 */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 md:hidden transition-opacity duration-200 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onCloseMobile}
        aria-hidden={!mobileOpen}
      />

      {/* Sidebar Aside dengan z-index z-[60], h-screen / h-dvh, dan shadow */}
      <aside
        className={`
          fixed top-0 left-0 z-[60] h-screen h-dvh w-64
          bg-white dark:bg-zinc-900
          border-r border-zinc-200 dark:border-zinc-800
          flex flex-col justify-between shrink-0 select-none overflow-x-hidden shadow-2xl md:shadow-none
          transition-transform duration-200 ease-out
          md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-4 space-y-4 overflow-y-auto overflow-x-hidden flex-1">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="text-[#b8860b] shrink-0" size={28} />
              <div>
                <div className="font-extrabold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
                  IPK KEMENBUD
                </div>
                <div className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase">
                  Portal Administrasi
                </div>
              </div>
            </div>

            {/* Tombol Tutup Khusus Layar Mobile */}
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                aria-label="Tutup sidebar"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Widget Simulasi Role Super Admin */}
          {canSimulate && (
            <div className="rounded-2xl p-3 bg-amber-500/10 border border-[#b8860b]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b8860b] flex items-center gap-1.5">
                  <ShieldAlert size={13} /> Simulasi Role
                </span>
                {isImpersonating && (
                  <button
                    type="button"
                    disabled={loadingSwitch}
                    onClick={() => handleSwitchRole("reset")}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 hover:underline cursor-pointer"
                    title="Kembali ke Super Admin"
                  >
                    <RotateCcw size={10} /> Reset
                  </button>
                )}
              </div>

              <select
                value={role}
                disabled={loadingSwitch}
                onChange={(e) => handleSwitchRole(e.target.value)}
                className="w-full text-xs rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1.5 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#b8860b] cursor-pointer"
              >
                {SIMULATION_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Navigation Groups */}
          <nav className="space-y-4 text-xs font-semibold">
            {/* 1. Dashboard Utama */}
            <div>
              <Link
                href="/admin/dashboard"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                  isActive("/admin/dashboard")
                    ? "bg-[#b8860b] text-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard size={17} />
                  <span>Dashboard</span>
                </div>
                {isActive("/admin/dashboard") && <ChevronRight size={14} />}
              </Link>
            </div>

            {/* 2. Modul Data & Indikator IPK */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                Data & Indikator IPK
              </div>
              <Link
                href="/admin/data-nasional"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition ${
                  isActive("/admin/data-nasional")
                    ? "bg-[#b8860b] text-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 size={16} />
                  <span>Data Nasional</span>
                </div>
                {!isData && (
                  <span className="text-[9px] text-zinc-400 font-normal">View</span>
                )}
              </Link>
              <Link
                href="/admin/data-provinsi"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition ${
                  isActive("/admin/data-provinsi")
                    ? "bg-[#b8860b] text-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin size={16} />
                  <span>Data Provinsi</span>
                </div>
                {!isData && (
                  <span className="text-[9px] text-zinc-400 font-normal">View</span>
                )}
              </Link>
              <Link
                href="/admin/metadata-indikator"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition ${
                  isActive("/admin/metadata-indikator")
                    ? "bg-[#b8860b] text-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers size={16} />
                  <span>Metadata Indikator</span>
                </div>
                {!isData && (
                  <span className="text-[9px] text-zinc-400 font-normal">View</span>
                )}
              </Link>
            </div>

            {/* 3. Modul Konten */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                Konten
              </div>
              <Link
                href="/admin/publikasi"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition ${
                  isActive("/admin/publikasi")
                    ? "bg-[#b8860b] text-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen size={16} />
                  <span>Publikasi & Dokumen</span>
                </div>
                {!isContent && (
                  <span className="text-[9px] text-zinc-400 font-normal">View</span>
                )}
              </Link>
              <Link
                href="/admin/faq"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition ${
                  isActive("/admin/faq")
                    ? "bg-[#b8860b] text-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle size={16} />
                  <span>Kelola FAQ</span>
                </div>
                {!isContent && (
                  <span className="text-[9px] text-zinc-400 font-normal">View</span>
                )}
              </Link>
              <Link
                href="/admin/dasar-hukum"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition ${
                  isActive("/admin/dasar-hukum")
                    ? "bg-[#b8860b] text-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Scale size={16} />
                  <span>Dasar Hukum</span>
                </div>
                {!isContent && (
                  <span className="text-[9px] text-zinc-400 font-normal">View</span>
                )}
              </Link>
            </div>

            {/* 4. Modul Layanan Publik */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                Layanan Publik
              </div>
              <Link
                href="/admin/permohonan-data"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition ${
                  isActive("/admin/permohonan-data")
                    ? "bg-[#b8860b] text-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText size={16} />
                  <span>Permohonan Data</span>
                </div>
                {countPermohonan > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-600 text-white">
                    {countPermohonan}
                  </span>
                )}
              </Link>
              <Link
                href="/admin/surat-masuk"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition ${
                  isActive("/admin/surat-masuk")
                    ? "bg-[#b8860b] text-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Mail size={16} />
                  <span>Surat Masuk</span>
                </div>
                {countSurat > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-600 text-white">
                    {countSurat}
                  </span>
                )}
              </Link>
              <Link
                href="/admin/unduhan-data"
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition ${
                  isActive("/admin/unduhan-data")
                    ? "bg-[#b8860b] text-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Download size={16} />
                  <span>Log Unduhan Data</span>
                </div>
              </Link>
            </div>

            {/* 5. Khusus Super Admin */}
            {isSuper && (
              <div className="space-y-1">
                <div className="px-3 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  Sistem & Pengguna
                </div>
                <Link
                  href="/admin/kelola-admin"
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl transition ${
                    isActive("/admin/kelola-admin")
                      ? "bg-[#b8860b] text-white shadow-sm"
                      : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users size={16} />
                    <span>Kelola Admin</span>
                  </div>
                </Link>
              </div>
            )}
          </nav>
        </div>

        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-400 text-center shrink-0">
          Versi {pkg.version} • RBAC Active
        </div>
      </aside>
    </>
  );
}