import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// On Vercel / Serverless environments, SQLite requires a writable directory (/tmp)
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  const tmpDbPath = path.join('/tmp', 'dev.db');
  const projectDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  const rootDbPath = path.join(process.cwd(), 'dev.db');

  const sourceDbPath = fs.existsSync(projectDbPath)
    ? projectDbPath
    : fs.existsSync(rootDbPath)
    ? rootDbPath
    : null;

  if (sourceDbPath && !fs.existsSync(tmpDbPath)) {
    try {
      fs.copyFileSync(sourceDbPath, tmpDbPath);
      console.log(`Copied SQLite database from ${sourceDbPath} to ${tmpDbPath}`);
    } catch (err) {
      console.error('Error copying SQLite database to /tmp:', err);
    }
  }

  if (fs.existsSync(tmpDbPath)) {
    process.env.DATABASE_URL = `file:${tmpDbPath}`;
  }
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

