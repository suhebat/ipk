import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/ui/PageHeader";
import CtaSection from "@/components/CtaSection";
import Button from "@/components/ui/Button";
import DatasetCardSection from "@/components/DatasetCardSection";
import { getDatasetPeriods } from "@/lib/dataset";
import {
  Database,
  Network,
  FileSpreadsheet,
  Sliders,
  FileText,
} from "lucide-react";

// Revalidasi data otomatis setiap 60 detik jika ada input data baru
export const revalidate = 60;

export default async function DatasetPage() {
  const { periods, rentangTahun } = await getDatasetPeriods();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Navbar />

      <PageHeader
        eyebrow="Publikasi IPK"
        title="Dataset IPK"
        description="Unduh data IPK nasional dan provinsi dalam format CSV atau Excel untuk kebutuhan analisis, penelitian, dan pengolahan data."
        breadcrumbs={[{ label: "Publikasi" }, { label: "Dataset IPK" }]}
      />

      {/* Bagian kartu pilihan periode dataset (dinamis dari database) */}
      <DatasetCardSection periods={periods} rentangTahun={rentangTahun} />

      {/* 4 Kolom Info */}
      <section className="py-14 lg:py-16 bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B8860B] block mb-2">
              Informasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-3">
              Tentang Data yang Tersedia
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Dataset disusun agar mudah diolah kembali untuk riset, perumusan kebijakan, maupun keperluan akademik.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                <Database size={22} />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">Sumber Data</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Dataset bersumber dari data resmi yang digunakan dalam penghitungan Indeks Pembangunan Kebudayaan.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                <Network size={22} />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">Struktur Data</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Mencakup nilai total IPK, 7 dimensi, seluruh indikator, wilayah, serta periode tahun pengukuran.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
                <FileSpreadsheet size={22} />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">Format Data</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Tersedia dalam format standar yang mudah diimpor: Microsoft Excel (.xlsx) dan Comma-Separated Values (.csv).
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-4">
                <Sliders size={22} />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">Metodologi</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Setiap file mengikuti metodologi periode terkait agar analisis komparasi tetap akurat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection
        eyebrow="METODOLOGI · DIMENSI & INDIKATOR"
        title="Dapatkan dokumentasi dimensi & indikator"
        description="Lihat daftar dimensi, indikator, sumber data, serta cara perhitungan pada halaman Metodologi — lengkap untuk memahami isi setiap dataset sebelum atau sesudah diunduh."
      >
        <Button
          href="/pages/metodologi#dimensi-indikator"
          variant="blue"
          showArrow
        >
          <span className="inline-flex items-center gap-2">
            <FileText size={18} className="shrink-0" />
            <span>Lihat Dimensi &amp; Indikator</span>
          </span>
        </Button>
      </CtaSection>

      <Footer />
    </div>
  );
}