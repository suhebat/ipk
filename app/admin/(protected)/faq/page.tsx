import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  HelpCircle,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Eye,
  Pencil,
  X,
  Save,
} from "lucide-react";
import { getAdminSession } from "@/lib/admin-auth";
import { requirePermission } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const KATEGORI_OPTIONS = [
  "Umum",
  "Metodologi",
  "Data & Hasil",
  "Unduhan",
  "Lainnya",
];

async function createFaq(formData: FormData) {
  "use server";
  const session = await getAdminSession();
  if (
    session?.role !== "superadmin" &&
    session?.role !== "admin" &&
    session?.role !== "content_admin"
  ) {
    return;
  }

  const kategori = String(formData.get("kategori") || "Umum").trim();
  const pertanyaan = String(formData.get("pertanyaan") || "").trim();
  const jawaban = String(formData.get("jawaban") || "").trim();
  const urutan = Number(formData.get("urutan") || 0);

  if (!pertanyaan || !jawaban) return;

  await prisma.faqs.create({
    data: {
      kategori,
      pertanyaan,
      jawaban,
      urutan: Number.isFinite(urutan) ? urutan : 0,
      is_active: true,
    },
  });

  revalidatePath("/admin/faq");
  revalidatePath("/pages/faq");
}

async function updateFaq(formData: FormData) {
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
  const kategori = String(formData.get("kategori") || "Umum").trim();
  const pertanyaan = String(formData.get("pertanyaan") || "").trim();
  const jawaban = String(formData.get("jawaban") || "").trim();
  const urutan = Number(formData.get("urutan") || 0);

  if (!id || !pertanyaan || !jawaban) return;

  await prisma.faqs.update({
    where: { id },
    data: {
      kategori,
      pertanyaan,
      jawaban,
      urutan: Number.isFinite(urutan) ? urutan : 0,
    },
  });

  revalidatePath("/admin/faq");
  revalidatePath("/pages/faq");
  redirect("/admin/faq"); // Tutup modal seketika
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

  await prisma.faqs.update({
    where: { id },
    data: { is_active: next },
  });

  revalidatePath("/admin/faq");
  revalidatePath("/pages/faq");
}

async function deleteFaq(formData: FormData) {
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

  await prisma.faqs.delete({ where: { id } });

  revalidatePath("/admin/faq");
  revalidatePath("/pages/faq");
}

export default async function AdminFaqPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const session = await requirePermission("menu.faq");
  const canManage =
    session.role === "superadmin" ||
    session.role === "admin" ||
    session.role === "content_admin";

  const sp = await searchParams;
  const editId = sp.edit ? Number(sp.edit) : null;

  const [rows, editingItem] = await Promise.all([
    prisma.faqs.findMany({
      orderBy: [{ urutan: "asc" }, { id: "asc" }],
    }),
    editId ? prisma.faqs.findUnique({ where: { id: editId } }) : null,
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <HelpCircle size={22} className="text-[#b8860b]" />
            Kelola Tanya Jawab (FAQ)
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {canManage
              ? "Kelola dan sesuaikan daftar pertanyaan serta jawaban yang tampil di portal publik."
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
            {rows.length} total FAQ
          </span>
        </div>
      </div>

      {/* Form Tambah FAQ Baru */}
      {canManage && (
        <form
          action={createFaq}
          className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4"
        >
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <Plus size={16} /> Tambah FAQ Baru
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-500 mb-1 block font-medium">Kategori</label>
              <select
                name="kategori"
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                defaultValue="Umum"
              >
                {KATEGORI_OPTIONS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-zinc-500 mb-1 block font-medium">Urutan Tampil</label>
              <input
                name="urutan"
                type="number"
                defaultValue={rows.length + 1}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-zinc-500 mb-1 block font-medium">
                Pertanyaan <span className="text-red-500">*</span>
              </label>
              <input
                name="pertanyaan"
                required
                placeholder="Contoh: Apa itu Indeks Pembangunan Kebudayaan (IPK)?"
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-zinc-500 mb-1 block font-medium">
                Jawaban <span className="text-red-500">*</span>
              </label>
              <textarea
                name="jawaban"
                required
                rows={3}
                placeholder="Tuliskan penjelasan jawaban secara lengkap dan jelas..."
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b] resize-y"
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[#b8860b] text-white text-sm font-semibold px-4 py-2.5 hover:bg-[#9a7009] transition shadow-sm"
          >
            <Plus size={16} /> Simpan FAQ
          </button>
        </form>
      )}

      {/* Tabel FAQ */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3 w-14">No</th>
                <th className="px-4 py-3 w-28">Kategori</th>
                <th className="px-4 py-3">Pertanyaan & Jawaban</th>
                <th className="px-4 py-3 text-center w-24">Status</th>
                {canManage && <th className="px-4 py-3 text-right w-28">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 5 : 4} className="py-10 text-center text-zinc-400">
                    Belum ada data FAQ yang terdaftar.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition"
                  >
                    <td className="px-4 py-3 tabular-nums font-bold text-zinc-400">
                      {r.urutan}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                        {r.kategori}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-lg">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                        {r.pertanyaan}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-1 line-clamp-2">
                        {r.jawaban}
                      </div>
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
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Tombol Edit Per Item */}
                          <a
                            href={`/admin/faq?edit=${r.id}`}
                            title="Edit FAQ"
                            className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-[#b8860b] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                          >
                            <Pencil size={15} />
                          </a>

                          {/* Tombol Toggle Aktif/Nonaktif */}
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

                          {/* Tombol Hapus */}
                          <form action={deleteFaq}>
                            <input type="hidden" name="id" value={r.id} />
                            <button
                              type="submit"
                              title="Hapus FAQ"
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                            >
                              <Trash2 size={15} />
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
      {/* MODAL POPUP EDIT PER ITEM                                */}
      {/* ======================================================== */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <a
            href="/admin/faq"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-default"
            aria-label="Tutup modal"
          />

          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-sm">
                <Pencil size={16} className="text-[#b8860b]" /> Edit FAQ #{editingItem.id}
              </div>
              <a
                href="/admin/faq"
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X size={18} />
              </a>
            </div>

            <form action={updateFaq} className="space-y-4">
              <input type="hidden" name="id" value={editingItem.id} />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block font-medium">Kategori</label>
                  <select
                    name="kategori"
                    defaultValue={editingItem.kategori}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                  >
                    {KATEGORI_OPTIONS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-zinc-500 mb-1 block font-medium">Urutan Tampil</label>
                  <input
                    name="urutan"
                    type="number"
                    defaultValue={editingItem.urutan}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1 block font-medium">
                  Pertanyaan <span className="text-red-500">*</span>
                </label>
                <input
                  name="pertanyaan"
                  required
                  defaultValue={editingItem.pertanyaan}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1 block font-medium">
                  Jawaban <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="jawaban"
                  required
                  rows={5}
                  defaultValue={editingItem.jawaban}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b] resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <a
                  href="/admin/faq"
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