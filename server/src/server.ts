import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ZodError } from 'zod';
import { env } from './config.js';
import { prisma } from './db.js';
import { requireAdmin } from './middleware/auth.js';
import { adminRouter } from './routes/admin.js';
import { authRouter } from './routes/auth.js';
import { publicRouter } from './routes/public.js';
import { fail, ok } from './utils.js';

const app = express();
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

const allowedOrigins = [env.CLIENT_URL, 'http://localhost:5173'].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIR), { maxAge: env.SERVER_ENV === 'production' ? '7d' : 0 }));

app.use('/api/admin/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 40, standardHeaders: true, legacyHeaders: false }), authRouter);
app.use('/api/admin', requireAdmin, adminRouter);
app.use('/api', publicRouter);
app.get('/api/health', async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  return ok(res, { database: 'connected', timestamp: new Date().toISOString() }, 'AuraStore API is healthy');
});

app.use('/api', (_req, res) => fail(res, 'API route not found', 404));

const distPath = path.resolve('dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('{*splat}', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof ZodError) return fail(res, 'Invalid request', 422, error.flatten());
  console.error(error);
  return fail(res, 'An unexpected server error occurred', 500);
});

const server = app.listen(env.PORT, () => console.log(`AuraStore API listening on http://localhost:${env.PORT}`));
const shutdown = async () => {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
