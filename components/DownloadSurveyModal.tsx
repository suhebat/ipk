"use client";

import { useState } from "react";
import {
  X,
  Send,
  Info,
  FileSpreadsheet,
  FileCode,
  FileText,
  Download,
  Loader2,
} from "lucide-react";

export interface DatasetItem {
  dataset: "nasional" | "provinsi" | string;
  period: string;
  label: string;
  halaman: string;
  availableFormats?: ("xlsx" | "csv" | "pdf")[];
  /** Path file langsung (untuk PDF metadata, dll.) */
  fileUrl?: string;
  fileName?: string;
}

export interface SurveyForm {
  nama: string;
  email: string;
  bidang: string;
  tujuan: string;
  tujuan_lain: string;
}

interface DownloadSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: DatasetItem | null;
  basePath?: string;
  /** Jika diisi, survei hanya disimpan lalu callback ini dipanggil (tanpa langsung unduh). */
  onSubmitted?: (form: SurveyForm) => void;
}

export default function DownloadSurveyModal({
  isOpen,
  onClose,
  item,
  basePath = "/docs/data-set/",
  onSubmitted,
}: DownloadSurveyModalProps) {
  const [step, setStep] = useState<"survey" | "format">("survey");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState<SurveyForm>({
    nama: "",
    email: "",
    bidang: "",
    tujuan: "",
    tujuan_lain: "",
  });

  if (!isOpen || !item) return null;

  const formats = item.availableFormats ?? ["xlsx", "csv"];
  const isPdfOnly = formats.length === 1 && formats[0] === "pdf";

  const isFormValid = () => {
    if (
      !formData.nama.trim() ||
      !formData.email.trim() ||
      !formData.bidang ||
      !formData.tujuan
    ) {
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return false;
    }
    if (formData.tujuan === "Lainnya" && !formData.tujuan_lain.trim()) {
      return false;
    }
    return true;
  };

  const buildPayload = (jenis: string) => ({
    nama: formData.nama.trim(),
    email: formData.email.trim(),
    bidang: formData.bidang,
    tujuan: formData.tujuan,
    tujuan_lain: formData.tujuan_lain.trim(),
    halaman: item.halaman,
    jenis,
    dataset: item.dataset,
    period: item.period,
    tahun: /^\d{4}$/.test(item.period) ? parseInt(item.period, 10) : null,
    label: item.label,
  });

  const postSurvey = async (jenis: string) => {
    try {
      await fetch("/api/download_survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(jenis)),
      });
    } catch (err) {
      console.warn("Survey API warning:", err);
    }
  };

  const triggerFileDownload = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleClose = () => {
    setStep("survey");
    setErrorMsg("");
    setIsSubmitting(false);
    onClose();
  };

  const submitAndDownloadPdf = async () => {
    setIsSubmitting(true);
    await postSurvey("pdf");
    const url = item.fileUrl || "/files/metadata-indikator-IPK-2024.pdf";
    const name = item.fileName || "metadata-indikator-IPK-2024.pdf";
    triggerFileDownload(url, name);
    setIsSubmitting(false);
    handleClose();
  };

  const handleSurveyNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      setErrorMsg("Mohon lengkapi semua field yang wajib diisi dengan benar.");
      return;
    }
    setErrorMsg("");

    // Mode khusus: serahkan ke parent (pilih metodologi/format dulu).
    // Jangan simpan jenis_unduh palsu seperti "survei-metodologi".
    // Parent / DownloadModal wajib memanggil API dengan format nyata (pdf|xlsx|csv).
    if (onSubmitted) {
      setIsSubmitting(true);
      setIsSubmitting(false);
      onSubmitted(formData);
      return;
    }

    if (isPdfOnly) {
      await submitAndDownloadPdf();
      return;
    }
    setStep("format");
  };

  const triggerDownload = (format: string) => {
    const ext = format.toLowerCase();
    const fileName = `IPK-${item.dataset}-${item.period}.${ext}`;
    const fileUrl = `${basePath}${fileName}`;
    triggerFileDownload(fileUrl, fileName);
  };

  const handleChooseFormat = async (format: "xlsx" | "csv") => {
    setIsSubmitting(true);
    await postSurvey(format === "csv" ? "csv" : "excel");
    triggerDownload(format);
    setIsSubmitting(false);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {step === "survey" ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-2.5 text-[#B8860B] font-semibold text-base mb-1">
            <Info size={20} />
            <span>Sebelum mengunduh data ini…</span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
            Mohon berkenan mengisi sedikit informasi mengenai Anda untuk membantu
            evaluasi dan pengembangan <strong>Portal IPK</strong>. Data tidak
            akan dipublikasikan.
          </p>

          <form onSubmit={handleSurveyNext} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                placeholder="Nama Anda"
                className="w-full text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2.5 focus:outline-none focus:border-[#B8860B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Alamat Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="nama@email.com"
                className="w-full text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2.5 focus:outline-none focus:border-[#B8860B]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Bidang Pekerjaan <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.bidang}
                  onChange={(e) =>
                    setFormData({ ...formData, bidang: e.target.value })
                  }
                  className="w-full text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2.5 focus:outline-none focus:border-[#B8860B] cursor-pointer"
                >
                  <option value="" disabled>
                    Pilih bidang…
                  </option>
                  <option value="Pemerintah / BUMN">Pemerintah / BUMN</option>
                  <option value="Akademisi / Peneliti">
                    Akademisi / Peneliti
                  </option>
                  <option value="Mahasiswa">Mahasiswa</option>
                  <option value="Swasta / Profesional">
                    Swasta / Profesional
                  </option>
                  <option value="LSM / Organisasi Masyarakat">
                    LSM / Organisasi Masyarakat
                  </option>
                  <option value="Media / Jurnalis">Media / Jurnalis</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Tujuan Unduh <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.tujuan}
                  onChange={(e) =>
                    setFormData({ ...formData, tujuan: e.target.value })
                  }
                  className="w-full text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2.5 focus:outline-none focus:border-[#B8860B] cursor-pointer"
                >
                  <option value="" disabled>
                    Pilih tujuan…
                  </option>
                  <option value="Penelitian / Riset">Penelitian / Riset</option>
                  <option value="Perumusan Kebijakan">
                    Perumusan Kebijakan
                  </option>
                  <option value="Tugas Kuliah / Akademik">
                    Tugas Kuliah / Akademik
                  </option>
                  <option value="Publikasi / Liputan">
                    Publikasi / Liputan
                  </option>
                  <option value="Monitoring & Evaluasi">
                    Monitoring & Evaluasi
                  </option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            {formData.tujuan === "Lainnya" && (
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Jelaskan Tujuan Lainnya <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.tujuan_lain}
                  onChange={(e) =>
                    setFormData({ ...formData, tujuan_lain: e.target.value })
                  }
                  placeholder="Tuliskan tujuan unduh data Anda"
                  className="w-full text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2.5 focus:outline-none focus:border-[#B8860B]"
                />
              </div>
            )}

            {errorMsg && (
              <p className="text-xs text-red-500 pt-1">{errorMsg}</p>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-sm font-medium border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#B8860B] hover:bg-[#9a7008] text-white disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Send size={15} />
                )}
                {onSubmitted
                  ? "Lanjutkan"
                  : isPdfOnly
                  ? "Kirim & Unduh PDF"
                  : "Lanjutkan"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>

          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
            Pilih Format Unduhan
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
            File:{" "}
            <strong className="text-zinc-800 dark:text-zinc-200">
              {item.label}
            </strong>
          </p>

          <div className="space-y-3">
            {formats.includes("xlsx") && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleChooseFormat("xlsx")}
                className="w-full text-left p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/70 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition flex items-center justify-between group cursor-pointer disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <FileSpreadsheet size={22} />
                  </div>
                  <div>
                    <strong className="block text-sm font-semibold text-zinc-900 dark:text-white">
                      Microsoft Excel
                    </strong>
                    <small className="text-xs text-zinc-500 dark:text-zinc-400">
                      Format .xlsx — siap olah tabel
                    </small>
                  </div>
                </div>
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin text-zinc-400" />
                ) : (
                  <Download
                    size={18}
                    className="text-zinc-400 group-hover:text-emerald-500 transition"
                  />
                )}
              </button>
            )}

            {formats.includes("csv") && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleChooseFormat("csv")}
                className="w-full text-left p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/70 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition flex items-center justify-between group cursor-pointer disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <FileCode size={22} />
                  </div>
                  <div>
                    <strong className="block text-sm font-semibold text-zinc-900 dark:text-white">
                      CSV (Comma Separated)
                    </strong>
                    <small className="text-xs text-zinc-500 dark:text-zinc-400">
                      Format .csv — ringan, mudah diimpor
                    </small>
                  </div>
                </div>
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin text-zinc-400" />
                ) : (
                  <Download
                    size={18}
                    className="text-zinc-400 group-hover:text-blue-500 transition"
                  />
                )}
              </button>
            )}

            {formats.includes("pdf") && item.fileUrl && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => submitAndDownloadPdf()}
                className="w-full text-left p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-red-500/70 hover:bg-red-50/40 dark:hover:bg-red-950/20 transition flex items-center justify-between group cursor-pointer disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                    <FileText size={22} />
                  </div>
                  <div>
                    <strong className="block text-sm font-semibold text-zinc-900 dark:text-white">
                      PDF
                    </strong>
                    <small className="text-xs text-zinc-500 dark:text-zinc-400">
                      Format .pdf — dokumen siap baca
                    </small>
                  </div>
                </div>
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin text-zinc-400" />
                ) : (
                  <Download
                    size={18}
                    className="text-zinc-400 group-hover:text-red-500 transition"
                  />
                )}
              </button>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setStep("survey")}
              className="text-xs text-zinc-500 hover:underline cursor-pointer"
            >
              ← Kembali ke survey
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}