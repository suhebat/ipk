import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dimensions = await prisma.dimensions.findMany();
    return NextResponse.json({
      ok: true,
      total: dimensions.length,
      data: dimensions,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}