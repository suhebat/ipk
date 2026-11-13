import Link from "next/link";
import { FileText, Mail, Download } from "lucide-react";

type Props = {
  admin: { nama: string };
  permohonanBaru: number;
  suratBaru: number;
  totalUnduhan: number;
  recentPermohonan: any[];
  recentSurat: any[];
};

export default function DashboardPengelolaLayanan({
  admin,
  permohonanBaru,
  suratBaru,
  totalUnduhan,
  recentPermohonan,
  recentSurat,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-red-500/10 via-amber-500/10 to-transparent border border-zinc-200 dark:border-zinc-800 p-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
          Inbox & Layanan Publik
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Terdapat <strong>{permohonanBaru} permohonan data baru</strong> dan <strong>{suratBaru} surat baru</strong> yang membutuhkan tindak lanjut Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Permohonan Baru</span>
            <FileText size={20} className="text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-blue-900 dark:text-blue-100 my-2">{permohonanBaru}</div>
          <Link href="/admin/permohonan-data" className="text-xs font-bold text-blue-600 hover:underline">
            Tindak lanjuti antrean →
          </Link>
        </div>

        <div className="rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50/40 dark:bg-red-950/20 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-700 dark:text-red-300 uppercase">Surat Belum Dibaca</span>
            <Mail size={20} className="text-red-600" />
          </div>
          <div className="text-3xl font-extrabold text-red-900 dark:text-red-100 my-2">{suratBaru}</div>
          <Link href="/admin/surat-masuk" className="text-xs font-bold text-red-600 hover:underline">
            Buka inbox surat →
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase">Total Unduhan Data</span>
            <Download size={20} className="text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 my-2">{totalUnduhan}</div>
          <Link href="/admin/unduhan-data" className="text-xs font-semibold text-zinc-500 hover:underline">
            Lihat log survei →
          </Link>
        </div>
      </div>
    </div>
  );
}