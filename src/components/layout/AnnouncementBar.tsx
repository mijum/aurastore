import React from 'react';
import { Sparkles, Tag, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

export const AnnouncementBar: React.FC = () => {
  const { addToast } = useStore();

  const copyCoupon = () => {
    navigator.clipboard?.writeText('AURA20');
    addToast('Coupon code "AURA20" copied to clipboard!', 'success');
  };

  return (
    <aside aria-label="Special Offers" className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-slate-300">
            Exclusive Launch Offer:
          </span>
          <span className="font-semibold text-white">
            Get 20% OFF with code
          </span>
          <button
            onClick={copyCoupon}
            className="inline-flex items-center gap-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 hover:text-white px-2 py-0.5 rounded border border-indigo-400/30 font-mono font-bold text-[11px] transition-colors"
            title="Click to copy promo code"
          >
            <Tag className="w-3 h-3" />
            AURA20
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4 text-slate-400">
          <span>Free Express Shipping on orders over ৳5,000</span>
          <span className="text-slate-600">•</span>
          <Link
            to="/shop"
            className="text-indigo-300 hover:text-white font-medium inline-flex items-center gap-0.5 transition-colors"
          >
            Explore Catalog <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </aside>
  );
};
