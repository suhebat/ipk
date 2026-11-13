import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rows = await prisma.metadata_indikator.findMany({
      where: {
        OR: [{ is_active: true }, { is_active: null }],
      },
      orderBy: [{ urutan: "asc" }, { id: "asc" }],
    });

    const data = rows.map((r) => ({
      id: r.id,
      kode_indikator: r.kode_indikator,
      dimensi: r.dimensi,
      nama_indikator: r.nama_indikator,
      konsep_definisi: r.konsep_definisi,
      interpretasi: r.interpretasi,
      contoh_interpretasi: r.contoh_interpretasi,
      rumus_perhitungan: r.rumus_perhitungan,
      rumus_pembilang: r.rumus_pembilang,
      rumus_penyebut: r.rumus_penyebut,
      variabel_pembangun: r.variabel_pembangun,
      kegiatan_penghasil: r.kegiatan_penghasil,
      ukuran_satuan: r.ukuran_satuan,
      waktu_ketersediaan: r.waktu_ketersediaan,
      level_estimasi: r.level_estimasi,
      dapat_diakses_umum: r.dapat_diakses_umum,
      publikasi_terkait: r.publikasi_terkait,
      urutan: r.urutan,
    }));

    return NextResponse.json({ ok: true, data });
  } catch (e) {
    console.error("[api/metadata-indikator]", e);
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "Gagal memuat metadata",
        data: [],
      },
      { status: 500 }
    );
  }
}