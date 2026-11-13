import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Scale,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Eye,
  FileText,
  ExternalLink,
  Upload,
  Pencil,
  X,
  Save,
} from "lucide-react";
import { getAdminSession } from "@/lib/admin-auth";
import { hasPermission, requirePermission } from "@/lib/permissions";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

async function createDocument(formData: FormData) {
  "use server";
  const session = await getAdminSession();
  const canManage = await hasPermission(Number(session?.id), "menu.tentang");
  if (
    !canManage ||
    (session?.role !== "superadmin" &&
      session?.role !== "admin" &&
      session?.role !== "content_admin")
  ) {
    return;
  }

  const badge = String(formData.get("badge") || "").trim();
  const judul = String(formData.get("judul") || "").trim();
  const deskripsi = String(formData.get("deskripsi") || "").trim() || null;
  const nomor_urut = Number(formData.get("nomor_urut") || 0);

  const pdfFile = formData.get("pdf_file") as File | null;
  let file_url: string | null = null;

  if (pdfFile && pdfFile.size > 0 && typeof pdfFile.arrayBuffer === "function") {
    try {
      const bytes = await pdfFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const safeName = `${Date.now()}-${pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public", "docs", "dasar-hukum");

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, safeName), buffer);

      file_url = `/docs/dasar-hukum/${safeName}`;
    } catch (err) {
      console.error("[Upload PDF Error]", err);
    }
  }

  if (!badge || !judul || !file_url) return;

  await prisma.dasar_hukum.create({
    data: {
      badge,
      judul,
      deskripsi,
      file_url,
      nomor_urut: Number.isFinite(nomor_urut) ? nomor_urut : 0,
      is_active: true,
    },
  });

  revalidatePath("/admin/dasar-hukum");
  revalidatePath("/pages/dasar-hukum");
}

async function updateDocument(formData: FormData) {
  "use server";
  const session = await getAdminSession();
  const canManage = await hasPermission(Number(session?.id), "menu.tentang");
  if (
    !canManage ||
    (session?.role !== "superadmin" &&
      session?.role !== "admin" &&
      session?.role !== "content_admin")
  ) {
    return;
  }

  const id = Number(formData.get("id"));
  const badge = String(formData.get("badge") || "").trim();
  const judul = String(formData.get("judul") || "").trim();
  const deskripsi = String(formData.get("deskripsi") || "").trim() || null;
  const nomor_urut = Number(formData.get("nomor_urut") || 0);

  const pdfFile = formData.get("pdf_file") as File | null;

  if (!id || !badge || !judul) return;

  const existing = await prisma.dasar_hukum.findUnique({ where: { id } });
  let file_url = existing?.file_url;

  // Jika ada file PDF baru yang diunggah
  if (pdfFile && pdfFile.size > 0 && typeof pdfFile.arrayBuffer === "function") {
    try {
      const bytes = await pdfFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const safeName = `${Date.now()}-${pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public", "docs", "dasar-hukum");

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, safeName), buffer);

      // Hapus file lama jika ada
      if (existing?.file_url?.startsWith("/docs/dasar-hukum/")) {
        await fs.unlink(path.join(process.cwd(), "public", existing.file_url)).catch(() => {});
      }

      file_url = `/docs/dasar-hukum/${safeName}`;
    } catch (err) {
      console.error("[Update PDF Error]", err);
    }
  }

  await prisma.dasar_hukum.update({
    where: { id },
    data: {
      badge,
      judul,
      deskripsi,
      nomor_urut: Number.isFinite(nomor_urut) ? nomor_urut : 0,
      ...(file_url ? { file_url } : {}),
    },
  });

  revalidatePath("/admin/dasar-hukum");
  revalidatePath("/pages/dasar-hukum");
  redirect("/admin/dasar-hukum");
}

async function toggleActive(formData: FormData) {
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
  const next = formData.get("next") === "1";
  if (!id) return;
  await prisma.dasar_hukum.update({
    where: { id },
    data: { is_active: next },
  });
  revalidatePath("/admin/dasar-hukum");
  revalidatePath("/pages/dasar-hukum");
}

async function deleteDocument(formData: FormData) {
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

  const target = await prisma.dasar_hukum.findUnique({ where: { id } });

  if (target?.file_url?.startsWith("/docs/dasar-hukum/")) {
    const fullPath = path.join(process.cwd(), "public", target.file_url);
    await fs.unlink(fullPath).catch(() => {});
  }

  await prisma.dasar_hukum.delete({ where: { id } });
  revalidatePath("/admin/dasar-hukum");
  revalidatePath("/pages/dasar-hukum");
}

export default async function AdminDasarHukumPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const session = await requirePermission("menu.tentang");
  const canManage =
    session.role === "superadmin" ||
    session.role === "admin" ||
    session.role === "content_admin";

  const sp = await searchParams;
  const editId = sp.edit ? Number(sp.edit) : null;

  const [rows, editingItem] = await Promise.all([
    prisma.dasar_hukum.findMany({
      orderBy: [{ nomor_urut: "asc" }, { id: "asc" }],
    }),
    editId ? prisma.dasar_hukum.findUnique({ where: { id: editId } }) : null,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Scale size={22} className="text-[#b8860b]" />
            Dasar Hukum & Kebijakan
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {canManage
              ? "Unggah dan kelola dokumen SK, Peraturan Menteri, dan kebijakan yang tampil di portal publik."
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
            {rows.length} dokumen
          </span>
        </div>
      </div>

      {/* Form Tambah Dokumen */}
      {canManage && (
        <form
          action={createDocument}
          className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4"
        >
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <Plus size={16} /> Tambah & Upload Dokumen Baru
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-zinc-500 mb-1 block font-medium">Urutan Tampil</label>
              <input
                name="nomor_urut"
                type="number"
                defaultValue={rows.length + 1}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 mb-1 block font-medium">
                Badge / Jenis <span className="text-red-500">*</span>
              </label>
              <input
                name="badge"
                required
                placeholder="Keputusan Menteri"
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-zinc-500 mb-1 block font-medium">
                Judul Dokumen / Peraturan <span className="text-red-500">*</span>
              </label>
              <input
                name="judul"
                required
                placeholder="Kepmenbud No. ... Tahun 2024 tentang ..."
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="text-xs text-zinc-500 mb-1 block font-medium flex items-center gap-1.5">
                <FileText size={14} className="text-[#b8860b]" /> Upload File PDF <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="pdf_file"
                required
                accept=".pdf,application/pdf"
                className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#b8860b]/15 file:text-[#b8860b] hover:file:bg-[#b8860b]/25 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 p-1.5 cursor-pointer"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="text-xs text-zinc-500 mb-1 block font-medium">Deskripsi Singkat (Opsional)</label>
              <input
                name="deskripsi"
                placeholder="Ringkasan isi kebijakan atau dasar hukum..."
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[#b8860b] text-white text-sm font-semibold px-5 py-2.5 hover:bg-[#9a7009] transition shadow-sm"
          >
            <Upload size={16} /> Upload & Simpan Dokumen
          </button>
        </form>
      )}

      {/* Tabel Dokumen */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3 w-14">No</th>
                <th className="px-4 py-3">Badge</th>
                <th className="px-4 py-3">Judul Kebijakan</th>
                <th className="px-4 py-3">File Dokumen</th>
                <th className="px-4 py-3 text-center">Status</th>
                {canManage && <th className="px-4 py-3 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 6 : 5} className="py-10 text-center text-zinc-400">
                    Belum ada dokumen dasar hukum.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition"
                  >
                    <td className="px-4 py-3 tabular-nums text-zinc-400 font-bold">
                      {String(r.nomor_urut).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                        {r.badge}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                        {r.judul}
                      </div>
                      {r.deskripsi && (
                        <div className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">
                          {r.deskripsi}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-zinc-500">
                      {r.file_url ? (
                        <a
                          href={r.file_url}
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
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          r.is_active
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
                        }`}
                      >
                        {r.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    {canManage && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {/* Tombol Edit Per Item */}
                          <a
                            href={`/admin/dasar-hukum?edit=${r.id}`}
                            title="Edit Dokumen"
                            className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-[#b8860b] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                          >
                            <Pencil size={15} />
                          </a>

                          <form action={toggleActive}>
                            <input type="hidden" name="id" value={r.id} />
                            <input
                              type="hidden"
                              name="next"
                              value={r.is_active ? "0" : "1"}
                            />
                            <button
                              type="submit"
                              title={r.is_active ? "Nonaktifkan" : "Aktifkan"}
                              className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                            >
                              {r.is_active ? (
                                <ToggleRight size={18} className="text-emerald-600" />
                              ) : (
                                <ToggleLeft size={18} />
                              )}
                            </button>
                          </form>
                          <form action={deleteDocument}>
                            <input type="hidden" name="id" value={r.id} />
                            <button
                              type="submit"
                              title="Hapus dokumen"
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </form>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL POPUP EDIT DOKUMEN DASAR HUKUM                     */}
      {/* ======================================================== */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <a
            href="/admin/dasar-hukum"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-default"
            aria-label="Tutup modal"
          />

          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-sm">
                <Pencil size={16} className="text-[#b8860b]" /> Edit Dokumen #{editingItem.id}
              </div>
              <a
                href="/admin/dasar-hukum"
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X size={18} />
              </a>
            </div>

            <form action={updateDocument} className="space-y-4">
              <input type="hidden" name="id" value={editingItem.id} />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block font-medium">Urutan Tampil</label>
                  <input
                    name="nomor_urut"
                    type="number"
                    defaultValue={editingItem.nomor_urut}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500 mb-1 block font-medium">Badge / Jenis</label>
                  <input
                    name="badge"
                    required
                    defaultValue={editingItem.badge}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1 block font-medium">
                  Judul Dokumen <span className="text-red-500">*</span>
                </label>
                <input
                  name="judul"
                  required
                  defaultValue={editingItem.judul}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1 block font-medium">
                  Ganti File Dokumen (Kosongkan jika tidak diganti)
                </label>
                <input
                  type="file"
                  name="pdf_file"
                  accept=".pdf,application/pdf"
                  className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#b8860b]/15 file:text-[#b8860b] hover:file:bg-[#b8860b]/25 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 p-1.5 cursor-pointer"
                />
                <span className="text-[10px] text-zinc-400 mt-1 block">
                  File saat ini: {editingItem.file_url}
                </span>
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1 block font-medium">Deskripsi Singkat</label>
                <textarea
                  name="deskripsi"
                  rows={3}
                  defaultValue={editingItem.deskripsi || ""}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b] resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <a
                  href="/admin/dasar-hukum"
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