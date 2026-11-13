"use client";

import { fmt } from "./types";

type RankItem = {
  rank: number;
  kode_bps: string;
  nama: string;
  skor: number | null;
};

type Props = {
  tahun: number;
  ranking: RankItem[];
  activeKodeBps: string;
};

export default function ProvRankingTable({
  tahun,
  ranking,
  activeKodeBps,
}: Props) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
      <div className="px-4 sm:px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="font-semibold text-zinc-900 dark:text-white">
          Peringkat Provinsi {tahun}
        </h2>
      </div>
      <div className="overflow-x-auto max-h-80">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-zinc-50 dark:bg-zinc-900">
            <tr className="text-left text-xs text-zinc-500 border-b border-zinc-100 dark:border-zinc-800">
              <th className="py-2 px-4 w-16">#</th>
              <th className="py-2 px-2">Provinsi</th>
              <th className="py-2 px-4 text-right">Skor IPK</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((r) => {
              const active = r.kode_bps === activeKodeBps;
              return (
                <tr
                  key={r.kode_bps}
                  className={`border-b border-zinc-50 dark:border-zinc-800/80 ${
                    active
                      ? "bg-[#B8860B]/10 font-semibold"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                  }`}
                >
                  <td className="py-2 px-4 tabular-nums text-zinc-500">
                    {r.rank}
                  </td>
                  <td className="py-2 px-2">{r.nama}</td>
                  <td className="py-2 px-4 text-right tabular-nums">
                    {fmt(r.skor)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}