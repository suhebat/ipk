import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Ambil semua tahun unik yang ada di tabel skor IPK nasional
    const records = await prisma.ipk_nasional_tahunan.findMany({
      select: { tahun: true },
      distinct: ["tahun"],
      orderBy: { tahun: "desc" },
    });

    const tahunList = records
      .map((r) => String(r.tahun))
      .filter((y) => y && y !== "0");

    // Jika di DB kosong, fallback ke daftar standar
    const fallback = ["2024", "2023", "2022", "2021", "2020", "2019", "2018"];
    const result = tahunList.length > 0 ? tahunList : fallback;

    return NextResponse.json({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error("[API Tahun Tersedia Error]", error);
    return NextResponse.json({
      status: "success",
      data: ["2024", "2023", "2022", "2021", "2020", "2019", "2018"],
    });
  }
}