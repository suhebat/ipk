// components/dataset/DatasetCardSection.tsx
"use client";

import { useState } from "react";
import DownloadSurveyModal, { DatasetItem } from "@/components/DownloadSurveyModal";
import {
  BarChart3,
  Map,
  Calendar,
  Globe2,
  MapPin,
  FileSpreadsheet,
  Download,
  ArrowRight,
} from "lucide-react";

interface PeriodItem {
  kode: string;
  label: string;
  displayPeriod: string;
  subLabel: string;
}

interface DatasetCardSectionProps {
  periods: PeriodItem[];
  rentangTahun: string;
}

export default function DatasetCardSection({ periods, rentangTahun }: DatasetCardSectionProps) {
  const [selectedDataset, setSelectedDataset] = useState<DatasetItem | null>(null);

  return (
    <>
      <section className="pt-10 pb-12 lg:pt-14 lg:pb-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Card 1: Nasional */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-9 shadow-sm hover:shadow-md hover:border-blue-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <BarChart3 size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-1.5">
                      Dataset IPK Nasional
                    </h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Data IPK tingkat nasional beserta nilai dimensi dan indikator capaiannya.
                    </p>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-8 text-sm text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-center gap-2.5">
                    <Calendar size={16} className="text-blue-500 shrink-0" />
                    <span>Periode data: <strong className="text-zinc-900 dark:text-white">{rentangTahun}</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Globe2 size={16} className="text-blue-500 shrink-0" />
                    <span>Cakupan: <strong className="text-zinc-900 dark:text-white">Nasional</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FileSpreadsheet size={16} className="text-blue-500 shrink-0" />
                    <span>Format: <strong className="text-zinc-900 dark:text-white">CSV &amp; XLSX</strong></span>
                  </li>
                </ul>

                <div className="pt-5 border-t border-zinc-200 dark:border-zinc-800 space-y-3 mb-6">
                  <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase block">
                    Pilih Periode
                  </span>

                  {/* Dinamis dari database */}
                  {periods.map((item) => (
                    <button
                      key={`nasional-${item.displayPeriod}`}
                      type="button"
                      onClick={() =>
                        setSelectedDataset({
                          dataset: "nasional",
                          period: item.displayPeriod,
                          label: `IPK Nasional ${item.displayPeriod.replace("-", "–")}`,
                          halaman: "dataset",
                        })
                      }
                      className="w-full text-left p-3.5 sm:p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 hover:border-blue-500/60 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                          <FileSpreadsheet size={20} />
                        </div>
                        <div className="truncate">
                          <strong className="block text-sm font-semibold text-zinc-900 dark:text-white">
                            IPK Nasional {item.displayPeriod.replace("-", "–")}
                          </strong>
                          <small className="text-xs text-zinc-500 dark:text-zinc-400">
                            {item.subLabel}
                          </small>
                        </div>
                      </div>
                      <Download size={18} className="text-zinc-400 group-hover:text-blue-500 shrink-0 transition" />
                    </button>
                  ))}
                </div>
              </div>

              <a
                href="/pages/hasil-nasional"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:gap-3 transition-all pt-2"
              >
                Lihat hasil IPK Nasional <ArrowRight size={16} />
              </a>
            </div>

            {/* Card 2: Provinsi */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-9 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <Map size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-1.5">
                      Dataset IPK Provinsi
                    </h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Data IPK seluruh provinsi beserta nilai dimensi dan rincian indikator.
                    </p>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-8 text-sm text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-center gap-2.5">
                    <Calendar size={16} className="text-emerald-500 shrink-0" />
                    <span>Periode data: <strong className="text-zinc-900 dark:text-white">{rentangTahun}</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <MapPin size={16} className="text-emerald-500 shrink-0" />
                    <span>Cakupan: <strong className="text-zinc-900 dark:text-white">38 Provinsi Indonesia</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FileSpreadsheet size={16} className="text-emerald-500 shrink-0" />
                    <span>Format: <strong className="text-zinc-900 dark:text-white">CSV &amp; XLSX</strong></span>
                  </li>
                </ul>

                <div className="pt-5 border-t border-zinc-200 dark:border-zinc-800 space-y-3 mb-6">
                  <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase block">
                    Pilih Periode
                  </span>

                  {/* Dinamis dari database */}
                  {periods.map((item) => (
                    <button
                      key={`provinsi-${item.displayPeriod}`}
                      type="button"
                      onClick={() =>
                        setSelectedDataset({
                          dataset: "provinsi",
                          period: item.displayPeriod,
                          label: `IPK Provinsi ${item.displayPeriod.replace("-", "–")}`,
                          halaman: "dataset",
                        })
                      }
                      className="w-full text-left p-3.5 sm:p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 hover:border-emerald-500/60 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                          <FileSpreadsheet size={20} />
                        </div>
                        <div className="truncate">
                          <strong className="block text-sm font-semibold text-zinc-900 dark:text-white">
                            IPK Provinsi {item.displayPeriod.replace("-", "–")}
                          </strong>
                          <small className="text-xs text-zinc-500 dark:text-zinc-400">
                            {item.subLabel}
                          </small>
                        </div>
                      </div>
                      <Download size={18} className="text-zinc-400 group-hover:text-emerald-500 shrink-0 transition" />
                    </button>
                  ))}
                </div>
              </div>

              <a
                href="/pages/hasil-provinsi"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:gap-3 transition-all pt-2"
              >
                Lihat hasil IPK Provinsi <ArrowRight size={16} />
              </a>
            </div>

          </div>
        </div>
      </section>

      <DownloadSurveyModal
        isOpen={!!selectedDataset}
        item={selectedDataset}
        onClose={() => setSelectedDataset(null)}
      />
    </>
  );
}