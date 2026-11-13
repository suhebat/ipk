import { prisma } from "@/lib/prisma";

export type MetodologiVersi = {
  id: number;
  kode: string;
  label: string;
  year_start: number;
  year_end: number | null;
  tabel_ref: string;
  tabel_skor: string;
  tabel_sumber: string;
  tabel_dimensi: string | null;
};

/** Ambil semua versi aktif, diurutkan year_start DESC */
export async function listMetodologiVersi(): Promise<MetodologiVersi[]> {
  const rows = await prisma.metodologi_versi.findMany({
    where: { is_active: true },
    orderBy: { year_start: "desc" },
  });

  return rows.map((r) => ({
    id: r.id,
    kode: r.kode,
    label: r.label,
    year_start: Number(r.year_start),
    year_end: r.year_end == null ? null : Number(r.year_end),
    tabel_ref: r.tabel_ref,
    tabel_skor: r.tabel_skor,
    tabel_sumber: r.tabel_sumber,
    tabel_dimensi: r.tabel_dimensi ?? null,
  }));
}

/**
 * Tahun data → versi metodologi yang berlaku.
 * Contoh: 2023 → m2018, 2024/2025/2026 → m2024
 */
export async function resolveMetodologi(
  tahun: number
): Promise<MetodologiVersi> {
  const versions = await listMetodologiVersi();
  if (!versions.length) {
    throw new Error("Tabel metodologi_versi kosong. Jalankan seed SQL dulu.");
  }

  const match = versions.find(
    (v) =>
      tahun >= v.year_start &&
      (v.year_end == null || tahun <= v.year_end)
  );

  // fallback: versi dengan year_start terbesar yang <= tahun, atau yang terbaru
  if (match) return match;

  const older = versions.find((v) => v.year_start <= tahun);
  return older ?? versions[0];
}

/** Whitelist nama tabel agar raw query aman */
const ALLOWED_TABLES = new Set([
  "ref_indikator_2018",
  "ref_indikator_2024",
  "skor_indikator_provinsi_2018_2023",
  "skor_indikator_provinsi_2024",
  "sumber_data_indikator_2018",
  "sumber_data_indikator_2024",
  "skor_dimensi_provinsi_2018_2023",
  "skor_dimensi_provinsi_2024",
]);

export function assertAllowedTable(name: string): string {
  if (!ALLOWED_TABLES.has(name)) {
    throw new Error(`Nama tabel tidak diizinkan: ${name}`);
  }
  return name;
}

/** Saat metodologi baru: daftarkan nama tabel di ALLOWED_TABLES juga */