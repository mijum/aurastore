import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCategory } from '../../types';

const CATEGORIES: ProductCategory[] = [
  'Clothing',
  'Shoes',
  'Accessories',
  'Electronics',
  'Bags',
  'Watches',
];

export const Footer: React.FC = () => {
  const { addToast, setCategory } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(() => {
    return !!localStorage.getItem('aurastore_newsletter_subscribed');
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      addToast('Please enter a valid email address.', 'warning');
      return;
    }

    if (subscribed) {
      addToast('You are already subscribed to our newsletter!', 'info');
      return;
    }

    localStorage.setItem('aurastore_newsletter_subscribed', cleanEmail);
    setSubscribed(true);
    setEmail('');
    addToast('Thank you for subscribing! Check your inbox for 20% off.', 'success');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Propositions Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-14 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Express Delivery</h4>
              <p className="text-xs text-slate-400 mt-1">Fast delivery across Bangladesh within 48-72 hours.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">30-Day Easy Returns</h4>
              <p className="text-xs text-slate-400 mt-1">Hassle-free exchanges and instant store credit.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">100% Authentic</h4>
              <p className="text-xs text-slate-400 mt-1">All products are sourced directly and quality verified.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">24/7 Dedicated Support</h4>
              <p className="text-xs text-slate-400 mt-1">Direct assistance via hotline and customer live desk.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-14 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                <Sparkles className="w-5 h-5 fill-white/20" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Aura<span className="text-indigo-400">Store</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Curated premium lifestyle, fashion, electronics, and horological masterpieces engineered for discerning tastemakers across Bangladesh.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Gulshan-2, Dhaka 1212, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+880 1700-000000 (9 AM - 10 PM)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>support@aurastore.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Shop Collections
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(cat)}`}
                    onClick={() => setCategory(cat)}
                    className="hover:text-white transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Customer Support
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/account?tab=orders" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-white transition-colors">
                  Account Dashboard
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5 font-medium">
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Join the Insider Club
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe to get seasonal private sales, drops, and 20% off your first order.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>You're subscribed to updates!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800/90 text-white placeholder-slate-500 text-xs rounded-xl border border-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5"
                >
                  Subscribe Now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar & Payment badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {new Date().getFullYear()} AuraStore Inc. All rights reserved. Designed for Bangladesh.</span>
            <span className="text-slate-700">•</span>
            <Link to="/admin/login" className="text-slate-500 hover:text-indigo-400 transition-colors">
              Staff Portal
            </Link>
          </div>

          {/* Payment & Currency Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700">
              🇧🇩 BDT (৳)
            </span>
            <span className="px-2 py-1 rounded bg-slate-800 text-[11px] font-medium text-pink-400 border border-slate-700">
              bKash
            </span>
            <span className="px-2 py-1 rounded bg-slate-800 text-[11px] font-medium text-orange-400 border border-slate-700">
              Nagad
            </span>
            <span className="px-2 py-1 rounded bg-slate-800 text-[11px] font-medium text-blue-400 border border-slate-700">
              Visa
            </span>
            <span className="px-2 py-1 rounded bg-slate-800 text-[11px] font-medium text-red-400 border border-slate-700">
              Mastercard
            </span>
            <span className="px-2 py-1 rounded bg-slate-800 text-[11px] font-medium text-emerald-400 border border-slate-700">
              Cash on Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
