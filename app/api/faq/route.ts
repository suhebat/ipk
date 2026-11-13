import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rows = await prisma.faqs.findMany({
      where: { is_active: true },
      orderBy: [{ urutan: "asc" }, { id: "asc" }],
      select: {
        id: true,
        kategori: true,
        pertanyaan: true,
        jawaban: true,
        urutan: true,
      },
    });

    return NextResponse.json({ items: rows });
  } catch (e) {
    console.error("[api/faq]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Gagal memuat FAQ", items: [] },
      { status: 500 }
    );
  }
}