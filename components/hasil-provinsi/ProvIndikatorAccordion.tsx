"use client";

import { useState } from "react";
import { ChevronDown, Database } from "lucide-react";
import { fmt, type Grouped } from "./types";

interface ProvIndikatorAccordionProps {
  groups: Grouped[];
  provinceName: string;
  year: number;
}

export default function ProvIndikatorAccordion({
  groups,
  provinceName,
  year,
}: ProvIndikatorAccordionProps) {
  const [openId, setOpenId] = useState<number | null>(1);

  if (!groups.length) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-10 text-center text-zinc-500 text-sm">
        Tidak ada data indikator untuk tahun ini.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
      <div className="px-4 sm:px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="font-semibold text-zinc-900 dark:text-white">
          Skor Indikator Provinsi ({provinceName})
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          Rincian nilai indikator kebudayaan tahun {year}.
        </p>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {groups.map((g) => {
          const open = openId === g.id;
          return (
            <div key={g.id} className="print:break-inside-avoid">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : g.id)}
                className="w-full flex items-center gap-3 px-4 sm:px-5 py-3.5 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition"
              >
                <span
                  className="shrink-0 text-[11px] font-bold text-white px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: g.color }}
                >
                  Dimensi {g.id}
                </span>
                <span className="font-medium text-zinc-900 dark:text-white flex-1">
                  {g.nama}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                  {g.indikator.length} Indikator
                </span>
                <ChevronDown
                  size={16}
                  className={`accordion-chevron text-zinc-400 transition-transform shrink-0 print:!hidden ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/*
                Layar: hanya panel open yang tampil (hidden).
                PDF: selalu tampil via print:block + data-print-collapse (CSS globals).
              */}
              <div
                data-print-collapse
                className={
                  open
                    ? "block overflow-x-auto px-2 sm:px-4 pb-4"
                    : "hidden print:!block overflow-x-auto px-2 sm:px-4 pb-4"
                }
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-zinc-500 border-b border-zinc-100 dark:border-zinc-800">
                      <th className="py-2 px-2 w-20">Kode</th>
                      <th className="py-2 px-2">Indikator</th>
                      <th className="py-2 px-2 text-right w-24">Nilai</th>
                      <th className="py-2 px-2 w-40">Sumber</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.indikator.map((ind) => (
                      <tr
                        key={ind.kode}
                        className="border-b border-zinc-50 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                      >
                        <td className="py-2.5 px-2">
                          <span
                            className="inline-block text-[11px] font-bold text-white px-2 py-0.5 rounded-md"
                            style={{ backgroundColor: g.color }}
                          >
                            {ind.kode}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-zinc-700 dark:text-zinc-300">
                          {ind.nama}
                        </td>
                        <td className="py-2.5 px-2 text-right font-semibold text-zinc-900 dark:text-white tabular-nums">
                          {fmt(ind.nilai)}
                        </td>
                        <td className="py-2.5 px-2 text-xs text-zinc-500">
                          <span className="inline-flex items-center gap-1">
                            <Database size={12} />
                            {ind.sumber || "—"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
