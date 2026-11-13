"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/ui/PageHeader";
import CtaSection from "@/components/CtaSection";
import Button from "@/components/ui/Button";
import DownloadSurveyModal, {
  type DatasetItem,
  type SurveyForm,
} from "@/components/DownloadSurveyModal";
import PdfOptionsModal from "@/components/PdfOptionsModal";
import { printIpkPage } from "@/lib/printIpk";
import { FileText, FileSpreadsheet, CheckCircle2, AlertTriangle } from "lucide-react";

import {
  fetchNasional,
  type FileFormat,
} from "@/components/hasil-nasional/types";
import TrendBars from "@/components/hasil-nasional/TrendBars";
import DimensiBars from "@/components/hasil-nasional/DimensiBars";
import IndikatorAccordion from "@/components/hasil-nasional/IndikatorAccordion";
import NasSummaryCard from "@/components/hasil-nasional/NasSummaryCard";
import ExcelDownloadModal from "@/components/hasil-nasional/ExcelDownloadModal";
import { exportNasionalZip } from "@/components/hasil-nasional/exportNasionalZip";

export default function HasilNasionalPage() {
  const [tahun, setTahun] = useState(2024);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [excelOpen, setExcelOpen] = useState(false);
  const [pendingFormat, setPendingFormat] = useState<FileFormat>("pdf");
  const [currentUrl, setCurrentUrl] = useState(
    "https://ipk.kemenbud.go.id/pages/hasil-nasional"
  );
  const [printScope, setPrintScope] = useState<"dimensi" | "semua">("dimensi");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const u = new URL(window.location.href);
      const host = u.hostname;
      const isLocal =
        host === "localhost" ||
        host === "127.0.0.1" ||
        host.startsWith("192.168.") ||
        host.startsWith("10.") ||
        host.endsWith(".local");
      if (isLocal) {
        setCurrentUrl(
          `https://ipk.kemenbud.go.id${u.pathname}${u.search}`.replace(
            /\/$/,
            ""
          ) || "https://ipk.kemenbud.go.id/pages/hasil-nasional"
        );
      } else {
        setCurrentUrl(u.href);
      }
    } catch {
      setCurrentUrl("https://ipk.kemenbud.go.id/pages/hasil-nasional");
    }
  }, []);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["nasional", tahun],
    queryFn: () => fetchNasional(tahun),
  });

  const yearOptions = useMemo(() => {
    return data?.years?.length
      ? data.years
      : [2024, 2023, 2022, 2021, 2020, 2019, 2018];
  }, [data?.years]);

  const topDimensi = useMemo(() => {
    if (!data?.dimensi?.length) return null;
    return [...data.dimensi]
      .filter((d) => d.nilai != null)
      .sort((a, b) => (b.nilai ?? 0) - (a.nilai ?? 0))[0];
  }, [data?.dimensi]);

  const lowDimensi = useMemo(() => {
    if (!data?.dimensi?.length) return null;
    return [...data.dimensi]
      .filter((d) => d.nilai != null)
      .sort((a, b) => (a.nilai ?? 0) - (b.nilai ?? 0))[0];
  }, [data?.dimensi]);

  const surveyItem: DatasetItem = {
    dataset: "nasional",
    period: String(tahun),
    label: `IPK Nasional ${tahun}`,
    halaman: "hasil-nasional",
    availableFormats: ["pdf", "xlsx"],
  };

  const openDownloadFlow = (format: FileFormat) => {
    setPendingFormat(format);
    setSurveyOpen(true);
  };

  const handleSurveyDone = (_form: SurveyForm) => {
    setSurveyOpen(false);
    setTimeout(() => {
      if (pendingFormat === "xlsx") setExcelOpen(true);
      else setPdfOpen(true);
    }, 200);
  };

  const handlePdfConfirm = async (scope: "dimensi" | "semua") => {
    setPrintScope(scope);
    setPdfOpen(false);
    setSurveyOpen(false);
    setExcelOpen(false);
    await new Promise((r) => setTimeout(r, 250));

    await printIpkPage({
      year: tahun,
      title: "IPK Nasional",
      metodologi: data?.metodologi,
      scope,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <div className="sticky top-0 z-50 print:!hidden no-print w-full">
        <Navbar />
      </div>

      <div className="no-print print:hidden">
        <PageHeader
          eyebrow="Data & Hasil"
          title="Hasil Nasional"
          description="Lihat capaian Indeks Pembangunan Kebudayaan Indonesia secara nasional, lengkap dengan nilai dimensi dan indikatornya."
          breadcrumbs={[
            { label: "Data & Hasil", href: "#" },
            { label: "Hasil Nasional" },
          ]}
        />
      </div>

      <section className="pt-8 pb-10 lg:pt-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20 space-y-6">
          <div className="no-print print:hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm text-zinc-600 dark:text-zinc-400">
                Tahun
              </label>
              <select
                value={tahun}
                onChange={(e) => setTahun(Number(e.target.value))}
                className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#B8860B]/30"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <span className="text-sm text-zinc-500">
                Metodologi berlaku:{" "}
                <strong className="text-[#B8860B]">
                  {data?.metodologi || "—"}
                </strong>
              </span>
            </div>

            {data && (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${
                  data.available
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900"
                }`}
              >
                {data.available ? (
                  <>
                    <CheckCircle2 size={14} /> Data Nasional Tersedia
                  </>
                ) : (
                  <>
                    <AlertTriangle size={14} /> Data Belum Lengkap
                  </>
                )}
              </span>
            )}
          </div>

          {isLoading && (
            <p className="text-sm text-zinc-500 py-8 no-print">
              Memuat data nasional…
            </p>
          )}
          {error && (
            <p className="text-sm text-red-600 py-8 no-print">
              Gagal memuat data. Periksa koneksi database / API{" "}
              <code className="text-xs">/api/nasional</code>.
            </p>
          )}

          {data && !error && (
            <div id="ipk-print-root" className="space-y-6">
              <header className="print-header hidden print:block">
                <div className="print-heading">
                  <div className="print-eyebrow">DATA & HASIL</div>
                  <h1>Hasil Nasional</h1>
                  <div className="print-description">
                    {tahun} ·{" "}
                    {printScope === "semua"
                      ? "Skor Dimensi & Indikator"
                      : "Skor Dimensi"}
                  </div>
                  <div className="print-source">
                    <span>Sumber: {currentUrl}</span>
                  </div>
                </div>
              </header>

              <NasSummaryCard
                skorIpk={data.skor_ipk}
                year={data.year}
                metodologi={data.metodologi}
                topDimensi={topDimensi}
                lowDimensi={lowDimensi}
                dimensi={data.dimensi}
                isFetching={isFetching}
              />

              <div className="grid lg:grid-cols-2 gap-4">
                <TrendBars tren={data.tren} />
                <DimensiBars dimensi={data.dimensi} />
              </div>

              <div className="print-hide-indikator">
                <IndikatorAccordion groups={data.grouped || []} />
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="no-print print:hidden">
        <CtaSection
          eyebrow="Unduh Data · Hasil Nasional"
          title="Unduh data IPK Nasional"
          description="Isi kuesioner singkat, lalu unduh data dalam format PDF atau ZIP (Excel + README) untuk tahun yang dipilih."
        >
          <div className="flex flex-row gap-3 w-full max-w-lg">
            <Button
              variant="red"
              className="!px-3 sm:!px-6 !py-3 text-xs sm:text-sm flex-1 min-w-0"
              onClick={() => openDownloadFlow("pdf")}
              disabled={!data}
            >
              <span className="inline-flex items-center justify-center gap-1.5 sm:gap-2">
                <FileText size={16} className="shrink-0" />
                <span className="truncate">PDF (Tahun {tahun})</span>
              </span>
            </Button>
            <Button
              variant="green"
              className="!px-3 sm:!px-6 !py-3 text-xs sm:text-sm flex-1 min-w-0"
              onClick={() => openDownloadFlow("xlsx")}
              disabled={!data}
            >
              <span className="inline-flex items-center justify-center gap-1.5 sm:gap-2">
                <FileSpreadsheet size={16} className="shrink-0" />
                <span className="truncate">Excel (Tahun {tahun})</span>
              </span>
            </Button>
          </div>
        </CtaSection>

        <Footer />
      </div>

      <DownloadSurveyModal
        isOpen={surveyOpen}
        onClose={() => setSurveyOpen(false)}
        item={surveyItem}
        onSubmitted={handleSurveyDone}
      />

      <PdfOptionsModal
        isOpen={pdfOpen}
        onClose={() => setPdfOpen(false)}
        title={`IPK Nasional · ${tahun}`}
        subtitle={data?.metodologi}
        onConfirm={handlePdfConfirm}
      />

      {excelOpen && data && (
        <ExcelDownloadModal
          onClose={() => setExcelOpen(false)}
          tahun={tahun}
          metodologi={data.metodologi}
          onConfirm={async () => {
            await exportNasionalZip(data);
          }}
        />
      )}
    </div>
  );
}
