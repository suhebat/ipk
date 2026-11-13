"use client";

import {
  useImperativeHandle,
  forwardRef,
  type ReactNode,
} from "react";

export type PrintDocumentHandle = {
  print: () => void;
};

interface PrintDocumentProps {
  children: ReactNode;
  title: string;
  eyebrow?: string;
  description?: string;
  period?: string;
  version?: string;
  sourceUrl?: string;
  showPrintButton?: boolean;
  className?: string;
  filename?: string;
  tahun?: string;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

const PrintDocument = forwardRef<PrintDocumentHandle, PrintDocumentProps>(
  function PrintDocument(
    {
      children,
      title,
      eyebrow = "METODOLOGI & INDIKATOR",
      description,
      period,
      version,
      sourceUrl = "https://ipk.kemenbud.go.id",
      showPrintButton = true,
      className = "",
      filename,
      tahun,
    },
    ref
  ) {
    const runPrint = () => {
      document.body.classList.remove("printing-scoped", "print-scope-dimensi");

      const base =
        filename?.replace(/\.pdf$/i, "") ||
        `dimensi-indikator-metodologi-${slugify(tahun || "dokumen")}`;

      const prevTitle = document.title;
      document.title = base;

      window.setTimeout(() => {
        window.print();
        window.setTimeout(() => {
          document.title = prevTitle;
        }, 800);
      }, 250);
    };

    useImperativeHandle(ref, () => ({
      print: runPrint,
    }));

    return (
      <div className={`print-document ${className}`}>
        {showPrintButton && (
          <div className="no-print mb-5 flex justify-end">
            <button
              type="button"
              onClick={runPrint}
              className="inline-flex items-center gap-2 rounded-lg bg-[#176B50] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#12583f]"
            >
              Cetak / Simpan PDF
            </button>
          </div>
        )}

        <div className="print-content">
          <header className="print-header">
            <div className="print-heading">
              <div className="print-eyebrow">{eyebrow}</div>
              <h1>{title}</h1>

              {(description || period || version) && (
                <div className="print-description">
                  {[description, period, version].filter(Boolean).join(" · ")}
                </div>
              )}

              <div className="print-source">
                <span>Sumber: {sourceUrl}</span>
              </div>
            </div>
          </header>

          <main className="print-main">{children}</main>
        </div>

        {/* Footer + nomor halaman (berulang tiap lembar via position:fixed + CSS counter) */}
        <footer className="print-footer">
          <span className="print-footer-left">
            Indeks Pembangunan Kebudayaan · ipk.kemenbud.go.id
          </span>
          <span className="print-page-number">
            Halaman <span className="page-number" />
          </span>
        </footer>
      </div>
    );
  }
);

export default PrintDocument;