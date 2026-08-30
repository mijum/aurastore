// ──────────────────────────────────────────────────────────────────────────────
// AuraStore – Users Storage Layer (localStorage CRUD)
// ──────────────────────────────────────────────────────────────────────────────

import { INITIAL_REGISTERED_USERS } from './usersData';
import type { RegisteredUser, CreateUserInput, UpdateUserInput, UserStats } from './types';

const STORAGE_KEY = 'aurastore_accounts';
const ORDERS_KEY  = 'aurastore_orders';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readRaw(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_REGISTERED_USERS;
    const parsed = JSON.parse(raw) as RegisteredUser[];
    // Backfill role/status for legacy records that lack them
    return parsed.map((u) => ({
      ...u,
      role: u.role ?? 'CUSTOMER',
      status: u.status ?? 'ACTIVE',
    }));
  } catch {
    return INITIAL_REGISTERED_USERS;
  }
}

function persist(users: RegisteredUser[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    // Broadcast to other tabs
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
  } catch {
    /* storage quota exceeded – silent fail */
  }
}

function enrichWithOrderStats(users: RegisteredUser[]): RegisteredUser[] {
  try {
    const ordersRaw = localStorage.getItem(ORDERS_KEY);
    if (!ordersRaw) return users;
    const orders = JSON.parse(ordersRaw) as Array<{
      userId?: string;
      customerEmail?: string;
      total: number;
      status: string;
      date?: string;
      createdAt?: string;
    }>;

    return users.map((user) => {
      const userOrders = orders.filter(
        (o) =>
          o.userId === user.id ||
          (o.customerEmail && o.customerEmail.toLowerCase() === user.email.toLowerCase())
      );
      const completed = userOrders.filter((o) => !['Cancelled', 'CANCELLED', 'REFUNDED'].includes(o.status));
      const totalSpent = completed.reduce((sum, o) => sum + Number(o.total || 0), 0);
      const sorted = [...userOrders].sort((a, b) => {
        const da = new Date(a.date ?? a.createdAt ?? 0).getTime();
        const db = new Date(b.date ?? b.createdAt ?? 0).getTime();
        return db - da;
      });
      return {
        ...user,
        orderCount: userOrders.length,
        totalSpent: totalSpent || user.totalSpent || 0,
        lastOrderDate: sorted[0]?.date ?? sorted[0]?.createdAt ?? user.lastOrderDate,
      };
    });
  } catch {
    return users;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getUsers(): RegisteredUser[] {
  return enrichWithOrderStats(readRaw());
}

export function getUserById(id: string): RegisteredUser | undefined {
  return getUsers().find((u) => u.id === id);
}

export function getUserByEmail(email: string): RegisteredUser | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function addUser(input: CreateUserInput): RegisteredUser {
  const users = readRaw();
  const existing = users.find((u) => u.email.toLowerCase() === input.email.trim().toLowerCase());
  if (existing) throw new Error('A user with this email already exists.');

  const newUser: RegisteredUser = {
    id: `user-${Date.now()}`,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    password: input.password,
    avatar: input.avatar ?? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(input.name)}`,
    role: input.role ?? 'CUSTOMER',
    status: input.status ?? 'ACTIVE',
    joinedDate: new Date().toISOString().split('T')[0],
    addresses: [],
    notes: input.notes,
    orderCount: 0,
    totalSpent: 0,
  };

  persist([...users, newUser]);
  return newUser;
}

export function updateUser(id: string, input: UpdateUserInput): RegisteredUser {
  const users = readRaw();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error('User not found.');

  // Guard: if email changes, check uniqueness
  if (input.email) {
    const clash = users.find(
      (u) => u.id !== id && u.email.toLowerCase() === input.email!.trim().toLowerCase()
    );
    if (clash) throw new Error('Another user is already using this email address.');
  }

  const updated: RegisteredUser = {
    ...users[idx],
    ...input,
    email: input.email ? input.email.trim().toLowerCase() : users[idx].email,
    name: input.name ? input.name.trim() : users[idx].name,
    avatar:
      input.avatar ??
      (input.name
        ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(input.name)}`
        : users[idx].avatar),
  };

  const next = [...users];
  next[idx] = updated;
  persist(next);
  return updated;
}

export function deleteUser(id: string): void {
  const users = readRaw();
  persist(users.filter((u) => u.id !== id));
}

export function toggleUserStatus(id: string): RegisteredUser {
  const users = readRaw();
  const user = users.find((u) => u.id === id);
  if (!user) throw new Error('User not found.');
  return updateUser(id, { status: user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' });
}

export function computeUserStats(users: RegisteredUser[]): UserStats {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return {
    total: users.length,
    active: users.filter((u) => u.status === 'ACTIVE').length,
    blocked: users.filter((u) => u.status === 'BLOCKED').length,
    pending: users.filter((u) => u.status === 'PENDING').length,
    vip: users.filter((u) => u.role === 'VIP').length,
    totalSpendAll: users.reduce((sum, u) => sum + (u.totalSpent ?? 0), 0),
    newThisMonth: users.filter((u) => u.joinedDate?.startsWith(thisMonth)).length,
  };
}

export function exportUsersJSON(users: RegisteredUser[]): void {
  const safe = users.map(({ password: _p, ...u }) => u);
  const blob = new Blob([JSON.stringify(safe, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aurastore-users-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportUsersCSV(users: RegisteredUser[]): void {
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Joined', 'Orders', 'Total Spent', 'Notes'];
  const rows = users.map((u) => [
    u.id,
    u.name,
    u.email,
    u.phone,
    u.role,
    u.status,
    u.joinedDate,
    u.orderCount ?? 0,
    u.totalSpent ?? 0,
    u.notes ?? '',
  ]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aurastore-users-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

