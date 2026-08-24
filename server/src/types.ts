import type { AdminRole } from '../../generated/prisma/client.js';

export interface AdminClaims {
  sub: string;
  email: string;
  role: AdminRole;
  type: 'access' | 'refresh';
  sessionId?: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AdminClaims;
    }
  }
}

export {};
