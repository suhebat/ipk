import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // sesuaikan

export async function GET() {
  try {
    // Sesuaikan nama model Prisma hasil db pull (ref_indikator_2024)
    const rows = await prisma.ref_indikator_2024.findMany({
      where: { NOT: { kode: "kode" } },
      select: {
        kode: true,
        nama_indikator: true,
        nilai_minimum: true,
        nilai_maximum: true,
      },
    });

    const grouped: Record<
      number,
      { kode: string; nama: string; min: number; max: number }[]
    > = {};

    for (const row of rows) {
      const m = String(row.kode).match(/^X([1-7])\./i);
      if (!m) continue;
      const dim = Number(m[1]);
      if (!grouped[dim]) grouped[dim] = [];
      grouped[dim].push({
        kode: row.kode,
        nama: row.nama_indikator || row.kode,
        min: row.nilai_minimum != null ? Number(row.nilai_minimum) : 0,
        max: row.nilai_maximum != null ? Number(row.nilai_maximum) : 100,
      });
    }

    return NextResponse.json({ status: "ok", grouped });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: "error", grouped: {} }, { status: 500 });
  }
}