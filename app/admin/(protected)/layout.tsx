import { getAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminLayoutShell from "@/components/admin/AdminLayoutShell";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  // Ambil counter notifikasi
  const [countPermohonan, countSurat, recentPermohonan, recentSurat] =
    await Promise.all([
      prisma.permohonan_data.count({ where: { status: "baru" } }),
      prisma.surat_masuk.count({ where: { status: "baru" } }),
      prisma.permohonan_data.findMany({
        where: { status: "baru" },
        take: 3,
        orderBy: { created_at: "desc" },
        select: { id: true, nomor_permohonan: true, nama_pemohon: true },
      }),
      prisma.surat_masuk.findMany({
        where: { status: "baru" },
        take: 3,
        orderBy: { created_at: "desc" },
        select: { id: true, nomor_tiket: true, perihal: true, nama_pengirim: true },
      }),
    ]);

  const recentNotif = [
    ...recentPermohonan.map((p) => ({
      id: Number(p.id),
      ref: p.nomor_permohonan,
      pengirim: p.nama_pemohon,
      tipe: "permohonan" as const,
    })),
    ...recentSurat.map((s) => ({
      id: Number(s.id),
      ref: s.nomor_tiket || s.perihal,
      pengirim: s.nama_pengirim,
      tipe: "surat" as const,
    })),
  ];

  return (
    <AdminLayoutShell
      admin={session as any}
      countPermohonan={countPermohonan}
      countSurat={countSurat}
      recentNotif={recentNotif}
    >
      {children}
    </AdminLayoutShell>
  );
}