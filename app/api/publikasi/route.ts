import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { coverUrl, pdfUrl } from "@/lib/publikasi-path";

export async function GET() {
  try {
    const rows = await prisma.publications.findMany({
      orderBy: { year: "desc" },
    });

    const data = rows.map((row) => ({
      id: row.id,
      judul: row.title,
      tahun: row.year,
      kategori: row.type || "Publikasi",
      deskripsi: row.description || "",
      cover: coverUrl(row.image_path),
      fileUrl: pdfUrl(row.download_link),
    }));

    return NextResponse.json({ status: "success", data });
  } catch (e) {
    console.error("[publikasi]", e);
    return NextResponse.json(
      { status: "error", message: "Gagal memuat publikasi" },
      { status: 500 }
    );
  }
}