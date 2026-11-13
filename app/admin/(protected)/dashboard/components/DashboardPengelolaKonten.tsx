import Link from "next/link";
import { BookOpen, HelpCircle, Scale, Plus, ArrowRight } from "lucide-react";

type Props = {
  admin: { nama: string; role: string };
  pubCount: number;
  faqCount: number;
  dasarHukumCount: number;
  latestPub: Array<{ id: number; title: string; year: number }>;
};

export default function DashboardPengelolaKonten({
  admin,
  pubCount,
  faqCount,
  dasarHukumCount,
  latestPub,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-amber-500/10 via-[#b8860b]/10 to-transparent border border-[#b8860b]/20 p-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
          Selamat Datang, {admin.nama}!
        </h1>
        <p className="text-sm text-zinc-500 mt-1 max-w-xl">
          Ruang kerja <strong>Pengelola Konten</strong>. Kelola dokumen publikasi, daftar pertanyaan FAQ, dan dasar hukum IPK yang tampil di website publik.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-400 uppercase">Publikasi & eBook</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <BookOpen size={20} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">{pubCount}</div>
          <Link
            href="/admin/publikasi"
            className="inline-flex items-center gap-1 text-xs text-[#b8860b] font-semibold mt-3 hover:underline"
          >
            Kelola publikasi <ArrowRight size={13} />
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-400 uppercase">Daftar FAQ</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <HelpCircle size={20} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">{faqCount}</div>
          <Link
            href="/admin/faq"
            className="inline-flex items-center gap-1 text-xs text-[#b8860b] font-semibold mt-3 hover:underline"
          >
            Kelola pertanyaan <ArrowRight size={13} />
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-400 uppercase">Dasar Hukum</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <Scale size={20} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">{dasarHukumCount}</div>
          <Link
            href="/admin/dasar-hukum"
            className="inline-flex items-center gap-1 text-xs text-[#b8860b] font-semibold mt-3 hover:underline"
          >
            Kelola dokumen <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Aksi Cepat</h2>
          <div className="space-y-2">
            <Link
              href="/admin/publikasi"
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200"
            >
              <span className="flex items-center gap-2"><Plus size={16} /> Tambah Buku / Modul Baru</span>
              <ArrowRight size={14} className="text-zinc-400" />
            </Link>
            <Link
              href="/admin/faq"
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200"
            >
              <span className="flex items-center gap-2"><Plus size={16} /> Buat Tanya-Jawab Baru</span>
              <ArrowRight size={14} className="text-zinc-400" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3">Publikasi Terakhir</h2>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {latestPub.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-400">Belum ada publikasi.</div>
            ) : (
              latestPub.map((p) => (
                <div key={p.id} className="py-2.5 flex justify-between items-center text-xs">
                  <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate pr-2">{p.title}</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-500 shrink-0">
                    {p.year}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}