import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const DIMENSI_META: Record<
  number,
  { nama: string; color: string; muted: string }
> = {
  1: { nama: "Ekonomi Budaya", color: "#f59e0b", muted: "#b45309" },
  2: { nama: "Pendidikan", color: "#3b82f6", muted: "#1d4ed8" },
  3: { nama: "Ketahanan Sosial", color: "#10b981", muted: "#047857" },
  4: { nama: "Warisan Budaya", color: "#8b5cf6", muted: "#6d28d9" },
  5: { nama: "Ekspresi Budaya", color: "#ec4899", muted: "#be185d" },
  6: { nama: "Budaya Literasi", color: "#06b6d4", muted: "#0e7490" },
  7: { nama: "Gender", color: "#f97316", muted: "#c2410c" },
};

function cleanName(s: string) {
  return String(s || "")
    .toLowerCase()
    .replace(/provinsi/gi, "")
    .replace(/daerah istimewa/gi, "")
    .replace(/dki/gi, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

function padBps(code: string | number) {
  return String(code).padStart(4, "0").slice(0, 4);
}

function kodeToCol(kode: string) {
  return kode.trim().toLowerCase().replace(".", "_");
}

function dimFromKode(kode: string) {
  const m = /^X(\d+)/i.exec(kode.trim());
  return m ? Number(m[1]) : 0;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tahun = Number(searchParams.get("tahun")) || 2024;
    const provinsiId = Number(searchParams.get("provinsi") || 0);

    const is2024 = tahun >= 2024;
    const metodologi = is2024
      ? "Metodologi 2024 (Baru)"
      : "Metodologi 2018 - 2023 (Lama)";

    const provinces = await prisma.provinces.findMany({
      orderBy: { id: "asc" },
    });

    // ---- skor dimensi semua provinsi (logika file lama Anda) ----
    let skorRows: any[] = [];
    if (is2024) {
      skorRows = await prisma.skor_dimensi_provinsi_2024.findMany({
        where: { tahun: 2024, NOT: { kode_bps: "kode_bps" } },
      });
    } else {
      skorRows = await prisma.skor_dimensi_provinsi_2018_2023.findMany({
        where: { tahun, NOT: { kode_bps: "kode_bps" } },
      });
    }

    const skorByName = new Map<string, any>();
    const skorByBps = new Map<string, any>();
    for (const s of skorRows) {
      const kbps = String(s.kode_bps);
      skorByBps.set(kbps, s);
      skorByName.set(cleanName(s.nama_provinsi), s);
    }

    const filteredProvinces = provinces.filter((p) => {
      if (tahun < 2024) {
        const cn = cleanName(p.name);
        if (
          cn.includes("papuabaratdaya") ||
          cn.includes("papuaselatan") ||
          cn.includes("papuatengah") ||
          cn.includes("papuapegunungan")
        ) {
          return false;
        }
      }
      return true;
    });

    function resolveSkor(p: (typeof provinces)[0], displayName: string) {
      const cn = cleanName(p.name);
      let s = skorByName.get(cleanName(displayName));
      if (!s) {
        if (cn.includes("pegunungan")) s = skorByBps.get("9700");
        else if (cn.includes("tengah") && cn.includes("papua"))
          s = skorByBps.get("9600");
        else if (cn.includes("selatan") && cn.includes("papua"))
          s = skorByBps.get("9500");
        else if (cn.includes("daya")) s = skorByBps.get("9200");
        else if (cn.includes("barat") && cn.includes("papua"))
          s = skorByBps.get("9100");
        else if (cn === "papua") s = skorByBps.get("9400");
        else s = skorByBps.get(padBps(p.code));
      }
      return s;
    }

    // Format lama (homepage / peta)
    const data = filteredProvinces.map((p) => {
      let displayName = p.name;
      const cn = cleanName(p.name);
      if (tahun < 2024 && (cn.includes("papuabaratdaya") || cn === "papuabarat")) {
        displayName = "Papua Barat";
      }

      const s = resolveSkor(p, displayName);
      const skorRaw = is2024 ? s?.skor_ipk : s?.ipk ?? s?.skor_ipk;

      return {
        id: p.id,
        kode: String(p.code).padStart(2, "0"),
        kodeBps: s ? String(s.kode_bps) : `${p.code}00`,
        nama: displayName,
        skorIpk:
          skorRaw != null && skorRaw !== "" && Number(skorRaw) !== 0
            ? Number(skorRaw)
            : null,
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

    // Base response = kompatibel file lama
    const base = {
      ok: true as const,
      tahun,
      total: data.length,
      data,
      years: [...new Set(
        is2024
          ? [2024, 2023, 2022, 2021, 2020, 2019, 2018]
          : data.length
            ? [tahun]
            : [2024, 2023, 2022, 2021, 2020, 2019, 2018]
      )].sort((a, b) => b - a),
      metodologi,
      provinces: filteredProvinces.map((p) => ({
        id: p.id,
        name: p.name,
        code: String(p.code),
        kode_bps: padBps(p.code),
      })),
    };

    // ---- tanpa ?provinsi= → cukup list (homepage aman) ----
    if (!provinsiId) {
      return NextResponse.json(base);
    }

    // ---- dengan ?provinsi= → detail untuk halaman Hasil Provinsi ----
    const prov =
      filteredProvinces.find((p) => p.id === provinsiId) ||
      filteredProvinces[0];
    if (!prov) {
      return NextResponse.json(
        { ok: false, error: "Provinsi tidak ditemukan" },
        { status: 404 }
      );
    }

    let displayName = prov.name;
    const cn = cleanName(prov.name);
    if (tahun < 2024 && (cn.includes("papuabaratdaya") || cn === "papuabarat")) {
      displayName = "Papua Barat";
    }

    const s = resolveSkor(prov, displayName);
    const kodeBps = s ? String(s.kode_bps) : padBps(prov.code);
    const skorRaw = is2024 ? s?.skor_ipk : s?.ipk ?? s?.skor_ipk;
    const skorIpk =
      skorRaw != null && skorRaw !== "" ? Number(skorRaw) : null;

    const dimensiScores = [1, 2, 3, 4, 5, 6, 7].map((i) => {
      const raw = s ? s[`dimensi_${i}`] : null;
      return {
        id: i,
        ...DIMENSI_META[i],
        nilai: raw != null && raw !== "" ? Number(raw) : null,
      };
    });

    // Ranking dari list data
    const ranked = [...data]
      .filter((d) => d.skorIpk != null)
      .sort((a, b) => (b.skorIpk ?? 0) - (a.skorIpk ?? 0))
      .map((d, idx) => ({
        rank: idx + 1,
        kode_bps: d.kodeBps,
        nama: d.nama,
        skor: d.skorIpk,
      }));

    const myRank =
      ranked.find((r) => r.kode_bps === kodeBps)?.rank ?? null;

    // Tren multi-tahun
    const yearsWanted = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
    const tren: { tahun: number; skor_ipk: number | null }[] = [];
    for (const cy of yearsWanted) {
      try {
        let row: any = null;
        if (cy >= 2024) {
          row = await prisma.skor_dimensi_provinsi_2024.findFirst({
            where: { tahun: cy, kode_bps: kodeBps },
          });
          tren.push({
            tahun: cy,
            skor_ipk: row?.skor_ipk != null ? Number(row.skor_ipk) : null,
          });
        } else {
          row = await prisma.skor_dimensi_provinsi_2018_2023.findFirst({
            where: { tahun: cy, kode_bps: kodeBps },
          });
          const v = row?.ipk ?? row?.skor_ipk;
          tren.push({
            tahun: cy,
            skor_ipk: v != null ? Number(v) : null,
          });
        }
      } catch {
        tren.push({ tahun: cy, skor_ipk: null });
      }
    }

    // Indikator
    const tableRef = is2024 ? "ref_indikator_2024" : "ref_indikator_2018";
    const tableInd = is2024
      ? "skor_indikator_provinsi_2024"
      : "skor_indikator_provinsi_2018_2023";
    const tableSumber = is2024
      ? "sumber_data_indikator_2024"
      : "sumber_data_indikator_2018";

    const ref = await prisma.$queryRawUnsafe<
      { kode: string; nama_indikator: string }[]
    >(`SELECT kode, nama_indikator FROM \`${tableRef}\` WHERE kode != 'kode'`);

    const indRows = await prisma.$queryRawUnsafe<Record<string, any>[]>(
      `SELECT * FROM \`${tableInd}\` WHERE tahun = ? AND kode_bps = ? LIMIT 1`,
      tahun,
      kodeBps
    );
    const skorInd = indRows[0] || null;

    let sumberRow: Record<string, any> | null = null;
    try {
      const src = await prisma.$queryRawUnsafe<Record<string, any>[]>(
        `SELECT * FROM \`${tableSumber}\` WHERE tahun = ? LIMIT 1`,
        tahun
      );
      sumberRow = src[0] || null;
    } catch {
      sumberRow = null;
    }

    const grouped: Record<
      number,
      {
        id: number;
        nama: string;
        color: string;
        muted: string;
        indikator: {
          kode: string;
          nama: string;
          nilai: number | null;
          sumber: string;
        }[];
      }
    > = {};

    for (const r of ref) {
      const kode = String(r.kode).trim();
      if (!kode || kode.toLowerCase() === "kode") continue;
      const dim = dimFromKode(kode);
      if (!dim || !DIMENSI_META[dim]) continue;
      if (!grouped[dim]) {
        grouped[dim] = { id: dim, ...DIMENSI_META[dim], indikator: [] };
      }
      const col = kodeToCol(kode);
      let nilai: number | null = null;
      if (skorInd && skorInd[col] != null && skorInd[col] !== "") {
        nilai = Number(skorInd[col]);
      }
      let sumber = "";
      if (sumberRow && sumberRow[col] != null) {
        const raw = String(sumberRow[col]).trim();
        if (raw && raw.toLowerCase() !== col) sumber = raw;
      }
      grouped[dim].indikator.push({
        kode,
        nama: String(r.nama_indikator || ""),
        nilai,
        sumber,
      });
    }

    for (const g of Object.values(grouped)) {
      g.indikator.sort((a, b) =>
        a.kode.localeCompare(b.kode, undefined, { numeric: true })
      );
    }

    return NextResponse.json({
      ...base,
      year: tahun,
      available: Boolean(s),
      province: {
        id: prov.id,
        name: displayName,
        code: String(prov.code),
        kode_bps: kodeBps,
      },
      skor_ipk: skorIpk,
      rank: myRank,
      total_ranked: ranked.length,
      dimensi: dimensiScores,
      grouped: Object.values(grouped).sort((a, b) => a.id - b.id),
      tren,
      ranking: ranked,
    });
  } catch (error: any) {
    console.error("Error /api/provinsi:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Gagal mengambil data provinsi" },
      { status: 500 }
    );
  }
}