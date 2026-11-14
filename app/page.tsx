
"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import MapProvinsi from "@/components/MapProvinsi";
import CtaSection from "@/components/CtaSection";
import CarouselPublikasi from "@/components/CarouselPublikasi";
import ChartTrenNasional from "@/components/ChartTrenNasional";
import ChartRadarNasional, {
  colorForYear,
  isBrightColor,
} from "@/components/ChartRadarNasional";
import {
  TrendingUp,
  GraduationCap,
  UserRoundGroup,
  Landmark,
  EighthNotes,
  BookOpen,
  VenusAndMars,
  ArrowUpCircle,
  ArrowDownCircle,
  Star,
} from "lucide-react";

const DIMENSI_LIST = [
  { key: "ekonomiBudaya", label: "Ekonomi Budaya" },
  { key: "pendidikan", label: "Pendidikan" },
  { key: "ketahananSosial", label: "Ketahanan Sosial" },
  { key: "warisanBudaya", label: "Warisan Budaya" },
  { key: "ekspresiBudaya", label: "Ekspresi Budaya" },
  { key: "budayaLiterasi", label: "Budaya Literasi" },
  { key: "gender", label: "Gender" },
] as const;

async function fetchNasionalData() {
  const res = await fetch("/api/nasional");
  if (!res.ok) throw new Error("Gagal mengambil data");
  const json = await res.json();
  return json.data as {
    tahun: number;
    skorIpk: number | null;
    dimensi: Record<string, number | null>;
  }[];
}

export default function IPKHomepage() {
  const [modeTahun, setModeTahun] = useState<"banyak" | "dua">("banyak");
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [compareYear1, setCompareYear1] = useState<number | null>(null);
  const [compareYear2, setCompareYear2] = useState<number | null>(null);
  const [yearsReady, setYearsReady] = useState(false);

  const { data: dataNasional } = useQuery({
    queryKey: ["nasional"],
    queryFn: fetchNasionalData,
  });

  /** Tahun dari DB — otomatis bertambah jika data baru masuk */
  const daftarTahun = useMemo(() => {
    if (!dataNasional?.length) return [] as number[];
    return [...new Set(dataNasional.map((d) => d.tahun))].sort((a, b) => a - b);
  }, [dataNasional]);

  const yearColors = useMemo(() => {
    const map: Record<number, string> = {};
    daftarTahun.forEach((y) => {
      map[y] = colorForYear(y);
    });
    return map;
  }, [daftarTahun]);

  // Inisialisasi pilihan tahun dari data terbaru
  useEffect(() => {
    if (!daftarTahun.length || yearsReady) return;
    const last = daftarTahun[daftarTahun.length - 1];
    const prev = daftarTahun[daftarTahun.length - 2] ?? last;
    setSelectedYears(
      [prev, last].filter((v, i, arr) => arr.indexOf(v) === i)
    );
    setCompareYear1(prev);
    setCompareYear2(last);
    setYearsReady(true);
  }, [daftarTahun, yearsReady]);

  // ===== Skor Hero =====
  const latest = dataNasional?.[dataNasional.length - 1];
  const previous = dataNasional?.[dataNasional.length - 2];

  const skorTerbaru = latest?.skorIpk != null ? Number(latest.skorIpk) : null;
  const skorSebelumnya =
    previous?.skorIpk != null ? Number(previous.skorIpk) : null;
  const tahunTerbaru = latest?.tahun ?? null;

  const selisih =
    skorTerbaru != null && skorSebelumnya != null
      ? Number((skorTerbaru - skorSebelumnya).toFixed(2))
      : null;

  const pertumbuhan =
    skorTerbaru != null && skorSebelumnya != null && skorSebelumnya !== 0
      ? Number(
          (((skorTerbaru - skorSebelumnya) / skorSebelumnya) * 100).toFixed(2)
        )
      : null;

  // ===== Animasi running skor =====
  const [displaySkor, setDisplaySkor] = useState(0);
  const [displaySelisih, setDisplaySelisih] = useState(0);
  const [displayPertumbuhan, setDisplayPertumbuhan] = useState(0);

  useEffect(() => {
    if (skorTerbaru === null) return;

    let step = 0;
    const steps = 40;
    const intervalMs = 30;

    setDisplaySkor(0);
    setDisplaySelisih(0);
    setDisplayPertumbuhan(0);

    const timer = setInterval(() => {
      step += 1;
      const p = step / steps;

      setDisplaySkor(Number((skorTerbaru * p).toFixed(2)));
      if (selisih !== null) {
        setDisplaySelisih(Number((selisih * p).toFixed(2)));
      }
      if (pertumbuhan !== null) {
        setDisplayPertumbuhan(Number((pertumbuhan * p).toFixed(2)));
      }

      if (step >= steps) {
        clearInterval(timer);
        setDisplaySkor(skorTerbaru);
        if (selisih !== null) setDisplaySelisih(selisih);
        if (pertumbuhan !== null) setDisplayPertumbuhan(pertumbuhan);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [skorTerbaru, selisih, pertumbuhan]);

  const handleYearToggle = (year: number) => {
    if (selectedYears.includes(year)) {
      if (selectedYears.length > 1) {
        setSelectedYears(selectedYears.filter((y) => y !== year));
      }
    } else {
      setSelectedYears([...selectedYears, year].sort((a, b) => a - b));
    }
  };

  const activeYears =
    modeTahun === "banyak"
      ? selectedYears
      : ([compareYear1, compareYear2].filter(Boolean) as number[]);

  const dataY1 = dataNasional?.find((d) => d.tahun === compareYear1)?.dimensi;
  const dataY2 = dataNasional?.find((d) => d.tahun === compareYear2)?.dimensi;

  const dimensions = [
    {
      icon: TrendingUp,
      name: "Ekonomi Budaya",
      color: "#f59e0b",
      muted: "#b45309",
    },
    {
      icon: GraduationCap,
      name: "Pendidikan",
      color: "#3b82f6",
      muted: "#1d4ed8",
    },
    {
      icon: UserRoundGroup,
      name: "Ketahanan Sosial",
      color: "#10b981",
      muted: "#047857",
    },
    {
      icon: Landmark,
      name: "Warisan Budaya",
      color: "#8b5cf6",
      muted: "#6d28d9",
    },
    {
      icon: EighthNotes,
      name: "Ekspresi Budaya",
      color: "#ec4899",
      muted: "#be185d",
    },
    {
      icon: BookOpen,
      name: "Budaya Literasi",
      color: "#06b6d4",
      muted: "#0e7490",
    },
    { icon: VenusAndMars, name: "Gender", color: "#f97316", muted: "#c2410c" },
  ];

  // ===== Data ringkasan perbandingan =====
  const rows = DIMENSI_LIST.map(({ key, label }) => {
    const val1 = Number(dataY1?.[key] ?? 0);
    const val2 = Number(dataY2?.[key] ?? 0);
    const diff = Number((val2 - val1).toFixed(2));
    return { key, label, val1, val2, diff };
  });

  const maxRow = rows.reduce((a, b) => (b.diff > a.diff ? b : a), rows[0]);
  const minRow = rows.reduce((a, b) => (b.diff < a.diff ? b : a), rows[0]);

  const fmtInsight = (n: number) =>
    `${n > 0 ? "+" : ""}${n.toFixed(2).replace(".", ",")}`;
  const fmtTabel = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors relative">
      <Navbar />

      {/* =========================================================
           1. HERO SECTION (Parallax & Dual Column)
      ========================================================= */}
      <section
        className="relative min-h-[660px] flex items-center bg-fixed bg-cover bg-center overflow-hidden py-24 lg:py-32"
        style={{ backgroundImage: "url('/images/hero/hero-bg-1.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/35 dark:bg-black/50 pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-14 items-center">
            {/* Kiri — Teks Utama */}
            <div className="lg:col-span-8 text-left text-white lg:pr-4">
              <span className="text-white/80 text-xs md:text-sm font-bold tracking-widest uppercase mb-4 inline-block">
                INDEKS PEMBANGUNAN KEBUDAYAAN
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-[2.6rem] xl:text-[2.9rem] font-bold tracking-tight mb-6 leading-[1.2] text-white">
                Mengukur Kemajuan
                <br />
                Pembangunan Kebudayaan
              </h1>
              <p className="text-sm md:text-base text-white/90 mb-8 leading-relaxed">
                Instrumen pengukuran pembangunan kebudayaan yang menggambarkan
                capaian pembangunan kebudayaan nasional dan daerah berdasarkan
                indikator yang terukur, objektif, dan berkelanjutan.
              </p>
              <div className="flex flex-wrap gap-4 pt-1">
                <Button
                  variant="gold-solid"
                  showArrow
                  href="#profil-ipk-nasional"
                >
                  Lihat Data
                </Button>
                <Button variant="outline" showArrow href="/pages/metodologi">
                  Lihat Metodologi
                </Button>
              </div>
            </div>

            {/* Kanan — Card Skor IPK */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="w-full max-w-md bg-white/95 dark:bg-zinc-900/90 backdrop-blur-md rounded-3xl border border-white/40 dark:border-zinc-800 shadow-2xl overflow-hidden text-center">
                <div className="pt-9 pb-8 px-8">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                    Skor IPK Nasional Tahun {tahunTerbaru ?? "—"}
                  </span>
                  <strong className="block text-6xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white tabular-nums">
                    {skorTerbaru !== null
                      ? displaySkor.toFixed(2).replace(".", ",")
                      : "—"}
                  </strong>
                </div>

                <div className="grid grid-cols-2 border-t border-zinc-200/80 dark:border-zinc-800 bg-[#f8f8f6] dark:bg-zinc-950/60 py-6 px-5 relative">
                  <div className="absolute top-5 bottom-5 left-1/2 w-px bg-zinc-200 dark:bg-zinc-800 -translate-x-1/2" />

                  <div className="px-3 flex flex-col justify-center items-center">
                    <span className="text-[11px] md:text-xs text-zinc-500 dark:text-zinc-400 leading-tight mb-2">
                      Selisih dengan
                      <br />
                      tahun sebelumnya
                    </span>
                    <strong className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white tabular-nums">
                      {selisih !== null
                        ? `${displaySelisih > 0 ? "+" : ""}${displaySelisih
                            .toFixed(2)
                            .replace(".", ",")}`
                        : "—"}
                    </strong>
                  </div>

                  <div className="px-3 flex flex-col justify-center items-center">
                    <span className="text-[11px] md:text-xs text-zinc-500 dark:text-zinc-400 leading-tight mb-2">
                      Pertumbuhan dari
                      <br />
                      tahun sebelumnya
                    </span>
                    <strong className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white tabular-nums">
                      {pertumbuhan !== null
                        ? `${
                            displayPertumbuhan > 0 ? "+" : ""
                          }${displayPertumbuhan.toFixed(2).replace(".", ",")}%`
                        : "—"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
           2. TENTANG IPK
      ========================================================= */}
      <section className="relative section-py border-t border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.38] dark:opacity-[0.28] pointer-events-none"
          style={{
            backgroundImage: "url('/decorations/indonesian-01.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6 sm:px-10 text-center">
          <SectionHeader
            eyebrow="Tentang IPK"
            title="Apa itu IPK?"
            className="mb-8"
          />
          <div className="text-zinc-700 dark:text-zinc-300 space-y-5 leading-relaxed text-base max-w-2xl mx-auto">
            <p>
              Indeks Pembangunan Kebudayaan (IPK) merupakan instrumen pengukuran
              yang digunakan untuk menggambarkan capaian pembangunan kebudayaan
              di Indonesia berdasarkan sejumlah dimensi dan indikator yang
              terukur.
            </p>
            <p>
              IPK menjadi salah satu dasar untuk memahami kondisi pembangunan
              kebudayaan secara objektif, melihat perkembangan dari waktu ke
              waktu, serta mendukung perumusan kebijakan pembangunan kebudayaan
              yang berbasis data.
            </p>
          </div>
          <div className="mt-12 flex justify-center">
            <Button
              variant="gold-solid"
              showArrow
              href="/pages/tentang-ipk"
            >
              Lebih Lanjut
            </Button>
          </div>
        </div>
      </section>

      {/* =========================================================
           3. 7 DIMENSI IPK
      ========================================================= */}
      <section className="section-alt section-py">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 text-center">
          <SectionHeader
            eyebrow="Dimensi IPK"
            title="7 Dimensi Indeks Pembangunan Kebudayaan"
            description="Indeks Pembangunan Kebudayaan diukur melalui tujuh dimensi yang menggambarkan berbagai aspek pembangunan kebudayaan di Indonesia."
            maxWidth="max-w-2xl"
            className="mb-14"
          />
          <div className="grid grid-cols-2 lg:grid-cols-7 gap-5">
            {dimensions.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 text-white shadow-md hover:-translate-y-1 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${item.color} 0%, ${item.muted} 100%)`,
                }}
              >
                <item.icon
                  className="w-12 h-12 mx-auto mb-3 text-white"
                  strokeWidth={1.5}
                />
                <h3 className="font-medium text-sm leading-tight">
                  {item.name}
                </h3>
              </div>
            ))}
          </div>
          <p className="mt-14 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Tujuh dimensi ini menjadi dasar perhitungan IPK. Rincian indikator,
            definisi operasional, dan cara hitung tersedia di halaman
            metodologi.
          </p>
          <div className="mt-10 flex justify-center">
            <Button
              variant="gold-solid"
              showArrow
              href="/pages/metodologi"
            >
              Pelajari Metodologi &amp; Indikator
            </Button>
          </div>
        </div>
      </section>

      {/* =========================================================
           4. TREN NASIONAL
      ========================================================= */}
      <section id="profil-ipk-nasional" className="section-base section-py">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-14 text-center">
          <SectionHeader
            eyebrow="Profil IPK Nasional"
            title="Indeks Pembangunan Kebudayaan Nasional"
            description="Gambaran capaian pembangunan kebudayaan Indonesia berdasarkan hasil pengukuran IPK"
          />
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm">
            <h3 className="text-left text-lg font-semibold mb-6 text-[#B8860B]">
              Grafik Tren IPK Nasional
            </h3>
            <ChartTrenNasional />
          </div>
        </div>
      </section>

      {/* =========================================================
           5. RADAR & RINGKASAN
      ========================================================= */}
      <section className="pb-24 lg:pb-28 border-t border-zinc-200 dark:border-zinc-800 pt-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 text-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div
              className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm transition-all ${
                modeTahun === "dua"
                  ? "lg:col-span-8"
                  : "lg:col-span-12 max-w-5xl mx-auto w-full"
              }`}
            >
              <h3 className="text-left text-lg font-semibold text-[#B8860B]">
                Perbandingan Nilai per Dimensi
              </h3>

              {/* Tab mode — inactive tetap terlihat sebagai tombol */}
              <div className="flex justify-start my-5">
                <div className="inline-flex p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 shadow-inner gap-1">
                  <button
                    type="button"
                    onClick={() => setModeTahun("banyak")}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                      modeTahun === "banyak"
                        ? "bg-[#B8860B] text-white shadow-sm"
                        : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-600 hover:border-[#B8860B]/60 hover:text-[#B8860B]"
                    }`}
                  >
                    Banyak Tahun
                  </button>
                  <button
                    type="button"
                    onClick={() => setModeTahun("dua")}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                      modeTahun === "dua"
                        ? "bg-[#B8860B] text-white shadow-sm"
                        : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-600 hover:border-[#B8860B]/60 hover:text-[#B8860B]"
                    }`}
                  >
                    Bandingkan 2 Tahun
                  </button>
                </div>
              </div>

              {modeTahun === "banyak" ? (
                <div className="text-left mb-6">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2.5">
                    Pilih Tahun:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {daftarTahun.map((thn) => {
                      const isActive = selectedYears.includes(thn);
                      const color = yearColors[thn] || colorForYear(thn);
                      const bright = isBrightColor(color);
                      return (
                        <button
                          key={thn}
                          type="button"
                          onClick={() => handleYearToggle(thn)}
                          style={{
                            backgroundColor: isActive ? color : "transparent",
                            borderColor: color,
                            color: isActive
                              ? bright
                                ? "#111"
                                : "#fff"
                              : color,
                          }}
                          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border-2 transition-all cursor-pointer ${
                            isActive
                              ? "shadow-sm scale-[1.02]"
                              : "bg-white dark:bg-zinc-950/40 opacity-90 hover:opacity-100 hover:shadow-sm"
                          }`}
                          title={
                            isActive
                              ? `Sembunyikan ${thn}`
                              : `Tampilkan ${thn}`
                          }
                        >
                          {thn}
                        </button>
                      );
                    })}
                  </div>
                  {daftarTahun.length === 0 && (
                    <p className="text-xs text-zinc-400 mt-2">
                      Memuat daftar tahun...
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3 text-left mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 font-medium">
                      Tahun A:
                    </span>
                    <select
                      value={compareYear1 ?? ""}
                      onChange={(e) =>
                        setCompareYear1(Number(e.target.value))
                      }
                      className="text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 font-medium focus:outline-none focus:ring-1 focus:ring-[#B8860B]"
                    >
                      {daftarTahun.map((thn) => (
                        <option key={thn} value={thn}>
                          {thn}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-xs text-zinc-400 font-bold">vs</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 font-medium">
                      Tahun B:
                    </span>
                    <select
                      value={compareYear2 ?? ""}
                      onChange={(e) =>
                        setCompareYear2(Number(e.target.value))
                      }
                      className="text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2 font-medium focus:outline-none focus:ring-1 focus:ring-[#B8860B]"
                    >
                      {daftarTahun.map((thn) => (
                        <option key={thn} value={thn}>
                          {thn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="w-full flex items-center justify-center pt-2">
                {activeYears.length > 0 ? (
                  <ChartRadarNasional
                    years={activeYears}
                    yearColors={yearColors}
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center text-zinc-400 text-sm">
                    {daftarTahun.length === 0
                      ? "Memuat data..."
                      : "Pilih minimal satu tahun"}
                  </div>
                )}
              </div>
            </div>

            {modeTahun === "dua" && rows.length > 0 && (
              <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 text-left shadow-sm">
                <h4 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 pb-4">
                  Ringkasan Perbandingan
                </h4>

                <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-4 py-3 space-y-2 text-xs">
                  {maxRow && maxRow.diff > 0 && (
                    <p className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                      <ArrowUpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        <b className="text-emerald-700 dark:text-emerald-400">
                          {maxRow.label}
                        </b>{" "}
                        naik terbesar ({fmtInsight(maxRow.diff)})
                      </span>
                    </p>
                  )}
                  {minRow && minRow.diff < 0 && (
                    <p className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                      <ArrowDownCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>
                        <b className="text-rose-600 dark:text-rose-400">
                          {minRow.label}
                        </b>{" "}
                        turun terbesar ({fmtInsight(minRow.diff)})
                      </span>
                    </p>
                  )}
                </div>

                <div className="overflow-x-auto mt-5">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-700">
                        <th className="py-2.5 text-left font-bold">Dimensi</th>
                        <th className="py-2.5 text-right font-bold">
                          {compareYear1}
                        </th>
                        <th className="py-2.5 text-right font-bold">
                          {compareYear2}
                        </th>
                        <th className="py-2.5 text-right font-bold">Selisih</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => {
                        const isMax = r.key === maxRow?.key && maxRow.diff > 0;
                        const isMin = r.key === minRow?.key && minRow.diff < 0;
                        const isHighlight = isMax || isMin;

                        const rowBg = isMax
                          ? "bg-emerald-100/70 dark:bg-emerald-950/50"
                          : isMin
                          ? "bg-rose-100 dark:bg-rose-950/50"
                          : "";

                        const diffColor =
                          r.diff > 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : r.diff < 0
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-zinc-400";

                        return (
                          <tr
                            key={r.key}
                            className={`border-b border-zinc-200 dark:border-zinc-800 ${rowBg}`}
                          >
                            <td className="py-2.5 text-zinc-700 dark:text-zinc-400">
                              <span className="inline-flex items-center gap-1.5">
                                {r.label}
                                {isHighlight && (
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                )}
                              </span>
                            </td>
                            <td className="py-2.5 text-right tabular-nums text-zinc-700 dark:text-zinc-300">
                              {r.val1.toFixed(2)}
                            </td>
                            <td className="py-2.5 text-right tabular-nums text-zinc-700 dark:text-zinc-300">
                              {r.val2.toFixed(2)}
                            </td>
                            <td
                              className={`py-2.5 text-right font-bold tabular-nums ${diffColor}`}
                            >
                              {fmtTabel(r.diff)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="mt-14 flex justify-center">
            <Button
              variant="gold"
              showArrow
              href="/pages/hasil-nasional"
            >
              Lihat Detail Indikator Nasional
            </Button>
          </div>
        </div>
      </section>

      {/* =========================================================
           6. PROFIL IPK PROVINSI (MAP)
      ========================================================= */}
      <section className="section-alt section-py">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 text-center">
          <SectionHeader
            eyebrow="Profil IPK Provinsi"
            title="Capaian IPK di Seluruh Indonesia"
            description="Jelajahi capaian pembangunan kebudayaan berdasarkan provinsi."
          />
          <MapProvinsi tahunAwal={tahunTerbaru ?? 2024} />
        </div>
      </section>

      {/* =========================================================
           7. CALL TO ACTION (CTA)
      ========================================================= */}
      <CtaSection
        eyebrow="SIMULASI · METODOLOGI 2024"
        title="Coba simulasi perhitungan IPK"
        description="Masukkan nilai indikator pada tujuh dimensi, lalu lihat hasil normalisasi dan nilai dimensi sesuai Metodologi 2024."
      >
        <Button variant="blue" showArrow href="/pages/intro-simulasi">
          Coba simulasi
        </Button>
      </CtaSection>

      {/* =========================================================
           8. KOLEKSI BUKU DIGITAL (PUBLIKASI)
      ========================================================= */}
      <CarouselPublikasi />

      <Footer />
    </div>
  );
}
