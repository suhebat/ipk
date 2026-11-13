"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CtaSection from "@/components/CtaSection";
import Button from "@/components/ui/Button";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Info,
  MapPin,
  RotateCcw,
} from "lucide-react";

/* ========== Tipe & konstanta (metodologi 2024) ========== */

type Provinsi = { id: number; code: string; name: string };

type Indikator = {
  kode: string;
  nama: string;
  min: number;
  max: number;
};

type DimensiDef = {
  id: number;
  nama: string;
  color: string;
  muted: string;
  deskripsi: string;
};

const SCALE = 100;
const TOTAL_STEPS = 7;

const DIMENSI: DimensiDef[] = [
  {
    id: 1,
    nama: "Ekonomi Budaya",
    color: "#f59e0b",
    muted: "#b45309",
    deskripsi: "Aspek ekonomi yang berkaitan dengan aktivitas kebudayaan.",
  },
  {
    id: 2,
    nama: "Pendidikan",
    color: "#3b82f6",
    muted: "#1d4ed8",
    deskripsi: "Keterkaitan pendidikan dengan pembangunan kebudayaan.",
  },
  {
    id: 3,
    nama: "Ketahanan Sosial Budaya",
    color: "#10b981",
    muted: "#047857",
    deskripsi: "Ketahanan masyarakat dalam kehidupan sosial dan budaya.",
  },
  {
    id: 4,
    nama: "Warisan Budaya",
    color: "#8b5cf6",
    muted: "#6d28d9",
    deskripsi: "Keberadaan, pelindungan, dan keberlanjutan warisan budaya.",
  },
  {
    id: 5,
    nama: "Ekspresi Budaya",
    color: "#ec4899",
    muted: "#be185d",
    deskripsi: "Aktivitas dan partisipasi masyarakat dalam ekspresi budaya.",
  },
  {
    id: 6,
    nama: "Budaya Literasi",
    color: "#06b6d4",
    muted: "#0e7490",
    deskripsi: "Budaya membaca, mengakses, dan memanfaatkan informasi.",
  },
  {
    id: 7,
    nama: "Gender",
    color: "#f97316",
    muted: "#c2410c",
    deskripsi: "Kesetaraan dan partisipasi gender dalam kebudayaan.",
  },
];

/** Fallback indikator (jika API belum siap) */
const FALLBACK_INDIKATOR: Record<number, Indikator[]> = {
  1: [
    { kode: "X1.1", nama: "Indikator Ekonomi Budaya 1", min: 0, max: 100 },
    { kode: "X1.2", nama: "Indikator Ekonomi Budaya 2", min: 0, max: 100 },
  ],
  2: [
    { kode: "X2.1", nama: "Indikator Pendidikan 1", min: 0, max: 100 },
    { kode: "X2.2", nama: "Indikator Pendidikan 2", min: 0, max: 100 },
    { kode: "X2.3", nama: "Indikator Pendidikan 3", min: 0, max: 100 },
  ],
  3: [
    { kode: "X3.1", nama: "Indikator Ketahanan Sosial 1", min: 0, max: 100 },
    { kode: "X3.2", nama: "Indikator Ketahanan Sosial 2", min: 0, max: 100 },
    { kode: "X3.3", nama: "Indikator Ketahanan Sosial 3", min: 0, max: 100 },
  ],
  4: [
    { kode: "X4.1", nama: "Indikator Warisan Budaya 1", min: 0, max: 100 },
    { kode: "X4.2", nama: "Indikator Warisan Budaya 2", min: 0, max: 100 },
    { kode: "X4.3", nama: "Indikator Warisan Budaya 3", min: 0, max: 100 },
    { kode: "X4.4", nama: "Indikator Warisan Budaya 4", min: 0, max: 100 },
    { kode: "X4.5", nama: "Indikator Warisan Budaya 5", min: 0, max: 100 },
    { kode: "X4.6", nama: "Indikator Warisan Budaya 6", min: 0, max: 100 },
  ],
  5: [
    { kode: "X5.1", nama: "Indikator Ekspresi Budaya 1", min: 0, max: 100 },
    { kode: "X5.2", nama: "Indikator Ekspresi Budaya 2", min: 0, max: 100 },
    { kode: "X5.3", nama: "Indikator Ekspresi Budaya 3", min: 0, max: 100 },
    { kode: "X5.4", nama: "Indikator Ekspresi Budaya 4", min: 0, max: 100 },
  ],
  6: [
    { kode: "X6.1", nama: "Indikator Budaya Literasi 1", min: 0, max: 100 },
    { kode: "X6.2", nama: "Indikator Budaya Literasi 2", min: 0, max: 100 },
    { kode: "X6.3", nama: "Indikator Budaya Literasi 3", min: 0, max: 100 },
  ],
  7: [
    { kode: "X7.1", nama: "Indikator Gender 1", min: 0, max: 100 },
    { kode: "X7.2", nama: "Indikator Gender 2", min: 0, max: 100 },
    { kode: "X7.3", nama: "Indikator Gender 3", min: 0, max: 100 },
  ],
};

function fmt(n: number | null | undefined, digits = 2) {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function normalize01(x: number, min: number, max: number) {
  if (max === min) return null;
  return (x - min) / (max - min);
}

function interpretIPK(ipk: number | null) {
  if (ipk == null || Number.isNaN(ipk)) {
    return {
      level: "Belum lengkap",
      color: "zinc",
      text: "Lengkapi nilai seluruh tujuh dimensi agar IPK simulasi dapat dihitung.",
    };
  }
  if (ipk < 40) {
    return {
      level: "Sangat rendah",
      color: "red",
      text: "Hasil simulasi menunjukkan capaian kebudayaan yang masih sangat rendah. Banyak ruang perbaikan di hampir seluruh dimensi.",
    };
  }
  if (ipk < 55) {
    return {
      level: "Rendah",
      color: "amber",
      text: "Capaian simulasi masih di kategori rendah. Ada fondasi, tetapi perlu intervensi terarah agar IPK naik signifikan.",
    };
  }
  if (ipk < 70) {
    return {
      level: "Sedang",
      color: "sky",
      text: "Hasil simulasi berada di kategori sedang — cukup baik, namun masih ada kesenjangan antar-dimensi yang bisa diperbaiki.",
    };
  }
  if (ipk < 85) {
    return {
      level: "Tinggi",
      color: "emerald",
      text: "Simulasi menunjukkan capaian tinggi. Pembangunan kebudayaan relatif solid di sebagian besar dimensi.",
    };
  }
  return {
    level: "Sangat tinggi",
    color: "violet",
    text: "Hasil simulasi sangat tinggi. Profil kebudayaan sangat kuat menurut kerangka metodologi 2024.",
  };
}

const badgeClass: Record<string, string> = {
  zinc: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  red: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  sky: "bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
  emerald:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  violet:
    "bg-violet-100 text-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
};

/* ========== Fetch ========== */

async function fetchProvinces(): Promise<Provinsi[]> {
  try {
    const res = await fetch("/api/provinsi?tahun=2024");
    if (!res.ok) throw new Error("fail");
    const json = await res.json();
    const list = json.provinces || json.data || [];
    return list.map(
      (p: {
        id: number;
        code?: string;
        kode_bps?: string;
        name: string;
      }) => ({
        id: p.id,
        code: String(p.code ?? p.kode_bps ?? p.id).padStart(2, "0"),
        name: p.name,
      })
    );
  } catch {
    return [];
  }
}

async function fetchIndikator(): Promise<Record<number, Indikator[]>> {
  try {
    const res = await fetch("/api/simulasi/indikator");
    if (!res.ok) throw new Error("fail");
    const json = await res.json();
    if (json.grouped && Object.keys(json.grouped).length) {
      return json.grouped as Record<number, Indikator[]>;
    }
  } catch {
    /* fallback */
  }
  return FALLBACK_INDIKATOR;
}

/* ========== Halaman ========== */

export default function SimulasiPage() {
  const [phase, setPhase] = useState<"intro" | "wizard" | "result">("intro");
  const [step, setStep] = useState(1);
  const [provinsiId, setProvinsiId] = useState<number | "">("");
  const [provError, setProvError] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [warns, setWarns] = useState<Record<string, string>>({});

  const { data: provinces = [] } = useQuery({
    queryKey: ["simulasi-provinces"],
    queryFn: fetchProvinces,
  });

  const { data: indikatorMap = FALLBACK_INDIKATOR } = useQuery({
    queryKey: ["simulasi-indikator"],
    queryFn: fetchIndikator,
  });

  const selectedProv = useMemo(
    () => provinces.find((p) => p.id === provinsiId) || null,
    [provinces, provinsiId]
  );

  const computed = useMemo(() => {
    const sMap: Record<string, number | null> = {};
    const dMap: Record<number, number | null> = {};

    for (const dim of DIMENSI) {
      const inds = indikatorMap[dim.id] || [];
      const sList: number[] = [];

      for (const ind of inds) {
        const raw = values[ind.kode];
        if (raw === undefined || raw.trim() === "") {
          sMap[ind.kode] = null;
          continue;
        }
        const x = Number(String(raw).replace(",", "."));
        if (!Number.isFinite(x)) {
          sMap[ind.kode] = null;
          continue;
        }
        const s01 = normalize01(x, ind.min, ind.max);
        const s100 = s01 != null ? s01 * SCALE : null;
        sMap[ind.kode] = s100;
        if (s100 != null) sList.push(s100 / SCALE);
      }

      if (inds.length > 0 && sList.length === inds.length) {
        const d01 = sList.reduce((a, b) => a + b, 0) / sList.length;
        dMap[dim.id] = d01 * SCALE;
      } else {
        dMap[dim.id] = null;
      }
    }

    const dims = DIMENSI.map((d) => dMap[d.id]);
    const valid = dims.filter((d): d is number => d != null);
    const ipk =
      valid.length === TOTAL_STEPS
        ? valid.reduce((a, b) => a + b, 0) / TOTAL_STEPS
        : null;

    return { sMap, dMap, ipk, filledDims: valid.length };
  }, [values, indikatorMap]);

  const interp = interpretIPK(computed.ipk);

  const clampAndSet = (ind: Indikator, raw: string) => {
    if (raw.trim() === "") {
      setValues((v) => ({ ...v, [ind.kode]: "" }));
      setWarns((w) => {
        const n = { ...w };
        delete n[ind.kode];
        return n;
      });
      return;
    }
    let n = Number(String(raw).replace(",", "."));
    if (!Number.isFinite(n)) {
      setWarns((w) => ({ ...w, [ind.kode]: "Nilai tidak valid." }));
      return;
    }
    let msg = "";
    if (n > ind.max) {
      n = ind.max;
      msg = `Nilai dipotong ke maksimum (${fmt(ind.max)}).`;
    } else if (n < ind.min) {
      n = ind.min;
      msg = `Nilai dipotong ke minimum (${fmt(ind.min)}).`;
    }
    setValues((v) => ({ ...v, [ind.kode]: String(n) }));
    setWarns((w) => {
      const next = { ...w };
      if (msg) next[ind.kode] = msg;
      else delete next[ind.kode];
      return next;
    });
  };

  const startWizard = () => {
    if (!provinsiId) {
      setProvError(true);
      return;
    }
    setProvError(false);
    setPhase("wizard");
    setStep(1);
  };

  const resetAll = () => {
    setValues({});
    setWarns({});
    setPhase("intro");
    setStep(1);
    setProvinsiId("");
  };

  const goNext = () => {
    if (step >= TOTAL_STEPS) setPhase("result");
    else setStep((s) => s + 1);
  };

  const goPrev = () => {
    if (phase === "result") {
      setPhase("wizard");
      setStep(TOTAL_STEPS);
      return;
    }
    if (step > 1) setStep((s) => s - 1);
  };

  useEffect(() => {
    if (phase === "wizard" || phase === "result") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step, phase]);

  const currentDim = DIMENSI[step - 1];
  const currentInds = indikatorMap[step] || [];
  const progressPct = (step / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Navbar />

      <section className="py-10 lg:py-14">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-14 space-y-6">
          {/* Sticky progress (wizard / result) */}
          {phase !== "intro" && (
            <div className="sticky top-16 z-20 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="text-sm">
                  <span className="font-semibold">
                    {phase === "result"
                      ? "Hasil simulasi"
                      : `Langkah ${step} dari ${TOTAL_STEPS}`}
                  </span>
                  {phase === "wizard" && currentDim && (
                    <span className="text-zinc-500 ml-2">{currentDim.nama}</span>
                  )}
                </div>
                {selectedProv && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/20">
                    {selectedProv.name}
                  </span>
                )}
                <div className="text-sm font-bold text-[#B8860B] tabular-nums">
                  IPK: {fmt(computed.ipk)}
                  {computed.ipk == null && computed.filledDims > 0 && (
                    <span className="text-zinc-400 font-normal text-xs ml-1">
                      ({computed.filledDims}/7)
                    </span>
                  )}
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-[#B8860B] transition-all"
                  style={{
                    width: `${phase === "result" ? 100 : progressPct}%`,
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DIMENSI.map((d) => {
                  const done = computed.dMap[d.id] != null;
                  const active = phase === "wizard" && step === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        setPhase("wizard");
                        setStep(d.id);
                      }}
                      title={d.nama}
                      className={`w-8 h-8 rounded-full text-xs font-bold border transition ${
                        active
                          ? "text-white border-transparent scale-110"
                          : done
                          ? "text-white border-transparent opacity-90"
                          : "border-zinc-300 dark:border-zinc-600 text-zinc-500"
                      }`}
                      style={
                        active || done
                          ? { backgroundColor: d.color }
                          : undefined
                      }
                    >
                      {d.id}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===== INTRO: pilih provinsi (screenshot 2) ===== */}
          {phase === "intro" && (
            <div className="flex justify-center py-4 sm:py-8">
              <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg shadow-zinc-200/40 dark:shadow-none px-6 sm:px-8 py-8 sm:py-10 text-center">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-[#B8860B]/15 text-[#B8860B] flex items-center justify-center mb-4">
                  <MapPin size={22} />
                </div>

                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  Pilih Provinsi
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                  Simulasi ini mengikuti{" "}
                  <strong className="text-zinc-700 dark:text-zinc-300">
                    Metodologi IPK 2024
                  </strong>
                  . Pilih provinsi terlebih dahulu, lalu masukkan nilai mentah
                  indikator pada setiap dimensi.
                </p>

                <div className="text-left mb-5">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Provinsi
                  </label>
                  <select
                    value={provinsiId}
                    onChange={(e) => {
                      setProvinsiId(
                        e.target.value ? Number(e.target.value) : ""
                      );
                      setProvError(false);
                    }}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#B8860B]/30"
                  >
                    <option value="">— Pilih provinsi —</option>
                    {provinces.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.code} · {p.name}
                      </option>
                    ))}
                  </select>
                  {provError && (
                    <p className="text-xs text-red-500 mt-1.5">
                      Pilih provinsi terlebih dahulu.
                    </p>
                  )}
                  {!provinces.length && (
                    <p className="text-xs text-amber-600 mt-2">
                      Daftar provinsi kosong. Pastikan API{" "}
                      <code className="text-[11px]">/api/provinsi</code> aktif.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={startWizard}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-semibold transition shadow-md shadow-blue-500/25"
                >
                  Mulai simulasi
                  <ArrowRight size={18} />
                </button>

                <p className="text-xs text-zinc-400 mt-5 flex items-center justify-center gap-1.5">
                  <Info size={13} />
                  Nilai input dibatasi sesuai rentang min–max setiap indikator.
                </p>
              </div>
            </div>
          )}

          {/* ===== WIZARD ===== */}
          {phase === "wizard" && currentDim && (
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
              <div
                className="px-5 sm:px-6 py-4 border-b border-zinc-100 dark:border-zinc-800"
                style={{
                  background: `linear-gradient(135deg, ${currentDim.color}22, transparent)`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-10 h-10 rounded-xl text-white font-bold flex items-center justify-center text-sm shrink-0"
                    style={{ backgroundColor: currentDim.color }}
                  >
                    {String(currentDim.id).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-bold text-lg truncate">
                      {currentDim.nama}
                    </h2>
                    <p className="text-xs text-zinc-500">
                      {currentDim.deskripsi}
                    </p>
                  </div>
                  <div className="ml-auto text-right shrink-0">
                    <p className="text-[11px] text-zinc-500 uppercase tracking-wide">
                      Nilai dimensi
                    </p>
                    <p
                      className="text-2xl font-bold tabular-nums"
                      style={{ color: currentDim.color }}
                    >
                      {fmt(computed.dMap[currentDim.id])}
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {currentInds.map((ind) => (
                  <div key={ind.kode} className="px-5 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <span
                          className="inline-block text-[11px] font-bold text-white px-2 py-0.5 rounded-md mb-1"
                          style={{ backgroundColor: currentDim.color }}
                        >
                          {ind.kode}
                        </span>
                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                          {ind.nama}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          Min {fmt(ind.min)} · Max {fmt(ind.max)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                          <span className="px-2.5 text-xs font-semibold text-zinc-500 bg-zinc-50 dark:bg-zinc-800">
                            X
                          </span>
                          <input
                            type="number"
                            step="any"
                            inputMode="decimal"
                            placeholder="0"
                            value={values[ind.kode] ?? ""}
                            onChange={(e) =>
                              setValues((v) => ({
                                ...v,
                                [ind.kode]: e.target.value,
                              }))
                            }
                            onBlur={() =>
                              clampAndSet(ind, values[ind.kode] ?? "")
                            }
                            className="w-28 px-2.5 py-2 text-sm bg-transparent outline-none tabular-nums"
                          />
                        </div>
                        <div className="text-center min-w-[4.5rem]">
                          <p className="text-[10px] text-zinc-500 uppercase">
                            S
                          </p>
                          <p className="text-sm font-bold tabular-nums">
                            {fmt(computed.sMap[ind.kode])}
                          </p>
                        </div>
                      </div>
                    </div>
                    {warns[ind.kode] && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                        <Info size={12} />
                        {warns[ind.kode]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="px-5 sm:px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                <Button
                  variant="outline"
                  className="!px-4 !py-2 text-sm"
                  onClick={goPrev}
                  disabled={step === 1}
                >
                  <ArrowLeft size={16} /> Sebelumnya
                </Button>
                <button
                  type="button"
                  onClick={() => setPhase("result")}
                  className="text-sm text-zinc-500 hover:text-[#B8860B] underline-offset-2 hover:underline"
                >
                  Lihat hasil
                </button>
                <Button
                  variant="gold-solid"
                  className="!px-4 !py-2 text-sm"
                  onClick={goNext}
                >
                  {step >= TOTAL_STEPS ? "Lihat hasil" : "Selanjutnya"}
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* ===== HASIL ===== */}
          {phase === "result" && (
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-6">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  IPK Simulasi
                  {selectedProv ? ` · ${selectedProv.name}` : ""}
                </p>
                <p className="text-5xl sm:text-6xl font-bold text-[#B8860B] my-3 tabular-nums">
                  {fmt(computed.ipk)}
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${badgeClass[interp.color]}`}
                >
                  <CheckCircle2 size={14} />
                  {interp.level}
                </span>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3 max-w-lg mx-auto leading-relaxed">
                  {interp.text}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Skor per dimensi</h3>
                {DIMENSI.map((d) => {
                  const v = computed.dMap[d.id];
                  const w = Math.min(Math.max(v ?? 0, 0), 100);
                  return (
                    <div key={d.id}>
                      <div className="flex justify-between text-xs mb-1 gap-2">
                        <button
                          type="button"
                          className="text-left text-zinc-600 dark:text-zinc-400 hover:text-[#B8860B]"
                          onClick={() => {
                            setPhase("wizard");
                            setStep(d.id);
                          }}
                        >
                          {d.id}. {d.nama}
                        </button>
                        <span className="font-semibold tabular-nums">
                          {fmt(v)}
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

              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <Button
                  variant="outline"
                  className="!px-4 !py-2 text-sm"
                  onClick={goPrev}
                >
                  <ArrowLeft size={16} /> Kembali ke dimensi
                </Button>
                <Button
                  variant="outline"
                  className="!px-4 !py-2 text-sm"
                  onClick={resetAll}
                >
                  <RotateCcw size={16} /> Mulai ulang
                </Button>
              </div>
            </div>
          )}

          <p className="text-xs text-zinc-500 flex items-start gap-1.5">
            <Info size={14} className="shrink-0 mt-0.5" />
            Normalisasi min–max dikalikan 100 (skala 0–100). Nilai dimensi =
            rata-rata S indikator pada dimensi tersebut. IPK = rata-rata 7
            dimensi. Simulasi hanya untuk pembelajaran metodologi 2024.
          </p>
        </div>
      </section>

      <CtaSection
        eyebrow="Metodologi"
        title="Pelajari rumus lengkap per dimensi"
        description="Lihat definisi operasional, daftar indikator, dan cara menghitung nilai dimensi pada halaman Metodologi & Indikator."
      >
        <Link href="/pages/metodologi">
          <Button variant="gold" showArrow>
            Metodologi & Indikator
          </Button>
        </Link>
      </CtaSection>

      <Footer />
    </div>
  );
}