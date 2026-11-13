"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/ui/PageHeader";
import CtaSection from "@/components/CtaSection";
import Button from "@/components/ui/Button";
import DownloadSurveyModal, {
  type DatasetItem,
} from "@/components/DownloadSurveyModal";
import {
  Search,
  ChevronDown,
  Database,
  Info,
  Lightbulb,
  Calculator,
  SlidersHorizontal,
  FileText,
  FolderOpen,
} from "lucide-react";

type MetaItem = {
  id: number;
  kode_indikator: string | null;
  dimensi: string;
  nama_indikator: string;
  konsep_definisi: string;
  interpretasi: string;
  contoh_interpretasi: string | null;
  rumus_perhitungan: string | null;
  rumus_pembilang: string | null;
  rumus_penyebut: string | null;
  variabel_pembangun: string | null;
  kegiatan_penghasil: string;
  ukuran_satuan: string | null;
  waktu_ketersediaan: string | null;
  level_estimasi: string | null;
  dapat_diakses_umum: string | null;
  publikasi_terkait: string | null;
  urutan: number | null;
};

const DIMENSI_MASTER = [
  { key: "Ekonomi Budaya", number: "01", color: "#f59e0b", match: ["ekonomi"] },
  { key: "Pendidikan", number: "02", color: "#3b82f6", match: ["pendidikan"] },
  {
    key: "Ketahanan Sosial",
    number: "03",
    color: "#10b981",
    match: ["ketahanan"],
  },
  {
    key: "Warisan Budaya",
    number: "04",
    color: "#8b5cf6",
    match: ["warisan"],
  },
  {
    key: "Ekspresi Budaya",
    number: "05",
    color: "#ec4899",
    match: ["ekspresi"],
  },
  {
    key: "Budaya Literasi",
    number: "06",
    color: "#06b6d4",
    match: ["literasi"],
  },
  { key: "Gender", number: "07", color: "#f97316", match: ["gender"] },
] as const;

function getDimensiMeta(dimensi: string) {
  const lower = dimensi.toLowerCase();
  for (const d of DIMENSI_MASTER) {
    if (d.match.some((m) => lower.includes(m))) return d;
  }
  return {
    key: dimensi,
    number: "00",
    color: "#71717a",
    match: [] as string[],
  };
}

async function fetchMetadata(): Promise<MetaItem[]> {
  const res = await fetch("/api/metadata-indikator");
  if (!res.ok) throw new Error("Gagal memuat metadata");
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "Gagal memuat metadata");
  return (json.data || []) as MetaItem[];
}

function FormulaBlock({ item }: { item: MetaItem }) {
  if (item.rumus_pembilang && item.rumus_penyebut) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 overflow-hidden text-sm">
          <div className="px-3 py-2.5 text-zinc-800 dark:text-zinc-200 border-b border-zinc-200 dark:border-zinc-700">
            {item.rumus_pembilang}
          </div>
          <div className="px-3 py-2.5 text-zinc-800 dark:text-zinc-200">
            {item.rumus_penyebut}
          </div>
        </div>
        <span className="text-sm font-semibold text-zinc-500 shrink-0">
          × 100%
        </span>
      </div>
    );
  }
  return (
    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
      {item.rumus_perhitungan || "—"}
    </p>
  );
}

function MetaCard({
  item,
  open,
  onToggle,
}: {
  item: MetaItem;
  open: boolean;
  onToggle: () => void;
}) {
  const dim = getDimensiMeta(item.dimensi);

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start gap-3 px-4 sm:px-5 py-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition cursor-pointer"
      >
        <span
          className="shrink-0 mt-0.5 text-[11px] font-bold text-white w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: dim.color }}
        >
          {dim.number}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block font-semibold text-zinc-900 dark:text-white text-sm sm:text-base leading-snug">
            {item.nama_indikator}
          </span>
          <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] sm:text-xs text-zinc-500">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border"
              style={{
                color: dim.color,
                borderColor: `${dim.color}55`,
                backgroundColor: `${dim.color}14`,
              }}
            >
              {item.dimensi}
            </span>
            <span className="inline-flex items-center gap-1">
              <Database size={12} />
              {item.kegiatan_penghasil || "—"}
            </span>
            <span>Satuan: {item.ukuran_satuan || "—"}</span>
            {item.kode_indikator && (
              <span className="font-mono text-zinc-400">
                {item.kode_indikator}
              </span>
            )}
          </span>
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-zinc-400 mt-1 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="px-4 sm:px-5 pb-5 border-t border-zinc-100 dark:border-zinc-800">
          <div className="grid lg:grid-cols-12 gap-5 pt-4">
            <div className="lg:col-span-7 space-y-4">
              <div>
                <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#B8860B] mb-2">
                  <Info size={14} /> Konsep & Definisi
                </h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {item.konsep_definisi}
                </p>
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#B8860B] mb-2">
                  <Lightbulb size={14} /> Interpretasi
                </h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {item.interpretasi}
                </p>
                {item.contoh_interpretasi && (
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 italic leading-relaxed border-l-2 border-[#B8860B]/40 pl-3">
                    {item.contoh_interpretasi}
                  </p>
                )}
              </div>
              {item.variabel_pembangun && (
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#B8860B] mb-2">
                    Variabel Pembangun
                  </h4>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {item.variabel_pembangun}
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 bg-zinc-50/80 dark:bg-zinc-800/40">
                <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#B8860B] mb-3">
                  <Calculator size={14} /> Metode / Rumus Perhitungan
                </h4>
                <FormulaBlock item={item} />
              </div>

              <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-4">
                <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#B8860B] mb-3">
                  <SlidersHorizontal size={14} /> Atribut Teknis
                </h4>
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {[
                      ["Satuan Ukuran", item.ukuran_satuan],
                      ["Waktu Rilis", item.waktu_ketersediaan],
                      ["Level Estimasi", item.level_estimasi],
                      ["Akses Umum", item.dapat_diakses_umum || "Ya"],
                      ["Publikasi", item.publikasi_terkait],
                    ]
                      .filter(([, v]) => v)
                      .map(([label, value]) => (
                        <tr key={label as string}>
                          <td className="py-2 pr-3 text-zinc-500 align-top w-[40%]">
                            {label}
                          </td>
                          <td className="py-2 text-zinc-800 dark:text-zinc-200">
                            {value}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const METADATA_DOWNLOAD_ITEM: DatasetItem = {
  dataset: "metadata",
  period: "2024",
  label: "Metadata Indikator IPK 2024",
  halaman: "metadata-indikator",
  availableFormats: ["pdf"],
  fileUrl: "/files/metadata-indikator-IPK-2024.pdf",
  fileName: "metadata-indikator-IPK-2024.pdf",
};

export default function MetadataIndikatorPage() {
  const [q, setQ] = useState("");
  const [dimensi, setDimensi] = useState("all");
  const [openId, setOpenId] = useState<number | null>(null);
  const [surveyOpen, setSurveyOpen] = useState(false);

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["metadata-indikator"],
    queryFn: fetchMetadata,
  });

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return data.filter((item) => {
      const dimMeta = getDimensiMeta(item.dimensi);
      const matchDim =
        dimensi === "all" ||
        dimMeta.key === dimensi ||
        item.dimensi.toLowerCase().includes(dimensi.toLowerCase());

      if (!matchDim) return false;
      if (!query) return true;

      const hay = [
        item.nama_indikator,
        item.konsep_definisi,
        item.dimensi,
        item.kegiatan_penghasil,
        item.kode_indikator,
        item.rumus_perhitungan,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(query);
    });
  }, [data, q, dimensi]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Navbar />

      <PageHeader
        eyebrow="Publikasi IPK"
        title="Metadata Indikator IPK"
        description="Pelajari konsep, definisi, rumus perhitungan, interpretasi, dan sumber data dari setiap indikator pembentuk IPK."
        breadcrumbs={[
          { label: "Publikasi", href: "#" },
          { label: "Metadata Indikator" },
        ]}
      />

      <section className="pt-8 pb-12 lg:pt-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
            <div className="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80">
              <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  />
                  <input
                    type="search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Cari nama indikator, konsep, rumus, atau sumber data (cth: Susenas, Seni)…"
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#B8860B]/30"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500 shrink-0">
                  <span>Menampilkan</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/25">
                    {filtered.length} Indikator
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDimensi("all")}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition cursor-pointer ${
                    dimensi === "all"
                      ? "bg-[#B8860B] border-[#B8860B] text-white"
                      : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-[#B8860B]/50"
                  }`}
                >
                  Semua Dimensi
                </button>
                {DIMENSI_MASTER.map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setDimensi(d.key)}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition cursor-pointer ${
                      dimensi === d.key
                        ? "text-white border-transparent"
                        : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-[#B8860B]/40"
                    }`}
                    style={
                      dimensi === d.key
                        ? { backgroundColor: d.color, borderColor: d.color }
                        : undefined
                    }
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: d.color }}
                    />
                    {d.key}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-3">
              {isLoading && (
                <p className="text-sm text-zinc-500 py-8 text-center">
                  Memuat metadata indikator…
                </p>
              )}
              {error && (
                <p className="text-sm text-red-600 py-8 text-center">
                  Gagal memuat data. Periksa API{" "}
                  <code className="text-xs">/api/metadata-indikator</code>.
                </p>
              )}

              {!isLoading && !error && filtered.length === 0 && (
                <div className="py-14 text-center">
                  <FolderOpen
                    className="mx-auto text-zinc-300 dark:text-zinc-600 mb-3"
                    size={40}
                  />
                  <p className="text-sm text-zinc-500">
                    Tidak ada indikator yang cocok dengan pencarian/filter.
                  </p>
                </div>
              )}

              {!isLoading &&
                !error &&
                filtered.map((item) => (
                  <MetaCard
                    key={item.id}
                    item={item}
                    open={openId === item.id}
                    onToggle={() =>
                      setOpenId(openId === item.id ? null : item.id)
                    }
                  />
                ))}
            </div>
          </div>
        </div>
      </section>

      <CtaSection
        eyebrow="Unduh Metadata"
        title="Unduh dokumen metadata indikator IPK"
        description="Dapatkan ringkasan lengkap konsep, definisi, rumus, dan sumber data seluruh indikator pembentuk Indeks Pembangunan Kebudayaan dalam format PDF."
      >
        <Button
          variant="red"
          className="!px-6 !py-3 text-sm"
          onClick={() => setSurveyOpen(true)}
        >
          <span className="inline-flex items-center gap-2">
            <FileText size={18} />
            Unduh PDF Lengkap
          </span>
        </Button>
      </CtaSection>

      <DownloadSurveyModal
        isOpen={surveyOpen}
        onClose={() => setSurveyOpen(false)}
        item={METADATA_DOWNLOAD_ITEM}
      />

      <Footer />
    </div>
  );
}