import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      latestNas,
      totalPublications,
      totalRequests,
      newRequests,
      totalLetters,
      newLetters,
      totalDownloads,
      logs,
    ] = await Promise.all([
      prisma.ipk_nasional_tahunan.findFirst({
        where: { tahun: { not: 0 } },
        orderBy: { tahun: "desc" },
      }),
      prisma.publications.count(),
      prisma.permohonan_data.count(),
      prisma.permohonan_data.count({ where: { status: "baru" } }),
      prisma.surat_masuk.count(),
      prisma.surat_masuk.count({ where: { status: "baru" } }),
      prisma.download_survey.count(),
      prisma.log_aktivitas.findMany({
        take: 15,
        orderBy: { created_at: "desc" },
        include: {
          admins: { select: { nama: true, username: true, role: true } },
        },
      }),
    ]);

    return NextResponse.json({
      welcomeName: session.nama || session.username,
      role: session.role,
      latestYear: latestNas?.tahun ?? null,
      scoreCurrent:
        latestNas?.skor_ipk != null ? Number(latestNas.skor_ipk) : null,
      totalPublications,
      totalRequests,
      newRequests,
      totalLetters,
      newLetters,
      totalDownloads,
      logs: logs.map((l) => ({
        id: l.id,
        aktivitas: l.aktivitas,
        nama_file: l.nama_file,
        created_at: l.created_at,
        nama_admin: l.admins?.nama || l.admins?.username || "—",
        role: l.admins?.role || "admin",
      })),
    });
  } catch (e: unknown) {
    console.error("[admin/dashboard]", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}