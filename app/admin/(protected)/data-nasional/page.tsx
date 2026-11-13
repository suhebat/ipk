import { prisma } from "@/lib/prisma";
import DataNasionalClient from "./DataNasionalClient";
import { requirePermission } from "@/lib/permissions";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ tahun?: string }>;
}

export default async function DataNasionalPage({ searchParams }: PageProps) {
  // Hanya admin yang berhak yang bisa membuka halaman
  const session = await requirePermission("menu.data_nasional");

  const canManage =
    session.role === "superadmin" ||
    session.role === "admin" ||
    session.role === "data_admin";

  const isVerifikator =
    session.role === "superadmin" ||
    session.role === "admin" ||
    session.role === "data_verifikator";

  const params = await searchParams;
  const selectedYear = params.tahun ? parseInt(params.tahun) : 2024;

  // 1. Ambil tahun publik yang sudah ada di database
  const dbYears = await prisma.ipk_nasional_tahunan.findMany({
    select: { tahun: true },
    distinct: ["tahun"],
    orderBy: { tahun: "desc" },
  });

  // 2. KUNCI UTAMA: Tahun pengajuan HANYA masuk ke dropdown JIKA SUDAH DIUPLOAD DATA-NYA
  // (status: submitted, approved, atau published. Status 'draft' kosong DIABAIKAN!)
  const pengajuanWithData = await prisma.data_pengajuan.findMany({
    where: {
      jenis: "nasional",
      status: { in: ["submitted", "approved", "published"] }, // <-- Hanya yang sudah upload data
    },
    select: { tahun: true },
    distinct: ["tahun"],
  });

  const validUploadedYears = [
    ...dbYears.map((d) => d.tahun),
    ...pengajuanWithData.map((d) => d.tahun),
  ].filter((y) => y && y > 0);

  // Baseline data resmi: 2018 - 2024 (Tahun 2026 ditiadakan)
  const defaultYears = [2024, 2023, 2022, 2021, 2020, 2019, 2018];

  // Gabungkan baseline + tahun yang SUDAH ADA DATANYA
  const availableYears = Array.from(
    new Set([...validUploadedYears, ...defaultYears])
  ).sort((a, b) => b - a);

  const isMetodologiBaru = selectedYear >= 2024;
  const metodologiLabel = isMetodologiBaru
    ? "Metodologi 2024 (Baru)"
    : "Metodologi 2018 - 2023 (Lama)";

  const tableIndikator = isMetodologiBaru
    ? "skor_indikator_provinsi_2024"
    : "skor_indikator_provinsi_2018_2023";
  const tableRef = isMetodologiBaru
    ? "ref_indikator_2024"
    : "ref_indikator_2018";

  // 3. Ambil data pengajuan untuk tahun yang sedang dibuka
  const pengajuan = await prisma.data_pengajuan.findFirst({
    where: { jenis: "nasional", tahun: selectedYear },
    include: { detail_nasional: true },
    orderBy: { created_at: "desc" },
  });

  // 4. Ambil Skor IPK & 7 Dimensi Nasional (dari tabel publik)
  const skorNasional = await prisma.ipk_nasional_tahunan.findFirst({
    where: { tahun: selectedYear },
  });

  // 5. Ambil Referensi Indikator
  let refIndikatorRaw: Array<{ kode: string; nama_indikator: string }> = [];
  try {
    refIndikatorRaw = await prisma.$queryRawUnsafe<
      Array<{ kode: string; nama_indikator: string }>
    >(`SELECT kode, nama_indikator FROM ${tableRef} WHERE kode != 'kode'`);
  } catch (err) {
    console.error(`[DataNasional] Error fetch ${tableRef}:`, err);
  }

  // 6. Hitung Rata-Rata Seluruh Provinsi
  let skorIndikatorNasional: Record<string, number | null> = {};
  if (refIndikatorRaw.length > 0) {
    const avgCols = refIndikatorRaw
      .map((item) => {
        const col = item.kode.toLowerCase().replace(/\./g, "_");
        return `AVG(\`${col}\`) AS \`${col}\``;
      })
      .join(", ");

    try {
      const avgResult = await prisma.$queryRawUnsafe<Array<Record<string, any>>>(
        `SELECT ${avgCols} FROM \`${tableIndikator}\` WHERE tahun = ${selectedYear} AND kode_bps != '0000'`
      );
      if (avgResult && avgResult[0]) {
        skorIndikatorNasional = avgResult[0];
      }
    } catch (err) {
      console.error(`[DataNasional] Error AVG ${tableIndikator}:`, err);
    }
  }

  const dimensiMaster = [
    { id: 1, nama: "Ekonomi Budaya", color: "#f59e0b" },
    { id: 2, nama: "Pendidikan", color: "#3b82f6" },
    { id: 3, nama: "Ketahanan Sosial", color: "#10b981" },
    { id: 4, nama: "Warisan Budaya", color: "#8b5cf6" },
    { id: 5, nama: "Ekspresi Budaya", color: "#ec4899" },
    { id: 6, nama: "Budaya Literasi", color: "#06b6d4" },
    { id: 7, nama: "Gender", color: "#f97316" },
  ];

  const groupedIndikator: Record<
    number,
    Array<{ kode: string; col: string; nama: string; nilai: number | null }>
  > = {};

  refIndikatorRaw.forEach((ind) => {
    const match = ind.kode.match(/^X([1-7])\./i);
    if (match) {
      const dimIdx = parseInt(match[1]);
      const colName = ind.kode.toLowerCase().replace(/\./g, "_");
      const rawVal = skorIndikatorNasional[colName];
      const nilai = rawVal != null ? Number(rawVal) : null;

      if (!groupedIndikator[dimIdx]) groupedIndikator[dimIdx] = [];
      groupedIndikator[dimIdx].push({
        kode: ind.kode,
        col: colName,
        nama: ind.nama_indikator,
        nilai,
      });
    }
  });

  return (
    <DataNasionalClient
      availableYears={availableYears}
      selectedYear={selectedYear}
      metodologiLabel={metodologiLabel}
      canManage={canManage}
      isVerifikator={isVerifikator}
      statusPengajuan={pengajuan?.status ?? null}
      pengajuanId={pengajuan ? String(pengajuan.id) : null}
      skorNasional={
        skorNasional
          ? {
              skor_ipk: skorNasional.skor_ipk != null ? Number(skorNasional.skor_ipk) : null,
              dimensi_1: (skorNasional as any).dimensi_1 != null ? Number((skorNasional as any).dimensi_1) : null,
              dimensi_2: (skorNasional as any).dimensi_2 != null ? Number((skorNasional as any).dimensi_2) : null,
              dimensi_3: (skorNasional as any).dimensi_3 != null ? Number((skorNasional as any).dimensi_3) : null,
              dimensi_4: (skorNasional as any).dimensi_4 != null ? Number((skorNasional as any).dimensi_4) : null,
              dimensi_5: (skorNasional as any).dimensi_5 != null ? Number((skorNasional as any).dimensi_5) : null,
              dimensi_6: (skorNasional as any).dimensi_6 != null ? Number((skorNasional as any).dimensi_6) : null,
              dimensi_7: (skorNasional as any).dimensi_7 != null ? Number((skorNasional as any).dimensi_7) : null,
            }
          : null
      }
      dimensiMaster={dimensiMaster}
      groupedIndikator={groupedIndikator}
    />
  );
}