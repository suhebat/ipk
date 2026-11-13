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

  const rows = await prisma.surat_masuk.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { created_at: "desc" },
  });

  const excelData = rows.map((r, index) => ({
    No: index + 1,
    "Nomor Tiket": r.nomor_tiket || "—",
    "Nomor Surat": r.nomor_surat || "—",
    "Tanggal Diterima": new Date(r.tanggal_diterima).toLocaleDateString("id-ID"),
    "Nama Pengirim": r.nama_pengirim,
    "Email Pengirim": r.email_pengirim,
    "No. Telepon": r.telepon_pengirim || "—",
    "Instansi Asal": r.asal_instansi || "—",
    Kategori: String(r.kategori).replace(/-/g, " "),
    "Perihal Surat": r.perihal,
    "Isi Ringkasan": r.ringkasan,
    Status: r.status.toUpperCase(),
    "Disposisi Kepada": r.disposisi_kepada || "—",
    "Catatan Tindak Lanjut": r.catatan || "—",
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Surat Masuk");

  const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  const filename = `Rekap_Surat_Masuk_Kemenbud_${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buf, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}