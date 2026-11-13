import { prisma } from "@/lib/prisma";
import DataProvinsiClient from "./DataProvinsiClient";
import { requirePermission } from "@/lib/permissions";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ tahun?: string; provinsi?: string }>;
}

function serializeData<T>(obj: T): T {
  if (!obj) return obj;
  return JSON.parse(
    JSON.stringify(obj, (_, value) => {
      if (typeof value === "bigint") {
        return Number(value);
      }
      return value;
    })
  );
}

export default async function DataProvinsiPage({ searchParams }: PageProps) {
  const session = await requirePermission("menu.data_provinsi");

  const canManage =
    session.role === "superadmin" ||
    session.role === "admin" ||
    session.role === "data_admin";

  const isVerifikator =
    session.role === "superadmin" ||
    session.role === "admin" ||
    session.role === "data_verifikator";

  const params = await searchParams;

  const provinces = await prisma.provinces.findMany({
    orderBy: { code: "asc" },
  });

  const selectedYear = params.tahun ? parseInt(params.tahun) : 2024;
  const selectedProvId = params.provinsi
    ? parseInt(params.provinsi)
    : provinces[0]?.id ?? 1;

  const currentProv =
    provinces.find((p) => p.id === selectedProvId) || provinces[0];

  const kodeBps = currentProv ? String(currentProv.code).padEnd(4, "0") : "1100";

  // 1. Ambil tahun publik yang sudah ada di database skor provinsi
  let dbYears: Array<{ tahun: number }> = [];
  try {
    dbYears = await prisma.$queryRawUnsafe<Array<{ tahun: number }>>(
      `SELECT DISTINCT tahun FROM (
        SELECT tahun FROM skor_dimensi_provinsi_2024
        UNION
        SELECT tahun FROM skor_dimensi_provinsi_2018_2023
      ) AS all_years ORDER BY tahun DESC`
    );
  } catch (e) {
    console.error("[DataProvinsi] Error fetch available years:", e);
  }

  // 2. Ambil tahun pengajuan provinsi yang SUDAH DIUPLOAD (submitted, approved, published)
  const pengajuanWithData = await prisma.data_pengajuan.findMany({
    where: {
      jenis: "provinsi",
      status: { in: ["submitted", "approved", "published"] },
    },
    select: { tahun: true },
    distinct: ["tahun"],
  });

  const validUploadedYears = [
    ...dbYears.map((d) => Number(d.tahun)),
    ...pengajuanWithData.map((d) => d.tahun),
  ].filter((y) => y && y > 0);

  // Baseline tahun resmi: 2018 - 2024 (TANPA TAHUN 2026)
  const defaultYears = [2024, 2023, 2022, 2021, 2020, 2019, 2018];

  const availableYears = Array.from(
    new Set([...validUploadedYears, ...defaultYears])
  ).sort((a, b) => b - a);

  const isMetodologiBaru = selectedYear >= 2024;
  const metodologiLabel = isMetodologiBaru
    ? "Metodologi 2024 (Baru)"
    : "Metodologi 2018 - 2023 (Lama)";

  const tableDimensi = isMetodologiBaru
    ? "skor_dimensi_provinsi_2024"
    : "skor_dimensi_provinsi_2018_2023";
  const tableIndikator = isMetodologiBaru
    ? "skor_indikator_provinsi_2024"
    : "skor_indikator_provinsi_2018_2023";
  const tableRef = isMetodologiBaru
    ? "ref_indikator_2024"
    : "ref_indikator_2018";
  const ipkCol = isMetodologiBaru ? "skor_ipk" : "ipk";

  // 3. Ambil status pengajuan untuk provinsi & tahun ini (jika ada)
  const pengajuan = await prisma.data_pengajuan.findFirst({
    where: {
      jenis: "provinsi",
      tahun: selectedYear,
      kode_provinsi: String(currentProv?.code),
    },
    orderBy: { created_at: "desc" },
  });

  // 4. Query Skor Dimensi & IPK
  let skorDimensi: Record<string, any> | null = null;
  try {
    const dimRows = await prisma.$queryRawUnsafe<Array<Record<string, any>>>(
      `SELECT * FROM \`${tableDimensi}\` WHERE tahun = ${selectedYear} AND kode_bps = '${kodeBps}' LIMIT 1`
    );
    if (dimRows && dimRows[0]) {
      skorDimensi = serializeData(dimRows[0]);
    }
  } catch (err) {
    console.error(`[DataProvinsi] Error fetch ${tableDimensi}:`, err);
  }

  // 5. Query Skor Indikator
  let skorIndikator: Record<string, any> | null = null;
  try {
    const indRows = await prisma.$queryRawUnsafe<Array<Record<string, any>>>(
      `SELECT * FROM \`${tableIndikator}\` WHERE tahun = ${selectedYear} AND kode_bps = '${kodeBps}' LIMIT 1`
    );
    if (indRows && indRows[0]) {
      skorIndikator = serializeData(indRows[0]);
    }
  } catch (err) {
    console.error(`[DataProvinsi] Error fetch ${tableIndikator}:`, err);
  }

  // 6. Ambil Referensi Nama Indikator
  let refIndikatorRaw: Array<{ kode: string; nama_indikator: string }> = [];
  try {
    refIndikatorRaw = await prisma.$queryRawUnsafe<
      Array<{ kode: string; nama_indikator: string }>
    >(`SELECT kode, nama_indikator FROM \`${tableRef}\` WHERE kode != 'kode'`);
  } catch (err) {
    console.error(`[DataProvinsi] Error fetch ${tableRef}:`, err);
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
      const rawVal = skorIndikator ? skorIndikator[colName] : null;
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
    <DataProvinsiClient
      provinces={provinces.map((p) => ({ id: p.id, name: p.name, code: p.code }))}
      currentProv={
        currentProv
          ? { id: currentProv.id, name: currentProv.name, code: currentProv.code }
          : null
      }
      availableYears={availableYears}
      selectedYear={selectedYear}
      selectedProvId={selectedProvId}
      metodologiLabel={metodologiLabel}
      canManage={canManage}
      isVerifikator={isVerifikator}
      statusPengajuan={pengajuan?.status ?? null}
      pengajuanId={pengajuan ? String(pengajuan.id) : null}
      skorIpk={
        skorDimensi && skorDimensi[ipkCol] != null
          ? Number(skorDimensi[ipkCol])
          : null
      }
      skorDimensi={skorDimensi}
      dimensiMaster={dimensiMaster}
      groupedIndikator={groupedIndikator}
    />
  );
}