"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
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
import * as XLSX from "xlsx";
import JSZip from "jszip";
import {
  FileText,
  FileSpreadsheet,
  Download,
  Loader2,
  X,
  TriangleAlert,
} from "lucide-react";

import {
  YEAR_OPTIONS,
  fetchProvinsi,
  padBps,
} from "@/components/hasil-provinsi/types";
import ProvFilterBar from "@/components/hasil-provinsi/ProvFilterBar";
import ProvSummaryCard from "@/components/hasil-provinsi/ProvSummaryCard";
import ProvTrendBars from "@/components/hasil-provinsi/ProvTrendBars";
import ProvDimensiBars from "@/components/hasil-provinsi/ProvDimensiBars";
import ProvRankingTable from "@/components/hasil-provinsi/ProvRankingTable";
import ProvIndikatorAccordion from "@/components/hasil-provinsi/ProvIndikatorAccordion";
import ProvDimensiCompareChart from "@/components/hasil-provinsi/ProvDimensiCompareChart";

type FileFormat = "pdf" | "xlsx";

/** Ganti localhost / IP lokal → domain resmi portal */
function toPublicSourceUrl(href: string, fallbackPath: string) {
  try {
    const u = new URL(href);
    const host = u.hostname;
    const isLocal =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.startsWith("192.168.") ||
      host.startsWith("10.") ||
      host.endsWith(".local");
    if (isLocal) {
      const path = u.pathname || fallbackPath;
      return `https://ipk.kemenbud.go.id${path}${u.search}`;
    }
    return u.href;
  } catch {
    return `https://ipk.kemenbud.go.id${fallbackPath}`;
  }
}

function slugifyName(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_") || "provinsi";
}

function autoColWidths(
  rows: (string | number | null | undefined)[][],
  min = 10,
  max = 56
) {
  const colCount = Math.max(0, ...rows.map((r) => r.length));
  const widths = Array.from({ length: colCount }, () => min);
  for (const row of rows) {
    row.forEach((cell, i) => {
      const len = String(cell ?? "").length;
      widths[i] = Math.min(max, Math.max(widths[i], len + 2));
    });
  }
  return widths.map((w) => ({ wch: w }));
}

function buildProvinsiReadme(opts: {
  tahun: number;
  provinceName: string;
  kodeBps: string;
  metodologi: string;
  rank?: number | null;
  totalRanked?: number | null;
  pageUrl: string;
}) {
  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const rankLine =
    opts.rank != null && opts.totalRanked != null
      ? `Peringkat          : ${opts.rank} dari ${opts.totalRanked} provinsi`
      : "Peringkat          : —";

  return [
    "README.txt",
    "================================================================================",
    "IDENTITAS DATASET",
    "================================================================================",
    `Nama dataset       : IPK Provinsi ${opts.provinceName} ${opts.tahun}`,
    `Provinsi           : ${opts.provinceName}`,
    `Kode BPS           : ${opts.kodeBps}`,
    `Periode data       : ${opts.tahun}`,
    `Metodologi         : ${opts.metodologi || "—"}`,
    rankLine,
    "Format file        : xlsx (dikemas dalam ZIP bersama README.txt)",
    `Tanggal diunduh    : ${today}`,
    "",
    "================================================================================",
    "PRODUSEN DAN SUMBER DATA",
    "================================================================================",
    "Instansi           : Kementerian Kebudayaan Republik Indonesia",
    "Portal             : https://ipk.kemenbud.go.id",
    `Halaman dataset    : ${opts.pageUrl}`,
    "",
    "================================================================================",
    "ISI FILE EXCEL",
    "================================================================================",
    "Sheet Ringkasan  : identitas provinsi, skor IPK, metodologi, ranking",
    "Sheet Dimensi    : skor 7 dimensi provinsi",
    "Sheet Indikator  : skor tiap indikator per dimensi",
    "Sheet Tren       : skor IPK provinsi per tahun (jika tersedia)",
    "Sheet Ranking    : peringkat seluruh provinsi tahun yang sama (jika tersedia)",
    "",
    "================================================================================",
    "PENCANTUMAN SUMBER",
    "================================================================================",
    "Sumber: Kementerian Kebudayaan Republik Indonesia,",
    `IPK Provinsi ${opts.provinceName} ${opts.tahun}, diakses pada ${today},`,
    `melalui ${opts.pageUrl}.`,
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
  ].join("\n");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function exportProvinsiZip(opts: {
  data: any;
  tahun: number;
  provinceName: string;
  kodeBps: string;
  pageUrl: string;
}) {
  const { data, tahun, provinceName, kodeBps, pageUrl } = opts;
  const metodologi = data.metodologi || "—";
  const slug = slugifyName(provinceName);

  const metaRows: (string | number | null)[][] = [
    ["IPK Provinsi"],
    ["Provinsi", provinceName],
    ["Kode BPS", kodeBps],
    ["Tahun", tahun],
    ["Metodologi", metodologi],
    ["Skor IPK", data.skor_ipk ?? "—"],
    [
      "Peringkat",
      data.rank != null && data.total_ranked != null
        ? `${data.rank} dari ${data.total_ranked}`
        : "—",
    ],
    ["Sumber", "ipk.kemenbud.go.id"],
    ["Diunduh", new Date().toLocaleString("id-ID")],
    [],
  ];

  const dimRows: (string | number | null)[][] = [
    ["No", "Dimensi", "Skor"],
    ...(data.dimensi || []).map(
      (d: { id: number; nama: string; nilai: number | null }) => [
        d.id,
        d.nama,
        d.nilai ?? "—",
      ]
    ),
  ];

  const indRows: (string | number | null)[][] = [
    ["Dimensi", "Kode", "Nama Indikator", "Nilai", "Sumber"],
  ];
  for (const g of data.grouped || []) {
    for (const ind of g.indikator || []) {
      indRows.push([
        g.nama,
        ind.kode,
        ind.nama,
        ind.nilai ?? "—",
        ind.sumber || "—",
      ]);
    }
  }

  const trenRows: (string | number | null)[][] = [
    ["Tahun", "Skor IPK"],
    ...(data.tren || []).map(
      (t: { tahun: number; skor_ipk: number | null }) => [
        t.tahun,
        t.skor_ipk ?? "—",
      ]
    ),
  ];

  const rankRows: (string | number | null)[][] = [
    ["Peringkat", "Kode BPS", "Provinsi", "Skor IPK"],
    ...(data.ranking || []).map(
      (
        r: {
          rank?: number;
          peringkat?: number;
          kode_bps?: string;
          code?: string;
          name?: string;
          nama?: string;
          skor_ipk?: number | null;
          skor?: number | null;
        },
        i: number
      ) => [
        r.rank ?? r.peringkat ?? i + 1,
        r.kode_bps ?? r.code ?? "—",
        r.name ?? r.nama ?? "—",
        r.skor_ipk ?? r.skor ?? "—",
      ]
    ),
  ];

  const ringkasData = [...metaRows, ["Ringkasan Dimensi"], [], ...dimRows];
  const dimData = [["Skor Dimensi"], [], ...dimRows];
  const indData = [["Rincian Indikator"], [], ...indRows];
  const trenData = [["Tren IPK Provinsi"], [], ...trenRows];
  const rankingData = [["Peringkat Provinsi"], [], ...rankRows];

  const sheetRingkas = XLSX.utils.aoa_to_sheet(ringkasData);
  const sheetDimensi = XLSX.utils.aoa_to_sheet(dimData);
  const sheetIndikator = XLSX.utils.aoa_to_sheet(indData);
  const sheetTren = XLSX.utils.aoa_to_sheet(trenData);
  const sheetRanking = XLSX.utils.aoa_to_sheet(rankingData);

  sheetRingkas["!cols"] = autoColWidths(ringkasData);
  sheetDimensi["!cols"] = autoColWidths(dimData);
  sheetIndikator["!cols"] = autoColWidths(indData);
  sheetTren["!cols"] = autoColWidths(trenData);
  sheetRanking["!cols"] = autoColWidths(rankingData);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheetRingkas, "Ringkasan");
  XLSX.utils.book_append_sheet(wb, sheetDimensi, "Dimensi");
  XLSX.utils.book_append_sheet(wb, sheetIndikator, "Indikator");
  XLSX.utils.book_append_sheet(wb, sheetTren, "Tren");
  XLSX.utils.book_append_sheet(wb, sheetRanking, "Ranking");

  const xlsxBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  const zip = new JSZip();
  const xlsxName = `IPK_Provinsi_${slug}_${tahun}.xlsx`;
  zip.file(xlsxName, xlsxBuffer);
  zip.file(
    "README.txt",
    buildProvinsiReadme({
      tahun,
      provinceName,
      kodeBps,
      metodologi,
      rank: data.rank,
      totalRanked: data.total_ranked,
      pageUrl,
    })
  );

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `IPK_Provinsi_${slug}_${tahun}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Modal konfirmasi unduh Excel + ketentuan penggunaan */
function ExcelDownloadModal({
  onClose,
  tahun,
  provinceName,
  metodologi,
  onConfirm,
}: {
  onClose: () => void;
  tahun: number;
  provinceName: string;
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
          IPK Provinsi {provinceName} · {tahun}
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

function HasilProvinsiClient() {
  const searchParams = useSearchParams();

  const [tahun, setTahun] = useState(2024);
  const [provinsiId, setProvinsiId] = useState(1);
  const [kodeFromUrl, setKodeFromUrl] = useState<string | null>(null);
  const [hydratedFromUrl, setHydratedFromUrl] = useState(false);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [excelOpen, setExcelOpen] = useState(false);
  const [pendingFormat, setPendingFormat] = useState<FileFormat>("pdf");
  const [pdfScope, setPdfScope] = useState<"dimensi" | "semua">("dimensi");
  const [currentUrl, setCurrentUrl] = useState(
    "https://ipk.kemenbud.go.id/pages/hasil-provinsi"
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCurrentUrl(
      toPublicSourceUrl(window.location.href, "/pages/hasil-provinsi")
    );
  }, []);

  useEffect(() => {
    const p = Number(searchParams.get("provinsi") || 0);
    const t = Number(searchParams.get("tahun") || 0);
    const kode = searchParams.get("kode");

    if (t > 0 && YEAR_OPTIONS.includes(t)) setTahun(t);
    if (p > 0) setProvinsiId(p);
    if (kode) setKodeFromUrl(String(kode).padStart(2, "0"));
    setHydratedFromUrl(true);
  }, [searchParams]);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["provinsi-detail", tahun, provinsiId],
    queryFn: () => fetchProvinsi(tahun, provinsiId),
    enabled: hydratedFromUrl && provinsiId > 0,
  });

  const { data: nasYear } = useQuery({
    queryKey: ["nasional-year", tahun],
    queryFn: async () => {
      const res = await fetch(`/api/nasional?tahun=${tahun}`);
      if (!res.ok) return null;
      return res.json() as Promise<{
        dimensi?: { id: number; nama: string; nilai: number | null }[];
      }>;
    },
  });

  const provinces = data?.provinces || [];

  useEffect(() => {
    if (!provinces.length) return;

    if (kodeFromUrl) {
      const found = provinces.find(
        (p) => String(p.code).padStart(2, "0") === kodeFromUrl
      );
      if (found) {
        setProvinsiId(found.id);
        setKodeFromUrl(null);
        return;
      }
    }

    const exists = provinces.some((p) => p.id === provinsiId);
    if (!exists) {
      const aceh = provinces.find((p) => /aceh/i.test(p.name)) || provinces[0];
      setProvinsiId(aceh.id);
    }
  }, [provinces, provinsiId, kodeFromUrl]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCurrentUrl(
      toPublicSourceUrl(window.location.href, "/pages/hasil-provinsi")
    );
  }, [tahun, provinsiId]);

  const provinceName = data?.province?.name || "—";
  const kodeBps = data?.province?.kode_bps
    ? padBps(data.province.kode_bps)
    : "1100";

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
    dataset: "provinsi",
    period: String(tahun),
    label: `IPK Provinsi ${provinceName} ${tahun}`,
    halaman: "hasil-provinsi",
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
    setPdfScope(scope);
    setPdfOpen(false);
    setSurveyOpen(false);
    setExcelOpen(false);

    await new Promise((r) => setTimeout(r, 250));

    // Buka/tutup akordion dikelola printIpkPage (hanya selama print, lalu restore)
    await printIpkPage({
      year: tahun,
      title: `IPK Provinsi ${provinceName}`,
      metodologi: data?.metodologi,
      scope,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/*
        Sticky shell di level halaman.
        Jangan bungkus Navbar dengan div pendek non-sticky — itu yang membuat sticky gagal.
        Shell ini yang sticky; Navbar di dalamnya boleh tetap sticky/static.
      */}
      <div className="sticky top-0 z-50 print:!hidden no-print w-full">
        <Navbar />
      </div>

      <div className="no-print print:!hidden">
        <PageHeader
          eyebrow="Data & Hasil"
          title="Hasil Provinsi"
          description="Jelajahi capaian Indeks Pembangunan Kebudayaan per provinsi, lengkap dengan skor dimensi dan indikator."
          breadcrumbs={[
            { label: "Data & Hasil", href: "#" },
            { label: "Hasil Provinsi" },
          ]}
        />
      </div>

      <section className="pt-8 pb-10 lg:pt-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20 space-y-6">
          <div className="no-print print:hidden">
            <ProvFilterBar
              tahun={tahun}
              provinsiId={provinsiId}
              provinces={provinces}
              metodologi={data?.metodologi}
              available={data?.available}
              showBadge={!!data}
              onTahunChange={setTahun}
              onProvinsiChange={setProvinsiId}
            />
          </div>

          {isLoading && (
            <p className="text-sm text-zinc-500 py-8 no-print print:hidden">
              Memuat data provinsi…
            </p>
          )}
          {error && (
            <p className="text-sm text-red-600 py-8 no-print print:hidden">
              Gagal memuat data. Periksa API{" "}
              <code className="text-xs">/api/provinsi</code>.
            </p>
          )}

          {data && !error && (
            <div id="ipk-print-root" className="space-y-6">
              <header className="print-header hidden print:block">
                <div className="print-heading">
                  <div className="print-eyebrow">DATA & HASIL</div>
                  <h1>
                    Hasil Provinsi
                    {provinceName !== "—" ? ` ${provinceName}` : ""}
                  </h1>
                  <div className="print-description">
                    {tahun} ·{" "}
                    {pdfScope === "semua"
                      ? "Skor Dimensi & Indikator"
                      : "Skor Dimensi"}
                  </div>
                  <div className="print-source">
                    <span>Sumber: {currentUrl}</span>
                  </div>
                </div>
              </header>

              <ProvSummaryCard
                provinceName={provinceName}
                kodeBps={kodeBps}
                skorIpk={data.skor_ipk}
                tahun={tahun}
                rank={data.rank}
                totalRanked={data.total_ranked}
                metodologi={data.metodologi}
                dimensi={data.dimensi}
                topDimensi={topDimensi}
                lowDimensi={lowDimensi}
                isFetching={isFetching}
              />

              <div className="grid lg:grid-cols-2 gap-4">
                <ProvTrendBars tren={data.tren} provinceName={provinceName} />
                <ProvDimensiBars dimensi={data.dimensi} />
              </div>

              {/* Peringkat Provinsi: layar saja — hilang di PDF */}
              <div className="no-print print:!hidden" data-no-print>
                <ProvRankingTable
                  tahun={tahun}
                  ranking={data.ranking || []}
                  activeKodeBps={kodeBps}
                />
              </div>

              <div className="print-hide-indikator">
                <ProvIndikatorAccordion
                  groups={data.grouped || []}
                  provinceName={provinceName}
                  year={tahun}
                />
              </div>

              {/* Perbandingan Nilai per Dimensi: layar saja — hilang di PDF */}
              <div className="no-print print:!hidden" data-no-print>
                <ProvDimensiCompareChart
                  provinceName={provinceName}
                  year={tahun}
                  provDimensi={data.dimensi}
                  nasDimensi={nasYear?.dimensi}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="no-print print:hidden">
        <CtaSection
          eyebrow="Unduh Data · Hasil Provinsi"
          title={`Unduh data IPK Provinsi ${
            provinceName !== "—" ? provinceName : ""
          }`.trim()}
          description="Isi kuesioner singkat, lalu unduh data dalam format PDF atau ZIP (Excel + README) untuk provinsi dan tahun yang dipilih."
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
        title={`IPK Provinsi ${provinceName} · ${tahun}`}
        subtitle={data?.metodologi}
        onConfirm={handlePdfConfirm}
      />

      {excelOpen && data && (
        <ExcelDownloadModal
          onClose={() => setExcelOpen(false)}
          tahun={tahun}
          provinceName={provinceName}
          metodologi={data.metodologi}
          onConfirm={async () => {
            await exportProvinsiZip({
              data,
              tahun,
              provinceName,
              kodeBps,
              pageUrl: currentUrl,
            });
          }}
        />
      )}
    </div>
  );
}

export default function HasilProvinsiPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-zinc-500">
          Memuat halaman…
        </div>
      }
    >
      <HasilProvinsiClient />
    </Suspense>
  );
}
