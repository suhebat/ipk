import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

export async function POST(req: Request) {
  const jar = await cookies();
  const token = jar.get("ipk_admin_session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verifikasi bahwa user asli benar-benar Superadmin di database
  const secretKey = new TextEncoder().encode(
    process.env.ADMIN_SESSION_SECRET || "dev-only-secret-jangan-dipakai-di-production-32c"
  );
  const { payload } = await jwtVerify(token, secretKey);
  const admin = await prisma.admins.findUnique({ where: { id: Number(payload.id) } });

  if (admin?.role !== "superadmin") {
    return NextResponse.json({ error: "Hanya Super Admin yang berhak switch role" }, { status: 403 });
  }

  const { targetRole } = await req.json();

  if (!targetRole || targetRole === "superadmin" || targetRole === "reset") {
    // Hapus simulasi, kembali normal ke Super Admin
    jar.delete("impersonated_role");
  } else {
    // Set role simulasi ke cookie
    jar.set("impersonated_role", targetRole, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
  }

  return NextResponse.json({ success: true, activeRole: targetRole });
}