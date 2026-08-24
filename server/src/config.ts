import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  PORT: z.coerce.number().int().positive().default(3000),
  SERVER_ENV: z.enum(['development', 'test', 'production']).default('development'),
  UPLOAD_DIR: z.string().default('uploads'),
});

export const env = schema.parse(process.env);
export const isProduction = env.SERVER_ENV === 'production';
