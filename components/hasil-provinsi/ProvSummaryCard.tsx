"use client";

import { useState } from "react";
import { fmt } from "./types";

interface ProvSummaryCardProps {
  provinceName: string;
  kodeBps: string;
  skorIpk: number | null;
  tahun: number;
  rank?: number | null;
  totalRanked?: number | null;
  metodologi?: string;
  dimensi: { id: number; nama: string; nilai: number | null; color: string }[];
  topDimensi: { nama: string; nilai: number | null } | null;
  lowDimensi: { nama: string; nilai: number | null } | null;
  isFetching?: boolean;
}

/** Lambang daerah: /public/images/lambang/{kodeBps}.png — fallback inisial */
function LambangProvinsi({
  kodeBps,
  name,
}: {
  kodeBps: string;
  name: string;
}) {
  const [err, setErr] = useState(false);
  const src = `/images/lambang/${kodeBps}.png`;

  return (
    <div className="print-lambang relative w-32 h-40 sm:w-40 sm:h-48 shrink-0 mx-auto">
      {err ? (
        <div className="print-lambang-initials w-full h-full rounded-xl bg-gradient-to-b from-[#F8DA8D] to-[#B8860B] flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-inner">
          {getInitials(name)}
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`Lambang ${name}`}
          className="w-full h-full object-contain drop-shadow-md"
          onError={() => setErr(true)}
        />
      )}
    </div>
  );
}

function getInitials(name: string) {
  const initials = name
    .replace(/^(Provinsi|DI|DKI)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] || "")
    .join("")
    .toUpperCase();
  return initials || "ID";
}

export default function ProvSummaryCard({
  provinceName,
  kodeBps,
  skorIpk,
  tahun,
  rank,
  totalRanked,
  metodologi,
  dimensi,
  topDimensi,
  lowDimensi,
  isFetching,
}: ProvSummaryCardProps) {
  const hasRank = rank != null && totalRanked != null;

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
      <div className="print-summary-row grid md:grid-cols-3 gap-0">
        {/* Kiri: lambang + nilai IPK */}
        <div className="print-summary-left md:col-span-1 p-6 sm:p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800 bg-gradient-to-br from-[#B8860B]/10 to-transparent">
          <LambangProvinsi kodeBps={kodeBps} name={provinceName} />

          <div className="print-summary-text flex flex-col items-center">
            <p className="print-summary-label text-xs font-semibold uppercase tracking-wide text-zinc-500 mt-3">
              IPK {provinceName}
            </p>
            <p className="print-summary-score text-5xl sm:text-6xl font-bold text-[#B8860B] my-3 tabular-nums">
              {fmt(skorIpk)}
            </p>
            <span className="print-summary-badge text-xs px-3 py-1 rounded-full bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/20">
              {hasRank
                ? `Peringkat ${rank} dari ${totalRanked} Provinsi · ${tahun}`
                : `Tahun ${tahun}`}
              {isFetching ? " …" : ""}
            </span>
          </div>
        </div>

        {/* Kanan: metodologi, dimensi tertinggi & terendah */}
        <div className="print-summary-right md:col-span-2 p-6 sm:p-8 grid sm:grid-cols-3 gap-4 sm:gap-6 content-center">
          <div>
            <p className="print-summary-item-label text-xs text-zinc-500 mb-1">
              Metodologi
            </p>
            <p className="print-summary-item-value text-sm font-semibold text-zinc-900 dark:text-white leading-snug">
              {metodologi || "—"}
            </p>
          </div>
          <div>
            <p className="print-summary-item-label text-xs text-zinc-500 mb-1">
              Dimensi tertinggi
            </p>
            <p className="print-summary-item-value text-sm font-semibold text-zinc-900 dark:text-white">
              {topDimensi
                ? `${topDimensi.nama} (${fmt(topDimensi.nilai)})`
                : "—"}
            </p>
          </div>
          <div>
            <p className="print-summary-item-label text-xs text-zinc-500 mb-1">
              Dimensi terendah
            </p>
            <p className="print-summary-item-value text-sm font-semibold text-zinc-900 dark:text-white">
              {lowDimensi
                ? `${lowDimensi.nama} (${fmt(lowDimensi.nilai)})`
                : "—"}
            </p>
          </div>

          {/* Sebaran 7 dimensi: HANYA layar, tidak ikut PDF */}
          <div
            className="sm:col-span-3 pt-1 no-print print:!hidden"
            data-no-print
          >
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
