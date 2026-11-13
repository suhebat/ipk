import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb'; // <-- ganti jadi PrismaMariaDb (b kecil)
import mariadb from 'mariadb';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionUrl = process.env.DATABASE_URL;

  if (!connectionUrl) {
    throw new Error('DATABASE_URL environment variable is not defined.');
  }

  const pool = mariadb.createPool({
    connectionLimit: 5,
    connectTimeout: 30000,
    idleTimeout: 30000,
    acquireTimeout: 30000,
    host: new URL(connectionUrl).hostname,
    port: Number(new URL(connectionUrl).port) || 3306,
    user: new URL(connectionUrl).username,
    password: decodeURIComponent(new URL(connectionUrl).password),
    database: new URL(connectionUrl).pathname.replace('/', ''),
    ssl: false,
  });

  const adapter = new PrismaMariaDb(pool); // <-- ganti jadi PrismaMariaDb

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;