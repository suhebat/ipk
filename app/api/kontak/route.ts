import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTurnstile } from "@/lib/turnstile";
import type { surat_masuk_kategori } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Verifikasi Turnstile sebelum menyentuh database
    const turnstileToken = String(body.turnstileToken || "").trim();
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;

    let human = false;
    try {
      human = await verifyTurnstile(turnstileToken, ip);
    } catch (err) {
      console.error("[kontak][turnstile]", err);
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

    // 2. Validasi dan normalisasi field di server
    const nama = String(body.nama || "").trim();
    const email = String(body.email || "").trim();
    const telepon = String(body.telepon || "").trim() || null;
    const instansi = String(body.instansi || "").trim() || "Umum";
    const kategoriRaw = String(body.kategori || "lainnya").trim();
    const subjek = String(body.subjek || "").trim();
    const pesan = String(body.pesan || "").trim();

    if (!nama || !email || !subjek || !pesan) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Mohon lengkapi semua kolom wajib (Nama, Email, Subjek, dan Pesan).",
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

    if (subjek.length > 150 || pesan.length > 1500) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Subjek maksimal 150 karakter dan pesan maksimal 1500 karakter.",
        },
        { status: 400 }
      );
    }

    const kategoriMap: Record<string, surat_masuk_kategori> = {
      data: "data",
      metodologi: "metodologi",
      publikasi: "publikasi",
      "permohonan-data": "permohonan_data",
      permohonan_data: "permohonan_data",
      website: "website",
      lainnya: "lainnya",
      umum: "lainnya",
    };
    const kategori = kategoriMap[kategoriRaw] ?? "lainnya";

    const nomor_tiket =
      "IPK-" +
      new Date().getFullYear() +
      "-" +
      String(Math.floor(Math.random() * 999999)).padStart(6, "0");

    const now = new Date();
    const tanggal_diterima = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // 3. Simpan (turnstileToken tidak ikut disimpan)
    await prisma.surat_masuk.create({
      data: {
        nomor_tiket,
        tanggal_diterima,
        nama_pengirim: nama,
        email_pengirim: email,
        telepon_pengirim: telepon,
        asal_instansi: instansi,
        kategori,
        perihal: subjek,
        ringkasan: pesan,
        status: "baru",
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Pesan Anda berhasil dikirim dan akan segera ditindaklanjuti.",
      nomor_tiket,
    });
  } catch (e) {
    console.error("[kontak]", e);
    return NextResponse.json(
      { status: "error", message: "Gagal menyimpan pesan ke database." },
      { status: 500 }
    );
  }
}