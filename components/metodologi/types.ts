import {
  TrendingUp,
  GraduationCap,
  UserRoundGroup,
  Landmark,
  EighthNotes,
  BookOpen,
  VenusAndMars,
} from "lucide-react";

export type MetaIndikator = {
  konsep: string;
  interpretasi: string;
  contoh: string;
  variabel: string;
  rumus: string;
  rumus_pembilang: string;
  rumus_penyebut: string;
  kegiatan: string;
  satuan: string;
  waktu: string;
  level: string;
  akses: string;
  publikasi: string;
};

export type Indikator = {
  kode: string;
  nama: string;
  min: number | null;
  max: number | null;
  sumber: string;
  meta?: MetaIndikator | null;
};

export type Dimensi = {
  id: number;
  number: string;
  nama: string;
  color: string;
  muted: string;
  definisi: string;
  indikator: Indikator[];
};

export type Metodologi = "2024" | "2018-2023";
export type FileFormat = "pdf" | "xlsx";

export const ICONS = [
  TrendingUp,
  GraduationCap,
  UserRoundGroup,
  Landmark,
  EighthNotes,
  BookOpen,
  VenusAndMars,
];

export const METODOLOGI_OPTIONS: {
  value: Metodologi;
  label: string;
  desc: string;
}[] = [
  {
    value: "2024",
    label: "Metodologi 2024",
    desc: "Dimensi & indikator versi terbaru",
  },
  {
    value: "2018-2023",
    label: "Metodologi 2018–2023",
    desc: "Dimensi & indikator periode lama",
  },
];

/** Rumus teks terbaca untuk sheet Excel */
export const RUMUS_TEXT_2024: {
  dimensi: string;
  hitung: string;
  normalisasi: string;
}[] = [
  {
    dimensi: "1. Ekonomi Budaya",
    hitung: "D1 = (S1.1 + S1.2) / 2",
    normalisasi: "S1.i = (X1.i − min) / (max − min), i = 1, 2",
  },
  {
    dimensi: "2. Pendidikan",
    hitung: "D2 = (S2.1 + S2.2 + S2.3) / 3",
    normalisasi: "S2.i = (X2.i − min) / (max − min), i = 1, 2, 3",
  },
  {
    dimensi: "3. Ketahanan Sosial",
    hitung: "D3 = (S3.1 + S3.2 + S3.3) / 3",
    normalisasi: "S3.i = (X3.i − min) / (max − min), i = 1, 2, 3",
  },
  {
    dimensi: "4. Warisan Budaya",
    hitung: "D4 = (S4.1 + S4.2 + S4.3 + S4.4 + S4.5 + S4.6) / 6",
    normalisasi: "S4.i = (X4.i − min) / (max − min), i = 1 … 6",
  },
  {
    dimensi: "5. Ekspresi Budaya",
    hitung: "D5 = (S5.1 + S5.2 + S5.3 + S5.4) / 4",
    normalisasi: "S5.i = (X5.i − min) / (max − min), i = 1, 2, 3, 4",
  },
  {
    dimensi: "6. Budaya Literasi",
    hitung: "D6 = (S6.1 + S6.2 + S6.3) / 3",
    normalisasi: "S6.i = (X6.i − min) / (max − min), i = 1, 2, 3",
  },
  {
    dimensi: "7. Gender",
    hitung: "D7 = (S7.1 + S7.2 + S7.3) / 3",
    normalisasi: "S7.i = (X7.i − min) / (max − min), i = 1, 2, 3",
  },
];

export const RUMUS_TEXT_2018: {
  dimensi: string;
  hitung: string;
  normalisasi: string;
}[] = [
  {
    dimensi: "1. Ekonomi Budaya",
    hitung: "D1 = S1.1",
    normalisasi: "S1.1 = (X1.1 − min) / (max − min)",
  },
  {
    dimensi: "2. Pendidikan",
    hitung: "D2 = (S2.1 + … + S2.6) / 6",
    normalisasi: "S2.i = (X2.i − min) / (max − min), i = 1 … 6",
  },
  {
    dimensi: "3. Ketahanan Sosial",
    hitung: "D3 = (S3.1 + … + S3.8) / 8",
    normalisasi: "S3.i = (X3.i − min) / (max − min), i = 1 … 8",
  },
  {
    dimensi: "4. Warisan Budaya",
    hitung: "D4 = (S4.1 + … + S4.6) / 6",
    normalisasi: "S4.i = (X4.i − min) / (max − min), i = 1 … 6",
  },
  {
    dimensi: "5. Ekspresi Budaya",
    hitung: "D5 = (S5.1 + S5.2 + S5.3 + S5.4) / 4",
    normalisasi: "S5.i = (X5.i − min) / (max − min), i = 1, 2, 3, 4",
  },
  {
    dimensi: "6. Budaya Literasi",
    hitung: "D6 = (S6.1 + S6.2 + S6.3) / 3",
    normalisasi: "S6.i = (X6.i − min) / (max − min), i = 1, 2, 3",
  },
  {
    dimensi: "7. Gender",
    hitung: "D7 = (S7.1 + S7.2 + S7.3) / 3",
    normalisasi: "S7.i = (X7.i − min) / (max − min), i = 1, 2, 3",
  },
];

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

export async function fetchMetodologi() {
  const res = await fetch("/api/metodologi");
  if (!res.ok) throw new Error("Gagal memuat data metodologi");
  return res.json() as Promise<{ m2024: Dimensi[]; m2018: Dimensi[] }>;
}
