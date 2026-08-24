import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Home,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Package,
  LogOut,
  Sparkles,
  ChevronRight,
  Search,
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

export const MobileNav: React.FC = () => {
  const {
    isMobileNavOpen,
    setIsMobileNavOpen,
    wishlist,
    cartCount,
    currentUser,
    logout,
    setCategory,
  } = useStore();

  const navigate = useNavigate();

  if (!isMobileNavOpen) return null;

  const handleCategorySelect = (cat: ProductCategory) => {
    setCategory(cat);
    navigate(`/shop?category=${encodeURIComponent(cat)}`);
    setIsMobileNavOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => setIsMobileNavOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col z-10 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <Link
            to="/"
            onClick={() => setIsMobileNavOpen(false)}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-slate-900">
              Aura<span className="text-indigo-600">Store</span>
            </span>
          </Link>
          <button
            onClick={() => setIsMobileNavOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* User info / quick login */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover bg-indigo-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">Welcome Guest</p>
                  <p className="text-xs text-slate-500">Sign in to track orders & wishlist</p>
                </div>
                <Link
                  to="/login"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
              Main Menu
            </div>
            <Link
              to="/"
              onClick={() => setIsMobileNavOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium text-sm transition-colors"
            >
              <Home className="w-4 h-4 text-slate-400" />
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setIsMobileNavOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium text-sm transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-slate-400" />
              Shop All Products
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setIsMobileNavOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium text-sm transition-colors"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-slate-400" />
                Wishlist
              </div>
              {wishlist.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-rose-100 text-rose-600 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsMobileNavOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium text-sm transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-slate-400" />
                Shopping Cart
              </div>
              {cartCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-indigo-100 text-indigo-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Categories */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
              Categories
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 font-medium text-sm transition-colors"
              >
                <span>{cat}</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>
            ))}
          </div>

          {/* Account & Orders */}
          {currentUser && (
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                My Account
              </div>
              <Link
                to="/account"
                onClick={() => setIsMobileNavOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium text-sm transition-colors"
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                Profile Settings
              </Link>
              <Link
                to="/account?tab=orders"
                onClick={() => setIsMobileNavOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium text-sm transition-colors"
              >
                <Package className="w-4 h-4 text-slate-400" />
                Order History
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMobileNavOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 font-medium text-sm transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
