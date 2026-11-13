"use client";

import type { Indikator } from "./types";

export default function MetaModal({
  detail,
  onClose,
}: {
  detail: Indikator;
  onClose: () => void;
}) {
  const meta = detail.meta;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 print:hidden"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <span className="text-xs font-bold text-[#B8860B]">
              {detail.kode}
            </span>
            <h3 className="font-semibold text-zinc-900 dark:text-white mt-1">
              {detail.nama}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-lg leading-none"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {meta ? (
          <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">
                Konsep / definisi
              </p>
              <p className="leading-relaxed">{meta.konsep || "—"}</p>
            </div>

            {meta.rumus_pembilang && meta.rumus_penyebut ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">
                  Rumus
                </p>
                <div className="text-center px-4">
                  <p className="border-b border-zinc-400 dark:border-zinc-500 pb-1 mb-1">
                    {meta.rumus_pembilang}
                  </p>
                  <p>{meta.rumus_penyebut}</p>
                </div>
              </div>
            ) : meta.rumus ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">
                  Rumus
                </p>
                <p>{meta.rumus}</p>
              </div>
            ) : null}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">
                Interpretasi
              </p>
              <p className="leading-relaxed">{meta.interpretasi || "—"}</p>
            </div>

            {meta.contoh && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">
                  Contoh interpretasi
                </p>
                <p className="leading-relaxed">{meta.contoh}</p>
              </div>
            )}

            {meta.variabel && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1">
                  Variabel pembangun
                </p>
                <p className="leading-relaxed whitespace-pre-line">
                  {meta.variabel}
                </p>
              </div>
            )}

            <dl className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <div>
                <dt className="text-zinc-500">Min – Max</dt>
                <dd className="font-medium mt-0.5">
                  {detail.min ?? "—"} – {detail.max ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Satuan</dt>
                <dd className="font-medium mt-0.5">{meta.satuan || "—"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Sumber / kegiatan</dt>
                <dd className="font-medium mt-0.5">
                  {meta.kegiatan || detail.sumber || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Waktu ketersediaan</dt>
                <dd className="font-medium mt-0.5">{meta.waktu || "—"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Level estimasi</dt>
                <dd className="font-medium mt-0.5">{meta.level || "—"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Akses publik</dt>
                <dd className="font-medium mt-0.5">{meta.akses || "—"}</dd>
              </div>
              {meta.publikasi && (
                <div className="col-span-2">
                  <dt className="text-zinc-500">Publikasi terkait</dt>
                  <dd className="font-medium mt-0.5">{meta.publikasi}</dd>
                </div>
              )}
            </dl>
          </div>
        ) : (
          <p className="text-sm text-zinc-500">
            Metadata terbatas / belum tersedia di database.
          </p>
        )}
      </div>
    </div>
  );
}
