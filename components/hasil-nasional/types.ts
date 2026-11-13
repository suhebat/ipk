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

export type NasResponse = {
  year: number;
  years: number[];
  metodologi: string;
  available: boolean;
  skor_ipk: number | null;
  dimensi: DimensiScore[];
  grouped: Grouped[];
  tren: {
    tahun: number;
    skor_ipk: number | null;
    dimensi: (number | null)[];
  }[];
};

export type FileFormat = "pdf" | "xlsx";

export function fmt(n: number | null | undefined, digits = 2) {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function autoColWidths(
  rows: (string | number | null | undefined)[][],
  min = 10,
  max = 56
) {
  const colCount = Math.max(0, ...rows.map((r) => r.length));
  const widths = Array.from({ length: colCount }, () => min);
  for (const row of rows) {
    row.forEach((cell, i) => {
      const len = String(cell ?? "").length;
      widths[i] = Math.min(max, Math.max(widths[i], len + 2));
    });
  }
  return widths.map((w) => ({ wch: w }));
}

export async function fetchNasional(tahun: number) {
  const res = await fetch(`/api/nasional?tahun=${tahun}`);
  if (!res.ok) throw new Error("Gagal memuat data");
  return res.json() as Promise<NasResponse>;
}
