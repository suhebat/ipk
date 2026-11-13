import { getAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

// Import view komponen per role
import DashboardPengelolaKonten from "./components/DashboardPengelolaKonten";
import DashboardPengelolaData from "./components/DashboardPengelolaData";
import DashboardPengelolaLayanan from "./components/DashboardPengelolaLayanan";
import DashboardVerifikator from "./components/DashboardVerifikator";
import DashboardSuperAdmin from "./components/DashboardSuperAdmin";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  // 1. Jika Pengelola Konten (content_admin)
  if (session.role === "content_admin") {
    const [pubCount, faqCount, dasarHukumCount, latestPub] = await Promise.all([
      prisma.publications.count(),
      prisma.faqs.count(),
      prisma.dasar_hukum.count(),
      prisma.publications.findMany({
        take: 5,
        orderBy: [{ year: "desc" }, { id: "desc" }],
      }),
    ]);

    return (
      <DashboardPengelolaKonten
        admin={session}
        pubCount={pubCount}
        faqCount={faqCount}
        dasarHukumCount={dasarHukumCount}
        latestPub={latestPub}
      />
    );
  }

  // 2. Jika Pengelola Data (data_admin)
  if (session.role === "data_admin") {
    const [skorNasional, totalProvinsi, provTersedia] = await Promise.all([
      prisma.ipk_nasional_tahunan.findFirst({
        where: { tahun: 2024 },
      }),
      prisma.provinces.count(),
      // KUNCI PERBAIKAN: Hitung hanya 38 provinsi (kecualikan baris agregat nasional)
      prisma.skor_dimensi_provinsi_2024.count({
        where: {
          tahun: 2024,
          kode_bps: { notIn: ["0000", "00"] },
          nama_provinsi: { not: "INDONESIA" },
        },
      }),
    ]);

    return (
      <DashboardPengelolaData
        admin={session}
        skorNasional={skorNasional ? Number(skorNasional.skor_ipk) : null}
        totalProvinsi={totalProvinsi}
        provTersedia={provTersedia}
      />
    );
  }

  // 3. Jika Pengelola Layanan (service_admin)
  if (session.role === "service_admin") {
    const [permohonanBaru, suratBaru, totalUnduhan, recentPermohonan, recentSurat] =
      await Promise.all([
        prisma.permohonan_data.count({ where: { status: "baru" } }),
        prisma.surat_masuk.count({ where: { status: "baru" } }),
        prisma.download_survey.count(),
        prisma.permohonan_data.findMany({
          take: 5,
          orderBy: { created_at: "desc" },
        }),
        prisma.surat_masuk.findMany({
          take: 5,
          orderBy: { created_at: "desc" },
        }),
      ]);

    return (
      <DashboardPengelolaLayanan
        admin={session}
        permohonanBaru={permohonanBaru}
        suratBaru={suratBaru}
        totalUnduhan={totalUnduhan}
        recentPermohonan={recentPermohonan}
        recentSurat={recentSurat}
      />
    );
  }

  // 4. Jika Verifikator Data (data_verifikator)
  if (session.role === "data_verifikator") {
    const [antreanPengajuan, publishedCount] = await Promise.all([
      prisma.data_pengajuan.count({ where: { status: "submitted" } }),
      prisma.data_pengajuan.count({ where: { status: "published" } }),
    ]);

    return (
      <DashboardVerifikator
        admin={session}
        antreanCount={antreanPengajuan}
        publishedCount={publishedCount}
      />
    );
  }

  // 5. Default: Super Admin & Administrator (Ringkasan Komprehensif)
  const [
    adminCount,
    permohonanCount,
    suratCount,
    pubCount,
    skorNasional,
  ] = await Promise.all([
    prisma.admins.count(),
    prisma.permohonan_data.count({ where: { status: "baru" } }),
    prisma.surat_masuk.count({ where: { status: "baru" } }),
    prisma.publications.count(),
    prisma.ipk_nasional_tahunan.findFirst({ where: { tahun: 2024 } }),
  ]);

  return (
    <DashboardSuperAdmin
      admin={session}
      adminCount={adminCount}
      permohonanBaru={permohonanCount}
      suratBaru={suratCount}
      pubCount={pubCount}
      skorNasional={skorNasional ? Number(skorNasional.skor_ipk) : null}
    />
  );
}