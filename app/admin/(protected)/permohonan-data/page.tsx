import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  FileText,
  Eye,
  X,
  User,
  Building,
  Calendar,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Download,
} from "lucide-react";
import { getAdminSession } from "@/lib/admin-auth";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { requirePermission } from "@/lib/permissions";
import QuickTemplateTextarea from "@/components/admin/QuickTemplateTextarea";

export const dynamic = "force-dynamic";

const STATUSES = ["baru", "diproses", "selesai", "ditolak"] as const;

const TEMPLATES_PERMOHONAN = [
  {
    label: "✅ Disetujui (Lampirkan Link)",
    text: "Yth. Pemohon, permohonan data Anda telah kami setujui. Dataset Indeks Pembangunan Kebudayaan (IPK) yang diminta dapat diunduh melalui tautan berikut: [MASUKKAN_LINK_UNDUHAN]. Mohon untuk mencantumkan Kementerian Kebudayaan RI sebagai sumber rujukan dalam publikasi/kajian Anda. Terima kasih.",
  },
  {
    label: "⏳ Sedang Diproses Internal",
    text: "Yth. Pemohon, berkas dan rincian permohonan data Anda telah kami terima dan saat ini sedang dalam proses ekstraksi serta verifikasi oleh tim teknis pengelola data IPK. Kami akan mengabarkan kembali segera setelah data siap.",
  },
  {
    label: "❌ Ditolak (Data Belum Rilis)",
    text: "Yth. Pemohon, mohon maaf permohonan data Anda belum dapat kami penuhi karena dataset untuk tahun/indikator yang diminta saat ini masih dalam tahap pengolahan internal dan belum dirilis secara resmi untuk publik.",
  },
  {
    label: "❌ Ditolak (Syarat Belum Lengkap)",
    text: "Yth. Pemohon, permohonan data belum dapat kami tindak lanjuti karena kelengkapan administrasi (Surat Pengantar Instansi / Lembar Pernyataan Penggunaan Data) belum sesuai. Silakan mengajukan kembali permohonan dengan melampirkan berkas yang dipersyaratkan.",
  },
];

async function updateStatus(formData: FormData) {
  "use server";
  const session = await getAdminSession();
  if (
    session?.role !== "superadmin" &&
    session?.role !== "admin" &&
    session?.role !== "service_admin"
  ) {
    return;
  }

  const id = BigInt(String(formData.get("id") || "0"));
  const status = String(formData.get("status") || "") as (typeof STATUSES)[number];
  const catatan_admin =
    String(formData.get("catatan_admin") || "").trim() || undefined;

  if (!id || !STATUSES.includes(status)) return;

  const data: {
    status: (typeof STATUSES)[number];
    catatan_admin?: string;
    diproses_pada?: Date;
    selesai_pada?: Date;
  } = {
    status,
    ...(catatan_admin !== undefined ? { catatan_admin } : {}),
  };

  if (status === "diproses") data.diproses_pada = new Date();
  if (status === "selesai" || status === "ditolak") data.selesai_pada = new Date();

  await prisma.permohonan_data.update({ where: { id }, data });

  revalidatePath("/admin/permohonan-data");
  revalidatePath("/admin/dashboard");
  redirect("/admin/permohonan-data");
}

async function deletePermohonan(formData: FormData) {
  "use server";
  const session = await getAdminSession();
  if (session?.role !== "superadmin") return;
  const id = BigInt(String(formData.get("id") || "0"));
  if (!id) return;
  await prisma.permohonan_data.delete({ where: { id } });
  revalidatePath("/admin/permohonan-data");
  revalidatePath("/admin/dashboard");
  redirect("/admin/permohonan-data");
}

function statusClass(s: string) {
  switch (s) {
    case "baru":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300";
    case "diproses":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300";
    case "selesai":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300";
    case "ditolak":
      return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-300";
    default:
      return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800";
  }
}

export default async function AdminPermohonanDataPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; baca?: string }>;
}) {
  const session = await requirePermission("menu.permohonan");
  const isSuper = session?.role === "superadmin";
  const canProcess =
    isSuper || session?.role === "admin" || session?.role === "service_admin";

  const sp = await searchParams;
  const filter =
    sp.status && STATUSES.includes(sp.status as any) ? sp.status : undefined;
  const readId = sp.baca ? BigInt(sp.baca) : null;

  const [rows, counts, readingItem] = await Promise.all([
    prisma.permohonan_data.findMany({
      where: filter ? { status: filter as any } : undefined,
      orderBy: { created_at: "desc" },
      take: 100,
    }),
    prisma.permohonan_data.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    readId ? prisma.permohonan_data.findUnique({ where: { id: readId } }) : null,
  ]);

  const countMap = Object.fromEntries(
    counts.map((c) => [c.status, c._count._all])
  );
  const total = Object.values(countMap).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <FileText size={22} className="text-[#b8860b]" />
            Permohonan Data Publik
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {canProcess
              ? "Klik baris permohonan untuk membaca detail permintaan data, tujuan riset, dan mengirim tanggapan."
              : "Mode hanya lihat (Read-Only)."}
          </p>
        </div>
        {!canProcess && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            <Eye size={12} /> Read-Only
          </span>
        )}
      </div>

      {/* Baris Filter Tabs & Tombol Download Rekap XLS */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/permohonan-data"
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
              !filter
                ? "bg-[#b8860b] text-white border-[#b8860b]"
                : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            Semua ({total})
          </Link>
          {STATUSES.map((s) => (
            <Link
              key={s}
              href={`/admin/permohonan-data?status=${s}`}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border capitalize transition ${
                filter === s
                  ? "bg-[#b8860b] text-white border-[#b8860b]"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {s} ({countMap[s] ?? 0})
            </Link>
          ))}
        </div>

        {/* Tombol Download Rekap XLS */}
        <a
          href={`/api/admin/export-permohonan-data${filter ? `?status=${filter}` : ""}`}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition shadow-sm cursor-pointer"
        >
          <Download size={14} /> Download Rekap XLS
        </a>
      </div>

      {/* Tabel Permohonan Data */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">No. Tiket</th>
                <th className="px-4 py-3">Pemohon</th>
                <th className="px-4 py-3">Jenis Data & Wilayah</th>
                <th className="px-4 py-3">Tujuan Permintaan</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3">Masuk</th>
                {isSuper && <th className="px-4 py-3 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={isSuper ? 7 : 6}
                    className="py-10 text-center text-zinc-400"
                  >
                    Tidak ada permohonan{filter ? ` berstatus “${filter}”` : ""}.
                  </td>
                </tr>
              ) : (
                rows.map((r) => {
                  const isNew = r.status === "baru";
                  return (
                    <tr
                      key={String(r.id)}
                      className={`hover:bg-amber-500/5 transition cursor-pointer ${
                        isNew ? "bg-amber-500/[0.03] font-semibold" : "opacity-90"
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/admin/permohonan-data?${filter ? `status=${filter}&` : ""}baca=${r.id}`}
                          className="block"
                        >
                          <div className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">
                            {r.nomor_permohonan}
                          </div>
                          <div className="text-[11px] text-zinc-400 font-normal">
                            Format: {r.format_data.toUpperCase()} · Thn {r.tahun_data}
                          </div>
                        </Link>
                      </td>

                      <td className="px-4 py-3.5">
                        <Link
                          href={`/admin/permohonan-data?${filter ? `status=${filter}&` : ""}baca=${r.id}`}
                          className="block"
                        >
                          <div className="text-zinc-900 dark:text-zinc-100">
                            {r.nama_pemohon}
                          </div>
                          <div className="text-[11px] text-zinc-500 font-normal">
                            {r.email}
                          </div>
                          <div className="text-[11px] text-zinc-400 font-normal">
                            {r.instansi}
                          </div>
                        </Link>
                      </td>

                      <td className="px-4 py-3.5">
                        <Link
                          href={`/admin/permohonan-data?${filter ? `status=${filter}&` : ""}baca=${r.id}`}
                          className="block"
                        >
                          <div className="text-zinc-900 dark:text-zinc-100">
                            {r.jenis_data}
                          </div>
                          <div className="text-[11px] text-zinc-500 font-normal capitalize">
                            Wilayah: {String(r.wilayah).replace("-", "/")}
                            {r.detail_wilayah ? ` (${r.detail_wilayah})` : ""}
                          </div>
                        </Link>
                      </td>

                      <td className="px-4 py-3.5 max-w-[200px]">
                        <Link
                          href={`/admin/permohonan-data?${filter ? `status=${filter}&` : ""}baca=${r.id}`}
                          className="block"
                        >
                          <div className="text-zinc-900 dark:text-zinc-100 truncate">
                            {r.tujuan}
                          </div>
                          <div className="text-[11px] text-zinc-500 line-clamp-1 font-normal mt-0.5">
                            {r.detail_permintaan}
                          </div>
                        </Link>
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusClass(
                            r.status
                          )}`}
                        >
                          {r.status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-zinc-500 whitespace-nowrap text-[11px] font-normal">
                        {new Date(r.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {isSuper && (
                        <td className="px-4 py-3.5 text-right">
                          <ConfirmDeleteButton
                            id={String(r.id)}
                            itemLabel={r.nomor_permohonan}
                            entityLabel="permohonan data"
                            deleteAction={deletePermohonan}
                          />
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Permohonan Data (Email Reader) */}
      {readingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Link
            href={`/admin/permohonan-data${filter ? `?status=${filter}` : ""}`}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-default"
            aria-label="Tutup"
          />

          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-2xl z-10 space-y-6 text-zinc-900 dark:text-zinc-100">
            {/* Header Permohonan */}
            <div className="flex items-start justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border mb-2 ${statusClass(
                    readingItem.status
                  )}`}
                >
                  Status: {readingItem.status}
                </span>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                  Permohonan Dataset: {readingItem.jenis_data}
                </h2>
                <div className="font-mono text-xs text-[#b8860b] mt-1 font-semibold">
                  Nomor: {readingItem.nomor_permohonan}
                </div>
              </div>

              <Link
                href={`/admin/permohonan-data${filter ? `?status=${filter}` : ""}`}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <X size={20} />
              </Link>
            </div>

            {/* Identitas Pemohon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700/60">
              <div className="flex items-center gap-2">
                <User size={15} className="text-[#b8860b] shrink-0" />
                <div>
                  <span className="text-zinc-400 block text-[10px]">PEMOHON</span>
                  <span className="font-semibold">{readingItem.nama_pemohon}</span> (
                  <span className="text-zinc-500">{readingItem.email}</span>)
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Building size={15} className="text-[#b8860b] shrink-0" />
                <div>
                  <span className="text-zinc-400 block text-[10px]">INSTANSI / PROFESI</span>
                  <span className="font-semibold">{readingItem.instansi}</span>
                  <span className="text-zinc-500"> ({readingItem.jenis_pemohon})</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-[#b8860b] shrink-0" />
                <div>
                  <span className="text-zinc-400 block text-[10px]">CAKUPAN WILAYAH & TAHUN</span>
                  <span className="font-semibold capitalize">
                    {String(readingItem.wilayah).replace("-", "/")}
                    {readingItem.detail_wilayah ? ` · ${readingItem.detail_wilayah}` : ""}
                  </span>{" "}
                  · Thn {readingItem.tahun_data}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-[#b8860b] shrink-0" />
                <div>
                  <span className="text-zinc-400 block text-[10px]">TANGGAL PERMOHONAN</span>
                  <span className="font-semibold">
                    {new Date(readingItem.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Rincian Permintaan */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Tujuan Penggunaan Data:
                </span>
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  {readingItem.tujuan}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Rincian Spesifik Permintaan Data:
                </span>
                <div className="text-xs sm:text-sm leading-relaxed p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/20 border border-zinc-200 dark:border-zinc-800 whitespace-pre-wrap">
                  {readingItem.detail_permintaan}
                </div>
              </div>
            </div>

            {/* Lampiran Berkas */}
            {readingItem.lampiran && (
              <div className="p-3 rounded-2xl bg-[#b8860b]/10 border border-[#b8860b]/20 flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                  <FileText size={16} className="text-[#b8860b]" /> Surat Pengantar / Proposal Pemohon
                </span>
                <a
                  href={readingItem.lampiran}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[#b8860b] hover:underline font-bold"
                >
                  <ExternalLink size={13} /> Unduh Berkas
                </a>
              </div>
            )}

            {/* Form Pemrosesan Status & Template Tanggapan */}
            {canProcess && (
              <form
                action={updateStatus}
                className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4"
              >
                <input type="hidden" name="id" value={String(readingItem.id)} />

                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 block">
                    Update Status Permohonan
                  </label>
                  <select
                    name="status"
                    defaultValue={readingItem.status}
                    className="w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-zinc-900 dark:text-zinc-100"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dropdown Auto-Fill Template Catatan */}
                <QuickTemplateTextarea
                  name="catatan_admin"
                  initialValue={readingItem.catatan_admin || ""}
                  templates={TEMPLATES_PERMOHONAN}
                  placeholder="Ketik tanggapan atau gunakan opsi template cepat di atas..."
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Link
                    href={`/admin/permohonan-data${filter ? `?status=${filter}` : ""}`}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Tutup
                  </Link>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-[#b8860b] hover:bg-[#9a7009] text-white shadow-sm transition cursor-pointer"
                  >
                    <CheckCircle2 size={14} /> Simpan & Perbarui Status
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}