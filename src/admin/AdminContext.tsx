import React, { createContext, useContext, useEffect, useState } from 'react';
import { adminApi } from '../services/api';

export type AdminUser = { id: string; name: string; email: string; role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' };
type AdminContextValue = {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.me().then(setAdmin).catch(() => setAdmin(null)).finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => setAdmin(await adminApi.login(email, password));
  const logout = async () => { await adminApi.logout(); setAdmin(null); };

  return <AdminContext.Provider value={{ admin, loading, login, logout }}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used inside AdminProvider');
  return context;
}
