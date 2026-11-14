"use client";

import { fmt } from "./types";

type Props = {
  tren: { tahun: number; skor_ipk: number | null }[];
  provinceName: string;
};

export default function ProvTrendBars({ tren, provinceName }: Props) {
  const max = Math.max(
    ...tren.map((t) => t.skor_ipk ?? 0).filter((v) => v > 0),
    1
  );

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 h-full">
      <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">
        Tren IPK Provinsi {provinceName}
      </h3>
      <div className="flex items-end gap-2 sm:gap-3 h-40">
        {tren.map((t) => {
          const h =
            t.skor_ipk != null ? Math.max((t.skor_ipk / max) * 100, 4) : 4;
          return (
            <div
              key={t.tahun}
              className="flex-1 flex flex-col items-center gap-1 min-w-0"
            >
              <span className="text-[10px] sm:text-xs font-medium text-zinc-600 dark:text-zinc-300">
                {t.skor_ipk != null ? fmt(t.skor_ipk, 2) : "—"}
              </span>
              <div className="w-full flex items-end justify-center h-28">
                <div
                  className="w-full max-w-[36px] rounded-t-md bg-gradient-to-t from-[#B8860B] to-[#F8DA8D]"
                  style={{ height: `${h}%` }}
                  title={`${t.tahun}: ${fmt(t.skor_ipk, 2)}`}
                />
              </div>
              <span className="text-[10px] sm:text-xs text-zinc-500">
                {t.tahun}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}