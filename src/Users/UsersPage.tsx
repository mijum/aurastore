import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users, UserPlus, Search, Download, Filter, Shield, ShieldOff, ShieldCheck,
  Mail, Phone, MapPin, Edit3, Trash2, Eye, X, ChevronDown, ChevronUp,
  TrendingUp, UserCheck, UserX, Crown, Package, Calendar, AlertTriangle,
  CheckCircle, Clock, RefreshCw, MoreVertical, Star,
} from 'lucide-react';
import { PageTitle } from '../admin/AdminLayout';
import {
  getUsers, addUser, updateUser, deleteUser, toggleUserStatus,
  computeUserStats, exportUsersJSON, exportUsersCSV,
} from './userStorage';
import type { RegisteredUser, CreateUserInput, UpdateUserInput, UsersFilter, UserStats } from './types';

// ─── Style tokens ────────────────────────────────────────────────────────────
const card  = 'bg-white rounded-2xl shadow-sm border border-slate-100';
const input = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all';
const btn   = 'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return '৳ ' + n.toLocaleString('en-BD', { maximumFractionDigits: 0 });
}
function dateStr(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Badge Components ─────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: RegisteredUser['status'] }) {
  const map = {
    ACTIVE:  'bg-emerald-100 text-emerald-700',
    BLOCKED: 'bg-rose-100 text-rose-700',
    PENDING: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide ${map[status]}`}>
      {status === 'ACTIVE' && <CheckCircle className="w-3 h-3" />}
      {status === 'BLOCKED' && <ShieldOff className="w-3 h-3" />}
      {status === 'PENDING' && <Clock className="w-3 h-3" />}
      {status}
    </span>
  );
}

function RoleBadge({ role }: { role: RegisteredUser['role'] }) {
  const map: Record<string, string> = {
    VIP:              'bg-purple-100 text-purple-700',
    WHOLESALER:       'bg-blue-100 text-blue-700',
    CUSTOMER:         'bg-slate-100 text-slate-600',
    BLOCKED_CUSTOMER: 'bg-rose-100 text-rose-600',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide ${map[role] ?? 'bg-slate-100 text-slate-600'}`}>
      {role === 'VIP' && <Crown className="w-3 h-3" />}
      {role.replace('_', ' ')}
    </span>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string;
  icon: React.FC<{ className?: string }>; color: string;
}) {
  return (
    <div className={`${card} p-5 flex items-start gap-4`}>
      <span className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </span>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{label}</p>
        <p className="text-2xl font-black text-slate-900 mt-0.5">{value}</p>
        {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── User Form Modal ───────────────────────────────────────────────────────────
function UserFormModal({
  existing, onClose, onSave,
}: {
  existing?: RegisteredUser;
  onClose: () => void;
  onSave: () => void;
}) {
  const editing = !!existing;
  const [form, setForm] = useState<CreateUserInput & UpdateUserInput>({
    name: existing?.name ?? '',
    email: existing?.email ?? '',
    phone: existing?.phone ?? '',
    password: existing?.password ?? '',
    role: existing?.role ?? 'CUSTOMER',
    status: existing?.status ?? 'ACTIVE',
    notes: existing?.notes ?? '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const f = (key: keyof typeof form, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Name, email, and phone are required.');
      return;
    }
    if (!editing && !form.password) {
      setError('Password is required for new users.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      if (editing && existing) {
        updateUser(existing.id, form as UpdateUserInput);
      } else {
        addUser(form as CreateUserInput);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/60 grid place-items-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className={`${card} w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black">{editing ? 'Edit User' : 'Add New User'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />{error}
          </div>
        )}
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="col-span-2 text-xs font-bold text-slate-700">
              Full Name *
              <input className={`${input} mt-1.5`} value={form.name} onChange={(e) => f('name', e.target.value)} placeholder="e.g. Ayesha Rahman" required />
            </label>
            <label className="col-span-2 text-xs font-bold text-slate-700">
              Email Address *
              <input type="email" className={`${input} mt-1.5`} value={form.email} onChange={(e) => f('email', e.target.value)} placeholder="email@example.com" required />
            </label>
            <label className="text-xs font-bold text-slate-700">
              Phone *
              <input type="tel" className={`${input} mt-1.5`} value={form.phone} onChange={(e) => f('phone', e.target.value)} placeholder="01712345678" required />
            </label>
            <label className="text-xs font-bold text-slate-700">
              Password {!editing && '*'}
              <input type="password" className={`${input} mt-1.5`} value={form.password} onChange={(e) => f('password', e.target.value)} placeholder={editing ? 'Leave blank to keep' : 'Min 6 characters'} required={!editing} />
            </label>
            <label className="text-xs font-bold text-slate-700">
              Role
              <select className={`${input} mt-1.5`} value={form.role} onChange={(e) => f('role', e.target.value)}>
                <option value="CUSTOMER">Customer</option>
                <option value="VIP">VIP</option>
                <option value="WHOLESALER">Wholesaler</option>
              </select>
            </label>
            <label className="text-xs font-bold text-slate-700">
              Status
              <select className={`${input} mt-1.5`} value={form.status} onChange={(e) => f('status', e.target.value)}>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </label>
            <label className="col-span-2 text-xs font-bold text-slate-700">
              Admin Notes
              <textarea rows={3} className={`${input} mt-1.5`} value={form.notes} onChange={(e) => f('notes', e.target.value)} placeholder="Internal notes, only visible to admins..." />
            </label>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className={`${btn} bg-slate-100 flex-1`}>Cancel</button>
            <button disabled={busy} className={`${btn} bg-indigo-600 text-white flex-1 justify-center`}>
              {busy ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
              {editing ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── User Detail Modal ────────────────────────────────────────────────────────
function UserDetailModal({ user, onClose, onEdit }: { user: RegisteredUser; onClose: () => void; onEdit: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/60 grid place-items-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className={`${card} w-full max-w-lg max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-2xl object-cover bg-indigo-100" />
            <div>
              <h3 className="font-black text-lg">{user.name}</h3>
              <p className="text-xs text-slate-400">{user.email}</p>
              <div className="flex gap-2 mt-1.5">
                <StatusBadge status={user.status} />
                <RoleBadge role={user.role} />
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-6 pb-6 space-y-5">
          {/* Contact */}
          <div className={`${card} p-4 space-y-2`}>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Contact Info</p>
            <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-slate-400 shrink-0" />{user.phone}</div>
            <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-slate-400 shrink-0" />{user.email}</div>
            <div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-slate-400 shrink-0" />Joined {dateStr(user.joinedDate)}</div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className={`${card} p-3 text-center`}>
              <p className="text-xl font-black text-indigo-600">{user.orderCount ?? 0}</p>
              <p className="text-[10px] text-slate-400 font-bold">Orders</p>
            </div>
            <div className={`${card} p-3 text-center`}>
              <p className="text-sm font-black text-emerald-600 leading-tight">{fmt(user.totalSpent ?? 0)}</p>
              <p className="text-[10px] text-slate-400 font-bold">Spent</p>
            </div>
            <div className={`${card} p-3 text-center`}>
              <p className="text-[11px] font-black text-slate-700 leading-tight">{dateStr(user.lastOrderDate)}</p>
              <p className="text-[10px] text-slate-400 font-bold">Last Order</p>
            </div>
          </div>

          {/* Addresses */}
          {user.addresses?.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Saved Addresses</p>
              <div className="space-y-2">
                {user.addresses.map((addr) => (
                  <div key={addr.id} className={`${card} p-3 text-sm`}>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">{addr.fullName}</p>
                        <p className="text-slate-500">{addr.streetAddress}, {addr.area}, {addr.city} {addr.postalCode}</p>
                        {addr.isDefault && <span className="text-[10px] font-black text-indigo-600">DEFAULT</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {user.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              <p className="font-black mb-1">Admin Notes</p>
              <p>{user.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={onEdit} className={`${btn} bg-indigo-600 text-white flex-1 justify-center`}><Edit3 className="w-4 h-4" />Edit User</button>
            <button onClick={onClose} className={`${btn} bg-slate-100 flex-1 justify-center`}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main UsersPage ───────────────────────────────────────────────────────────
export function UsersPage() {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [stats, setStats] = useState<UserStats>({ total: 0, active: 0, blocked: 0, pending: 0, vip: 0, totalSpendAll: 0, newThisMonth: 0 });
  const [filters, setFilters] = useState<UsersFilter>({ search: '', status: 'ALL', role: 'ALL', sortBy: 'joinedDate', sortDir: 'desc' });
  const [viewUser, setViewUser] = useState<RegisteredUser | null>(null);
  const [editUser, setEditUser] = useState<RegisteredUser | undefined>(undefined);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const refresh = useCallback(() => {
    const all = getUsers();
    setUsers(all);
    setStats(computeUserStats(all));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Listen for cross-tab storage changes
  useEffect(() => {
    const handler = (e: StorageEvent) => { if (e.key === 'aurastore_accounts') refresh(); };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [refresh]);

  const filtered = useMemo(() => {
    let list = [...users];
    const q = filters.search.toLowerCase();
    if (q) list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q));
    if (filters.status !== 'ALL') list = list.filter((u) => u.status === filters.status);
    if (filters.role !== 'ALL') list = list.filter((u) => u.role === filters.role);
    list.sort((a, b) => {
      let va: number | string = 0, vb: number | string = 0;
      if (filters.sortBy === 'name') { va = a.name; vb = b.name; }
      else if (filters.sortBy === 'email') { va = a.email; vb = b.email; }
      else if (filters.sortBy === 'joinedDate') { va = a.joinedDate; vb = b.joinedDate; }
      else if (filters.sortBy === 'totalSpent') { va = a.totalSpent ?? 0; vb = b.totalSpent ?? 0; }
      else if (filters.sortBy === 'orderCount') { va = a.orderCount ?? 0; vb = b.orderCount ?? 0; }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return filters.sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [users, filters]);

  const setFilter = <K extends keyof UsersFilter>(key: K, value: UsersFilter[K]) =>
    setFilters((p) => ({ ...p, [key]: value }));

  const toggleSort = (col: UsersFilter['sortBy']) => {
    if (filters.sortBy === col) {
      setFilter('sortDir', filters.sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setFilters((p) => ({ ...p, sortBy: col, sortDir: 'desc' }));
    }
  };

  const SortIcon = ({ col }: { col: UsersFilter['sortBy'] }) =>
    filters.sortBy !== col ? null : filters.sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3" />
      : <ChevronDown className="w-3 h-3" />;

  const handleDelete = (id: string) => {
    deleteUser(id);
    setDeleteConfirm(null);
    refresh();
  };

  const handleToggleStatus = (id: string) => {
    toggleUserStatus(id);
    refresh();
    if (viewUser?.id === id) setViewUser((p) => p ? { ...p, status: p.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' } : null);
  };

  return (
    <>
      <PageTitle
        title="Users"
        description="Manage all registered storefront accounts — view profiles, edit details, and control access."
        action={
          <div className="flex gap-2">
            <button onClick={() => exportUsersCSV(filtered)} className={`${btn} bg-slate-100 text-slate-700`}>
              <Download className="w-4 h-4" />CSV
            </button>
            <button onClick={() => exportUsersJSON(filtered)} className={`${btn} bg-slate-100 text-slate-700`}>
              <Download className="w-4 h-4" />JSON
            </button>
            <button onClick={() => setShowAddModal(true)} className={`${btn} bg-indigo-600 text-white`}>
              <UserPlus className="w-4 h-4" />Add User
            </button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total Users" value={stats.total} sub={`+${stats.newThisMonth} this month`} icon={Users} color="bg-indigo-100 text-indigo-600" />
        <KpiCard label="Active Accounts" value={stats.active} sub={`${stats.blocked} blocked`} icon={UserCheck} color="bg-emerald-100 text-emerald-600" />
        <KpiCard label="VIP Members" value={stats.vip} sub="High-value buyers" icon={Crown} color="bg-purple-100 text-purple-600" />
        <KpiCard label="Total Revenue" value={fmt(stats.totalSpendAll)} sub="All registered users" icon={TrendingUp} color="bg-amber-100 text-amber-600" />
      </div>

      {/* Filters */}
      <div className={`${card} p-4 mb-4`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input className={`${input} pl-10`} placeholder="Search name, email, or phone…" value={filters.search} onChange={(e) => setFilter('search', e.target.value)} />
          </div>
          <select className={`${input} sm:w-36`} value={filters.status} onChange={(e) => setFilter('status', e.target.value as UsersFilter['status'])}>
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="BLOCKED">Blocked</option>
          </select>
          <select className={`${input} sm:w-40`} value={filters.role} onChange={(e) => setFilter('role', e.target.value as UsersFilter['role'])}>
            <option value="ALL">All roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="VIP">VIP</option>
            <option value="WHOLESALER">Wholesaler</option>
          </select>
          <button onClick={refresh} className={`${btn} bg-slate-100 text-slate-700 shrink-0`} title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full min-w-[780px] text-sm">
          <thead className="bg-slate-50 text-left text-[10px] uppercase tracking-widest text-slate-400">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4 cursor-pointer hover:text-slate-700 select-none" onClick={() => toggleSort('joinedDate')}>
                <span className="flex items-center gap-1">Joined <SortIcon col="joinedDate" /></span>
              </th>
              <th className="p-4 cursor-pointer hover:text-slate-700 select-none" onClick={() => toggleSort('orderCount')}>
                <span className="flex items-center gap-1">Orders <SortIcon col="orderCount" /></span>
              </th>
              <th className="p-4 cursor-pointer hover:text-slate-700 select-none" onClick={() => toggleSort('totalSpent')}>
                <span className="flex items-center gap-1">Lifetime Value <SortIcon col="totalSpent" /></span>
              </th>
              <th className="p-4">Status / Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="p-12 text-center text-slate-400 text-sm">No users match the current filters.</td></tr>
            ) : filtered.map((user) => (
              <tr key={user.id} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover bg-indigo-50 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        {user.name}
                        {user.isDemoUser && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                      </p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                      <p className="text-xs text-slate-400">{user.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-600">{dateStr(user.joinedDate)}</td>
                <td className="p-4 font-bold">{user.orderCount ?? 0}</td>
                <td className="p-4 font-black text-emerald-700">{fmt(user.totalSpent ?? 0)}</td>
                <td className="p-4">
                  <div className="flex flex-col gap-1.5">
                    <StatusBadge status={user.status} />
                    <RoleBadge role={user.role} />
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => setViewUser(user)} className="p-2 rounded-xl hover:bg-indigo-50 text-indigo-600" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setEditUser(user); setShowAddModal(true); }} className="p-2 rounded-xl hover:bg-slate-100 text-slate-600" title="Edit">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleToggleStatus(user.id)} className={`p-2 rounded-xl transition ${user.status === 'ACTIVE' ? 'hover:bg-rose-50 text-rose-500' : 'hover:bg-emerald-50 text-emerald-600'}`} title={user.status === 'ACTIVE' ? 'Block user' : 'Activate user'}>
                      {user.status === 'ACTIVE' ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setDeleteConfirm(user.id)} className="p-2 rounded-xl hover:bg-rose-50 text-rose-400" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
          Showing <span className="font-bold text-slate-700">{filtered.length}</span> of <span className="font-bold text-slate-700">{users.length}</span> registered users
        </div>
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[80] bg-slate-950/60 grid place-items-center p-4 backdrop-blur-sm">
          <div className={`${card} w-full max-w-sm p-6 text-center`}>
            <div className="w-12 h-12 rounded-2xl bg-rose-100 grid place-items-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="font-black text-lg">Delete User?</h3>
            <p className="text-sm text-slate-500 mt-2">This will permanently remove the user account and all their data. This action cannot be undone.</p>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setDeleteConfirm(null)} className={`${btn} bg-slate-100 flex-1 justify-center`}>Cancel</button>
              <button onClick={() => { handleDelete(deleteConfirm); refresh(); }} className={`${btn} bg-rose-600 text-white flex-1 justify-center`}><Trash2 className="w-4 h-4" />Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {viewUser && !showAddModal && (
        <UserDetailModal
          user={viewUser}
          onClose={() => setViewUser(null)}
          onEdit={() => { setEditUser(viewUser); setShowAddModal(true); }}
        />
      )}

      {/* Add / Edit Modal */}
      {showAddModal && (
        <UserFormModal
          existing={editUser}
          onClose={() => { setShowAddModal(false); setEditUser(undefined); }}
          onSave={refresh}
        />
      )}
    </>
  );
}
