import { PrismaClient } from '@prisma/client';
import { PrismaMariaDB } from '@prisma/adapter-mariadb';
import mariadb from 'mariadb';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionUrl = process.env.DATABASE_URL;

  if (!connectionUrl) {
    throw new Error('DATABASE_URL environment variable is not defined.');
  }

  // Konfigurasi pool koneksi MariaDB yang aman untuk Vercel & Railway
  const pool = mariadb.createPool({
    connectionLimit: 5,
    connectTimeout: 30000, // Timeout 30 detik agar koneksi remote tidak cepat putus
    idleTimeout: 30000,
    acquireTimeout: 30000,
    host: new URL(connectionUrl).hostname,
    port: Number(new URL(connectionUrl).port) || 3306,
    user: new URL(connectionUrl).username,
    password: decodeURIComponent(new URL(connectionUrl).password),
    database: new URL(connectionUrl).pathname.replace('/', ''),
    ssl: false, // Railway TCP Proxy MariaDB/MySQL default tidak memerlukan SSL kustom
  });

  const adapter = new PrismaMariaDB(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

// Mencegah pembuatan instance baru secara berulang saat hot-reload di Next.js
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;