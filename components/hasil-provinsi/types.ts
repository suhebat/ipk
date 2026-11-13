export type DimensiScore = {
  id: number;
  nama: string;
  color: string;
  muted: string;
  nilai: number | null;
};

export type Indikator = {
  kode: string;
  nama: string;
  nilai: number | null;
  sumber: string;
};

export type Grouped = {
  id: number;
  nama: string;
  color: string;
  muted: string;
  indikator: Indikator[];
};

export type ProvItem = {
  id: number;
  name: string;
  code: string;
  kode_bps: string;
};

export type ProvResponse = {
  ok: boolean;
  year: number;
  metodologi: string;
  available: boolean;
  province: ProvItem & { kode_bps: string };
  provinces: ProvItem[];
  skor_ipk: number | null;
  rank: number | null;
  total_ranked: number;
  dimensi: DimensiScore[];
  grouped: Grouped[];
  tren: { tahun: number; skor_ipk: number | null }[];
  ranking: {
    rank: number;
    kode_bps: string;
    nama: string;
    skor: number | null;
  }[];
};

export const YEAR_OPTIONS = [2024, 2023, 2022, 2021, 2020, 2019, 2018];

export function fmt(n: number | null | undefined, digits = 2) {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function padBps(code: string | number) {
  const s = String(code).replace(/\D/g, "");
  if (s.length >= 4) return s.slice(0, 4);
  if (s.length === 2) return s + "00";
  return s.padStart(4, "0");
}

export async function fetchProvinsi(tahun: number, provinsi: number) {
  const q = new URLSearchParams({
    tahun: String(tahun),
    provinsi: String(provinsi),
  });
  const res = await fetch(`/api/provinsi?${q}`);
  if (!res.ok) throw new Error("Gagal memuat data");
  return res.json() as Promise<ProvResponse>;
}