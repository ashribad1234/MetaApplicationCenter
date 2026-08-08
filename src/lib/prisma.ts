import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// On Vercel / Serverless environments, SQLite requires a writable directory (/tmp)
if (process.env.VERCEL) {
  try {
    const tmpDbPath = path.join('/tmp', 'dev.db');
    const projectDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const rootDbPath = path.join(process.cwd(), 'dev.db');

    const sourceDbPath = fs.existsSync(projectDbPath)
      ? projectDbPath
      : fs.existsSync(rootDbPath)
      ? rootDbPath
      : null;

    if (sourceDbPath && !fs.existsSync(tmpDbPath)) {
      fs.copyFileSync(sourceDbPath, tmpDbPath);
      console.log(`Copied SQLite database from ${sourceDbPath} to ${tmpDbPath}`);
    }

    if (fs.existsSync(tmpDbPath)) {
      process.env.DATABASE_URL = `file:${tmpDbPath}`;
    }
  } catch (err) {
    console.error('Vercel DB copy log:', err);
  }
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

