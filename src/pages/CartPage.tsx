import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CartItemRow } from '../components/cart/CartItemRow';
import { OrderSummaryCard } from '../components/cart/OrderSummaryCard';
import { EmptyState } from '../components/common/EmptyState';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { qualifiesForFreeDelivery } from '../utils/shipping';
import { formatBDT } from '../utils/formatters';
import { CartItem } from '../types';

export const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, cartCount, cartSubtotal, shippingSettings } = useStore();
  const navigate = useNavigate();

  const amountProgress = shippingSettings.freeDeliveryMinAmount > 0 ? cartSubtotal / shippingSettings.freeDeliveryMinAmount : 1;
  const itemProgress = shippingSettings.freeDeliveryMinItems > 0 ? cartCount / shippingSettings.freeDeliveryMinItems : 1;
  const progressPercent = shippingSettings.freeDeliveryEnabled ? Math.min(100, Math.round((shippingSettings.freeDeliveryRequirement === 'BOTH' ? Math.min(amountProgress, itemProgress) : Math.max(amountProgress, itemProgress)) * 100)) : 0;
  const remainingForFreeShipping = Math.max(0, shippingSettings.freeDeliveryMinAmount - cartSubtotal);
  const remainingItems = Math.max(0, shippingSettings.freeDeliveryMinItems - cartCount);
  const hasFreeDelivery = qualifiesForFreeDelivery(shippingSettings, cartSubtotal, cartCount);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added any items to your bag yet. Explore our handcrafted collection of apparel, sneakers, and accessories."
          actionText="Explore All Products"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your {cartCount} selected {cartCount === 1 ? 'item' : 'items'} and proceed to delivery
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All Items
        </button>
      </div>

      {/* Free Shipping Progress Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span>
            {!shippingSettings.freeDeliveryEnabled ? (
              <span>Delivery fee is calculated from the selected region at checkout.</span>
            ) : hasFreeDelivery ? (
              <span className="text-emerald-600 font-bold">🎉 Congratulations! You have unlocked FREE Shipping!</span>
            ) : (
              <span>
                Add <strong className="text-indigo-600 font-extrabold">{formatBDT(remainingForFreeShipping)}</strong> {shippingSettings.freeDeliveryRequirement === 'BOTH' ? 'and' : 'or'} <strong className="text-indigo-600 font-extrabold">{remainingItems} items</strong> more to unlock Free Shipping
              </span>
            )}
          </span>
          <span className="text-indigo-600 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              progressPercent >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Cart Items List (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="divide-y divide-slate-100">
            {cart.map((item: CartItem) => (
              <CartItemRow
                key={item.cartItemId}
                item={item}
                onUpdateQuantity={(q: number) => updateCartQuantity(item.cartItemId, q)}
                onRemove={() => removeFromCart(item.cartItemId)}
              />
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary (4 Cols) */}
        <div className="lg:col-span-4 sticky top-28">
          <OrderSummaryCard onCheckoutClick={() => navigate('/checkout')} />
        </div>
      </div>
    </div>
  );
};
