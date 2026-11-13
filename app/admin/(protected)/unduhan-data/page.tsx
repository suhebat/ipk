import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { Download, Search } from "lucide-react";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { requirePermission } from "@/lib/permissions";

export const dynamic = "force-dynamic";

/** Normalisasi format unduhan */
function normalizeFormat(raw: string | null | undefined): "xlsx" | "csv" | "pdf" | null {
  const v = (raw || "").trim().toLowerCase();
  if (!v) return null;
  if (v === "xlsx" || v === "excel" || v === "xls") return "xlsx";
  if (v === "csv") return "csv";
  if (v === "pdf") return "pdf";
  return null;
}

async function deleteLog(formData: FormData) {
  "use server";
  const session = await getAdminSession();
  if (session?.role !== "superadmin") return;

  const id = Number(formData.get("id"));
  if (!id) return;

  await prisma.download_survey.delete({ where: { id } });
  revalidatePath("/admin/unduhan-data");
  revalidatePath("/admin/dashboard");
}

export default async function AdminUnduhanDataPage() {
  // Hanya admin yang memiliki permission menu.unduhan yang bisa masuk
  const session = await requirePermission("menu.unduhan");
  const isSuper = session?.role === "superadmin";

  const [rows, total] = await Promise.all([
    prisma.download_survey.findMany({
      orderBy: { created_at: "desc" },
      take: 200,
    }),
    prisma.download_survey.count(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Download size={22} className="text-[#b8860b]" />
            Log Unduhan Data
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Data kuesioner dan survei pengguna sebelum mengunduh dataset di portal publik.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#b8860b]/10 text-[#b8860b] border border-[#b8860b]/20">
          {total} total unduhan tercatat
        </span>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">Responden</th>
                <th className="px-4 py-3">Bidang Kerja</th>
                <th className="px-4 py-3">Dataset / Halaman</th>
                <th className="px-4 py-3">Tujuan Unduh</th>
                <th className="px-4 py-3 text-center">Format</th>
                <th className="px-4 py-3">Waktu</th>
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
                    Belum ada data survei unduhan yang tercatat.
                  </td>
                </tr>
              ) : (
                rows.map((d) => {
                  const fmt = normalizeFormat(d.jenis_unduh);
                  return (
                    <tr
                      key={d.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition"
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {d.nama}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono">
                          {d.email}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 font-medium text-[11px] text-zinc-700 dark:text-zinc-300">
                          {d.bidang_pekerjaan || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium capitalize text-zinc-900 dark:text-zinc-100">
                          {d.halaman}
                          {d.provinsi ? ` · ${d.provinsi}` : ""}
                        </div>
                        {d.tahun != null && d.tahun !== 0 && (
                          <div className="text-[11px] text-zinc-400">
                            Tahun {d.tahun}
                          </div>
                        )}
                      </td>
                      <td
                        className="px-4 py-3 max-w-xs truncate text-zinc-600 dark:text-zinc-300"
                        title={d.tujuan_unduh}
                      >
                        {d.tujuan_unduh}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {fmt ? (
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              fmt === "xlsx"
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                : fmt === "csv"
                                ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                                : "bg-red-500/10 text-red-600 border border-red-500/20"
                            }`}
                          >
                            {fmt.toUpperCase()}
                          </span>
                        ) : (
                          <span
                            className="inline-block px-2 py-0.5 rounded text-[10px] font-medium text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-600"
                            title={d.jenis_unduh || "Format belum tercatat"}
                          >
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-zinc-500 whitespace-nowrap text-[11px]">
                        {new Date(d.created_at).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      {isSuper && (
                        <td className="px-4 py-3 text-right">
                          <ConfirmDeleteButton
                            id={d.id}
                            itemLabel={`${d.nama} (${d.email})`}
                            entityLabel="log unduhan"
                            deleteAction={deleteLog}
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
    </div>
  );
}