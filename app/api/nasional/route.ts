import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const DIMENSI_META: Record<
  number,
  { nama: string; color: string; muted: string }
> = {
  1: { nama: "Ekonomi Budaya", color: "#f59e0b", muted: "#b45309" },
  2: { nama: "Pendidikan", color: "#3b82f6", muted: "#1d4ed8" },
  3: { nama: "Ketahanan Sosial", color: "#10b981", muted: "#047857" },
  4: { nama: "Warisan Budaya", color: "#8b5cf6", muted: "#6d28d9" },
  5: { nama: "Ekspresi Budaya", color: "#ec4899", muted: "#be185d" },
  6: { nama: "Budaya Literasi", color: "#06b6d4", muted: "#0e7490" },
  7: { nama: "Gender", color: "#f97316", muted: "#c2410c" },
};

function kodeToCol(kode: string) {
  return kode.trim().toLowerCase().replace(".", "_");
}

function dimFromKode(kode: string) {
  const m = /^X(\d+)/i.exec(kode.trim());
  return m ? Number(m[1]) : 0;
}

export async function GET(req: NextRequest) {
  try {
    let year = Number(req.nextUrl.searchParams.get("tahun") || 2024);
    if (!year || year >= 2025) year = 2024;

    const is2024 = year >= 2024;
    const metodologi = is2024
      ? "Metodologi 2024 (Baru)"
      : "Metodologi 2018 - 2023 (Lama)";

    // Semua tahun (tren) — setara file lama Anda
    const allRows = await prisma.ipk_nasional_tahunan.findMany({
      where: { tahun: { not: 0 } },
      orderBy: { tahun: "asc" },
    });

    const years = allRows.map((r) => Number(r.tahun)).sort((a, b) => b - a);

    const tren = allRows.map((r) => ({
      tahun: Number(r.tahun),
      skor_ipk: r.skor_ipk != null ? Number(r.skor_ipk) : null,
      dimensi: [1, 2, 3, 4, 5, 6, 7].map((i) => {
        const v = (r as any)[`dimensi_${i}`];
        return v != null ? Number(v) : null;
      }),
    }));

    // Format lama (opsional, biar tidak pecah kalau ada yang masih pakai)
    const dataLegacy = allRows.map((row) => ({
      tahun: Number(row.tahun),
      skorIpk: row.skor_ipk != null ? Number(row.skor_ipk) : null,
      dimensi: {
        ekonomiBudaya: row.dimensi_1 != null ? Number(row.dimensi_1) : null,
        pendidikan: row.dimensi_2 != null ? Number(row.dimensi_2) : null,
        ketahananSosial: row.dimensi_3 != null ? Number(row.dimensi_3) : null,
        warisanBudaya: row.dimensi_4 != null ? Number(row.dimensi_4) : null,
        ekspresiBudaya: row.dimensi_5 != null ? Number(row.dimensi_5) : null,
        budayaLiterasi: row.dimensi_6 != null ? Number(row.dimensi_6) : null,
        gender: row.dimensi_7 != null ? Number(row.dimensi_7) : null,
      },
    }));

    // Skor tahun terpilih
    const skor = allRows.find((r) => Number(r.tahun) === year) || null;

    const dimensiScores = [1, 2, 3, 4, 5, 6, 7].map((i) => {
      const raw = skor ? (skor as any)[`dimensi_${i}`] : null;
      return {
        id: i,
        ...DIMENSI_META[i],
        nilai: raw != null ? Number(raw) : null,
      };
    });

    // Ref indikator
    const ref = is2024
      ? await prisma.ref_indikator_2024.findMany()
      : await prisma.ref_indikator_2018.findMany();

    const codes = ref
      .map((r) => String(r.kode).trim())
      .filter((k) => k && k.toLowerCase() !== "kode" && /^X[1-7]\./i.test(k));

    // AVG indikator nasional (seluruh provinsi)
    const avgMap: Record<string, number | null> = {};
    if (codes.length) {
      const selects = codes
        .map((kode) => {
          const col = kodeToCol(kode);
          if (!/^x[1-7]_\d+$/.test(col)) return null;
          return Prisma.sql`AVG(\`${Prisma.raw(col)}\`) AS \`${Prisma.raw(col)}\``;
        })
        .filter(Boolean) as Prisma.Sql[];

      if (selects.length) {
        const table = is2024
          ? Prisma.raw("skor_indikator_provinsi_2024")
          : Prisma.raw("skor_indikator_provinsi_2018_2023");

        const rows = await prisma.$queryRaw<Record<string, any>[]>`
          SELECT ${Prisma.join(selects)}
          FROM ${table}
          WHERE tahun = ${year} AND kode_bps != '0000'
        `;
        const row = rows[0] || {};
        for (const kode of codes) {
          const col = kodeToCol(kode);
          avgMap[col] =
            row[col] != null && row[col] !== "" ? Number(row[col]) : null;
        }
      }
    }

    // Sumber data
    let sumberRow: Record<string, any> | null = null;
    if (is2024) {
      sumberRow = await prisma.sumber_data_indikator_2024.findUnique({
        where: { tahun: year },
      });
    } else {
      sumberRow =
        (await prisma.sumber_data_indikator_2018.findUnique({
          where: { tahun: year },
        })) ||
        (await prisma.sumber_data_indikator_2018.findFirst({
          where: { tahun: { not: 0 } },
          orderBy: { tahun: "desc" },
        }));
    }

    // Group indikator
    const grouped: Record<
      number,
      {
        id: number;
        nama: string;
        color: string;
        muted: string;
        indikator: {
          kode: string;
          nama: string;
          nilai: number | null;
          sumber: string;
        }[];
      }
    > = {};

    for (const r of ref) {
      const kode = String(r.kode).trim();
      if (!kode || kode.toLowerCase() === "kode") continue;
      const dim = dimFromKode(kode);
      if (!dim || !DIMENSI_META[dim]) continue;

      if (!grouped[dim]) {
        grouped[dim] = { id: dim, ...DIMENSI_META[dim], indikator: [] };
      }

      const col = kodeToCol(kode);
      let sumber = "";
      if (sumberRow && sumberRow[col] != null) {
        const raw = String(sumberRow[col]).trim();
        if (raw && raw.toLowerCase() !== col) sumber = raw;
      }

      grouped[dim].indikator.push({
        kode,
        nama: String(r.nama_indikator || ""),
        nilai: avgMap[col] ?? null,
        sumber,
      });
    }

    for (const g of Object.values(grouped)) {
      g.indikator.sort((a, b) =>
        a.kode.localeCompare(b.kode, undefined, { numeric: true })
      );
    }

    return NextResponse.json({
      ok: true,
      year,
      years: years.length
        ? years
        : [2024, 2023, 2022, 2021, 2020, 2019, 2018],
      metodologi,
      available: Boolean(skor),
      skor_ipk: skor?.skor_ipk != null ? Number(skor.skor_ipk) : null,
      dimensi: dimensiScores,
      grouped: Object.values(grouped).sort((a, b) => a.id - b.id),
      tren,
      // tetap ada format lama Anda
      total: dataLegacy.length,
      data: dataLegacy,
    });
  } catch (error: any) {
    console.error("Error /api/nasional:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Gagal mengambil data nasional" },
      { status: 500 }
    );
  }
}