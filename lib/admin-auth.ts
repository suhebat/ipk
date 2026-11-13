import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const COOKIE = "ipk_admin_session";
const IMPERSONATE_COOKIE = "impersonated_role";

// Daftar seluruh role yang valid
export type AdminRole =
  | "superadmin"
  | "admin"
  | "data_admin"
  | "data_verifikator"
  | "content_admin"
  | "service_admin";

export type AdminSession = {
  id: number;
  username: string;
  nama: string;
  role: AdminRole;
  isImpersonating?: boolean;
  realRole?: AdminRole;
};

function secret(): Uint8Array {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_SESSION_SECRET belum diset atau kurang dari 32 karakter");
    }
    // Fallback hanya untuk development lokal
    return new TextEncoder().encode("dev-only-secret-jangan-dipakai-di-production-32c");
  }
  return new TextEncoder().encode(s);
}

export async function createAdminSession(payload: AdminSession, remember = false) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(remember ? "30d" : "1d")
    .sign(secret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
  });
}

export async function destroyAdminSession() {
  const jar = await cookies();
  jar.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  jar.set(IMPERSONATE_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret());
    const adminId = Number(payload.id);
    if (!adminId) return null;

    // SELALU BACA ROLE ASLI TERBARU DARI DATABASE
    const admin = await prisma.admins.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        username: true,
        nama: true,
        role: true,
        status: true,
      },
    });

    if (!admin || admin.status !== "aktif") {
      return null;
    }

    const realRole = admin.role as AdminRole;
    let effectiveRole = realRole;
    let isImpersonating = false;

    // FITUR SWITCH ROLE IMPERSONASI: Hanya berlaku jika akun aslinya adalah Super Admin
    if (realRole === "superadmin") {
      const simRole = jar.get(IMPERSONATE_COOKIE)?.value as AdminRole | undefined;
      if (simRole && simRole !== "superadmin") {
        effectiveRole = simRole;
        isImpersonating = true;
      }
    }

    return {
      id: admin.id,
      username: admin.username,
      nama: admin.nama || admin.username,
      role: effectiveRole,
      isImpersonating,
      realRole,
    };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AdminSession> {
  const s = await getAdminSession();
  if (!s) throw new Error("UNAUTHORIZED");
  return s;
}