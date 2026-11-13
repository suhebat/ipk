import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createAdminSession } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");
    const remember = Boolean(body.remember);

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    const admin = await prisma.admins.findUnique({ where: { username } });
    if (!admin) {
      return NextResponse.json(
        { error: "Username atau password salah." },
        { status: 401 }
      );
    }

    if (admin.status === "nonaktif") {
      return NextResponse.json(
        { error: "Akun Anda telah dinonaktifkan. Hubungi Super Admin." },
        { status: 403 }
      );
    }

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) {
      return NextResponse.json(
        { error: "Username atau password salah." },
        { status: 401 }
      );
    }

    await createAdminSession(
      {
        id: admin.id,
        username: admin.username,
        nama: admin.nama || admin.username,
        role: admin.role === "superadmin" ? "superadmin" : "admin",
      },
      remember
    );

    // opsional: catat log
    try {
      await prisma.log_aktivitas.create({
        data: {
          admin_id: admin.id,
          aktivitas: "Login ke panel admin",
          kategori: "Auth",
        },
      });
    } catch {
      /* ignore */
    }

    return NextResponse.json({
      ok: true,
      admin: {
        id: admin.id,
        username: admin.username,
        nama: admin.nama,
        role: admin.role,
      },
    });
  } catch (e: any) {
    console.error("[admin/login]", e);
    return NextResponse.json({ error: "Gagal login." }, { status: 500 });
  }
}