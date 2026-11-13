import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { User, Save, KeyRound, ShieldCheck } from "lucide-react";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

async function updateProfile(formData: FormData) {
  "use server";
  const session = await getAdminSession();
  if (!session?.id) redirect("/admin/login");

  const nama = String(formData.get("nama") || "").trim();
  const email = String(formData.get("email") || "").trim();

  if (!email) return;

  await prisma.admins.update({
    where: { id: Number(session.id) },
    data: {
      nama: nama || null,
      email,
    },
  });

  revalidatePath("/admin/profil");
  revalidatePath("/admin/dashboard");
}

async function changePassword(formData: FormData) {
  "use server";
  const session = await getAdminSession();
  if (!session?.id) redirect("/admin/login");

  const current = String(formData.get("current_password") || "");
  const next = String(formData.get("new_password") || "");
  const confirm = String(formData.get("confirm_password") || "");

  if (!current || next.length < 6 || next !== confirm) {
    redirect("/admin/profil?pwd=invalid");
  }

  const admin = await prisma.admins.findUnique({
    where: { id: Number(session.id) },
    select: { password: true },
  });
  if (!admin) redirect("/admin/login");

  const ok = await bcrypt.compare(current, admin.password);
  if (!ok) redirect("/admin/profil?pwd=wrong");

  const hash = await bcrypt.hash(next, 10);
  await prisma.admins.update({
    where: { id: Number(session.id) },
    data: { password: hash },
  });

  redirect("/admin/profil?pwd=ok");
}

export default async function AdminProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ pwd?: string }>;
}) {
  const session = await getAdminSession();
  if (!session?.id) redirect("/admin/login");

  const sp = await searchParams;
  const admin = await prisma.admins.findUnique({
    where: { id: Number(session.id) },
    select: {
      id: true,
      nama: true,
      username: true,
      email: true,
      role: true,
      status: true,
      foto: true,
    },
  });

  if (!admin) redirect("/admin/login");

  const displayName = admin.nama || admin.username;
  const pwdMsg =
    sp.pwd === "ok"
      ? { type: "ok" as const, text: "Password berhasil diubah." }
      : sp.pwd === "wrong"
      ? { type: "err" as const, text: "Password saat ini salah." }
      : sp.pwd === "invalid"
      ? {
          type: "err" as const,
          text: "Password baru minimal 6 karakter dan harus sama dengan konfirmasi.",
        }
      : null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <User size={22} className="text-[#b8860b]" />
          Pengaturan Akun
        </h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          Perbarui profil dan kata sandi akun admin Anda.
        </p>
      </div>

      {/* Kartu identitas */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#b8860b]/30 to-[#b8860b]/10 text-[#b8860b] flex items-center justify-center text-2xl font-bold uppercase shrink-0">
          {displayName.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
            {displayName}
          </div>
          <div className="text-xs text-zinc-500 font-mono">@{admin.username}</div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                admin.role === "superadmin"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800"
              }`}
            >
              <ShieldCheck size={11} />
              {admin.role}
            </span>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                admin.status === "aktif"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {admin.status}
            </span>
          </div>
        </div>
      </div>

      {/* Form profil */}
      <form
        action={updateProfile}
        className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4"
      >
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          Data profil
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Username</label>
            <input
              value={admin.username}
              disabled
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/50 px-3 py-2 text-sm text-zinc-500 cursor-not-allowed"
            />
            <p className="text-[11px] text-zinc-400 mt-1">Username tidak dapat diubah.</p>
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Role</label>
            <input
              value={admin.role}
              disabled
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/50 px-3 py-2 text-sm text-zinc-500 cursor-not-allowed capitalize"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Nama tampilan</label>
            <input
              name="nama"
              defaultValue={admin.nama || ""}
              placeholder="Nama lengkap"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Email</label>
            <input
              name="email"
              type="email"
              required
              defaultValue={admin.email}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-[#b8860b] text-white text-sm font-semibold px-4 py-2.5 hover:bg-[#9a7009] transition"
        >
          <Save size={16} />
          Simpan profil
        </button>
      </form>

      {/* Form password */}
      <form
        action={changePassword}
        className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4"
      >
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
          <KeyRound size={16} />
          Ubah password
        </h2>

        {pwdMsg && (
          <div
            className={`text-xs font-medium rounded-xl px-3 py-2 ${
              pwdMsg.type === "ok"
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                : "bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20"
            }`}
          >
            {pwdMsg.text}
          </div>
        )}

        <div className="space-y-3 max-w-md">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">
              Password saat ini
            </label>
            <input
              name="current_password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">
              Password baru (min. 6 karakter)
            </label>
            <input
              name="new_password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">
              Konfirmasi password baru
            </label>
            <input
              name="confirm_password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl border border-[#b8860b] text-[#b8860b] text-sm font-semibold px-4 py-2.5 hover:bg-[#b8860b]/10 transition"
        >
          <KeyRound size={16} />
          Ubah password
        </button>
      </form>
    </div>
  );
}
