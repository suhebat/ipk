import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTurnstile } from "@/lib/turnstile";
import type {
  permohonan_data_jenis_pemohon,
  permohonan_data_wilayah,
  permohonan_data_format_data,
} from "@prisma/client";

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // 1. Verifikasi Turnstile sebelum menyentuh database
    const turnstileToken = String(form.get("turnstileToken") || "").trim();
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;

    let human = false;
    try {
      human = await verifyTurnstile(turnstileToken, ip);
    } catch (err) {
      console.error("[permohonan][turnstile]", err);
      return NextResponse.json(
        {
          status: "error",
          message:
            "Layanan verifikasi sedang bermasalah. Coba lagi beberapa saat.",
        },
        { status: 503 }
      );
    }

    if (!human) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Verifikasi keamanan gagal atau sudah kedaluwarsa. Silakan coba lagi.",
        },
        { status: 400 }
      );
    }

    // 2. Ambil dan normalisasi field
    const nama_pemohon = String(form.get("nama_pemohon") || "").trim();
    const email = String(form.get("email") || "").trim();
    const telepon = String(form.get("telepon") || "").trim();
    const instansi = String(form.get("instansi") || "").trim();
    const jabatan = String(form.get("jabatan") || "").trim() || null;
    const jenis_pemohon = String(form.get("jenis_pemohon") || "").trim();
    const jenis_data = String(form.get("jenis_data") || "").trim();
    const wilayahRaw = String(form.get("wilayah") || "").trim();
    const detail_wilayah =
      String(form.get("detail_wilayah") || "").trim() || null;
    const format_data = String(form.get("format_data") || "").trim();
    const tujuan = String(form.get("tujuan") || "").trim();
    const detail_permintaan = String(
      form.get("detail_permintaan") || ""
    ).trim();
    const referensi = String(form.get("referensi") || "").trim() || null;

    const tahunList = form
      .getAll("tahun[]")
      .map(String)
      .filter(Boolean)
      .join(", ");

    if (
      !nama_pemohon ||
      !email ||
      !telepon ||
      !instansi ||
      !jenis_pemohon ||
      !jenis_data ||
      !wilayahRaw ||
      !format_data ||
      !tahunList ||
      !tujuan ||
      !detail_permintaan
    ) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Mohon lengkapi semua kolom wajib dan pilih minimal 1 tahun data.",
        },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json(
        { status: "error", message: "Format email tidak valid." },
        { status: 400 }
      );
    }

    if (detail_permintaan.length > 1000) {
      return NextResponse.json(
        { status: "error", message: "Uraian kebutuhan data maksimal 1000 karakter." },
        { status: 400 }
      );
    }

    const wilayahMap: Record<string, permohonan_data_wilayah> = {
      nasional: "nasional",
      provinsi: "provinsi",
      "kab-kota": "kab_kota",
      kab_kota: "kab_kota",
    };
    const wilayah = wilayahMap[wilayahRaw];
    if (!wilayah) {
      return NextResponse.json(
        { status: "error", message: "Nilai wilayah tidak valid." },
        { status: 400 }
      );
    }

    const nomor_permohonan =
      "REQ-IPK-" +
      new Date().toISOString().slice(0, 10).replace(/-/g, "") +
      "-" +
      String(Math.floor(Math.random() * 9999)).padStart(4, "0");

    const now = new Date();
    const tanggal_permohonan = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // 3. Simpan (turnstileToken tidak ikut disimpan)
    await prisma.permohonan_data.create({
      data: {
        nomor_permohonan,
        tanggal_permohonan,
        nama_pemohon,
        email,
        telepon,
        instansi,
        jabatan,
        jenis_pemohon: jenis_pemohon as permohonan_data_jenis_pemohon,
        jenis_data,
        wilayah,
        detail_wilayah,
        format_data: format_data as permohonan_data_format_data,
        tahun_data: tahunList,
        tujuan,
        detail_permintaan,
        referensi,
        lampiran: null,
        status: "baru",
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Permohonan berhasil dikirim.",
      nomor_permohonan,
    });
  } catch (e) {
    console.error("[permohonan-data]", e);
    return NextResponse.json(
      { status: "error", message: "Gagal menyimpan data ke database." },
      { status: 500 }
    );
  }
}