import Link from "next/link";
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";

type Props = {
  admin: { nama: string };
  antreanCount: number;
  publishedCount: number;
};

export default function DashboardVerifikator({
  admin,
  antreanCount,
  publishedCount,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-purple-500/10 to-transparent border border-zinc-200 dark:border-zinc-800 p-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
          Antrean Verifikasi Data IPK
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Periksa dan setujui draft pengajuan skor IPK sebelum diterbitkan ke web publik.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase">Menunggu Review</span>
            <Clock size={20} className="text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-900 dark:text-amber-100 my-2">{antreanCount}</div>
          <Link href="/admin/data-nasional" className="text-xs font-bold text-amber-600 hover:underline">
            Buka data untuk diverifikasi →
          </Link>
        </div>

        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase">Resmi Dipublish</span>
            <CheckCircle2 size={20} className="text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-100 my-2">{publishedCount}</div>
          <p className="text-xs text-zinc-500">Total batch data yang telah tayang di portal publik.</p>
        </div>
      </div>
    </div>
  );
}