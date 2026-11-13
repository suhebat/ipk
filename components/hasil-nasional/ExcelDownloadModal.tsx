"use client";

import { useEffect, useState } from "react";
import {
  Download,
  FileSpreadsheet,
  Loader2,
  X,
  TriangleAlert,
} from "lucide-react";

export default function ExcelDownloadModal({
  onClose,
  tahun,
  metodologi,
  onConfirm,
}: {
  onClose: () => void;
  tahun: number;
  metodologi?: string;
  onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } catch (err) {
      console.error(err);
      alert("Gagal membuat file ZIP.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 print:hidden"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
            <FileSpreadsheet size={18} className="text-emerald-600" />
            Unduh Excel (ZIP)
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          IPK Nasional · {tahun}
          {metodologi ? ` · ${metodologi}` : ""}. File ZIP berisi Excel (.xlsx)
          dan README.txt.
        </p>

        <div className="mb-5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 px-4 py-3 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <p className="mb-1.5 flex items-center gap-2 font-semibold text-zinc-800 dark:text-zinc-200">
            <TriangleAlert size={18} className="shrink-0 text-amber-500" />
            Ketentuan Penggunaan Data
          </p>
          <p className="mb-2">
            Dataset dapat digunakan untuk penelitian, pendidikan, dan analisis
            dengan mencantumkan sumber serta tidak mengatasnamakan hasil olahan
            sebagai publikasi resmi kementerian.
          </p>
          <p>
            Pelajari selengkapnya di:{" "}
            <a
              href="/pages/ketentuan-penggunaan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B8860B] font-medium hover:underline"
            >
              Ketentuan Penggunaan Data
            </a>
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#198754] text-white hover:bg-[#157347] disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Menyiapkan…
              </>
            ) : (
              <>
                <Download size={16} />
                Unduh ZIP (Excel + README)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
