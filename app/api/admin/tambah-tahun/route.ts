import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session || (session.role !== "superadmin" && session.role !== "admin" && session.role !== "data_admin")) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { tahun, tipe } = await req.json();
  const yearNum = Number(tahun);

  // Kunci minimal tahun 2025
  if (!yearNum || yearNum < 2025) {
    return NextResponse.json(
      { error: "Tahun baru dikunci minimal mulai dari tahun 2025." },
      { status: 400 }
    );
  }

  try {
    // Simpan ke tabel data_pengajuan (status: draft), TIDAK LANGSUNG KE TABEL PUBLIK!
    await prisma.data_pengajuan.upsert({
      where: {
        id: BigInt(yearNum), // atau cari berdasarkan jenis & tahun
      },
      update: {
        status: "draft",
      },
      create: {
        id: BigInt(yearNum),
        jenis: tipe === "provinsi" ? "provinsi" : "nasional",
        tahun: yearNum,
        status: "draft",
        dibuat_oleh: Number(session.id),
      },
    });

    return NextResponse.json({ success: true, tahun: yearNum });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Gagal menambah tahun" }, { status: 500 });
  }
}