import { NextResponse } from "next/server";
import { getDasarHukumDocuments } from "@/lib/dasar-hukum";

export const revalidate = 60;

/** GET /api/dasar-hukum — daftar dokumen aktif */
export async function GET() {
  try {
    const data = await getDasarHukumDocuments();
    return NextResponse.json({ data });
  } catch (err) {
    console.error("[api/dasar-hukum]", err);
    return NextResponse.json(
      { error: "Gagal memuat data dasar hukum", data: [] },
      { status: 500 }
    );
  }
}
