"use client";

import { CheckCircle2, AlertTriangle } from "lucide-react";
import { YEAR_OPTIONS, type ProvItem } from "./types";

type Props = {
  tahun: number;
  provinsiId: number;
  provinces: ProvItem[];
  metodologi?: string;
  available?: boolean;
  onTahunChange: (y: number) => void;
  onProvinsiChange: (id: number) => void;
  showBadge?: boolean;
};

export default function ProvFilterBar({
  tahun,
  provinsiId,
  provinces,
  metodologi,
  available,
  onTahunChange,
  onProvinsiChange,
  showBadge = false,
}: Props) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-zinc-600 dark:text-zinc-400">
          Provinsi
        </label>
        <select
          value={provinsiId}
          onChange={(e) => onProvinsiChange(Number(e.target.value))}
          className="min-w-[220px] rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#B8860B]/30"
        >
          {provinces.length === 0 ? (
            <option value={provinsiId}>Memuat daftar…</option>
          ) : (
            provinces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))
          )}
        </select>

        <label className="text-sm text-zinc-600 dark:text-zinc-400">
          Tahun
        </label>
        <select
          value={tahun}
          onChange={(e) => onTahunChange(Number(e.target.value))}
          className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#B8860B]/30"
        >
          {YEAR_OPTIONS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <span className="text-sm text-zinc-500">
          Metodologi:{" "}
          <strong className="text-[#B8860B]">{metodologi || "—"}</strong>
        </span>
      </div>

      {showBadge && available != null && (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${
            available
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
              : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900"
          }`}
        >
          {available ? (
            <>
              <CheckCircle2 size={14} /> Data Provinsi Tersedia
            </>
          ) : (
            <>
              <AlertTriangle size={14} /> Data Belum Lengkap
            </>
          )}
        </span>
      )}
    </div>
  );
}