import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Melakukan query ringan ke database
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ 
      status: 'success', 
      message: 'Database Railway BERHASIL terhubung ke Vercel!' 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Gagal terhubung ke database', 
      error: error.message 
    }, { status: 500 });
  }
}