import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../db.js';
import { env } from '../config.js';
import { requireAdmin } from '../middleware/auth.js';
import type { AdminClaims } from '../types.js';
import {
  clearAuthCookies,
  createAccessToken,
  createRefreshToken,
  fail,
  hashToken,
  ok,
  setAuthCookies,
} from '../utils.js';

export const authRouter = Router();
const credentialsSchema = z.object({ email: z.string().min(1), password: z.string().min(1) });

authRouter.post('/login', async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 'Valid username or email and password are required', 422);
  const input = parsed.data.email.trim().toLowerCase();
  const emailToFind = input === 'admin' ? 'admin@aurastore.com' : input;
  const admin = await prisma.adminUser.findFirst({
    where: {
      OR: [{ email: input }, { email: emailToFind }],
    },
  });
  if (!admin || !admin.active || !(await bcrypt.compare(parsed.data.password, admin.passwordHash))) {
    return fail(res, 'Invalid administrator credentials', 401);
  }

  const accessToken = createAccessToken(admin);
  const placeholderHash = hashToken(`${admin.id}:${Date.now()}:${Math.random()}`);
  const session = await prisma.adminSession.create({
    data: { adminId: admin.id, refreshTokenHash: placeholderHash, expiresAt: new Date(Date.now() + 7 * 86400000) },
  });
  const refreshToken = createRefreshToken(admin, session.id);
  await prisma.adminSession.update({ where: { id: session.id }, data: { refreshTokenHash: hashToken(refreshToken) } });
  setAuthCookies(res, accessToken, refreshToken);
  return ok(
    res,
    { id: admin.id, name: admin.name, email: admin.email, role: admin.role, token: accessToken },
    'Signed in successfully'
  );
});

authRouter.post('/refresh', async (req, res) => {
  const token = req.cookies?.aura_admin_refresh;
  if (!token) return fail(res, 'Refresh session required', 401);
  try {
    const claims = jwt.verify(token, env.JWT_REFRESH_SECRET) as AdminClaims;
    if (claims.type !== 'refresh' || !claims.sessionId) return fail(res, 'Invalid refresh session', 401);
    const session = await prisma.adminSession.findUnique({ where: { id: claims.sessionId }, include: { admin: true } });
    if (!session || session.expiresAt < new Date() || session.refreshTokenHash !== hashToken(token) || !session.admin.active) {
      clearAuthCookies(res);
      return fail(res, 'Refresh session expired', 401);
    }
    const nextAccess = createAccessToken(session.admin);
    const nextRefresh = createRefreshToken(session.admin, session.id);
    await prisma.adminSession.update({ where: { id: session.id }, data: { refreshTokenHash: hashToken(nextRefresh) } });
    setAuthCookies(res, nextAccess, nextRefresh);
    return ok(res, {
      id: session.admin.id,
      name: session.admin.name,
      email: session.admin.email,
      role: session.admin.role,
      token: nextAccess,
    });
  } catch {
    clearAuthCookies(res);
    return fail(res, 'Refresh session expired', 401);
  }
});

authRouter.get('/me', requireAdmin, async (req, res) => {
  const admin = await prisma.adminUser.findUnique({ where: { id: req.admin!.sub }, select: { id: true, name: true, email: true, role: true, active: true } });
  if (!admin?.active) return fail(res, 'Administrator account unavailable', 401);
  return ok(res, admin);
});

authRouter.post('/logout', async (req, res) => {
  const token = req.cookies?.aura_admin_refresh;
  if (token) await prisma.adminSession.deleteMany({ where: { refreshTokenHash: hashToken(token) } });
  clearAuthCookies(res);
  return ok(res, null, 'Signed out successfully');
});
