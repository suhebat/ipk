import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tahun = Number(searchParams.get("tahun")) || 2024;

    const provinces = await prisma.provinces.findMany({
      orderBy: { name: "asc" },
    });

    // Ambil skor sesuai tahun
    let skorRows: any[] = [];

    if (tahun >= 2024) {
      skorRows = await prisma.skor_dimensi_provinsi_2024.findMany({
        where: {
          tahun: 2024,
          // skip baris header dummy
          NOT: { kode_bps: "kode_bps" },
        },
      });
    } else {
      skorRows = await prisma.skor_dimensi_provinsi_2018_2023.findMany({
        where: {
          tahun,
          NOT: { kode_bps: "kode_bps" },
        },
      });
    }

    // Map: "11" → row skor (dari kode_bps "1100")
    const skorMap = new Map<string, any>();
    for (const s of skorRows) {
      const kodeBps = String(s.kode_bps);
      // "1100" → "11"
      const code2 = kodeBps.slice(0, 2);
      skorMap.set(code2, s);
      skorMap.set(kodeBps, s);
    }

    const data = provinces
      .filter((p) => {
        // 2018–2023: hanya provinsi yang available_before_2024
        if (tahun < 2024 && p.available_before_2024 === false) return false;
        return true;
      })
      .map((p) => {
        const code = String(p.code).padStart(2, "0");
        const s = skorMap.get(code);

        const skorRaw =
          tahun >= 2024 ? s?.skor_ipk : s?.ipk ?? s?.skor_ipk;

        return {
          kode: code,
          kodeBps: s ? String(s.kode_bps) : `${code}00`,
          nama: p.name,
          skorIpk: skorRaw != null && skorRaw !== "0" ? Number(skorRaw) : null,
          dimensi: s
            ? {
                ekonomiBudaya: Number(s.dimensi_1) || null,
                pendidikan: Number(s.dimensi_2) || null,
                ketahananSosial: Number(s.dimensi_3) || null,
                warisanBudaya: Number(s.dimensi_4) || null,
                ekspresiBudaya: Number(s.dimensi_5) || null,
                budayaLiterasi: Number(s.dimensi_6) || null,
                gender: Number(s.dimensi_7) || null,
              }
            : null,
        };
      });

    return NextResponse.json({
      ok: true,
      tahun,
      total: data.length,
      data,
    });
  } catch (error) {
    console.error("Error /api/provinsi:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal mengambil data provinsi" },
      { status: 500 }
    );
  }
}