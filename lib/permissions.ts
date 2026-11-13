import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

/**
 * Mengambil daftar kode permission yang dimiliki oleh admin tertentu
 */
export async function getAdminPermissions(adminId: number): Promise<string[]> {
  const admin = await prisma.admins.findUnique({
    where: { id: adminId },
    select: {
      role: true,
      admin_roles: {
        select: {
          role: {
            select: {
              role_permissions: {
                select: {
                  permission: {
                    select: { kode: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!admin) return [];

  // Superadmin selalu memiliki seluruh permission
  if (admin.role === "superadmin") {
    const allPerms = await prisma.permissions.findMany({ select: { kode: true } });
    return allPerms.map((p) => p.kode);
  }

  const permissions = new Set<string>();
  for (const ar of admin.admin_roles) {
    for (const rp of ar.role.role_permissions) {
      permissions.add(rp.permission.kode);
    }
  }

  return Array.from(permissions);
}

/**
 * Cek apakah admin aktif memiliki permission tertentu
 */
export async function hasPermission(adminId: number, requiredPermission: string): Promise<boolean> {
  const perms = await getAdminPermissions(adminId);
  return perms.includes(requiredPermission);
}

/**
 * Menu yang bisa dilihat oleh seluruh admin terautentikasi (Read-Only)
 */
const GENERAL_VIEW_PERMISSIONS = [
  "menu.dashboard",
  "menu.data_nasional",
  "menu.data_provinsi",
  "menu.publikasi",
  "menu.faq",
  "menu.tentang",
  "menu.permohonan",
  "menu.surat",
  "menu.unduhan",
];

export async function requirePermission(permission: string, redirectTo = "/admin") {
  const session = await getAdminSession();
  if (!session?.id) {
    redirect("/admin/login");
  }

  // Jika menu umum dan user berstatus aktif, izinkan melihat (Read-Only)
  if (GENERAL_VIEW_PERMISSIONS.includes(permission)) {
    return session;
  }

  // Khusus menu sensitif (kelola_admin, pengaturan_sistem), cek strict ke DB
  const allowed = await hasPermission(Number(session.id), permission);
  if (!allowed) {
    redirect(redirectTo);
  }

  return session;
}

// -------------------------------------------------------------
// FILTER MENU SIDEBAR
// -------------------------------------------------------------

export interface MenuItem {
  title: string;
  href: string;
  icon?: string;
  permission?: string;
}

export const ADMIN_NAV_ITEMS: MenuItem[] = [
  { title: "Dashboard", href: "/admin", permission: "menu.dashboard" },
  { title: "Data Nasional", href: "/admin/data-nasional", permission: "menu.data_nasional" },
  { title: "Data Provinsi", href: "/admin/data-provinsi", permission: "menu.data_provinsi" },
  { title: "Publikasi", href: "/admin/publikasi", permission: "menu.publikasi" },
  { title: "FAQ", href: "/admin/faq", permission: "menu.faq" },
  { title: "Tentang IPK", href: "/admin/dasar-hukum", permission: "menu.tentang" },
  { title: "Permohonan Data", href: "/admin/permohonan-data", permission: "menu.permohonan" },
  { title: "Surat Masuk", href: "/admin/surat-masuk", permission: "menu.surat" },
  { title: "Unduhan Data", href: "/admin/unduhan", permission: "menu.unduhan" },
  { title: "Kelola Admin", href: "/admin/kelola-admin", permission: "menu.kelola_admin" },
  { title: "Pengaturan Sistem", href: "/admin/pengaturan", permission: "menu.pengaturan_sistem" },
];

export function filterMenuByPermissions(items: MenuItem[], userPermissions: string[]): MenuItem[] {
  return items.filter((item) => {
    if (!item.permission) return true;
    return userPermissions.includes(item.permission);
  });
}