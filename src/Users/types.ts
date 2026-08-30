// ──────────────────────────────────────────────────────────────────────────────
// AuraStore – Users Module Types
// ──────────────────────────────────────────────────────────────────────────────

import type { Address } from '../types';

export type UserRole = 'CUSTOMER' | 'VIP' | 'WHOLESALER' | 'BLOCKED_CUSTOMER';
export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'PENDING';

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
  addresses: Address[];
  notes?: string;
  isDemoUser?: boolean;
  orderCount?: number;
  totalSpent?: number;
  lastOrderDate?: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
  status?: UserStatus;
  notes?: string;
  avatar?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
  notes?: string;
  avatar?: string;
  addresses?: Address[];
}

export interface UsersFilter {
  search: string;
  status: UserStatus | 'ALL';
  role: UserRole | 'ALL';
  sortBy: 'name' | 'email' | 'joinedDate' | 'totalSpent' | 'orderCount';
  sortDir: 'asc' | 'desc';
}

export interface UserStats {
  total: number;
  active: number;
  blocked: number;
  pending: number;
  vip: number;
  totalSpendAll: number;
  newThisMonth: number;
}
