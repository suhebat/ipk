"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

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

interface ChartRadarNasionalProps {
  years?: number[];
  yearColors?: Record<number, string>;
}

async function fetchNasional() {
  const res = await fetch("/api/nasional");
  if (!res.ok) throw new Error("Gagal mengambil data");
  const json = await res.json();
  return json.data as NasionalItem[];
}

const DIMENSI_KEYS: { key: keyof Dimensi; label: string }[] = [
  { key: "ekonomiBudaya", label: "Ekonomi Budaya" },
  { key: "pendidikan", label: "Pendidikan" },
  { key: "ketahananSosial", label: "Ketahanan Sosial" },
  { key: "warisanBudaya", label: "Warisan Budaya" },
  { key: "ekspresiBudaya", label: "Ekspresi Budaya" },
  { key: "budayaLiterasi", label: "Budaya Literasi" },
  { key: "gender", label: "Gender" },
];

/** Palet tetap 2018–2024 + sikluskan otomatis untuk tahun berikutnya */
const BASE_YEAR_COLORS: Record<number, string> = {
  2018: "#FF5733",
  2019: "#33AA57",
  2020: "#3357FF",
  2021: "#C026D3",
  2022: "#0891B2",
  2023: "#CA8A04",
  2024: "#E11D48",
};

/** Warna cadangan berurutan untuk tahun ≥ 2025 (kontras & rapi) */
const EXTRA_PALETTE = [
  "#B8860B", // gold
  "#7C3AED", // violet
  "#059669", // emerald
  "#DC2626", // red
  "#2563EB", // blue
  "#EA580C", // orange
  "#DB2777", // pink
  "#0D9488", // teal
  "#4F46E5", // indigo
  "#65A30D", // lime
];

export function colorForYear(year: number): string {
  if (BASE_YEAR_COLORS[year]) return BASE_YEAR_COLORS[year];
  // tahun setelah 2024: urut dari EXTRA_PALETTE
  const idx = Math.max(0, year - 2025);
  return EXTRA_PALETTE[idx % EXTRA_PALETTE.length];
}

/** Apakah warna terang (teks tombol sebaiknya gelap) */
export function isBrightColor(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length !== 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  // perceived luminance
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.65;
}

export default function ChartRadarNasional({
  years = [2024],
  yearColors,
}: ChartRadarNasionalProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["nasional"],
    queryFn: fetchNasional,
  });

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center text-zinc-500">
        Memuat data...
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-red-500">
        Gagal memuat data dimensi
      </div>
    );
  }

  const radarData = DIMENSI_KEYS.map(({ key, label }) => {
    const item: Record<string, string | number> = { dimensi: label };
    years.forEach((yr) => {
      const dataTahun = data.find((d) => d.tahun === yr);
      item[`thn_${yr}`] = dataTahun?.dimensi?.[key] ?? 0;
    });
    return item;
  });

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="82%">
          <PolarGrid
            className="stroke-zinc-200 dark:stroke-zinc-700/60"
            stroke="#e4e4e7"
            strokeOpacity={0.8}
          />
          <PolarAngleAxis
            dataKey="dimensi"
            tick={{ fill: "#71717a", fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "#a1a1aa", fontSize: 9 }}
            stroke="#e4e4e7"
            className="stroke-zinc-200 dark:stroke-zinc-700/50"
          />

          {years.map((yr) => {
            const color = yearColors?.[yr] ?? colorForYear(yr);
            return (
              <Radar
                key={yr}
                name={`Tahun ${yr}`}
                dataKey={`thn_${yr}`}
                stroke={color}
                fill={color}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            );
          })}

          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(24, 24, 27, 0.95)",
              border: "1px solid #3f3f46",
              borderRadius: "8px",
              color: "#fafafa",
              fontSize: "12px",
            }}
            formatter={(value) => {
			  const v = value == null ? 0 : Number(value);
			  return [v.toFixed(2), "IPK"];
			}}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
