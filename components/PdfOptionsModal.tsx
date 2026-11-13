"use client";

import { X, Printer, Loader2, TriangleAlert } from "lucide-react";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  onConfirm: (scope: "dimensi" | "semua") => void | Promise<void>;
};

export default function PdfOptionsModal({
  isOpen,
  onClose,
  title,
  subtitle,
  onConfirm,
}: Props) {
  const [scope, setScope] = useState<"dimensi" | "semua">("dimensi");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(scope);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 pr-8">
          Unduh PDF
        </h3>
        <p className="text-sm text-zinc-500 mb-1">{title}</p>
        {subtitle && <p className="text-xs text-zinc-400 mb-5">{subtitle}</p>}
        {!subtitle && <div className="mb-5" />}

        <div className="space-y-3 mb-5">
          <label
            className={`flex gap-3 p-4 rounded-2xl border cursor-pointer transition ${
              scope === "dimensi"
                ? "border-[#B8860B] bg-[#B8860B]/5"
                : "border-zinc-200 dark:border-zinc-800"
            }`}
          >
            <input
              type="radio"
              name="pdfScope"
              checked={scope === "dimensi"}
              onChange={() => setScope("dimensi")}
              className="mt-1 accent-[#B8860B]"
            />
            <div>
              <strong className="text-sm block text-zinc-900 dark:text-white">
                Hanya skor dimensi
              </strong>
              <span className="text-xs text-zinc-500">
                Ringkas: IPK + 7 dimensi
              </span>
            </div>
          </label>

          <label
            className={`flex gap-3 p-4 rounded-2xl border cursor-pointer transition ${
              scope === "semua"
                ? "border-[#B8860B] bg-[#B8860B]/5"
                : "border-zinc-200 dark:border-zinc-800"
            }`}
          >
            <input
              type="radio"
              name="pdfScope"
              checked={scope === "semua"}
              onChange={() => setScope("semua")}
              className="mt-1 accent-[#B8860B]"
            />
            <div>
              <strong className="text-sm block text-zinc-900 dark:text-white">
                Semua indikator
              </strong>
              <span className="text-xs text-zinc-500">
                Lengkap termasuk tabel indikator
              </span>
            </div>
          </label>
        </div>

        <div className="mb-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 px-4 py-3 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <p className="mb-1.5 flex items-center gap-2 font-semibold text-zinc-800 dark:text-zinc-200">
            <TriangleAlert size={16} className="shrink-0 text-amber-500" />
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

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#DC3545] text-white hover:bg-[#c82333] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Printer size={16} />
            )}
            Cetak / Simpan PDF
          </button>
        </div>
      </div>
    </div>
  );
}