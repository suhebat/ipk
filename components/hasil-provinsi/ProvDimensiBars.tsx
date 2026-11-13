"use client";

import { fmt, type DimensiScore } from "./types";

type Props = {
  dimensi: DimensiScore[];
};

export default function ProvDimensiBars({ dimensi }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 h-full">
      <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">
        Skor 7 Dimensi
      </h3>
      <div className="space-y-3">
        {dimensi.map((d) => {
          const w = Math.min(Math.max(d.nilai ?? 0, 0), 100);
          return (
            <div key={d.id}>
              <div className="flex justify-between text-xs mb-1 gap-2">
                <span className="text-zinc-600 dark:text-zinc-400 truncate">
                  {d.id}. {d.nama}
                </span>
                <span className="font-semibold tabular-nums shrink-0 text-zinc-800 dark:text-zinc-200">
                  {fmt(d.nilai)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${w}%`,
                    background: `linear-gradient(90deg, ${d.color}, ${d.muted})`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}