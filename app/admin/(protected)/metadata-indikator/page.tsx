import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Layers,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  X,
  Save,
  Calendar,
  Info,
} from "lucide-react";
import { getAdminSession } from "@/lib/admin-auth";
import { requirePermission } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const DIMENSI_OPTIONS = [
  "Ekonomi Budaya",
  "Pendidikan",
  "Ketahanan Sosial Budaya",
  "Warisan Budaya",
  "Ekspresi Budaya",
  "Budaya Literasi",
  "Gender",
];

async function createMetadata(formData: FormData) {
  "use server";
  const session = await getAdminSession();
  if (
    session?.role !== "superadmin" &&
    session?.role !== "admin" &&
    session?.role !== "content_admin" &&
    session?.role !== "data_admin"
  ) {
    return;
  }

  // Kunci penambahan tahun baru minimal mulai dari 2025 ke atas
  const tahun = Number(formData.get("tahun") || 2025);
  const dimensi = String(formData.get("dimensi") || "").trim();
  const nama_indikator = String(formData.get("nama_indikator") || "").trim();
  const konsep_definisi = String(formData.get("konsep_definisi") || "").trim();
  const interpretasi = String(formData.get("interpretasi") || "").trim();
  const rumus_perhitungan = String(formData.get("rumus_perhitungan") || "").trim() || null;
  const kegiatan_penghasil = String(formData.get("kegiatan_penghasil") || "BPS / Kemendikbud").trim();
  const ukuran_satuan = String(formData.get("ukuran_satuan") || "Persen").trim();
  const level_estimasi = String(formData.get("level_estimasi") || "Nasional, provinsi").trim();
  const dapat_diakses_umum = formData.get("dapat_diakses_umum") === "Tidak" ? "Tidak" : "Ya";
  const urutan = Number(formData.get("urutan") || 0);

  if (tahun < 2025) return;
  if (!dimensi || !nama_indikator || !konsep_definisi || !interpretasi) {
    return;
  }

  // Generate kode & slug otomatis dari nama indikator
  const baseSlug = nama_indikator
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 30);
  const kode_indikator = `IND-${Date.now().toString().slice(-4)}`;
  const slug = `${baseSlug}-${tahun}-${Date.now().toString().slice(-3)}`;

  await (prisma.metadata_indikator as any).create({
    data: {
      tahun,
      kode_indikator,
      dimensi,
      nama_indikator,
      slug,
      konsep_definisi,
      interpretasi,
      rumus_perhitungan,
      kegiatan_penghasil,
      ukuran_satuan,
      level_estimasi,
      dapat_diakses_umum,
      urutan,
      is_active: true,
    },
  });

  revalidatePath("/admin/metadata-indikator");
  revalidatePath("/pages/metodologi");
  redirect("/admin/metadata-indikator");
}

async function updateMetadata(formData: FormData) {
  "use server";
  const session = await getAdminSession();
  if (
    session?.role !== "superadmin" &&
    session?.role !== "admin" &&
    session?.role !== "content_admin" &&
    session?.role !== "data_admin"
  ) {
    return;
  }

  const id = Number(formData.get("id"));
  const tahun = Number(formData.get("tahun") || 2024);
  const dimensi = String(formData.get("dimensi") || "").trim();
  const nama_indikator = String(formData.get("nama_indikator") || "").trim();
  const konsep_definisi = String(formData.get("konsep_definisi") || "").trim();
  const interpretasi = String(formData.get("interpretasi") || "").trim();
  const rumus_perhitungan = String(formData.get("rumus_perhitungan") || "").trim() || null;
  const kegiatan_penghasil = String(formData.get("kegiatan_penghasil") || "BPS / Kemendikbud").trim();
  const ukuran_satuan = String(formData.get("ukuran_satuan") || "Persen").trim();
  const level_estimasi = String(formData.get("level_estimasi") || "Nasional, provinsi").trim();
  const dapat_diakses_umum = formData.get("dapat_diakses_umum") === "Tidak" ? "Tidak" : "Ya";
  const urutan = Number(formData.get("urutan") || 0);

  if (!id || !dimensi || !nama_indikator) return;

  await (prisma.metadata_indikator as any).update({
    where: { id },
    data: {
      tahun,
      dimensi,
      nama_indikator,
      konsep_definisi,
      interpretasi,
      rumus_perhitungan,
      kegiatan_penghasil,
      ukuran_satuan,
      level_estimasi,
      dapat_diakses_umum,
      urutan,
    },
  });

  revalidatePath("/admin/metadata-indikator");
  revalidatePath("/pages/metodologi");
  redirect("/admin/metadata-indikator");
}

async function deleteMetadata(formData: FormData) {
  "use server";
  const session = await getAdminSession();
  if (session?.role !== "superadmin" && session?.role !== "admin") return;

  const id = Number(formData.get("id"));
  if (!id) return;

  await prisma.metadata_indikator.delete({ where: { id } });
  revalidatePath("/admin/metadata-indikator");
  revalidatePath("/pages/metodologi");
  redirect("/admin/metadata-indikator");
}

export default async function AdminMetadataIndikatorPage({
  searchParams,
}: {
  searchParams: Promise<{ dimensi?: string; q?: string; edit?: string }>;
}) {
  const session = await requirePermission("menu.data_nasional");
  const canManage =
    session.role === "superadmin" ||
    session.role === "admin" ||
    session.role === "content_admin" ||
    session.role === "data_admin";

  const sp = await searchParams;
  const filterDimensi = sp.dimensi || undefined;
  const searchQuery = sp.q?.trim() || undefined;
  const editId = sp.edit ? Number(sp.edit) : null;

  const [rows, totalCount, editingItem] = await Promise.all([
    prisma.metadata_indikator.findMany({
      where: {
        ...(filterDimensi ? { dimensi: filterDimensi } : {}),
        ...(searchQuery
          ? {
              OR: [
                { nama_indikator: { contains: searchQuery } },
                { konsep_definisi: { contains: searchQuery } },
              ],
            }
          : {}),
      },
      orderBy: [{ dimensi: "asc" }, { urutan: "asc" }, { id: "asc" }],
    }),
    prisma.metadata_indikator.count(),
    editId ? prisma.metadata_indikator.findUnique({ where: { id: editId } }) : null,
  ]);

  return (
    <div className="space-y-6">
      {/* 1. Header Halaman */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Layers size={22} className="text-[#b8860b]" />
            Kamus Metadata Indikator IPK
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {canManage
              ? "Kelola definisi konsep, rumus pembangun, sumber data, dan interpretasi 31 indikator IPK."
              : "Mode hanya lihat (Read-Only)."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!canManage && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              <Eye size={12} /> Read-Only
            </span>
          )}
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#b8860b]/10 text-[#b8860b] border border-[#b8860b]/20">
            {totalCount} total indikator terdaftar
          </span>
        </div>
      </div>

      {/* Banner Penjelasan Metodologi */}
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-xs text-blue-800 dark:text-blue-300 flex items-center gap-3">
        <Info size={18} className="shrink-0 text-blue-600 dark:text-blue-400" />
        <div>
          <span className="font-bold">Informasi Metodologi:</span> Data indikator di bawah memuat master data{" "}
          <strong>Metodologi IPK 2024 (Baseline Aktif)</strong>. Anda dapat memperbarui rincian rumus atau definisi indikator 2024 langsung melalui tombol <strong>Edit (Pensil)</strong> pada tabel.
        </div>
      </div>

      {/* 2. Form Tambah Metadata Baru (Tanpa Input Kode) */}
      {canManage && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Plus size={16} className="text-[#b8860b]" /> Tambah Metadata Indikator (Tahun Rilis Baru)
            </h2>
            <span className="text-[10px] text-zinc-400 font-medium">
              Khusus penambahan metodologi baru (&ge; 2025)
            </span>
          </div>

          <form action={createMetadata} className="space-y-4">
            {/* Input Tahun Mulai 2025 Ke Atas */}
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Calendar className="text-[#b8860b]" size={18} />
                <div>
                  <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
                    Tahun Metodologi Baru:
                  </label>
                  <p className="text-[11px] text-zinc-500">
                    Mulai tahun 2025 ke atas (gunakan tombol panah atau ketik tahun langsung).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-500">Tahun:</span>
                <input
                  name="tahun"
                  type="number"
                  min={2025}
                  step={1}
                  defaultValue={2025}
                  required
                  className="w-28 text-center text-sm font-bold rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b] font-mono cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="text-xs text-zinc-500 mb-1 block font-medium">
                  Dimensi <span className="text-red-500">*</span>
                </label>
                <select
                  name="dimensi"
                  required
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                >
                  {DIMENSI_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-zinc-500 mb-1 block font-medium">
                  Nama Indikator <span className="text-red-500">*</span>
                </label>
                <input
                  name="nama_indikator"
                  required
                  placeholder="Contoh: Persentase Penduduk yang Menonton Pertunjukan Seni"
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-xs text-zinc-500 mb-1 block font-medium">
                  Konsep & Definisi <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="konsep_definisi"
                  required
                  rows={3}
                  placeholder="Penjelasan definisi operasional indikator..."
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b] resize-y"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-xs text-zinc-500 mb-1 block font-medium">
                  Interpretasi & Cara Baca <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="interpretasi"
                  required
                  rows={3}
                  placeholder="Semakin tinggi nilai menunjukkan bahwa..."
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b] resize-y"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-zinc-500 mb-1 block font-medium">Rumus Perhitungan</label>
                <input
                  name="rumus_perhitungan"
                  placeholder="(Jumlah A / Jumlah B) x 100%"
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm font-mono text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1 block font-medium">Sumber Data</label>
                <input
                  name="kegiatan_penghasil"
                  defaultValue="BPS (Susenas / Sakernas)"
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1 block font-medium">Akses Publik?</label>
                <select
                  name="dapat_diakses_umum"
                  defaultValue="Ya"
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                >
                  <option value="Ya">Ya (Tampil di Web)</option>
                  <option value="Tidak">Tidak (Internal Saja)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#b8860b] text-white text-sm font-semibold px-5 py-2.5 hover:bg-[#9a7009] transition shadow-sm cursor-pointer"
            >
              <Plus size={16} /> Simpan Metadata Indikator
            </button>
          </form>
        </div>
      )}

      {/* 3. Filter Dimensi & Pencarian Tabel */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <form className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-2.5 text-zinc-400" size={15} />
            <input
              name="q"
              defaultValue={searchQuery || ""}
              placeholder="Cari nama indikator atau definisi..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
            />
          </div>

          <select
            name="dimensi"
            defaultValue={filterDimensi || ""}
            className="text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
          >
            <option value="">Semua Dimensi</option>
            {DIMENSI_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl bg-[#b8860b] text-white text-xs font-semibold hover:bg-[#9a7009] transition shadow-sm cursor-pointer"
          >
            Filter
          </button>
        </form>
      </div>

      {/* 4. Tabel Daftar Metadata (Tanpa Kolom Kode) */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <table className="w-full table-fixed text-left text-xs">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-3 py-3 w-[8%]">Tahun</th>
              <th className="px-3 py-3 w-[20%]">Dimensi</th>
              <th className="px-3 py-3 w-[44%]">Nama & Definisi Konsep</th>
              <th className="px-3 py-3 w-[15%]">Sumber Data</th>
              <th className="px-3 py-3 text-center w-[13%]">Akses</th>
              {canManage && <th className="px-3 py-3 text-right w-[10%]">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 6 : 5} className="py-12 text-center text-zinc-400">
                  Tidak ada metadata indikator yang cocok.
                </td>
              </tr>
            ) : (
              rows.map((m) => {
                const itemTahun = (m as any).tahun || 2024;
                return (
                  <tr key={m.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition">
                    <td className="px-3 py-3.5 font-bold text-zinc-700 dark:text-zinc-300 align-top">
                      <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[11px]">
                        {itemTahun}
                      </span>
                    </td>

                    <td className="px-3 py-3.5 align-top">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 font-semibold text-[11px] text-zinc-700 dark:text-zinc-300 break-words leading-tight">
                        {m.dimensi}
                      </span>
                    </td>

                    <td className="px-3 py-3.5 align-top">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm break-words leading-snug">
                        {m.nama_indikator}
                      </div>
                      <div className="text-[11px] text-zinc-500 line-clamp-2 mt-1 break-words">
                        {m.konsep_definisi}
                      </div>
                      {m.rumus_perhitungan && (
                        <div
                          className="text-[10px] text-zinc-400 font-mono mt-0.5 break-all line-clamp-1"
                          title={m.rumus_perhitungan}
                        >
                          Rumus: {m.rumus_perhitungan}
                        </div>
                      )}
                    </td>

                    <td className="px-3 py-3.5 text-zinc-600 dark:text-zinc-400 font-medium align-top break-words text-[11px] leading-tight">
                      {m.kegiatan_penghasil}
                    </td>

                    <td className="px-3 py-3.5 text-center align-top">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          m.dapat_diakses_umum === "Ya"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
                        }`}
                      >
                        {m.dapat_diakses_umum}
                      </span>
                    </td>

                    {canManage && (
                      <td className="px-3 py-3.5 text-right align-top">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`/admin/metadata-indikator?edit=${m.id}`}
                            className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-[#b8860b] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                            title="Edit Metadata"
                          >
                            <Pencil size={14} />
                          </a>

                          {session.role === "superadmin" && (
                            <form action={deleteMetadata}>
                              <input type="hidden" name="id" value={m.id} />
                              <button
                                type="submit"
                                title="Hapus"
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </form>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 5. Modal Popup Edit Metadata (Tanpa Input Kode) */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <a
            href="/admin/metadata-indikator"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-default"
            aria-label="Tutup modal"
          />

          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-sm">
                <Pencil size={16} className="text-[#b8860b]" /> Edit Metadata: {editingItem.nama_indikator} (Tahun {(editingItem as any).tahun || 2024})
              </div>
              <a
                href="/admin/metadata-indikator"
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X size={18} />
              </a>
            </div>

            <form action={updateMetadata} className="space-y-4">
              <input type="hidden" name="id" value={editingItem.id} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block font-medium">Tahun Metodologi</label>
                  <input
                    name="tahun"
                    type="number"
                    required
                    defaultValue={(editingItem as any).tahun || 2024}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500 mb-1 block font-medium">Dimensi</label>
                  <select
                    name="dimensi"
                    defaultValue={editingItem.dimensi}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100"
                  >
                    {DIMENSI_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-zinc-500 mb-1 block font-medium">Nama Indikator</label>
                  <input
                    name="nama_indikator"
                    required
                    defaultValue={editingItem.nama_indikator}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-zinc-500 mb-1 block font-medium">Konsep & Definisi</label>
                  <textarea
                    name="konsep_definisi"
                    required
                    rows={3}
                    defaultValue={editingItem.konsep_definisi}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 resize-y"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-zinc-500 mb-1 block font-medium">Interpretasi</label>
                  <textarea
                    name="interpretasi"
                    required
                    rows={3}
                    defaultValue={editingItem.interpretasi}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 resize-y"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500 mb-1 block font-medium">Rumus Perhitungan</label>
                  <input
                    name="rumus_perhitungan"
                    defaultValue={editingItem.rumus_perhitungan || ""}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm font-mono text-xs text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500 mb-1 block font-medium">Akses Publik?</label>
                  <select
                    name="dapat_diakses_umum"
                    defaultValue={editingItem.dapat_diakses_umum || "Ya"}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="Ya">Ya (Publik)</option>
                    <option value="Tidak">Tidak (Internal)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <a
                  href="/admin/metadata-indikator"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  Batal
                </a>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#b8860b] hover:bg-[#9a7009] text-white shadow-sm transition cursor-pointer"
                >
                  <Save size={14} /> Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}