"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/ui/PageHeader";
import CtaSection from "@/components/CtaSection";
import Button from "@/components/ui/Button";
import DownloadSurveyModal, {
  type DatasetItem,
} from "@/components/DownloadSurveyModal";
import PrintDocument, {
  type PrintDocumentHandle,
} from "@/components/PrintDocument";
import { FileText, FileSpreadsheet } from "lucide-react";

import {
  type Metodologi,
  type FileFormat,
  fetchMetodologi,
} from "@/components/metodologi/types";
import FormulaAndIndikator from "@/components/metodologi/FormulaAndIndikator";
import DownloadModal from "@/components/metodologi/DownloadModal";

const METODOLOGI_SURVEY_ITEM: DatasetItem = {
  dataset: "metodologi",
  period: "dimensi-indikator",
  label: "Dimensi & Indikator IPK",
  halaman: "metodologi",
  availableFormats: ["pdf", "xlsx"],
};

export default function MetodologiPage() {
  const [tab, setTab] = useState<"2024" | "2018">("2024");
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [pendingFormat, setPendingFormat] = useState<FileFormat>("pdf");
  const [, setIsPrinting] = useState(false);
  const printRef = useRef<PrintDocumentHandle>(null);

  const openDownloadFlow = (format: FileFormat) => {
    setPendingFormat(format);
    setSurveyOpen(true);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["metodologi"],
    queryFn: fetchMetodologi,
  });

  const data2024 = data?.m2024 ?? [];
  const data2018 = data?.m2018 ?? [];
  const items = tab === "2024" ? data2024 : data2018;

  const handleTriggerPrint = (selectedMetodologi: Metodologi) => {
    const targetTab = selectedMetodologi === "2018-2023" ? "2018" : "2024";
    setTab(targetTab);
    setIsPrinting(true);

    document.body.classList.remove("printing-scoped", "print-scope-dimensi");

    const delay = selectedMetodologi === "2018-2023" ? 1200 : 700;

    requestAnimationFrame(() => {
      setTimeout(() => {
        printRef.current?.print();
      }, delay);
    });
  };

  useEffect(() => {
    const onAfterPrint = () => {
      setIsPrinting(false);
      document.body.classList.remove("printing-scoped", "print-scope-dimensi");
    };
    window.addEventListener("afterprint", onAfterPrint);
    return () => window.removeEventListener("afterprint", onAfterPrint);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors print:bg-white print:text-black">
      <div className="sticky top-0 z-50 print:!hidden no-print w-full">
        <Navbar />
      </div>

      <div className="print:hidden">
        <PageHeader
          eyebrow="Tentang IPK"
          title="Metodologi & Indikator"
          description="IPK dibangun melalui tujuh dimensi. Berikut ini adalah rincian indikator per dimensi menurut metodologi yang berlaku, beserta sumber datanya."
          breadcrumbs={[
            { label: "Tentang", href: "/pages/tentang-ipk" },
            { label: "Metodologi & Indikator" },
          ]}
        />
      </div>

      <section className="pt-10 pb-8 lg:pt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20">
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              type="button"
              onClick={() => setTab("2024")}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${
                tab === "2024"
                  ? "bg-[#B8860B] text-white shadow-sm"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              Metodologi 2024
            </button>
            <button
              type="button"
              onClick={() => setTab("2018")}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${
                tab === "2018"
                  ? "bg-[#B8860B] text-white shadow-sm"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              Metodologi 2018 – 2023
            </button>
          </div>

          <div className="mb-6 text-left">
            <h2 className="text-brand-gold text-xl md:text-2xl font-bold mb-2">
              {tab === "2024"
                ? "Metodologi 2024 (Baru)"
                : "Metodologi 2018 – 2023 (Lama)"}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-5xl leading-relaxed">
              {tab === "2024"
                ? "Pengukuran IPK tahun 2024 menggunakan seperangkat indikator yang diperbarui. Nilai setiap dimensi dihitung dari rata-rata indikator yang telah dinormalisasi."
                : "Pengukuran IPK tahun 2018–2023 menggunakan metodologi dan indikator versi sebelumnya."}
            </p>
          </div>

          {isLoading && (
            <p className="text-sm text-zinc-500 py-10">
              Memuat data dari database…
            </p>
          )}
          {error && (
            <p className="text-sm text-red-600 py-10">
              Gagal memuat data. Pastikan MySQL berjalan dan Prisma terhubung (
              <code className="text-xs">/api/metodologi</code>).
            </p>
          )}
          {!isLoading && !error && (
            <FormulaAndIndikator
              items={items}
              mode={tab}
              isPrintingAll={false}
            />
          )}
        </div>
      </section>

      <div className="print-only">
        <PrintDocument
          ref={printRef}
          showPrintButton={false}
          title="Daftar Dimensi dan Indikator IPK"
          eyebrow="METODOLOGI & INDIKATOR"
          description={
            tab === "2024" ? "Metodologi 2024" : "Metodologi 2018–2023"
          }
          period="Semua dimensi & indikator"
          sourceUrl="https://ipk.kemenbud.go.id/pages/metodologi"
          tahun={tab === "2024" ? "2024" : "2018-2023"}
          filename={
            tab === "2024"
              ? "dimensi-indikator-metodologi-2024"
              : "dimensi-indikator-metodologi-2018-2023"
          }
        >
          {!isLoading && !error && (
            <FormulaAndIndikator
              items={items}
              mode={tab}
              isPrintingAll={true}
            />
          )}
        </PrintDocument>
      </div>

      <div className="print:hidden">
        <CtaSection
          eyebrow="Dokumentasi · Dimensi & Indikator"
          title="Unduh daftar dimensi dan indikator IPK"
          description="Pilih format unduhan. Setelah mengisi survei singkat, Anda memilih metodologi (2018–2023 atau 2024). Excel dikemas sebagai ZIP berisi .xlsx dan README.txt."
        >
          <div className="flex flex-row gap-3 w-full max-w-lg">
            <Button
              variant="red"
              className="!px-3 sm:!px-6 !py-3 text-xs sm:text-sm flex-1 min-w-0"
              onClick={() => openDownloadFlow("pdf")}
            >
              <span className="inline-flex items-center justify-center gap-1.5 sm:gap-2">
                <FileText size={16} className="shrink-0" />
                <span className="truncate">Unduh format PDF</span>
              </span>
            </Button>
            <Button
              variant="green"
              className="!px-3 sm:!px-6 !py-3 text-xs sm:text-sm flex-1 min-w-0"
              onClick={() => openDownloadFlow("xlsx")}
            >
              <span className="inline-flex items-center justify-center gap-1.5 sm:gap-2">
                <FileSpreadsheet size={16} className="shrink-0" />
                <span className="truncate">Unduh format Excel</span>
              </span>
            </Button>
          </div>
        </CtaSection>
      </div>

      <DownloadSurveyModal
        isOpen={surveyOpen}
        item={METODOLOGI_SURVEY_ITEM}
        onClose={() => setSurveyOpen(false)}
        onSubmitted={() => {
          setSurveyOpen(false);
          setDownloadOpen(true);
        }}
      />

      {downloadOpen && (
        <DownloadModal
          onClose={() => setDownloadOpen(false)}
          data2024={data2024}
          data2018={data2018}
          format={pendingFormat}
          onTriggerPrint={handleTriggerPrint}
        />
      )}

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
