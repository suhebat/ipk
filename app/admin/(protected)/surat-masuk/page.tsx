import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Mail,
  Eye,
  X,
  User,
  Building,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Download,
} from "lucide-react";
import { getAdminSession } from "@/lib/admin-auth";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { requirePermission } from "@/lib/permissions";
import QuickTemplateTextarea from "@/components/admin/QuickTemplateTextarea";

export const dynamic = "force-dynamic";

const STATUSES = ["baru", "dibaca", "didisposisikan", "selesai"] as const;

const TEMPLATES_SURAT = [
  {
    label: "📬 Diterima & Didisposisikan",
    text: "Yth. Pengirim, surat/pertanyaan Anda telah kami terima dengan baik dan telah didisposisikan kepada unit kerja/pokja terkait di lingkungan Kementerian Kebudayaan RI untuk penelaahan lebih lanjut.",
  },
  {
    label: "✅ Selesai (Rujukan Publikasi)",
    text: "Yth. Pengirim, terima kasih telah menghubungi kami. Terkait hal yang disampaikan, kami informasikan bahwa rincian metodologi dan publikasi lengkap IPK dapat diakses langsung melalui portal resmi kami pada menu Publikasi & Regulasi.",
  },
  {
    label: "🤝 Audiensi / Narasumber Diterima",
    text: "Yth. Pengirim, surat permohonan narasumber/audiensi Anda telah kami terima dan saat ini sedang kami koordinasikan dengan pimpinan terkait jadwal serta ketersediaan pejabat yang berwenang.",
  },
  {
    label: "❓ Meminta Informasi Tambahan",
    text: "Yth. Pengirim, terima kasih atas surat yang dikirimkan. Untuk mempermudah proses tindak lanjut, mohon dapat menyampaikan informasi tambahan atau dokumen pendukung terkait perihal surat tersebut.",
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
  const catatan = String(formData.get("catatan") || "").trim() || undefined;
  const disposisi_kepada =
    String(formData.get("disposisi_kepada") || "").trim() || undefined;

  if (!id || !STATUSES.includes(status)) return;

  await prisma.surat_masuk.update({
    where: { id },
    data: {
      status,
      ...(catatan !== undefined ? { catatan } : {}),
      ...(disposisi_kepada !== undefined ? { disposisi_kepada } : {}),
    },
  });

  revalidatePath("/admin/surat-masuk");
  revalidatePath("/admin/dashboard");
  redirect("/admin/surat-masuk");
}

async function deleteSurat(formData: FormData) {
  "use server";
  const session = await getAdminSession();
  if (session?.role !== "superadmin") return;
  const id = BigInt(String(formData.get("id") || "0"));
  if (!id) return;
  await prisma.surat_masuk.delete({ where: { id } });
  revalidatePath("/admin/surat-masuk");
  revalidatePath("/admin/dashboard");
  redirect("/admin/surat-masuk");
}

function statusClass(s: string) {
  switch (s) {
    case "baru":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300";
    case "dibaca":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300";
    case "didisposisikan":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300";
    case "selesai":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300";
    default:
      return "bg-zinc-100 text-zinc-600";
  }
}

export default async function AdminSuratMasukPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; baca?: string }>;
}) {
  const session = await requirePermission("menu.surat");
  const isSuper = session?.role === "superadmin";
  const canProcess =
    isSuper || session?.role === "admin" || session?.role === "service_admin";

  const sp = await searchParams;
  const filter =
    sp.status && STATUSES.includes(sp.status as any) ? sp.status : undefined;
  const readId = sp.baca ? BigInt(sp.baca) : null;

  // Jika surat baru dibuka oleh admin, otomatis tandai sebagai 'dibaca'
  if (readId && canProcess) {
    const targetSurat = await prisma.surat_masuk.findUnique({
      where: { id: readId },
      select: { status: true },
    });
    if (targetSurat?.status === "baru") {
      await prisma.surat_masuk.update({
        where: { id: readId },
        data: { status: "dibaca" },
      });
      revalidatePath("/admin/surat-masuk");
      revalidatePath("/admin/dashboard");
    }
  }

  const [rows, counts, readingItem] = await Promise.all([
    prisma.surat_masuk.findMany({
      where: filter ? { status: filter as any } : undefined,
      orderBy: { created_at: "desc" },
      take: 100,
    }),
    prisma.surat_masuk.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    readId ? prisma.surat_masuk.findUnique({ where: { id: readId } }) : null,
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
            <Mail size={22} className="text-[#b8860b]" />
            Inbox Surat Masuk
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {canProcess
              ? "Klik baris surat untuk membaca pesan lengkap, mengatur disposisi, dan memperbarui status."
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
            href="/admin/surat-masuk"
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
              href={`/admin/surat-masuk?status=${s}`}
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
          href={`/api/admin/export-surat-masuk${filter ? `?status=${filter}` : ""}`}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition shadow-sm cursor-pointer"
        >
          <Download size={14} /> Download Rekap XLS
        </a>
      </div>

      {/* Tabel Surat Masuk */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">No. Tiket</th>
                <th className="px-4 py-3">Pengirim</th>
                <th className="px-4 py-3">Perihal & Ringkasan</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3">Diterima</th>
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
                    Tidak ada surat{filter ? ` berstatus “${filter}”` : ""}.
                  </td>
                </tr>
              ) : (
                rows.map((r) => {
                  const isUnread = r.status === "baru";
                  return (
                    <tr
                      key={String(r.id)}
                      className={`hover:bg-amber-500/5 transition cursor-pointer ${
                        isUnread ? "bg-amber-500/[0.03] font-semibold" : "opacity-90"
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/admin/surat-masuk?${filter ? `status=${filter}&` : ""}baca=${r.id}`}
                          className="block"
                        >
                          <div className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">
                            {r.nomor_tiket || "—"}
                          </div>
                          {r.nomor_surat && (
                            <div className="text-[11px] text-zinc-400 font-normal">
                              No: {r.nomor_surat}
                            </div>
                          )}
                        </Link>
                      </td>

                      <td className="px-4 py-3.5">
                        <Link
                          href={`/admin/surat-masuk?${filter ? `status=${filter}&` : ""}baca=${r.id}`}
                          className="block"
                        >
                          <div className="text-zinc-900 dark:text-zinc-100">
                            {r.nama_pengirim}
                          </div>
                          <div className="text-[11px] text-zinc-500 font-normal">
                            {r.email_pengirim}
                          </div>
                          {r.asal_instansi && (
                            <div className="text-[11px] text-zinc-400 font-normal">
                              {r.asal_instansi}
                            </div>
                          )}
                        </Link>
                      </td>

                      <td className="px-4 py-3.5 max-w-sm">
                        <Link
                          href={`/admin/surat-masuk?${filter ? `status=${filter}&` : ""}baca=${r.id}`}
                          className="block"
                        >
                          <div className="text-zinc-900 dark:text-zinc-100 truncate">
                            {r.perihal}
                          </div>
                          <div className="text-[11px] text-zinc-500 line-clamp-1 font-normal mt-0.5">
                            {r.ringkasan}
                          </div>
                        </Link>
                      </td>

                      <td className="px-4 py-3.5 capitalize">
                        <Link
                          href={`/admin/surat-masuk?${filter ? `status=${filter}&` : ""}baca=${r.id}`}
                          className="block text-zinc-600 dark:text-zinc-400 font-normal"
                        >
                          {String(r.kategori).replace(/-/g, " ")}
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
                        {new Date(r.tanggal_diterima).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {isSuper && (
                        <td className="px-4 py-3.5 text-right">
                          <ConfirmDeleteButton
                            id={String(r.id)}
                            itemLabel={r.nomor_tiket || r.perihal}
                            entityLabel="surat masuk"
                            deleteAction={deleteSurat}
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

      {/* Modal Detail Surat Masuk (Email Reader) */}
      {readingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Link
            href={`/admin/surat-masuk${filter ? `?status=${filter}` : ""}`}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-default"
            aria-label="Tutup"
          />

          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-2xl z-10 space-y-6 text-zinc-900 dark:text-zinc-100">
            {/* Header Surat */}
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
                  {readingItem.perihal}
                </h2>
                <div className="font-mono text-xs text-[#b8860b] mt-1 font-semibold">
                  Tiket: {readingItem.nomor_tiket || "—"}{" "}
                  {readingItem.nomor_surat ? `| No. Surat: ${readingItem.nomor_surat}` : ""}
                </div>
              </div>

              <Link
                href={`/admin/surat-masuk${filter ? `?status=${filter}` : ""}`}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <X size={20} />
              </Link>
            </div>

            {/* Profil Pengirim */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700/60">
              <div className="flex items-center gap-2">
                <User size={15} className="text-[#b8860b] shrink-0" />
                <div>
                  <span className="text-zinc-400 block text-[10px]">PENGIRIM</span>
                  <span className="font-semibold">{readingItem.nama_pengirim}</span> (
                  <span className="text-zinc-500">{readingItem.email_pengirim}</span>)
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Building size={15} className="text-[#b8860b] shrink-0" />
                <div>
                  <span className="text-zinc-400 block text-[10px]">INSTANSI / TELEPON</span>
                  <span className="font-semibold">{readingItem.asal_instansi || "Umum"}</span>
                  {readingItem.telepon_pengirim ? ` · ${readingItem.telepon_pengirim}` : ""}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:col-span-2">
                <Calendar size={15} className="text-[#b8860b] shrink-0" />
                <div>
                  <span className="text-zinc-400 block text-[10px]">TANGGAL MASUK</span>
                  <span className="font-semibold">
                    {new Date(readingItem.tanggal_diterima).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Isi Pesan */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Isi Surat / Pesan:
              </span>
              <div className="text-xs sm:text-sm leading-relaxed p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/20 border border-zinc-200 dark:border-zinc-800 whitespace-pre-wrap">
                {readingItem.ringkasan || "Tidak ada rincian pesan."}
              </div>
            </div>

            {/* Lampiran Berkas */}
            {readingItem.file_surat && (
              <div className="p-3 rounded-2xl bg-[#b8860b]/10 border border-[#b8860b]/20 flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                  <Mail size={16} className="text-[#b8860b]" /> Berkas Lampiran Surat
                </span>
                <a
                  href={readingItem.file_surat}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[#b8860b] hover:underline font-bold"
                >
                  <ExternalLink size={13} /> Buka Berkas
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 block">
                      Perbarui Status Surat
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

                  <div>
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 block">
                      Disposisikan Kepada (Opsional)
                    </label>
                    <input
                      name="disposisi_kepada"
                      defaultValue={readingItem.disposisi_kepada || ""}
                      placeholder="Contoh: Tim Pokja Analisis Budaya"
                      className="w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  {/* Dropdown Auto-Fill Template Catatan */}
                  <div className="sm:col-span-2">
                    <QuickTemplateTextarea
                      name="catatan"
                      initialValue={readingItem.catatan || ""}
                      templates={TEMPLATES_SURAT}
                      placeholder="Ketik catatan tindak lanjut atau pilih template cepat di atas..."
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Link
                    href={`/admin/surat-masuk${filter ? `?status=${filter}` : ""}`}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Tutup
                  </Link>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-[#b8860b] hover:bg-[#9a7009] text-white shadow-sm transition cursor-pointer"
                  >
                    <CheckCircle2 size={14} /> Simpan Tindak Lanjut
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