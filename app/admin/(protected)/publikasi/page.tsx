import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { requirePermission } from "@/lib/permissions";
import {
  BookOpen,
  Plus,
  Trash2,
  Eye,
  ExternalLink,
  Upload,
  FileText,
  Image as ImageIcon,
  Pencil,
  X,
  Save,
} from "lucide-react";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const PUBLICATION_TYPES = [
  "Buku Digital",
  "Laporan Tahunan IPK",
  "Dokumen Metodologi",
  "Policy Brief",
  "Lainnya",
];

async function createPublication(formData: FormData) {
  "use server";
  const session = await getAdminSession();
  if (
    session?.role !== "superadmin" &&
    session?.role !== "admin" &&
    session?.role !== "content_admin"
  ) {
    return;
  }

  const title = String(formData.get("title") || "").trim();
  const year = Number(formData.get("year") || new Date().getFullYear());
  const type = String(formData.get("type") || "Buku Digital").trim();
  const description = String(formData.get("description") || "").trim() || null;

  const pdfFile = formData.get("pdf_file") as File | null;
  const coverFile = formData.get("cover_file") as File | null;

  if (!title || !year) return;

  let download_link: string | null = null;
  let image_path: string | null = null;

  if (pdfFile && pdfFile.size > 0 && typeof pdfFile.arrayBuffer === "function") {
    try {
      const bytes = await pdfFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const safeName = `${Date.now()}-${pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public", "docs", "publikasi");

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, safeName), buffer);

      download_link = `/docs/publikasi/${safeName}`;
    } catch (err) {
      console.error("[Upload PDF Error]", err);
    }
  }

  if (coverFile && coverFile.size > 0 && typeof coverFile.arrayBuffer === "function") {
    try {
      const bytes = await coverFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const safeCoverName = `${Date.now()}-${coverFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const coverDir = path.join(process.cwd(), "public", "images", "covers");

      await fs.mkdir(coverDir, { recursive: true });
      await fs.writeFile(path.join(coverDir, safeCoverName), buffer);

      image_path = `/images/covers/${safeCoverName}`;
    } catch (err) {
      console.error("[Upload Cover Error]", err);
    }
  }

  await prisma.publications.create({
    data: {
      title,
      year,
      type,
      description,
      download_link,
      image_path,
    },
  });

  revalidatePath("/admin/publikasi");
  revalidatePath("/pages/publikasi");
}

async function updatePublication(formData: FormData) {
  "use server";
  const session = await getAdminSession();
  if (
    session?.role !== "superadmin" &&
    session?.role !== "admin" &&
    session?.role !== "content_admin"
  ) {
    return;
  }

  const id = Number(formData.get("id"));
  const title = String(formData.get("title") || "").trim();
  const year = Number(formData.get("year") || new Date().getFullYear());
  const type = String(formData.get("type") || "Buku Digital").trim();
  const description = String(formData.get("description") || "").trim() || null;

  const pdfFile = formData.get("pdf_file") as File | null;
  const coverFile = formData.get("cover_file") as File | null;

  if (!id || !title || !year) return;

  const existing = await prisma.publications.findUnique({ where: { id } });
  let download_link = existing?.download_link;
  let image_path = existing?.image_path;

  // Jika ada file PDF baru
  if (pdfFile && pdfFile.size > 0 && typeof pdfFile.arrayBuffer === "function") {
    try {
      const bytes = await pdfFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const safeName = `${Date.now()}-${pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public", "docs", "publikasi");

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, safeName), buffer);

      if (existing?.download_link?.startsWith("/docs/publikasi/")) {
        await fs.unlink(path.join(process.cwd(), "public", existing.download_link)).catch(() => {});
      }

      download_link = `/docs/publikasi/${safeName}`;
    } catch (err) {
      console.error("[Update PDF Error]", err);
    }
  }

  // Jika ada Cover Gambar baru
  if (coverFile && coverFile.size > 0 && typeof coverFile.arrayBuffer === "function") {
    try {
      const bytes = await coverFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const safeCoverName = `${Date.now()}-${coverFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const coverDir = path.join(process.cwd(), "public", "images", "covers");

      await fs.mkdir(coverDir, { recursive: true });
      await fs.writeFile(path.join(coverDir, safeCoverName), buffer);

      if (existing?.image_path?.startsWith("/images/covers/")) {
        await fs.unlink(path.join(process.cwd(), "public", existing.image_path)).catch(() => {});
      }

      image_path = `/images/covers/${safeCoverName}`;
    } catch (err) {
      console.error("[Update Cover Error]", err);
    }
  }

  await prisma.publications.update({
    where: { id },
    data: {
      title,
      year,
      type,
      description,
      ...(download_link ? { download_link } : {}),
      ...(image_path ? { image_path } : {}),
    },
  });

  revalidatePath("/admin/publikasi");
  revalidatePath("/pages/publikasi");
  redirect("/admin/publikasi");
}

async function deletePublication(formData: FormData) {
  "use server";
  const session = await getAdminSession();
  if (
    session?.role !== "superadmin" &&
    session?.role !== "admin" &&
    session?.role !== "content_admin"
  ) {
    return;
  }

  const id = Number(formData.get("id"));
  if (!id) return;

  const target = await prisma.publications.findUnique({ where: { id } });

  if (target?.download_link?.startsWith("/docs/publikasi/")) {
    const fullPath = path.join(process.cwd(), "public", target.download_link);
    await fs.unlink(fullPath).catch(() => {});
  }

  if (target?.image_path?.startsWith("/images/covers/")) {
    const fullCoverPath = path.join(process.cwd(), "public", target.image_path);
    await fs.unlink(fullCoverPath).catch(() => {});
  }

  await prisma.publications.delete({ where: { id } });

  revalidatePath("/admin/publikasi");
  revalidatePath("/pages/publikasi");
}

export default async function AdminPublikasiPage({
  searchParams,
}: {
  searchParams: Promise<{ tipe?: string; edit?: string }>;
}) {
  const session = await requirePermission("menu.publikasi");
  const canManage =
    session.role === "superadmin" ||
    session.role === "admin" ||
    session.role === "content_admin";

  const sp = await searchParams;
  const filterType = sp.tipe || undefined;
  const editId = sp.edit ? Number(sp.edit) : null;

  const [rows, totalCount, editingItem] = await Promise.all([
    prisma.publications.findMany({
      where: filterType ? { type: filterType } : undefined,
      orderBy: [{ year: "desc" }, { id: "desc" }],
    }),
    prisma.publications.count(),
    editId ? prisma.publications.findUnique({ where: { id: editId } }) : null,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <BookOpen size={22} className="text-[#b8860b]" />
            Publikasi & Koleksi Buku Digital
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {canManage
              ? "Unggah dan kelola eBook, laporan IPK tahunan, dan dokumen PDF resmi."
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
            {totalCount} total publikasi
          </span>
        </div>
      </div>

      {/* Form Tambah Publikasi Baru */}
      {canManage && (
        <form
          action={createPublication}
          className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4"
        >
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <Plus size={16} /> Tambah & Upload Dokumen Baru
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs text-zinc-500 mb-1 block font-medium">
                Judul Publikasi / Buku <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                required
                placeholder="Contoh: Laporan Indeks Pembangunan Kebudayaan 2024"
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 mb-1 block font-medium">
                Tahun Terbit <span className="text-red-500">*</span>
              </label>
              <input
                name="year"
                type="number"
                defaultValue={new Date().getFullYear()}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 mb-1 block font-medium">
                Kategori Dokumen
              </label>
              <select
                name="type"
                defaultValue="Buku Digital"
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
              >
                {PUBLICATION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-zinc-500 mb-1 block font-medium flex items-center gap-1.5">
                <FileText size={14} className="text-[#b8860b]" /> Upload File Dokumen (PDF)
              </label>
              <input
                type="file"
                name="pdf_file"
                accept=".pdf,application/pdf"
                className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#b8860b]/15 file:text-[#b8860b] hover:file:bg-[#b8860b]/25 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 p-1.5 cursor-pointer"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-zinc-500 mb-1 block font-medium flex items-center gap-1.5">
                <ImageIcon size={14} className="text-[#b8860b]" /> Upload Cover Gambar (Opsional)
              </label>
              <input
                type="file"
                name="cover_file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#b8860b]/15 file:text-[#b8860b] hover:file:bg-[#b8860b]/25 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 p-1.5 cursor-pointer"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="text-xs text-zinc-500 mb-1 block font-medium">
                Deskripsi / Ringkasan Isi
              </label>
              <textarea
                name="description"
                rows={2}
                placeholder="Tuliskan gambaran singkat mengenai isi dokumen atau buku ini..."
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[#b8860b] text-white text-sm font-semibold px-5 py-2.5 hover:bg-[#9a7009] transition shadow-sm"
          >
            <Upload size={16} /> Upload & Simpan Publikasi
          </button>
        </form>
      )}

      {/* Tabel Daftar Publikasi */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3 w-16">Cover</th>
                <th className="px-4 py-3 w-16">Tahun</th>
                <th className="px-4 py-3">Judul Publikasi</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">File Unduhan</th>
                {canManage && <th className="px-4 py-3 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 6 : 5} className="py-10 text-center text-zinc-400">
                    Belum ada publikasi terdaftar.
                  </td>
                </tr>
              ) : (
                rows.map((p) => {
                  const imageSrc = p.image_path
                    ? p.image_path.startsWith("http") || p.image_path.startsWith("/")
                      ? p.image_path
                      : `/${p.image_path}`
                    : null;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition"
                    >
                      <td className="px-4 py-3">
                        {imageSrc ? (
                          <div className="w-10 h-14 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm bg-zinc-100 dark:bg-zinc-800 shrink-0">
                            <img
                              src={imageSrc}
                              alt={p.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-14 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-400">
                            <ImageIcon size={16} />
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 font-bold text-zinc-900 dark:text-zinc-100">
                        {p.year}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                          {p.title}
                        </div>
                        {p.description && (
                          <div className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">
                            {p.description}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 font-semibold text-[11px] text-zinc-700 dark:text-zinc-300">
                          {p.type || "Publikasi"}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-mono text-[11px] text-zinc-500">
                        {p.download_link ? (
                          <a
                            href={p.download_link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#b8860b]/10 text-[#b8860b] hover:bg-[#b8860b]/20 transition font-sans font-semibold text-xs"
                          >
                            <ExternalLink size={13} /> Buka PDF
                          </a>
                        ) : (
                          <span className="text-zinc-400 italic">Tidak ada file</span>
                        )}
                      </td>

                      {canManage && (
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Tombol Edit Per Item */}
                            <a
                              href={`/admin/publikasi?edit=${p.id}`}
                              title="Edit Publikasi"
                              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-[#b8860b] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                            >
                              <Pencil size={15} />
                            </a>

                            <form action={deletePublication}>
                              <input type="hidden" name="id" value={p.id} />
                              <button
                                type="submit"
                                title="Hapus publikasi"
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                              >
                                <Trash2 size={15} />
                              </button>
                            </form>
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
      </div>

      {/* ======================================================== */}
      {/* MODAL POPUP EDIT PUBLIKASI                               */}
      {/* ======================================================== */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <a
            href="/admin/publikasi"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-default"
            aria-label="Tutup modal"
          />

          <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-sm">
                <Pencil size={16} className="text-[#b8860b]" /> Edit Publikasi #{editingItem.id}
              </div>
              <a
                href="/admin/publikasi"
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X size={18} />
              </a>
            </div>

            <form action={updatePublication} className="space-y-4">
              <input type="hidden" name="id" value={editingItem.id} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs text-zinc-500 mb-1 block font-medium">Judul Dokumen</label>
                  <input
                    name="title"
                    required
                    defaultValue={editingItem.title}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500 mb-1 block font-medium">Tahun Terbit</label>
                  <input
                    name="year"
                    type="number"
                    defaultValue={editingItem.year}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500 mb-1 block font-medium">Kategori</label>
                  <select
                    name="type"
                    defaultValue={editingItem.type || "Buku Digital"}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                  >
                    {PUBLICATION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-zinc-500 mb-1 block font-medium">Ganti File PDF</label>
                  <input
                    type="file"
                    name="pdf_file"
                    accept=".pdf,application/pdf"
                    className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-[#b8860b]/15 file:text-[#b8860b] border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 p-1 cursor-pointer"
                  />
                  <span className="text-[10px] text-zinc-400 mt-0.5 block truncate">
                    {editingItem.download_link || "Belum ada file"}
                  </span>
                </div>

                <div>
                  <label className="text-xs text-zinc-500 mb-1 block font-medium">Ganti Cover Gambar</label>
                  <input
                    type="file"
                    name="cover_file"
                    accept="image/*"
                    className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-[#b8860b]/15 file:text-[#b8860b] border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 p-1 cursor-pointer"
                  />
                  <span className="text-[10px] text-zinc-400 mt-0.5 block truncate">
                    {editingItem.image_path || "Belum ada cover"}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-zinc-500 mb-1 block font-medium">Deskripsi Ringkas</label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={editingItem.description || ""}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b] resize-y"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <a
                  href="/admin/publikasi"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  Batal
                </a>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#b8860b] hover:bg-[#9a7009] text-white shadow-sm transition"
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