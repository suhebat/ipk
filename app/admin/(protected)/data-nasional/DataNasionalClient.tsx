"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ListCheck,
  FolderX,
  X,
  FileSpreadsheet,
  Download,
  Eye,
  ShieldCheck,
  ArrowLeft,
  CalendarPlus,
} from "lucide-react";

type DimensiInfo = { id: number; nama: string; color: string };
type IndikatorItem = {
  kode: string;
  col: string;
  nama: string;
  nilai: number | null;
};

type Props = {
  availableYears: number[];
  selectedYear: number;
  metodologiLabel: string;
  canManage?: boolean;
  isVerifikator?: boolean;
  statusPengajuan?: "draft" | "submitted" | "approved" | "rejected" | "published" | null;
  pengajuanId?: string | null;
  skorNasional: {
    skor_ipk: number | null;
    dimensi_1: number | null;
    dimensi_2: number | null;
    dimensi_3: number | null;
    dimensi_4: number | null;
    dimensi_5: number | null;
    dimensi_6: number | null;
    dimensi_7: number | null;
  } | null;
  dimensiMaster: DimensiInfo[];
  groupedIndikator: Record<number, IndikatorItem[]>;
};

export default function DataNasionalClient({
  availableYears,
  selectedYear,
  metodologiLabel,
  canManage = false,
  isVerifikator = false,
  statusPengajuan = null,
  pengajuanId = null,
  skorNasional,
  dimensiMaster,
  groupedIndikator,
}: Props) {
  const router = useRouter();
  const [currentYearFilter, setCurrentYearFilter] = useState(selectedYear);
  const [openDimensi, setOpenDimensi] = useState<number[]>([1]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddYearModal, setShowAddYearModal] = useState(false);
  
  // Kunci minimal tahun mulai dari 2025
  const [newYearInput, setNewYearInput] = useState<number>(2025);
  const [isSubmittingYear, setIsSubmittingYear] = useState(false);
  const [isProcessingApproval, setIsProcessingApproval] = useState(false);

  // Cek apakah tahun yang sedang dibuka adalah mode draft baru (belum masuk ke daftar dropdown)
  const isDraftNewYearMode = !availableYears.includes(selectedYear) && selectedYear >= 2025;
  const isFutureYear = selectedYear >= 2025;

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/data-nasional?tahun=${currentYearFilter}`);
  };

  async function handleCreateNewYear(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!Number.isInteger(newYearInput) || newYearInput < 2025 || newYearInput > 2100) {
      alert("Tahun baru dikunci minimal mulai dari tahun 2025 (2025–2100).");
      return;
    }

    try {
      setIsSubmittingYear(true);
      const res = await fetch("/api/admin/tambah-tahun", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tahun: newYearInput, tipe: "nasional" }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || data?.error || "Gagal menambah tahun");
      }

      setShowAddYearModal(false);
      router.push(`/admin/data-nasional?tahun=${newYearInput}`);
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsSubmittingYear(false);
    }
  }

  async function handleApprovalAction(action: "approve" | "publish" | "reject") {
    if (!pengajuanId) return;
    try {
      setIsProcessingApproval(true);
      const res = await fetch("/api/admin/verifikasi-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pengajuan_id: pengajuanId, aksi: action }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Gagal memproses verifikasi");
      }

      alert(`Sukses: Data berhasil diproses (${action})!`);
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal memproses");
    } finally {
      setIsProcessingApproval(false);
    }
  }

  const toggleAccordion = (id: number) => {
    setOpenDimensi((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Halaman */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            Data IPK & Indikator Nasional
            {!canManage && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                <Eye size={12} /> Read-Only
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Capaian agregat Indeks Pembangunan Kebudayaan (IPK), 7 dimensi, dan rata-rata indikator nasional.
          </p>
        </div>

        {canManage && isFutureYear && (
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#f0c14b] text-[#5c3d00] font-bold text-xs px-4 py-2.5 shadow-sm hover:brightness-105 transition"
          >
            <UploadCloud size={16} />
            Upload CSV Data Nasional ({selectedYear})
          </button>
        )}
      </div>

      {/* 2. Banner Status Approval Workflow (Jika Tahun >= 2025) */}
      {isFutureYear && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                Status Rilis Publik Tahun {selectedYear}:
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold ${
                    statusPengajuan === "published"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : statusPengajuan === "submitted"
                      ? "bg-blue-100 text-blue-800 border border-blue-300"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  {statusPengajuan === "published"
                    ? "Tayang di Publik"
                    : statusPengajuan === "submitted"
                    ? "Menunggu Verifikasi"
                    : "Draft (Belum Diupload)"}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                {statusPengajuan === "published"
                  ? "Data sudah resmi dipublish dan dapat dilihat oleh publik di portal utama."
                  : statusPengajuan === "submitted"
                  ? "Data telah diunggah dan sedang menunggu verifikasi dari Verifikator."
                  : "Silakan unggah file CSV di atas agar data tahun ini tersimpan resmi."}
              </p>
            </div>
          </div>

          {/* Tombol Aksi Verifikator */}
          {isVerifikator && statusPengajuan === "submitted" && (
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                disabled={isProcessingApproval}
                onClick={() => handleApprovalAction("reject")}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50"
              >
                Tolak
              </button>
              <button
                type="button"
                disabled={isProcessingApproval}
                onClick={() => handleApprovalAction("publish")}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                Approve & Rilis
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. CARD FILTER TAHUN ATAU BANNER MODE DRAFT */}
      {isDraftNewYearMode ? (
        /* JIKA SEDANG TAMBAH TAHUN BARU: Card dropdown disembunyikan dan diganti banner fokus upload */
        <div className="rounded-2xl border border-amber-300/60 dark:border-amber-700/60 bg-amber-500/10 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#b8860b] text-white">
              <CalendarPlus size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Mode Input Tahun Baru: {selectedYear}
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Tahun ini belum masuk ke dropdown publik karena data CSV belum diunggah.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push("/admin/data-nasional?tahun=2024")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-xl transition"
          >
            <ArrowLeft size={13} /> Batalkan / Kembali ke Tahun 2024
          </button>
        </div>
      ) : (
        /* TAMPILAN NORMAL: Card "Pilih Tahun Analisis" */
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-5 shadow-sm">
          <form onSubmit={handleApplyFilter} className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[220px]">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Pilih Tahun Analisis:
              </label>
              <select
                value={currentYearFilter}
                onChange={(e) => setCurrentYearFilter(parseInt(e.target.value))}
                className="w-full text-xs sm:text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]/40"
              >
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    Tahun {yr}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#b8860b] hover:bg-[#996515] text-white font-semibold text-xs transition shadow-sm"
              >
                <Filter size={15} /> Tampilkan Data
              </button>
              {canManage && (
                <button
                  type="button"
                  onClick={() => setShowAddYearModal(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 font-semibold text-xs transition shadow-sm"
                >
                  + Tambah Tahun
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* 4. Info Metodologi Banner */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f0c14b] text-[#5c3d00]">
            Nasional • {selectedYear}
          </span>
          <div>
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              Agregasi Seluruh Indonesia
            </div>
            <div className="text-[11px] text-zinc-500">
              Metodologi: <span className="font-semibold text-[#b8860b]">{metodologiLabel}</span>
            </div>
          </div>
        </div>

        {skorNasional?.skor_ipk != null ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={14} /> Data Nasional Tersedia
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <AlertTriangle size={14} /> Data Belum Tersedia / Menunggu Upload
          </span>
        )}
      </div>

      {/* 5. Skor IPK & 7 Dimensi Mini Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#b8860b]/30 bg-gradient-to-br from-[#b8860b]/10 via-[#b8860b]/5 to-transparent p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#b8860b]">
            IPK Nasional
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-[#b8860b] my-2">
            {skorNasional?.skor_ipk != null
              ? skorNasional.skor_ipk.toFixed(2).replace(".", ",")
              : "—"}
          </div>
          <span className="text-[11px] font-semibold text-zinc-500 bg-white/70 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 px-3 py-1 rounded-full">
            Rata-Rata Komposit
          </span>
        </div>

        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {dimensiMaster.map((d) => {
            const val = skorNasional ? (skorNasional as any)[`dimensi_${d.id}`] : null;
            return (
              <div
                key={d.id}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0"
                      style={{ backgroundColor: d.color }}
                    >
                      {d.id}
                    </span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {val != null ? Number(val).toFixed(2).replace(".", ",") : "—"}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-300 font-medium truncate" title={d.nama}>
                    {d.nama}
                  </div>
                </div>

                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(Math.max(val ?? 0, 0), 100)}%`,
                      backgroundColor: d.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Tabel Rata-Rata Indikator per Dimensi (Accordion) */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
          <ListCheck size={18} className="text-[#b8860b]" />
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Rata-Rata Nasional Tiap Indikator ({metodologiLabel})
          </h2>
        </div>

        {Object.keys(groupedIndikator).length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-400">
            <FolderX size={32} className="mx-auto mb-2 opacity-50" />
            Tidak ada data indikator yang ditemukan untuk tahun ini.
          </div>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {dimensiMaster.map((d) => {
              const indikators = groupedIndikator[d.id] || [];
              const isOpen = openDimensi.includes(d.id);

              return (
                <div key={d.id} className="transition">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(d.id)}
                    className="w-full flex items-center justify-between p-4 bg-zinc-50/70 dark:bg-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 text-left transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-white text-[11px] font-bold"
                        style={{ backgroundColor: d.color }}
                      >
                        Dimensi {d.id}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {d.nama}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        ({indikators.length} Indikator)
                      </span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-zinc-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 uppercase tracking-wider font-semibold border-b border-zinc-200 dark:border-zinc-800">
                          <tr>
                            <th className="px-5 py-3 w-32">Kode</th>
                            <th className="px-5 py-3">Nama Indikator</th>
                            <th className="px-5 py-3 text-right w-44">Rata-Rata Nasional</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                          {indikators.map((ind) => (
                            <tr
                              key={ind.kode}
                              className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition"
                            >
                              <td className="px-5 py-3">
                                <span className="font-mono font-bold text-[11px] text-[#b8860b] bg-[#b8860b]/10 border border-[#b8860b]/20 px-2 py-0.5 rounded">
                                  {ind.kode}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-zinc-700 dark:text-zinc-300 font-medium">
                                {ind.nama}
                              </td>
                              <td className="px-5 py-3 text-right font-mono font-bold">
                                {ind.nilai != null ? (
                                  <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px]">
                                    {ind.nilai.toFixed(2).replace(".", ",")}
                                  </span>
                                ) : (
                                  <span className="text-zinc-400">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. Modal Upload CSV Data Nasional */}
      {canManage && showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowUploadModal(false)}
          />
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="text-[#b8860b]" size={20} />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Upload Data IPK Nasional ({selectedYear})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X size={18} />
              </button>
            </div>

            <form
              action="/api/admin/upload-nasional-csv"
              method="POST"
              encType="multipart/form-data"
              className="space-y-4"
            >
              <input type="hidden" name="tahun" value={selectedYear} />
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300">
                Format kolom CSV:
                <code className="block mt-1 font-mono text-[11px] bg-white dark:bg-zinc-800 p-1.5 rounded">
                  tahun, dimensi_1, dimensi_2, dimensi_3, dimensi_4, dimensi_5, dimensi_6, dimensi_7, skor_ipk
                </code>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Pilih File CSV:
                </label>
                <input
                  type="file"
                  name="file_csv"
                  accept=".csv"
                  required
                  className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#b8860b]/15 file:text-[#b8860b] hover:file:bg-[#b8860b]/25 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 p-1.5"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href={`/api/admin/template-nasional-csv?tahun=${selectedYear}`}
                  className="inline-flex items-center gap-1 text-xs text-[#b8860b] hover:underline font-semibold"
                >
                  <Download size={13} /> Download Template
                </a>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#b8860b] hover:bg-[#996515] text-white shadow-sm"
                  >
                    Upload untuk Verifikasi
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Modal Tambah Tahun Analisis (DIKUNCI MINIMAL MULAI 2025) */}
      {canManage && showAddYearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isSubmittingYear && setShowAddYearModal(false)}
          />
          <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl z-10 text-center">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              Tambah Tahun Analisis
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Pilih tahun rilis baru. Sistem mengunci penambahan tahun <strong>minimal mulai dari tahun 2025</strong>.
            </p>

            <form onSubmit={handleCreateNewYear} className="space-y-4">
              <div>
                <input
                  type="number"
                  min={2025}
                  max={2100}
                  required
                  value={newYearInput}
                  onChange={(e) => setNewYearInput(e.target.value === "" ? 2025 : parseInt(e.target.value, 10))}
                  className="w-full text-center text-lg font-bold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]/40 font-mono"
                  placeholder="2025"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isSubmittingYear}
                  onClick={() => setShowAddYearModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingYear}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-[#b8860b] hover:bg-[#996515] text-white shadow-sm disabled:opacity-50"
                >
                  {isSubmittingYear ? "Menyimpan Draft..." : "Tambah Draft"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}