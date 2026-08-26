import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';
import { env } from './config.js';

const globalDatabase = globalThis as unknown as { prisma?: PrismaClient; pool?: pg.Pool };
const pool = globalDatabase.pool ?? new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});
const adapter = new PrismaPg(pool);

export const prisma = globalDatabase.prisma ?? new PrismaClient({ adapter });
if (env.SERVER_ENV !== 'production') {
  globalDatabase.prisma = prisma;
  globalDatabase.pool = pool;
}

