import { fmt, type DimensiScore } from "./types";

interface NasSummaryCardProps {
  skorIpk: number | null;
  year: number;
  metodologi: string;
  topDimensi: { nama: string; nilai: number | null } | null;
  lowDimensi: { nama: string; nilai: number | null } | null;
  dimensi: DimensiScore[];
  isFetching?: boolean;
}

export default function NasSummaryCard({
  skorIpk,
  year,
  metodologi,
  topDimensi,
  lowDimensi,
  dimensi,
  isFetching,
}: NasSummaryCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
      <div className="grid md:grid-cols-3 gap-0">
        <div className="md:col-span-1 p-6 sm:p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800 bg-gradient-to-br from-[#B8860B]/10 to-transparent">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            IPK Nasional
          </p>
          <p className="text-5xl sm:text-6xl font-bold text-[#B8860B] my-3 tabular-nums">
            {fmt(skorIpk)}
          </p>
          <span className="text-xs px-3 py-1 rounded-full bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/20">
            Rata-Rata Komposit · {year}
            {isFetching ? " …" : ""}
          </span>
        </div>

        <div className="md:col-span-2 p-6 sm:p-8 grid sm:grid-cols-3 gap-4 sm:gap-6 content-center">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Metodologi</p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-snug">
              {metodologi}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Dimensi tertinggi</p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              {topDimensi
                ? `${topDimensi.nama} (${fmt(topDimensi.nilai)})`
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Dimensi terendah</p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              {lowDimensi
                ? `${lowDimensi.nama} (${fmt(lowDimensi.nilai)})`
                : "—"}
            </p>
          </div>

          <div className="sm:col-span-3 pt-1 print:hidden no-print" data-no-print>
            <p className="text-xs text-zinc-500 mb-2">Sebaran 7 dimensi</p>
            <div className="flex h-3 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              {dimensi.map((d) => {
                const v = Math.max(d.nilai ?? 0, 0);
                const total =
                  dimensi.reduce((s, x) => s + Math.max(x.nilai ?? 0, 0), 0) ||
                  1;
                return (
                  <div
                    key={d.id}
                    title={`${d.nama}: ${fmt(d.nilai)}`}
                    style={{
                      width: `${(v / total) * 100}%`,
                      backgroundColor: d.color,
                    }}
                  />
                );
              })}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              {dimensi.map((d) => (
                <span
                  key={d.id}
                  className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: d.color }}
                  />
                  {d.nama}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
