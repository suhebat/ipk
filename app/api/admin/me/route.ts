import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const s = await getAdminSession();
  if (!s) return NextResponse.json({ admin: null }, { status: 401 });
  return NextResponse.json({ admin: s });
}