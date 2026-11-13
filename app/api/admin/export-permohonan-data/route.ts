import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;

  const rows = await prisma.permohonan_data.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { created_at: "desc" },
  });

  const excelData = rows.map((r, index) => ({
    No: index + 1,
    "Nomor Permohonan": r.nomor_permohonan,
    "Tanggal Permohonan": new Date(r.created_at).toLocaleDateString("id-ID"),
    "Nama Pemohon": r.nama_pemohon,
    Email: r.email,
    Telepon: r.telepon,
    "Instansi / Lembaga": r.instansi,
    "Profesi Pemohon": r.jenis_pemohon,
    "Dataset Diminta": r.jenis_data,
    "Cakupan Wilayah": String(r.wilayah).replace("-", "/"),
    "Detail Wilayah": r.detail_wilayah || "—",
    "Format Data": r.format_data.toUpperCase(),
    "Tahun Data": r.tahun_data,
    "Tujuan Penggunaan": r.tujuan,
    "Rincian Permintaan": r.detail_permintaan,
    Status: r.status.toUpperCase(),
    "Tanggapan / Catatan Admin": r.catatan_admin || "—",
    "Diproses Pada": r.diproses_pada ? new Date(r.diproses_pada).toLocaleDateString("id-ID") : "—",
    "Selesai Pada": r.selesai_pada ? new Date(r.selesai_pada).toLocaleDateString("id-ID") : "—",
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Permohonan Data");

  const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  const filename = `Rekap_Permohonan_Data_IPK_${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buf, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}