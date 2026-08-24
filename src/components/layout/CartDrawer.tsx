import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatBDT } from '../../utils/formatters';
import { qualifiesForFreeDelivery } from '../../utils/shipping';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartCount,
    shippingSettings,
  } = useStore();

  const navigate = useNavigate();

  // Escape key closes drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartDrawerOpen(false);
      }
    };
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartDrawerOpen, setIsCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  const amountProgress = shippingSettings.freeDeliveryMinAmount > 0 ? cartSubtotal / shippingSettings.freeDeliveryMinAmount : 1;
  const itemProgress = shippingSettings.freeDeliveryMinItems > 0 ? cartCount / shippingSettings.freeDeliveryMinItems : 1;
  const progressPercent = shippingSettings.freeDeliveryEnabled ? Math.min(100, Math.round((shippingSettings.freeDeliveryRequirement === 'BOTH' ? Math.min(amountProgress, itemProgress) : Math.max(amountProgress, itemProgress)) * 100)) : 0;
  const remainingForFreeShipping = Math.max(0, shippingSettings.freeDeliveryMinAmount - cartSubtotal);
  const remainingItems = Math.max(0, shippingSettings.freeDeliveryMinItems - cartCount);
  const hasFreeDelivery = qualifiesForFreeDelivery(shippingSettings, cartSubtotal, cartCount);

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  const handleViewCartClick = () => {
    setIsCartDrawerOpen(false);
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 cart-water-overlay" role="dialog" aria-modal="true" aria-labelledby="cart-dialog-title">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-md cart-water-backdrop"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="cart-water-ripples" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      {/* Centered cart */}
      <div className="cart-water-modal fixed left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg max-h-[min(86vh,760px)] bg-white shadow-2xl flex flex-col z-10 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <h2 id="cart-dialog-title" className="font-bold text-slate-900 text-lg">
              Your Cart <span className="text-slate-400 text-sm font-medium">({cartCount})</span>
            </h2>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        {cart.length > 0 && (
          <div className="bg-indigo-50/60 px-5 py-3 border-b border-indigo-100/60">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>
                {!shippingSettings.freeDeliveryEnabled ? (
                  <span>Delivery fee is based on your region.</span>
                ) : hasFreeDelivery ? (
                  <span className="text-emerald-700 font-bold">🎉 You've unlocked FREE Shipping!</span>
                ) : (
                  <span>Add <strong className="text-indigo-600">{formatBDT(remainingForFreeShipping)}</strong> {shippingSettings.freeDeliveryRequirement === 'BOTH' ? 'and' : 'or'} <strong className="text-indigo-600">{remainingItems} items</strong> more for FREE shipping</span>
                )}
              </span>
              <span className="text-indigo-600">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  progressPercent >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Your cart is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mb-6">
                Looks like you haven't added any items yet. Discover our curated collection today!
              </p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/shop');
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                const currentProduct = item.product;
                const unitPrice = item.priceAtAddition;

                return (
                  <div key={item.cartItemId} className="flex gap-4 pt-4 first:pt-0">
                    <img
                      src={currentProduct.images[0]}
                      alt={currentProduct.name}
                      className="w-20 h-24 object-cover rounded-xl bg-slate-100 border border-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/product/${currentProduct.slug}`}
                            onClick={() => setIsCartDrawerOpen(false)}
                            className="text-sm font-semibold text-slate-900 hover:text-indigo-600 line-clamp-1 transition-colors"
                          >
                            {currentProduct.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Selected Variants */}
                        <div className="flex flex-wrap gap-2 text-xs text-slate-500 mt-1">
                          {item.selectedSize && (
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
                              <span
                                className="w-2 h-2 rounded-full border border-slate-300"
                                style={{ backgroundColor: item.selectedColor.hex }}
                              />
                              {item.selectedColor.name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Stepper & Subtotal */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-1.5 text-slate-500 hover:bg-slate-200 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                            disabled={item.quantity >= currentProduct.stock}
                            className="p-1.5 text-slate-500 hover:bg-slate-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-900">
                            {formatBDT(unitPrice * item.quantity)}
                          </div>
                          {currentProduct.discountPrice && (
                            <div className="text-[11px] text-slate-400 line-through">
                              {formatBDT(currentProduct.price * item.quantity)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer & CTAs */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 font-medium">Subtotal</span>
              <span className="text-base font-extrabold text-slate-900">
                {formatBDT(cartSubtotal)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Taxes and shipping fees are calculated during checkout.
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={handleViewCartClick}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-all shadow-sm text-center"
              >
                View Full Cart
              </button>
              <button
                onClick={handleCheckoutClick}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5"
              >
                Checkout <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Guaranteed Safe & Secure Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
