import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { Users, UserPlus, Pencil, ShieldAlert } from "lucide-react";
import bcrypt from "bcryptjs";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { admins_role } from "@prisma/client";

export const dynamic = "force-dynamic";

/**
 * Role (nilai DB) → label UI resmi
 * Selaras dengan enum admins_role di MySQL & schema.prisma
 */
export const ROLE_OPTIONS = [
  { value: "superadmin", label: "Super Admin" },
  { value: "admin", label: "Administrator" },
  { value: "data_admin", label: "Pengelola Data" },
  { value: "data_verifikator", label: "Verifikator Data" },
  { value: "content_admin", label: "Pengelola Konten" },
  { value: "service_admin", label: "Pengelola Layanan" },
] as const;

type RoleValue = (typeof ROLE_OPTIONS)[number]["value"];

function roleLabel(role: string) {
  return ROLE_OPTIONS.find((r) => r.value === role)?.label ?? role;
}

/**
 * Helper untuk menyelaraskan ke tabel RBAC admin_roles
 */
async function syncAdminRole(adminId: number, roleKode: string) {
  const roleRecord = await prisma.roles.findUnique({ where: { kode: roleKode } });
  if (roleRecord) {
    await prisma.admin_roles.deleteMany({ where: { admin_id: adminId } });
    await prisma.admin_roles.create({
      data: {
        admin_id: adminId,
        role_id: roleRecord.id,
      },
    });
  } else {
    console.warn(`[RBAC Sync] Role dengan kode "${roleKode}" belum ada di tabel roles.`);
  }
}

async function createAdmin(formData: FormData) {
  "use server";
  const session = await getAdminSession();
  if (session?.role !== "superadmin") return;

  const nama = String(formData.get("nama") || "").trim();
  const username = String(formData.get("username") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "admin").trim() as RoleValue;

  if (!username || !email || password.length < 6) return;
  if (!ROLE_OPTIONS.some((r) => r.value === role)) return;

  const hash = await bcrypt.hash(password, 10);
  const newAdmin = await prisma.admins.create({
    data: {
      nama: nama || null,
      username,
      email,
      password: hash,
      role: role as admins_role,
      status: "aktif",
      remember_token: "",
      foto: "",
    },
  });

  // Sinkronkan ke tabel RBAC admin_roles
  await syncAdminRole(newAdmin.id, role);

  revalidatePath("/admin/kelola-admin");
}

async function updateAdmin(formData: FormData) {
  "use server";
  const session = await getAdminSession();
  if (session?.role !== "superadmin") return;

  const id = Number(formData.get("id"));
  const nama = String(formData.get("nama") || "").trim();
  const username = String(formData.get("username") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const role = String(formData.get("role") || "").trim() as RoleValue;
  const newPassword = String(formData.get("new_password") || "");

  if (!id || !username || !email || !role) return;
  if (!ROLE_OPTIONS.some((r) => r.value === role)) return;

  let finalRole: RoleValue = role;

  // Jaga minimal harus ada 1 Super Admin aktif di sistem
  if (role !== "superadmin") {
    const current = await prisma.admins.findUnique({
      where: { id },
      select: { role: true },
    });
    if (current?.role === "superadmin") {
      const otherSuper = await prisma.admins.count({
        where: {
          role: "superadmin",
          status: "aktif",
          id: { not: id },
        },
      });
      if (otherSuper === 0) {
        finalRole = "superadmin"; // Batalkan penurunan role jika dia superadmin terakhir
      }
    }
  }

  // 1. Update data pada tabel admins
  await prisma.admins.update({
    where: { id },
    data: {
      nama: nama || null,
      username,
      email,
      role: finalRole as admins_role,
      ...(newPassword.length >= 6
        ? { password: await bcrypt.hash(newPassword, 10) }
        : {}),
    },
  });

  // 2. Sinkronkan ke tabel RBAC admin_roles
  await syncAdminRole(id, finalRole);

  revalidatePath("/admin/kelola-admin");
}

async function setStatus(formData: FormData) {
  "use server";
  const session = await getAdminSession();
  if (session?.role !== "superadmin") return;

  const id = Number(formData.get("id"));
  const status = String(formData.get("status")) as "aktif" | "nonaktif";
  if (!id || (status !== "aktif" && status !== "nonaktif")) return;
  if (Number(session.id) === id) return; // Tidak boleh menonaktifkan akun sendiri

  await prisma.admins.update({ where: { id }, data: { status } });
  revalidatePath("/admin/kelola-admin");
}

async function deleteAdmin(formData: FormData) {
  "use server";
  const session = await getAdminSession();
  if (session?.role !== "superadmin") return;

  const id = Number(formData.get("id"));
  if (!id || Number(session.id) === id) return; // Tidak boleh menghapus akun sendiri

  const target = await prisma.admins.findUnique({
    where: { id },
    select: { role: true },
  });
  if (!target) return;

  if (target.role === "superadmin") {
    const otherSuper = await prisma.admins.count({
      where: { role: "superadmin", id: { not: id } },
    });
    if (otherSuper === 0) return; // Jangan hapus jika superadmin terakhir
  }

  await prisma.admins.delete({ where: { id } });
  revalidatePath("/admin/kelola-admin");
}

export default async function AdminKelolaAdminPage() {
  const session = await getAdminSession();
  if (session?.role !== "superadmin") {
    redirect("/admin/dashboard");
  }

  const rows = await prisma.admins.findMany({
    orderBy: [{ id: "asc" }],
    select: {
      id: true,
      nama: true,
      username: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Users size={22} className="text-[#b8860b]" />
          Kelola Admin
        </h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          Tambah, ubah role wewenang, aktifkan/nonaktifkan, atau hapus akun admin portal IPK.
        </p>
      </div>

      {/* Form Tambah Akun Baru */}
      <form
        action={createAdmin}
        className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4"
      >
        <h2 className="text-sm font-bold flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100">
          <UserPlus size={16} /> Tambah Akun Admin
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Nama Lengkap</label>
            <input
              name="nama"
              placeholder="Contoh: Budi Santoso"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Username</label>
            <input
              name="username"
              required
              placeholder="username_admin"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="admin@kemenbud.go.id"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">
              Password (min. 6 karakter)
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Role Wewenang</label>
            <select
              name="role"
              defaultValue="admin"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-[#b8860b] text-white text-sm font-semibold px-4 py-2.5 hover:bg-[#9a7009] transition shadow-sm"
        >
          Simpan Akun
        </button>
      </form>

      {/* Daftar Semua Akun Admin */}
      <div className="space-y-4">
        {rows.map((a) => {
          const isSelf = Number(session.id) === a.id;
          return (
            <div
              key={a.id}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-5 shadow-sm space-y-4"
            >
              {/* Header Status Akun */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      a.role === "superadmin"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                        : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    {roleLabel(a.role)}
                  </span>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      a.status === "aktif"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                    }`}
                  >
                    {a.status}
                  </span>
                  {isSelf && (
                    <span className="text-xs text-[#b8860b] font-semibold bg-[#b8860b]/10 px-2 py-0.5 rounded-md">
                      (Sesi Anda)
                    </span>
                  )}
                </div>

                {/* Aksi Nonaktifkan & Hapus */}
                <div className="flex items-center gap-1.5">
                  {!isSelf && (
                    <form action={setStatus}>
                      <input type="hidden" name="id" value={a.id} />
                      <input
                        type="hidden"
                        name="status"
                        value={a.status === "aktif" ? "nonaktif" : "aktif"}
                      />
                      <button
                        type="submit"
                        className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 px-2.5 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                      >
                        {a.status === "aktif" ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    </form>
                  )}
                  {!isSelf && (
                    <ConfirmDeleteButton
                      id={a.id}
                      itemLabel={a.nama || a.username}
                      entityLabel="akun admin"
                      deleteAction={deleteAdmin}
                    />
                  )}
                </div>
              </div>

              {/* Form Edit Akun */}
              <form action={updateAdmin} className="space-y-4">
                <input type="hidden" name="id" value={a.id} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Nama</label>
                    <input
                      name="nama"
                      defaultValue={a.nama || ""}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Username</label>
                    <input
                      name="username"
                      required
                      defaultValue={a.username}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      defaultValue={a.email}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block font-medium">
                      Role Wewenang
                    </label>
                    <select
                      key={`${a.id}-${a.role}`}
                      name="role"
                      defaultValue={a.role}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">
                      Ganti Password (opsional)
                    </label>
                    <input
                      name="new_password"
                      type="password"
                      minLength={6}
                      placeholder="Kosongkan jika tidak diganti"
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#b8860b] text-white text-xs font-semibold px-3.5 py-2 hover:bg-[#9a7009] transition shadow-sm"
                >
                  <Pencil size={14} /> Simpan Perubahan
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}