import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  // Client generation and frontend builds do not require a live database.
  // Runtime and migration commands receive the real URL from DATABASE_URL.
  datasource: {
    url: process.env.DATABASE_URL ?? 'postgresql://build:build@127.0.0.1:5432/aurastore',
  },
});
