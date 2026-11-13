import Link from "next/link";
import { BarChart3, UploadCloud, MapPin, CheckCircle2 } from "lucide-react";

type Props = {
  admin: { nama: string };
  skorNasional: number | null;
  totalProvinsi: number;
  provTersedia: number;
};

export default function DashboardPengelolaData({
  admin,
  skorNasional,
  totalProvinsi,
  provTersedia,
}: Props) {
  const maxProv = totalProvinsi || 38;
  const safeProvTersedia = Math.min(provTersedia, maxProv);
  const percent = Math.min(Math.round((safeProvTersedia / maxProv) * 100), 100);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-transparent border border-zinc-200 dark:border-zinc-800 p-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
          Ruang Kerja Pengelola Data
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Pantau progres agregasi data skor IPK nasional dan 38 provinsi di Indonesia.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
          <span className="text-xs font-bold text-zinc-400 uppercase">IPK Nasional 2024</span>
          <div className="text-3xl font-extrabold text-[#b8860b] my-1">
            {skorNasional ? skorNasional.toFixed(2) : "Draft"}
          </div>
          <Link
            href="/admin/data-nasional"
            className="text-xs text-[#b8860b] font-semibold hover:underline inline-flex items-center gap-1"
          >
            Rincian 7 Dimensi →
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase">Kelengkapan Provinsi</span>
            {safeProvTersedia >= maxProv && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <CheckCircle2 size={12} /> Lengkap
              </span>
            )}
          </div>
          <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 my-1">
            {safeProvTersedia} / {maxProv}
          </div>
          <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="text-[10px] text-zinc-400 mt-1 font-medium">
            {percent}% data provinsi 2024 terisi
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase">Input Data Cepat</span>
            <p className="text-xs text-zinc-500 mt-1">
              Impor atau perbarui skor indikator per provinsi via berkas CSV.
            </p>
          </div>
          <Link
            href="/admin/data-provinsi"
            className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#b8860b] text-white text-xs font-bold hover:bg-[#9a7009] transition shadow-sm mt-3"
          >
            <UploadCloud size={16} /> Buka Data Provinsi
          </Link>
        </div>
      </div>
    </div>
  );
}