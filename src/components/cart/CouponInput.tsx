import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Tag, Check, X } from 'lucide-react';

export const CouponInput: React.FC = () => {
  const { appliedCoupon, applyCoupon, removeCoupon } = useStore();
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsApplying(true);
    const res = await applyCoupon(code);
    setIsApplying(false);
    if (res.success) {
      setCode('');
    } else {
      setErrorMsg(res.message);
    }
  };

  if (appliedCoupon) {
    return (
      <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
            <Check className="w-3.5 h-3.5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-emerald-900">
                {appliedCoupon.code}
              </span>
              <span className="text-[11px] font-semibold text-emerald-700">
                Applied
              </span>
            </div>
            <p className="text-[11px] text-emerald-600">{appliedCoupon.description}</p>
          </div>
        </div>

        <button
          onClick={removeCoupon}
          className="p-1 text-emerald-700 hover:text-rose-600 transition-colors"
          title="Remove coupon"
          aria-label="Remove coupon"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleApply} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Promo Code (e.g. AURA20)"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
          />
          <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <button
          type="submit"
          disabled={isApplying}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
        >
          {isApplying ? 'Checking…' : 'Apply'}
        </button>
      </form>

      {errorMsg && (
        <p className="text-xs font-medium text-rose-500">{errorMsg}</p>
      )}

      {/* Suggested demo coupons pills */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <span>Try:</span>
        <button
          type="button"
          onClick={() => {
            setCode('AURA20');
            setErrorMsg('');
          }}
          className="font-mono text-indigo-600 hover:underline font-bold"
        >
          AURA20
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => {
            setCode('FREESHIP');
            setErrorMsg('');
          }}
          className="font-mono text-indigo-600 hover:underline font-bold"
        >
          FREESHIP
        </button>
      </div>
    </div>
  );
};
