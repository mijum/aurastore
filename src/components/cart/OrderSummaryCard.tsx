import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatBDT } from '../../utils/formatters';
import { CouponInput } from './CouponInput';
import { ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface OrderSummaryCardProps {
  showCheckoutButton?: boolean;
  onCheckoutClick?: () => void | Promise<void>;
  customActionText?: string;
  isProcessing?: boolean;
  disabled?: boolean;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  showCheckoutButton = true,
  onCheckoutClick,
  customActionText = 'Proceed to Checkout',
  isProcessing = false,
  disabled = false,
}) => {
  const navigate = useNavigate();
  const {
    cartSubtotal,
    cartTax,
    cartShippingFee,
    cartDiscount,
    cartTotal,
    appliedCoupon,
    selectedDeliveryMethod,
  } = useStore();

  const handleCheckoutTransition = (event: React.MouseEvent<HTMLElement>) => {
    if (customActionText === 'Place Order Now') {
      event.preventDefault();
      const button = event.currentTarget;
      if (button.classList.contains('place-order-trigger-launching')) return;

      const rect = button.getBoundingClientRect();
      const flyX = window.innerWidth / 2 - (rect.left + rect.width / 2);
      const flyY = window.innerHeight / 2 - (rect.top + rect.height / 2);
      const flyer = document.createElement('span');
      flyer.className = 'place-order-globe-flyer';
      flyer.setAttribute('aria-hidden', 'true');
      flyer.innerHTML = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="29"/><path d="M10 25c8-4 11-12 20-11 5 1 4 7 10 8 5 1 9-3 14 1l6 7c-8 4-14 2-18 8-3 4 0 9-5 15l-9 7c-4-8 0-14-6-18-5-3-11-1-15-7l3-10Z"/></svg>';
      flyer.style.left = `${rect.left + rect.width / 2}px`;
      flyer.style.top = `${rect.top + rect.height / 2}px`;
      flyer.style.setProperty('--globe-fly-x', `${flyX}px`);
      flyer.style.setProperty('--globe-fly-y', `${flyY}px`);
      flyer.style.setProperty('--globe-fly-mid-x', `${flyX * 0.55}px`);
      flyer.style.setProperty('--globe-fly-mid-y', `${flyY * 0.55 - 38}px`);

      document.body.appendChild(flyer);
      button.classList.add('place-order-trigger-launching');

      window.setTimeout(() => {
        flyer.remove();
        const globe = document.createElement('span');
        globe.className = 'place-order-globe-cover';
        globe.setAttribute('aria-hidden', 'true');
        globe.innerHTML = `
          <span class="place-order-globe-ring"></span>
          <span class="place-order-globe-shape">
            <svg viewBox="0 0 240 240" focusable="false">
              <defs>
                <radialGradient id="place-order-globe-ocean" cx="35%" cy="28%" r="72%">
                  <stop offset="0" stop-color="#67e8f9" />
                  <stop offset="0.38" stop-color="#0ea5e9" />
                  <stop offset="0.72" stop-color="#2563eb" />
                  <stop offset="1" stop-color="#172554" />
                </radialGradient>
                <linearGradient id="place-order-globe-land" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#a7f3d0" />
                  <stop offset="1" stop-color="#22d3ee" />
                </linearGradient>
              </defs>
              <circle class="place-order-globe-ocean" cx="120" cy="120" r="116" />
              <path class="place-order-globe-land" d="M28 74c17-2 22-19 40-25 14-5 31 1 39 12 6 9 1 19 12 26 10 7 22-1 32 6 9 7 5 19 15 25 14 8 27-8 48 1-1 22-9 43-22 60-15-7-28-5-38 7-11 13-9 29-21 43-16 2-31 0-45-5 1-17 12-30 6-45-7-18-28-17-38-30-9-12-1-27-10-38-8-10-22-10-32-16-3-11-4-22 0-37Z" />
              <path class="place-order-globe-cloud" d="M22 103c34-18 61-2 91-12 34-11 57-30 91-17M28 151c35-12 58 7 92-3 31-9 52-26 87-17" />
              <ellipse class="place-order-globe-shine" cx="83" cy="68" rx="42" ry="28" />
            </svg>
          </span>`;
        document.body.appendChild(globe);
        const action = Promise.resolve(onCheckoutClick?.());

        window.setTimeout(async () => {
          await action;
          globe.classList.add('place-order-globe-exit');
          window.setTimeout(() => {
            globe.remove();
            button.classList.remove('place-order-trigger-launching');
          }, 320);
        }, 820);
      }, 430);
      return;
    }

    if (customActionText !== 'Proceed to Checkout') {
      onCheckoutClick?.();
      return;
    }

    event.preventDefault();
    const button = event.currentTarget;
    if (button.classList.contains('checkout-trigger-launching')) return;

    const rect = button.getBoundingClientRect();
    const flyX = window.innerWidth / 2 - (rect.left + rect.width / 2);
    const flyY = window.innerHeight / 2 - (rect.top + rect.height / 2);
    const flyer = document.createElement('span');
    flyer.className = 'checkout-button-flyer';
    flyer.setAttribute('aria-hidden', 'true');
    flyer.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';
    flyer.style.left = `${rect.left + rect.width / 2}px`;
    flyer.style.top = `${rect.top + rect.height / 2}px`;
    flyer.style.setProperty('--checkout-fly-x', `${flyX}px`);
    flyer.style.setProperty('--checkout-fly-y', `${flyY}px`);
    flyer.style.setProperty('--checkout-fly-mid-x', `${flyX * 0.55}px`);
    flyer.style.setProperty('--checkout-fly-mid-y', `${flyY * 0.55 - 34}px`);

    document.body.appendChild(flyer);
    button.classList.add('checkout-trigger-launching');

    window.setTimeout(() => {
      flyer.remove();
      const boom = document.createElement('span');
      boom.className = 'checkout-boom';
      boom.setAttribute('aria-hidden', 'true');
      boom.innerHTML = `
        <span class="checkout-boom-shockwave"></span>
        <span class="checkout-boom-burst"></span>
        <span class="checkout-boom-core">BOOM!</span>`;
      document.body.appendChild(boom);

      window.setTimeout(() => {
        boom.classList.add('checkout-boom-exit');
        if (onCheckoutClick) onCheckoutClick();
        else navigate('/checkout');

        window.setTimeout(() => {
          boom.remove();
          button.classList.remove('checkout-trigger-launching');
        }, 300);
      }, 760);
    }, 420);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
      <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-4">
        Order Summary
      </h3>

      {/* Coupon Code Section */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Have a Promo Code?
        </label>
        <CouponInput />
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-bold text-slate-900">{formatBDT(cartSubtotal)}</span>
        </div>

        {cartDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 font-semibold">
            <span>Discount ({appliedCoupon?.code})</span>
            <span>-{formatBDT(cartDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-600">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-slate-400" />
            Delivery ({selectedDeliveryMethod === 'express' ? 'Express' : 'Standard'})
          </span>
          <span className="font-semibold text-slate-900">
            {cartShippingFee === 0 ? (
              <span className="text-emerald-600 font-bold">FREE</span>
            ) : (
              formatBDT(cartShippingFee)
            )}
          </span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Estimated VAT (5%)</span>
          <span className="font-semibold text-slate-900">{formatBDT(cartTax)}</span>
        </div>

        {/* Final Total */}
        <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline">
          <div>
            <div className="text-base font-extrabold text-slate-900">Final Total</div>
            <div className="text-[11px] text-slate-400">All applicable taxes included</div>
          </div>
          <div className="text-2xl font-black text-indigo-600">
            {formatBDT(cartTotal)}
          </div>
        </div>
      </div>

      {/* Action Button */}
      {showCheckoutButton && (
        <div>
          {onCheckoutClick ? (
            <button
              onClick={handleCheckoutTransition}
              disabled={disabled || isProcessing}
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isProcessing ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <span>{customActionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          ) : (
            <Link
              to="/checkout"
              onClick={handleCheckoutTransition}
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 group text-center"
            >
              <span>{customActionText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      )}

      {/* Trust badges */}
      <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>100% Secure Checkout with 256-bit Encryption</span>
      </div>
    </div>
  );
};
