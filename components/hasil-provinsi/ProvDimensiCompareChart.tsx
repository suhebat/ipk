"use client";

import { useState } from "react";
import { fmt, type DimensiScore } from "./types";

type Props = {
  provinceName: string;
  year: number;
  provDimensi: DimensiScore[];
  nasDimensi?: { id: number; nilai: number | null }[];
};

export default function ProvDimensiCompareChart({
  provinceName,
  year,
  provDimensi,
  nasDimensi,
}: Props) {
  const [hover, setHover] = useState<{
    label: string;
    nilai: string;
    x: number;
    y: number;
  } | null>(null);

  const rows = provDimensi.map((d) => {
    const n = nasDimensi?.find((x) => x.id === d.id);
    return {
      id: d.id,
      nama: d.nama,
      prov: d.nilai,
      nas: n?.nilai ?? null,
    };
  });

  const maxVal = 100;

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 relative">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-[#B8860B] mb-1">
        Analisis
      </p>
      <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-6">
        Perbandingan Nilai per Dimensi Tahun {year}
      </h3>

      <div className="relative">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-1">
          {[100, 80, 60, 40, 20, 0].map((v) => (
            <div key={v} className="flex items-center gap-2">
              <span className="w-7 text-right text-[10px] text-zinc-400 tabular-nums shrink-0">
                {v}
              </span>
              <div className="flex-1 border-t border-dashed border-zinc-200 dark:border-zinc-700/80" />
            </div>
          ))}
        </div>

        <div className="relative pl-9 flex items-end justify-between gap-1 sm:gap-2 h-56 sm:h-64">
          {rows.map((r) => {
            const hNas =
              r.nas != null ? Math.max((r.nas / maxVal) * 100, 2) : 0;
            const hProv =
              r.prov != null ? Math.max((r.prov / maxVal) * 100, 2) : 0;
            return (
              <div
                key={r.id}
                className="flex-1 flex flex-col items-center min-w-0 h-full justify-end"
              >
                <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-[calc(100%-1.75rem)]">
                  <div
                    className="w-[42%] max-w-[28px] rounded-t-sm bg-[#3B82F6] origin-bottom transition-all duration-200 ease-out hover:brightness-110 hover:-translate-y-1 hover:shadow-md cursor-pointer"
                    style={{ height: `${hNas}%` }}
                    onMouseEnter={(e) => {
                      const rect = (
                        e.currentTarget as HTMLElement
                      ).getBoundingClientRect();
                      setHover({
                        label: `Nasional · ${r.nama}`,
                        nilai: fmt(r.nas),
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                      });
                    }}
                    onMouseLeave={() => setHover(null)}
                  />
                  <div
                    className="w-[42%] max-w-[28px] rounded-t-sm bg-[#F5A623] origin-bottom transition-all duration-200 ease-out hover:brightness-110 hover:-translate-y-1 hover:shadow-md cursor-pointer"
                    style={{ height: `${hProv}%` }}
                    onMouseEnter={(e) => {
                      const rect = (
                        e.currentTarget as HTMLElement
                      ).getBoundingClientRect();
                      setHover({
                        label: `${provinceName} · ${r.nama}`,
                        nilai: fmt(r.prov),
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                      });
                    }}
                    onMouseLeave={() => setHover(null)}
                  />
                </div>
                <p className="mt-2 text-[9px] sm:text-[11px] text-center text-zinc-500 dark:text-zinc-400 leading-tight px-0.5 line-clamp-2">
                  {r.nama}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={`pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs shadow-lg border border-white/10 transition-all duration-150 ease-out ${
          hover
            ? "opacity-100 scale-100 translate-y-[-8px]"
            : "opacity-0 scale-95 translate-y-0"
        }`}
        style={
          hover
            ? { left: hover.x, top: hover.y - 6 }
            : { left: 0, top: 0, visibility: "hidden" as const }
        }
      >
        {hover && (
          <>
            <div className="font-medium text-white/90">{hover.label}</div>
            <div className="tabular-nums text-[#F8DA8D] mt-0.5">
              {hover.nilai}
            </div>
          </>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-600 dark:text-zinc-400">
        <span className="inline-flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
          Nilai Dimensi Nasional Tahun {year}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F5A623]" />
          Nilai Dimensi Provinsi {provinceName} Tahun {year}
        </span>
      </div>
    </div>
  );
}