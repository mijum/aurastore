import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck, Store } from 'lucide-react';
import { useAdmin } from './AdminContext';

export function AdminLoginPage() {
  const { admin, login } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (admin) return <Navigate to="/admin" replace />;
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setBusy(true); setError(''); try { await login(email, password); navigate((location.state as any)?.from || '/admin', { replace: true }); } catch (err) { setError(err instanceof Error ? err.message : 'Sign in failed'); } finally { setBusy(false); } };
  return <div className="min-h-screen bg-slate-950 text-white grid lg:grid-cols-2">
    <div className="hidden lg:flex relative overflow-hidden p-16 flex-col justify-between bg-gradient-to-br from-indigo-700 via-indigo-900 to-slate-950"><div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} /><div className="relative flex items-center gap-3"><span className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur grid place-items-center"><Store /></span><span className="text-2xl font-black">AuraStore</span></div><div className="relative max-w-xl"><span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-indigo-100 text-xs font-bold mb-6"><ShieldCheck className="w-4 h-4" />Secure operations portal</span><h1 className="text-5xl font-black leading-tight">Run your store with clarity and control.</h1><p className="text-indigo-200 mt-5 text-lg">Products, inventory, orders, customers, and promotions—all connected to live storefront data.</p></div><p className="relative text-xs text-indigo-300">Authorized AuraStore staff only</p></div>
    <div className="flex items-center justify-center p-6 sm:p-12"><form onSubmit={submit} className="w-full max-w-md"><div className="lg:hidden flex items-center gap-3 mb-12"><span className="w-11 h-11 rounded-2xl bg-indigo-600 grid place-items-center"><Store /></span><span className="text-2xl font-black">AuraStore</span></div><p className="text-indigo-400 text-xs font-black uppercase tracking-[.2em]">Admin access</p><h2 className="text-4xl font-black mt-3">Welcome back</h2><p className="text-slate-400 mt-2 mb-8">Sign in with the administrator account created during database seeding.</p><label className="text-xs font-bold text-slate-300">Email address</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 mb-5 w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none" placeholder="admin@aurastore.com" /><label className="text-xs font-bold text-slate-300">Password</label><div className="relative mt-2"><input type={show ? 'text' : 'password'} minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3.5 pr-12 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none" placeholder="••••••••" /><button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">{show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>{error && <p className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">{error}</p>}<button disabled={busy} className="mt-6 w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 font-black flex items-center justify-center gap-2 shadow-xl shadow-indigo-950"><LockKeyhole className="w-4 h-4" />{busy ? 'Signing in…' : 'Sign in securely'}<ArrowRight className="w-4 h-4" /></button></form></div>
  </div>;
}
