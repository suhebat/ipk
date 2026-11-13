import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (
    !session ||
    (session.role !== "superadmin" &&
      session.role !== "admin" &&
      session.role !== "data_verifikator")
  ) {
    return NextResponse.json({ error: "Hanya Verifikator yang berhak" }, { status: 403 });
  }

  const { pengajuan_id, aksi } = await req.json();
  const idBig = BigInt(pengajuan_id);

  const pengajuan = await prisma.data_pengajuan.findUnique({
    where: { id: idBig },
    include: { detail_nasional: true },
  });

  if (!pengajuan) {
    return NextResponse.json({ error: "Pengajuan tidak ditemukan" }, { status: 404 });
  }

  if (aksi === "publish") {
    await prisma.$transaction(async (tx) => {
      // 1. Update status pengajuan
      await tx.data_pengajuan.update({
        where: { id: idBig },
        data: {
          status: "published",
          published_at: new Date(),
          diverifikasi_oleh: Number(session.id),
        },
      });

      // 2. SINKRONKAN KE TABEL PUBLIK (Hanya saat publish!)
      if (pengajuan.jenis === "nasional" && pengajuan.detail_nasional) {
        const dimensi = pengajuan.detail_nasional.skor_dimensi as Record<string, number>;
        await tx.ipk_nasional_tahunan.upsert({
          where: { tahun: pengajuan.tahun },
          update: {
            skor_ipk: pengajuan.detail_nasional.skor_ipk,
            dimensi_1: dimensi.d1,
            dimensi_2: dimensi.d2,
            dimensi_3: dimensi.d3,
            dimensi_4: dimensi.d4,
            dimensi_5: dimensi.d5,
            dimensi_6: dimensi.d6,
            dimensi_7: dimensi.d7,
          },
          create: {
            tahun: pengajuan.tahun,
            skor_ipk: pengajuan.detail_nasional.skor_ipk,
            dimensi_1: dimensi.d1,
            dimensi_2: dimensi.d2,
            dimensi_3: dimensi.d3,
            dimensi_4: dimensi.d4,
            dimensi_5: dimensi.d5,
            dimensi_6: dimensi.d6,
            dimensi_7: dimensi.d7,
          },
        });
      }
    });

    return NextResponse.json({ success: true, message: "Data resmi dipublish ke web publik!" });
  }

  if (aksi === "reject") {
    await prisma.data_pengajuan.update({
      where: { id: idBig },
      data: { status: "rejected", rejected_at: new Date() },
    });
    return NextResponse.json({ success: true, message: "Data ditolak dan dikembalikan ke draft" });
  }

  return NextResponse.json({ error: "Aksi tidak dikenal" }, { status: 400 });
}