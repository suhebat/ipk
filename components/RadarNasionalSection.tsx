"use client";

/**
 * Blok radar + kontrol tahun untuk beranda.
 * Tahun diambil dinamis dari /api/nasional (bertambah otomatis jika DB bertambah).
 *
 * Ganti bagian radar di page.tsx dengan:
 *   import RadarNasionalSection from "@/components/RadarNasionalSection";
 *   <RadarNasionalSection />
 */

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ChartRadarNasional, {
  colorForYear,
  isBrightColor,
} from "@/components/ChartRadarNasional";
import { ListOrdered, Gauge } from "lucide-react";

type Dimensi = {
  ekonomiBudaya: number | null;
  pendidikan: number | null;
  ketahananSosial: number | null;
  warisanBudaya: number | null;
  ekspresiBudaya: number | null;
  budayaLiterasi: number | null;
  gender: number | null;
};

type NasionalItem = {
  tahun: number;
  skorIpk: number | null;
  dimensi: Dimensi;
};

const DIMENSI_LIST: { key: keyof Dimensi; label: string }[] = [
  { key: "ekonomiBudaya", label: "Ekonomi Budaya" },
  { key: "pendidikan", label: "Pendidikan" },
  { key: "ketahananSosial", label: "Ketahanan Sosial" },
  { key: "warisanBudaya", label: "Warisan Budaya" },
  { key: "ekspresiBudaya", label: "Ekspresi Budaya" },
  { key: "budayaLiterasi", label: "Budaya Literasi" },
  { key: "gender", label: "Gender" },
];

async function fetchNasional() {
  const res = await fetch("/api/nasional");
  if (!res.ok) throw new Error("Gagal mengambil data");
  const json = await res.json();
  return json.data as NasionalItem[];
}

export default function RadarNasionalSection() {
  const { data: dataNasional } = useQuery({
    queryKey: ["nasional"],
    queryFn: fetchNasional,
  });

  /** Semua tahun di DB, urut naik — otomatis ikut data baru */
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

  const [modeTahun, setModeTahun] = useState<"banyak" | "dua">("banyak");
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [compareYear1, setCompareYear1] = useState<number | null>(null);
  const [compareYear2, setCompareYear2] = useState<number | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Inisialisasi pilihan saat data pertama kali masuk
  useEffect(() => {
    if (!daftarTahun.length || initialized) return;
    const last = daftarTahun[daftarTahun.length - 1];
    const prev = daftarTahun[daftarTahun.length - 2] ?? last;
    setSelectedYears([prev, last].filter((v, i, a) => a.indexOf(v) === i));
    setCompareYear1(prev);
    setCompareYear2(last);
    setInitialized(true);
  }, [daftarTahun, initialized]);

  const handleYearToggle = (thn: number) => {
    setSelectedYears((prev) =>
      prev.includes(thn) ? prev.filter((y) => y !== thn) : [...prev, thn].sort((a, b) => a - b)
    );
  };

  const activeYears =
    modeTahun === "banyak"
      ? selectedYears
      : ([compareYear1, compareYear2].filter(Boolean) as number[]);

  // Data ringkas untuk mode bandingkan 2 tahun
  const itemA = dataNasional?.find((d) => d.tahun === compareYear1);
  const itemB = dataNasional?.find((d) => d.tahun === compareYear2);

  return (
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
              <div className="inline-flex p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 shadow-inner">
                <button
                  type="button"
                  onClick={() => setModeTahun("banyak")}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    modeTahun === "banyak"
                      ? "bg-[#B8860B] text-white shadow-sm"
                      : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-600 hover:border-[#B8860B]/50 hover:text-[#B8860B]"
                  }`}
                >
                  Banyak Tahun
                </button>
                <button
                  type="button"
                  onClick={() => setModeTahun("dua")}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ml-1 ${
                    modeTahun === "dua"
                      ? "bg-[#B8860B] text-white shadow-sm"
                      : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-600 hover:border-[#B8860B]/50 hover:text-[#B8860B]"
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
                          borderColor: isActive ? color : color,
                          color: isActive ? (bright ? "#111" : "#fff") : color,
                        }}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border-2 transition-all cursor-pointer ${
                          isActive
                            ? "shadow-sm scale-[1.02]"
                            : "bg-white dark:bg-zinc-950/40 opacity-90 hover:opacity-100 hover:shadow-sm"
                        }`}
                        title={isActive ? `Sembunyikan ${thn}` : `Tampilkan ${thn}`}
                      >
                        {thn}
                      </button>
                    );
                  })}
                </div>
                {selectedYears.length === 0 && (
                  <p className="text-xs text-amber-600 mt-2">
                    Pilih minimal satu tahun.
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3 text-left mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 font-medium">Tahun A:</span>
                  <select
                    value={compareYear1 ?? ""}
                    onChange={(e) => setCompareYear1(Number(e.target.value))}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-1.5 text-xs font-semibold"
                  >
                    {daftarTahun.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="text-zinc-400 text-xs">vs</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 font-medium">Tahun B:</span>
                  <select
                    value={compareYear2 ?? ""}
                    onChange={(e) => setCompareYear2(Number(e.target.value))}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-1.5 text-xs font-semibold"
                  >
                    {daftarTahun.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {activeYears.length > 0 ? (
              <ChartRadarNasional years={activeYears} yearColors={yearColors} />
            ) : (
              <div className="h-64 flex items-center justify-center text-zinc-400 text-sm">
                Tidak ada tahun dipilih
              </div>
            )}
          </div>

          {/* Panel ringkas — hanya mode bandingkan 2 tahun */}
          {modeTahun === "dua" && itemA && itemB && (
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm text-left">
                <div className="flex items-center gap-2 text-[#B8860B] font-semibold text-sm mb-3">
                  <Gauge size={16} />
                  Skor IPK
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[11px] text-zinc-500">{compareYear1}</div>
                    <div className="text-xl font-bold" style={{ color: colorForYear(compareYear1!) }}>
                      {itemA.skorIpk != null ? Number(itemA.skorIpk).toFixed(2) : "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-zinc-500">{compareYear2}</div>
                    <div className="text-xl font-bold" style={{ color: colorForYear(compareYear2!) }}>
                      {itemB.skorIpk != null ? Number(itemB.skorIpk).toFixed(2) : "—"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm text-left">
                <div className="flex items-center gap-2 text-[#B8860B] font-semibold text-sm mb-3">
                  <ListOrdered size={16} />
                  Selisih per dimensi
                </div>
                <ul className="space-y-2">
                  {DIMENSI_LIST.map(({ key, label }) => {
                    const a = itemA.dimensi?.[key];
                    const b = itemB.dimensi?.[key];
                    const diff =
                      a != null && b != null ? Number(b) - Number(a) : null;
                    return (
                      <li
                        key={key}
                        className="flex items-center justify-between text-xs border-b border-zinc-100 dark:border-zinc-800 pb-1.5 last:border-0"
                      >
                        <span className="text-zinc-600 dark:text-zinc-300">{label}</span>
                        <span
                          className={`font-semibold tabular-nums ${
                            diff == null
                              ? "text-zinc-400"
                              : diff > 0
                              ? "text-emerald-600"
                              : diff < 0
                              ? "text-red-500"
                              : "text-zinc-500"
                          }`}
                        >
                          {diff == null
                            ? "—"
                            : `${diff > 0 ? "+" : ""}${diff.toFixed(2)}`}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
