import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

/** Hanya nilai yang boleh masuk kolom jenis_unduh (NOT NULL di MySQL) */
function normalizeJenisUnduh(raw: unknown): "pdf" | "xlsx" | "csv" | "excel" | "pending" {
  const v = String(raw ?? "")
    .trim()
    .toLowerCase();

  if (v === "pdf") return "pdf";
  if (v === "csv") return "csv";
  if (v === "xlsx" || v === "xls" || v === "excel") return "excel";
  // placeholder jika format belum dipilih (jangan null — kolom NOT NULL)
  if (v === "pending" || v === "survei-metodologi" || v === "") return "pending";
  // fallback aman
  return "pending";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const headersList = await headers();

    const {
      nama,
      email,
      bidang,
      tujuan,
      tujuan_lain,
      halaman = "dataset",
      jenis, // jangan default di destructure — null akan menimpa default
      dataset,
      period,
      tahun,
      provinsi,
    } = body;

    if (!nama?.trim() || !email?.trim() || !bidang?.trim() || !tujuan?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Semua field bertanda bintang wajib diisi." },
        { status: 400 }
      );
    }

    const forwardedFor = headersList.get("x-forwarded-for");
    const ip_address = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : "127.0.0.1";
    const user_agent = headersList.get("user-agent") || undefined;

    const finalTujuan =
      tujuan === "Lainnya" && tujuan_lain?.trim()
        ? `Lainnya: ${tujuan_lain.trim()}`
        : tujuan;

    let finalTahun: number | null = null;
    if (tahun && !isNaN(Number(tahun))) {
      finalTahun = Number(tahun);
    } else if (period && /^\d{4}$/.test(String(period))) {
      finalTahun = parseInt(String(period), 10);
    }

    const finalProvinsi =
      provinsi || (dataset ? `Dataset: ${dataset}` : null);

    // WAJIB string valid — kolom jenis_unduh NOT NULL
    const jenis_unduh = normalizeJenisUnduh(jenis);

    const newRecord = await prisma.download_survey.create({
      data: {
        nama: nama.trim(),
        email: email.trim(),
        bidang_pekerjaan: bidang,
        tujuan_unduh: finalTujuan,
        jenis_unduh,
        halaman: (halaman && String(halaman).trim()) || "dataset",
        tahun: finalTahun,
        provinsi: finalProvinsi,
        ip_address,
        user_agent: user_agent ? user_agent.substring(0, 255) : null,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Survey unduhan berhasil disimpan.",
      id: newRecord.id,
    });
  } catch (error) {
    console.error("Gagal menyimpan survey unduh:", error);
    return NextResponse.json(
      { ok: false, error: "Terjadi kesalahan internal pada database." },
      { status: 500 }
    );
  }
}
