"use client";

import { useState } from "react";
import {
  TrendingUp,
  ChevronDown,
  Database,
  Info,
} from "lucide-react";
import { type Dimensi, type Indikator, ICONS } from "./types";
import FormulaDimensi from "./FormulaDimensi";
import MetaModal from "./MetaModal";

export default function FormulaAndIndikator({
  items,
  mode,
  isPrintingAll,
}: {
  items: Dimensi[];
  mode: "2024" | "2018";
  isPrintingAll?: boolean;
}) {
  const [openId, setOpenId] = useState<number | null>(1);
  const [detail, setDetail] = useState<Indikator | null>(null);

  return (
    <>
      <div className="space-y-3">
        {items.map((d) => {
          const open = isPrintingAll || openId === d.id;
          const Icon = ICONS[d.id - 1] || TrendingUp;

          return (
            <div
              key={d.id}
              className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 print:border-zinc-300 print:break-inside-avoid print:mb-4"
            >
              <button
                type="button"
                onClick={() => {
                  if (isPrintingAll) return;
                  setOpenId(open ? null : d.id);
                }}
                className="w-full flex items-start gap-3 sm:gap-4 p-4 sm:p-5 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition print:hover:bg-transparent"
              >
                <span
                  className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold print:border print:border-zinc-400 print:text-black"
                  style={{
                    background: `linear-gradient(135deg, ${d.color}, ${d.muted})`,
                  }}
                >
                  {d.number}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Icon size={16} style={{ color: d.color }} />
                    <span className="font-semibold text-zinc-900 dark:text-white print:text-black">
                      Dimensi {d.nama}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 print:border print:border-zinc-300 print:text-zinc-700">
                      {d.indikator.length} Indikator
                    </span>
                  </div>
                  {d.definisi && (
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 print:line-clamp-none print:text-zinc-700">
                      <strong className="font-medium text-zinc-600 dark:text-zinc-300 print:text-black">
                        Definisi operasional:
                      </strong>{" "}
                      {d.definisi}
                    </p>
                  )}
                </div>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-zinc-400 transition-transform mt-1 print:hidden ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open && (
                <div className="px-4 sm:px-5 pb-5 border-t border-zinc-100 dark:border-zinc-800 print:border-zinc-200">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mt-4 mb-3 print:text-zinc-700">
                    Indikator
                  </p>
                  <div className="space-y-3">
                    {d.indikator.map((ind) => (
                      <div
                        key={ind.kode}
                        className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 print:bg-white print:border-zinc-200"
                      >
                        <span
                          className="shrink-0 inline-flex items-center justify-center min-w-[3.25rem] px-2 py-1 rounded-lg text-xs font-bold text-white print:text-black print:border print:border-zinc-400"
                          style={{ backgroundColor: d.color }}
                        >
                          {ind.kode}
                        </span>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed print:text-black">
                              {ind.nama}
                            </p>
                            {mode === "2024" && (
                              <button
                                type="button"
                                onClick={() => setDetail(ind)}
                                className="shrink-0 text-zinc-400 hover:text-[#B8860B] transition print:hidden"
                                title="Lihat metadata indikator"
                                aria-label={`Detail ${ind.nama}`}
                              >
                                <Info size={16} />
                              </button>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400 print:text-zinc-700">
                            <span>
                              Min:{" "}
                              <strong className="text-zinc-700 dark:text-zinc-300 print:text-black">
                                {ind.min ?? "—"}
                              </strong>
                            </span>
                            <span>
                              Max:{" "}
                              <strong className="text-zinc-700 dark:text-zinc-300 print:text-black">
                                {ind.max ?? "—"}
                              </strong>
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Database size={12} />
                              {ind.sumber || "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <FormulaDimensi dimId={d.id} mode={mode} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {detail && (
        <MetaModal detail={detail} onClose={() => setDetail(null)} />
      )}
    </>
  );
}
