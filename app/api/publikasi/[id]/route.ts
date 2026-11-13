import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { coverUrl, pdfUrl } from "@/lib/publikasi-path";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = Number(id);
    if (!numId || Number.isNaN(numId)) {
      return NextResponse.json(
        { status: "error", message: "ID tidak valid" },
        { status: 400 }
      );
    }

    const pub = await prisma.publications.findUnique({ where: { id: numId } });
    if (!pub) {
      return NextResponse.json(
        { status: "error", message: "Publikasi tidak ditemukan" },
        { status: 404 }
      );
    }

    const related = await prisma.publications.findMany({
      where: {
        id: { not: numId },
        ...(pub.type ? { type: pub.type } : {}),
      },
      take: 4,
      orderBy: { year: "desc" },
    });

    return NextResponse.json({
      status: "success",
      item: {
        id: pub.id,
        title: pub.title,
        year: pub.year,
        type: pub.type,
        description: pub.description,
        seo_description: pub.seo_description,
        image_path: coverUrl(pub.image_path),
        download_link: pdfUrl(pub.download_link),
        seo_keywords: pub.seo_keywords,
      },
      related: related.map((r) => ({
        id: r.id,
        title: r.title,
        year: r.year,
        type: r.type,
        image_path: coverUrl(r.image_path),
        download_link: pdfUrl(r.download_link),
      })),
    });
  } catch (e) {
    console.error("[publikasi/id]", e);
    return NextResponse.json(
      { status: "error", message: "Gagal memuat data" },
      { status: 500 }
    );
  }
}