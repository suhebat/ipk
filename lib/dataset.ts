// lib/dataset.ts
import { prisma } from "@/lib/prisma";

export interface PeriodeDataset {
  kode: string;
  label: string;
  yearStart: number;
  yearEnd: number | null;
  displayPeriod: string;
  subLabel: string;
}

export async function getDatasetPeriods(): Promise<{
  periods: PeriodeDataset[];
  rentangTahun: string;
}> {
  // Ambil versi metodologi yang aktif dari database
  const versions = await prisma.metodologi_versi.findMany({
    where: { is_active: true },
    orderBy: { year_start: "asc" },
  });

  // Cari tahun paling baru yang ada di ipk_nasional_tahunan
  const latestData = await prisma.ipk_nasional_tahunan.findFirst({
    orderBy: { tahun: "desc" },
    select: { tahun: true },
  });

  const earliestData = await prisma.ipk_nasional_tahunan.findFirst({
    orderBy: { tahun: "asc" },
    select: { tahun: true },
  });

  const minYear = earliestData?.tahun ?? 2018;
  const maxYear = latestData?.tahun ?? (versions[versions.length - 1]?.year_end ?? versions[versions.length - 1]?.year_start ?? 2024);

  const periods: PeriodeDataset[] = versions.map((v) => {
    // Jika year_end null atau sama dengan year_start, tampilkan tahun tunggal
    const isSingleYear = !v.year_end || v.year_start === v.year_end;
    const periodStr = isSingleYear ? `${v.year_start}` : `${v.year_start}-${v.year_end}`;
    const displayPeriod = isSingleYear ? `${v.year_start}` : `${v.year_start}–${v.year_end}`;

    return {
      kode: v.kode,
      label: v.label,
      yearStart: v.year_start,
      yearEnd: v.year_end,
      displayPeriod: periodStr,
      subLabel: `Metodologi ${displayPeriod} · XLSX / CSV`,
    };
  });

  return {
    periods,
    rentangTahun: `${minYear}–${maxYear}`,
  };
}