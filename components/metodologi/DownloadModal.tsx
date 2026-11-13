"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import {
  Download,
  FileText,
  FileSpreadsheet,
  Loader2,
  X,
  TriangleAlert,
} from "lucide-react";
import {
  type Dimensi,
  type Metodologi,
  type FileFormat,
  METODOLOGI_OPTIONS,
  RUMUS_TEXT_2024,
  RUMUS_TEXT_2018,
  autoColWidths,
} from "./types";

export default function DownloadModal({
  onClose,
  data2024,
  data2018,
  format,
  onTriggerPrint,
}: {
  onClose: () => void;
  data2024: Dimensi[];
  data2018: Dimensi[];
  format: FileFormat;
  onTriggerPrint: (metodologi: Metodologi) => void;
}) {
  const [metodologi, setMetodologi] = useState<Metodologi>("2024");
  const [loading, setLoading] = useState(false);
  const isExcel = format === "xlsx";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const buildReadme = (metodologiLabel: string) => {
    const today = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const pageUrl = "https://ipk.kemenbud.go.id/pages/metodologi";

    return [
      "README.txt",
      "================================================================================",
      "IDENTITAS DATASET",
      "================================================================================",
      `Nama dataset       : Dimensi & Indikator IPK (${metodologiLabel})`,
      `Periode data       : ${metodologiLabel}`,
      "Format file        : xlsx",
      `Tanggal diperbarui : ${today}`,
      "",
      "================================================================================",
      "PRODUSEN DAN SUMBER DATA",
      "================================================================================",
      "Instansi           : Kementerian Kebudayaan Republik Indonesia",
      "Portal             : https://ipk.kemenbud.go.id",
      `Halaman dataset    : ${pageUrl}`,
      "",
      "================================================================================",
      "PENCANTUMAN SUMBER",
      "================================================================================",
      "Sumber: Kementerian Kebudayaan Republik Indonesia,",
      `Dimensi & Indikator IPK (${metodologiLabel}), diakses pada ${today},`,
      `melalui ${pageUrl}.`,
      "",
      "================================================================================",
      "LISENSI DAN KETENTUAN",
      "================================================================================",
      "Dataset dapat digunakan untuk keperluan penelitian, pendidikan, analisis,",
      "dan pemanfaatan informasi publik sesuai ketentuan yang berlaku.",
      "",
      "Pengguna wajib mencantumkan sumber data dan tidak boleh menyajikan hasil",
      "pengolahan seolah-olah merupakan publikasi resmi kementerian.",
      "",
      "Ketentuan penggunaan mengikuti kebijakan resmi yang berlaku pada portal.",
      "Baca: https://ipk.kemenbud.go.id/pages/ketentuan-penggunaan",
      "",
      "Catatan: Sheet \"Rumus\" berisi cara hitung dimensi dalam bentuk teks.",
      "",
    ].join("\n");
  };

  const handleExportZip = async () => {
    const list = metodologi === "2024" ? data2024 : data2018;
    const label =
      metodologi === "2024" ? "Metodologi 2024" : "Metodologi 2018–2023";
    const suffix = metodologi === "2018-2023" ? "2018-2023" : "2024";
    const rumusList =
      metodologi === "2024" ? RUMUS_TEXT_2024 : RUMUS_TEXT_2018;

    const metaRows: (string | number)[][] = [
      ["Dimensi & Indikator IPK"],
      ["Metodologi", label],
      ["Sumber", "ipk.kemenbud.go.id"],
      ["Diunduh", new Date().toLocaleString("id-ID")],
      [],
    ];

    const dimSummaryRows: (string | number)[][] = [
      ["No", "Dimensi", "Jumlah Indikator"],
      ...list.map((d, idx) => [idx + 1, d.nama, d.indikator.length]),
    ];

    const indRows: (string | number | null)[][] = [
      ["Dimensi", "Kode", "Nama Indikator", "Min", "Max", "Sumber Data"],
    ];
    for (const d of list) {
      for (const ind of d.indikator) {
        indRows.push([
          d.nama,
          ind.kode,
          ind.nama,
          ind.min ?? "—",
          ind.max ?? "—",
          ind.sumber || "—",
        ]);
      }
    }

    const rumusRows: (string | number)[][] = [
      ["Dimensi", "Cara hitung nilai dimensi", "Normalisasi indikator"],
      ...rumusList.map((r) => [r.dimensi, r.hitung, r.normalisasi]),
      [],
      [
        "Keterangan",
        "S = skor indikator setelah normalisasi min–max; X = nilai mentah indikator",
        "",
      ],
    ];

    const dimData = [
      ...metaRows,
      ["Ringkasan Dimensi"],
      [],
      ...dimSummaryRows,
    ];
    const indData = [["Rincian Indikator"], [], ...indRows];

    const sheetDimensi = XLSX.utils.aoa_to_sheet(dimData);
    const sheetIndikator = XLSX.utils.aoa_to_sheet(indData);
    const sheetRumus = XLSX.utils.aoa_to_sheet(rumusRows);

    sheetDimensi["!cols"] = autoColWidths(dimData);
    sheetIndikator["!cols"] = autoColWidths(indData);
    sheetRumus["!cols"] = autoColWidths(rumusRows);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheetDimensi, "Dimensi");
    XLSX.utils.book_append_sheet(wb, sheetIndikator, "Indikator");
    XLSX.utils.book_append_sheet(wb, sheetRumus, "Rumus");

    const xlsxBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const zip = new JSZip();
    zip.file(`IPK_Dimensi_Indikator_${suffix}.xlsx`, xlsxBuffer);
    zip.file("README.txt", buildReadme(label));

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `IPK_Dimensi_Indikator_${suffix}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleConfirm = async () => {
    setLoading(true);
    if (format === "xlsx") {
      try {
        await handleExportZip();
      } catch (err) {
        console.error("Gagal membuat file ZIP:", err);
        alert("Gagal memproses file ZIP.");
      }
      setLoading(false);
      onClose();
    } else {
      setLoading(false);
      onClose();
      onTriggerPrint(metodologi);
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
        aria-labelledby="download-modal-title"
        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3
            id="download-modal-title"
            className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white"
          >
            {isExcel ? (
              <FileSpreadsheet size={18} className="text-emerald-600" />
            ) : (
              <FileText size={18} className="text-red-500" />
            )}
            {isExcel ? "Unduh Excel (ZIP)" : "Unduh PDF"}
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
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-5">
          {isExcel
            ? "Pilih metodologi. File ZIP berisi Excel (.xlsx) dan README.txt."
            : "Pilih metodologi yang ingin dicetak atau disimpan sebagai PDF."}
        </p>

        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">
          Metodologi
        </p>
        <div className="flex flex-col gap-2 mb-5">
          {METODOLOGI_OPTIONS.map((opt) => {
            const active = metodologi === opt.value;
            return (
              <label
                key={opt.value}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                  active
                    ? "border-[#B8860B] bg-[#B8860B]/10"
                    : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                }`}
              >
                <input
                  type="radio"
                  name="dlMetodologi"
                  value={opt.value}
                  checked={active}
                  onChange={() => setMetodologi(opt.value)}
                  className="mt-1 accent-[#B8860B]"
                />
                <span>
                  <span className="block text-sm font-semibold text-zinc-900 dark:text-white">
                    {opt.label}
                  </span>
                  <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                    {opt.desc}
                  </span>
                </span>
              </label>
            );
          })}
        </div>

        <div className="mb-5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 px-4 py-3 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <p className="mb-1.5 flex items-center gap-2 font-semibold text-zinc-800 dark:text-zinc-200">
			  <TriangleAlert size={18} className="shrink-0 text-amber-500" />
			  Ketentuan Penggunaan Data
			</p>
          <p className="mb-2">
            Dataset dapat digunakan untuk penelitian,
			 pendidikan, dan analisis dengan mencantumkan sumber
			 serta tidak mengatasnamakan hasil olahan sebagai publikasi
			 resmi kementerian.
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#B8860B] text-white hover:bg-[#9a7009] disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Menyiapkan…
              </>
            ) : (
              <>
                <Download size={16} />
                {isExcel ? "Unduh ZIP (Excel + README)" : "Cetak / Simpan PDF"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
