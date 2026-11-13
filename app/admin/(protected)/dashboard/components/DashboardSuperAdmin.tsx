import Link from "next/link";
import { Users, FileText, Mail, BookOpen, ShieldCheck } from "lucide-react";

type Props = {
  admin: { nama: string };
  adminCount: number;
  permohonanBaru: number;
  suratBaru: number;
  pubCount: number;
  skorNasional: number | null;
};

export default function DashboardSuperAdmin({
  admin,
  adminCount,
  permohonanBaru,
  suratBaru,
  pubCount,
  skorNasional,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-zinc-900 text-white p-6 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <ShieldCheck size={16} /> Pusat Kendali Sistem
          </div>
          <h1 className="text-2xl font-extrabold mt-1">Dashboard Super Admin</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Ringkasan menyeluruh seluruh modul data, pengguna, dan permohonan publik.
          </p>
        </div>
        <Link
          href="/admin/kelola-admin"
          className="inline-flex items-center gap-2 bg-[#b8860b] hover:bg-[#9a7009] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
        >
          <Users size={16} /> Kelola Akun Admin
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
          <span className="text-[11px] font-bold text-zinc-400 uppercase">Total Admin</span>
          <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 my-1">{adminCount}</div>
          <span className="text-[10px] text-zinc-500">Akun terdaftar</span>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
          <span className="text-[11px] font-bold text-zinc-400 uppercase">Permohonan Baru</span>
          <div className="text-2xl font-extrabold text-blue-600 my-1">{permohonanBaru}</div>
          <span className="text-[10px] text-zinc-500">Antrean layanan</span>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
          <span className="text-[11px] font-bold text-zinc-400 uppercase">Surat Baru</span>
          <div className="text-2xl font-extrabold text-red-600 my-1">{suratBaru}</div>
          <span className="text-[10px] text-zinc-500">Inbox belum dibaca</span>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
          <span className="text-[11px] font-bold text-zinc-400 uppercase">Publikasi Aktif</span>
          <div className="text-2xl font-extrabold text-[#b8860b] my-1">{pubCount}</div>
          <span className="text-[10px] text-zinc-500">Dokumen tayang</span>
        </div>
      </div>
    </div>
  );
}