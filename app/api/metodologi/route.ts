import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DIM_META = [
  { id: 1, number: "01", color: "#f59e0b", muted: "#b45309" },
  { id: 2, number: "02", color: "#3b82f6", muted: "#1d4ed8" },
  { id: 3, number: "03", color: "#10b981", muted: "#047857" },
  { id: 4, number: "04", color: "#8b5cf6", muted: "#6d28d9" },
  { id: 5, number: "05", color: "#ec4899", muted: "#be185d" },
  { id: 6, number: "06", color: "#06b6d4", muted: "#0e7490" },
  { id: 7, number: "07", color: "#f97316", muted: "#c2410c" },
] as const;

/** X1.1 → IPK-EKO-01 (ref_indikator ≠ metadata_indikator) */
const KODE_TO_META: Record<string, string> = {
  "X1.1": "IPK-EKO-01",
  "X1.2": "IPK-EKO-02",
  "X2.1": "IPK-PEN-01",
  "X2.2": "IPK-PEN-02",
  "X2.3": "IPK-PEN-03",
  "X3.1": "IPK-KSB-01",
  "X3.2": "IPK-KSB-02",
  "X3.3": "IPK-KSB-03",
  "X4.1": "IPK-WAR-01",
  "X4.2": "IPK-WAR-02",
  "X4.3": "IPK-WAR-03",
  "X4.4": "IPK-WAR-04",
  "X4.5": "IPK-WAR-05",
  "X4.6": "IPK-WAR-06",
  "X5.1": "IPK-EKS-01",
  "X5.2": "IPK-EKS-02",
  "X5.3": "IPK-EKS-03",
  "X5.4": "IPK-EKS-04",
  "X6.1": "IPK-LIT-01",
  "X6.2": "IPK-LIT-02",
  "X6.3": "IPK-LIT-03",
  "X7.1": "IPK-GEN-01",
  "X7.2": "IPK-GEN-02",
  "X7.3": "IPK-GEN-03",
};

function refToMetaKode(kode: string): string | null {
  return KODE_TO_META[kode.trim().toUpperCase()] ?? null;
}

function normalizeKode(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw.toString().trim().toUpperCase().replace(/_/g, ".");
}

function dimIdFromKode(kode: string): number | null {
  const n = normalizeKode(kode);
  const m = n.match(/^X?(\d+)/i);
  if (!m) return null;
  const id = parseInt(m[1], 10);
  return id >= 1 && id <= 7 ? id : null;
}

function toNum(v: unknown): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

type MetaRow = Awaited<
  ReturnType<typeof prisma.metadata_indikator.findMany>
>[number];

function mapMeta(m: MetaRow | null) {
  if (!m) return null;
  return {
    konsep: m.konsep_definisi || "",
    interpretasi: m.interpretasi || "",
    contoh: m.contoh_interpretasi || "",
    variabel: m.variabel_pembangun || "",
    rumus: m.rumus_perhitungan || "",
    rumus_pembilang: m.rumus_pembilang || "",
    rumus_penyebut: m.rumus_penyebut || "",
    kegiatan: m.kegiatan_penghasil || "",
    satuan: m.ukuran_satuan || "",
    waktu: m.waktu_ketersediaan || "",
    level: m.level_estimasi || "",
    akses: m.dapat_diakses_umum || "",
    publikasi: m.publikasi_terkait || "",
  };
}

async function latestSumber(
  table: "sumber_data_indikator_2024" | "sumber_data_indikator_2018"
) {
  if (table === "sumber_data_indikator_2024") {
    const rows = await prisma.sumber_data_indikator_2024.findMany({
      orderBy: { tahun: "desc" },
      take: 1,
    });
    return (rows[0] as Record<string, unknown> | undefined) ?? null;
  }
  const rows = await prisma.sumber_data_indikator_2018.findMany({
    orderBy: { tahun: "desc" },
    take: 1,
  });
  return (rows[0] as Record<string, unknown> | undefined) ?? null;
}

function sumberForKode(
  sumber: Record<string, unknown> | null,
  kode: string
): string {
  if (!sumber) return "";
  // X1.1 → x1_1
  const key = normalizeKode(kode).toLowerCase().replace(/\./g, "_");
  const val = sumber[key];
  return val != null ? String(val) : "";
}

export async function GET() {
  try {
    const [dims, refs2024, refs2018, metaRows, sumber2024, sumber2018] =
      await Promise.all([
        prisma.dimensions.findMany({
          include: { dimension_methodologies: true },
          orderBy: { id: "asc" },
        }),
        prisma.ref_indikator_2024.findMany(),
        prisma.ref_indikator_2018.findMany(),
        prisma.metadata_indikator.findMany({
          where: { OR: [{ is_active: true }, { is_active: null }] },
        }),
        latestSumber("sumber_data_indikator_2024"),
        latestSumber("sumber_data_indikator_2018"),
      ]);

    const metaByKode = new Map<string, MetaRow>();
    for (const r of metaRows) {
      if (r.kode_indikator) {
        metaByKode.set(r.kode_indikator.trim().toUpperCase(), r);
      }
    }

    const definisiFor = (dimId: number, yearStart: number) => {
      const dim = dims.find((d) => d.id === dimId);
      if (!dim) return "";
      const m = dim.dimension_methodologies.find(
        (x) => x.year_start === yearStart
      );
      return m?.definisi_operasional || "";
    };

    const namaDim = (dimId: number) => {
      const dim = dims.find((d) => d.id === dimId);
      return dim?.name || `Dimensi ${dimId}`;
    };

    const build = (
      refs: {
        kode: string;
        nama_indikator: string;
        nilai_minimum: unknown;
        nilai_maximum: unknown;
      }[],
      sumber: Record<string, unknown> | null,
      yearStart: number
    ) => {
      const groups: Record<
        number,
        {
          kode: string;
          nama_indikator: string;
          nilai_minimum: unknown;
          nilai_maximum: unknown;
        }[]
      > = {};

      for (const r of refs) {
        const id = dimIdFromKode(r.kode);
        if (!id) continue;
        if (!groups[id]) groups[id] = [];
        groups[id].push(r);
      }

      return DIM_META.map((dm) => {
        const list = groups[dm.id] || [];
        list.sort((a, b) =>
          normalizeKode(a.kode).localeCompare(normalizeKode(b.kode), "en", {
            numeric: true,
          })
        );

        return {
          id: dm.id,
          number: dm.number,
          nama: namaDim(dm.id),
          color: dm.color,
          muted: dm.muted,
          definisi: definisiFor(dm.id, yearStart),
          indikator: list.map((ind) => {
            const metaKey = refToMetaKode(ind.kode);
            const meta = metaKey ? metaByKode.get(metaKey) ?? null : null;

            return {
              kode: ind.kode,
              nama: ind.nama_indikator,
              min: toNum(ind.nilai_minimum),
              max: toNum(ind.nilai_maximum),
              sumber: sumberForKode(sumber, ind.kode),
              meta: mapMeta(meta),
            };
          }),
        };
      });
    };

    const m2024 = build(refs2024, sumber2024, 2024);
    const m2018 = build(refs2018, sumber2018, 2018);

    return NextResponse.json({ m2024, m2018 });
  } catch (e) {
    console.error("[api/metodologi]", e);
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "Gagal memuat metodologi",
        m2024: [],
        m2018: [],
      },
      { status: 500 }
    );
  }
}