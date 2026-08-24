import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AdminRole } from '../../../generated/prisma/client.js';
import { env } from '../config.js';
import type { AdminClaims } from '../types.js';
import { fail } from '../utils.js';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.aura_admin_access;
  if (!token) return fail(res, 'Administrator authentication required', 401);
  try {
    const claims = jwt.verify(token, env.JWT_ACCESS_SECRET) as AdminClaims;
    if (claims.type !== 'access') return fail(res, 'Invalid administrator session', 401);
    req.admin = claims;
    next();
  } catch {
    return fail(res, 'Administrator session expired', 401);
  }
};

export const requireRole = (...roles: AdminRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin || !roles.includes(req.admin.role)) return fail(res, 'Insufficient permissions', 403);
    next();
  };
