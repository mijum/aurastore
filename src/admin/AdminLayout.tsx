import React, { useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Boxes, ChevronRight, ClipboardList, FolderTree, LayoutDashboard, LogOut, Menu, PackageSearch, Settings, ShoppingBag, Store, Tags, Users, X } from 'lucide-react';
import { useAdmin } from './AdminContext';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: ShoppingBag },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/inventory', label: 'Inventory', icon: Boxes },
  { to: '/admin/coupons', label: 'Coupons', icon: Tags },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminGuard() {
  const { admin, loading } = useAdmin();
  const location = useLocation();
  if (loading) return <div className="min-h-screen bg-slate-950 grid place-items-center"><div className="h-10 w-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" /></div>;
  return admin ? <Outlet /> : <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
}

export function AdminLayout() {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const [open, setOpen] = useState(false);
  const current = links.find((link) => link.end ? pathname === link.to : pathname.startsWith(link.to));
  const close = () => setOpen(false);
  const signOut = async () => { await logout(); navigate('/admin/login', { replace: true }); };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {open && <button aria-label="Close menu" className="fixed inset-0 bg-slate-950/50 z-40 lg:hidden" onClick={close} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-white transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-3" onClick={close}>
            <span className="w-10 h-10 grid place-items-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/30"><Store className="w-5 h-5" /></span>
            <div><div className="font-black tracking-tight text-lg">AuraStore</div><div className="text-[10px] uppercase tracking-[.2em] text-indigo-300">Command Center</div></div>
          </Link>
          <button className="lg:hidden text-slate-400" onClick={close}><X /></button>
        </div>
        <nav className="p-4 space-y-1.5">
          {links.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={close} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><Icon className="w-4.5 h-4.5" />{label}</NavLink>)}
        </nav>
        <div className="absolute bottom-0 inset-x-0 p-4 border-t border-white/10">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white"><PackageSearch className="w-4 h-4" />View storefront</Link>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-300 hover:text-rose-200"><LogOut className="w-4 h-4" />Sign out</button>
        </div>
      </aside>
      <div className="lg:pl-72 min-h-screen">
        <header className="h-20 sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3"><button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-xl bg-slate-100"><Menu /></button><div><p className="text-[10px] uppercase tracking-[.2em] font-bold text-slate-400">Administration</p><h1 className="font-black text-xl">{current?.label || 'AuraStore'}</h1></div></div>
          <div className="flex items-center gap-3"><div className="hidden sm:block text-right"><p className="text-sm font-bold">{admin?.name}</p><p className="text-[10px] text-slate-400">{admin?.role.replace('_', ' ')}</p></div><span className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 grid place-items-center font-black">{admin?.name?.charAt(0)}</span></div>
        </header>
        <main className="p-4 sm:p-8 max-w-[1600px] mx-auto"><Outlet /></main>
      </div>
    </div>
  );
}

export function PageTitle({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7"><div><div className="flex items-center gap-2 text-xs text-indigo-600 font-bold mb-2"><BarChart3 className="w-3.5 h-3.5" />AuraStore operations<ChevronRight className="w-3 h-3" /></div><h2 className="text-2xl sm:text-3xl font-black tracking-tight">{title}</h2><p className="text-sm text-slate-500 mt-1">{description}</p></div>{action}</div>;
}
