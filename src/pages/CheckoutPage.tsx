import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, CartItem, Address, DeliveryRegion } from '../types';
import { OrderSummaryCard } from '../components/cart/OrderSummaryCard';
import { isValidBDPhone, isValidEmail, formatBDT } from '../utils/formatters';
import { calculateShippingFee } from '../utils/shipping';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  Lock,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  PackageCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    cartCount,
    currentUser,
    selectedDeliveryMethod,
    setSelectedDeliveryMethod,
    selectedDeliveryRegion,
    setSelectedDeliveryRegion,
    shippingSettings,
    cartSubtotal,
    placeOrder,
    addToast,
  } = useStore();

  // Pre-fill fields from logged-in user if available
  const defaultAddr = currentUser?.addresses?.find((a: Address) => a.isDefault) || currentUser?.addresses?.[0];

  const [formData, setFormData] = useState({
    fullName: currentUser?.name || defaultAddr?.fullName || '',
    email: currentUser?.email || '',
    phone: defaultAddr?.phone || currentUser?.phone || '',
    streetAddress: defaultAddr?.streetAddress || '',
    area: defaultAddr?.area || 'Banani',
    city: defaultAddr?.city || 'Dhaka',
    district: defaultAddr?.district || 'Dhaka',
    postalCode: defaultAddr?.postalCode || '1213',
    country: 'Bangladesh',
    deliveryRegion: defaultAddr?.deliveryRegion || 'dhaka_city' as DeliveryRegion,
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  // Demo Card fields
  const [cardData, setCardData] = useState({
    cardNumber: '4242 4242 4242 4242',
    cardExpiry: '12/28',
    cardCvv: '888',
    cardHolder: currentUser?.name || 'Demo Buyer',
  });

  // Demo Mobile wallet
  const [mobileWalletNumber, setMobileWalletNumber] = useState(
    defaultAddr?.phone || currentUser?.phone || '01712345678'
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    setSelectedDeliveryRegion(formData.deliveryRegion);
  }, [formData.deliveryRegion, setSelectedDeliveryRegion]);

  const standardDeliveryFee = calculateShippingFee(shippingSettings, cartSubtotal, cartCount, selectedDeliveryRegion, 'standard');
  const expressDeliveryFee = calculateShippingFee(shippingSettings, cartSubtotal, cartCount, selectedDeliveryRegion, 'express');

  // Keep hook order stable even when the cart is cleared while checkout is mounted.
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <PackageCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Your Cart is Empty</h1>
        <p className="text-sm text-slate-500 mb-6">
          You don't have any items in your cart to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-600/20"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!formData.phone.trim() || !isValidBDPhone(formData.phone)) {
      errs.phone = 'Enter a valid 11-digit phone number (e.g. 01712345678)';
    }
    if (!formData.streetAddress.trim()) errs.streetAddress = 'Street address is required';
    if (!formData.area.trim()) errs.area = 'Area/Thana is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.district.trim()) errs.district = 'District is required';
    if (!formData.postalCode.trim()) errs.postalCode = 'Postal code is required';

    if (paymentMethod === 'mobile_payment' && !isValidBDPhone(mobileWalletNumber)) {
      errs.payment = 'Enter a valid Bangladesh mobile-wallet number';
    }

    if (paymentMethod === 'card') {
      const cardNumber = cardData.cardNumber.replace(/\D/g, '');
      const expiryMatch = cardData.cardExpiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
      if (cardNumber.length < 12 || cardNumber.length > 19) {
        errs.payment = 'Enter a valid 12–19 digit card number';
      } else if (!expiryMatch) {
        errs.payment = 'Enter a valid card expiry in MM/YY format';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (isSubmitting) return;

    if (!validateForm()) {
      addToast('Please fill in all required shipping fields correctly.', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await placeOrder(formData, selectedDeliveryMethod, paymentMethod);
      setIsSubmitting(false);

      if (res.success && res.order) {
        // Trigger celebratory confetti!
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }

        navigate(`/order-success?orderId=${res.order.id}`);
      } else {
        addToast(res.message, 'error');
      }
    } catch {
      setIsSubmitting(false);
      addToast('Order could not be created. Please try again.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link to="/cart" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold">Secure Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Form: Customer Info, Delivery, Payment (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Customer & Shipping Information */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-sm shadow-indigo-600/30">
                  1
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Shipping & Delivery Details
                  </h2>
                  <p className="text-xs text-slate-400">Where should we deliver your parcel?</p>
                </div>
              </div>

              {!currentUser && (
                <Link
                  to="/login"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Already registered? Login
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Delivery Region <span className="text-rose-500">*</span>
                </label>
                <select
                  name="deliveryRegion"
                  value={formData.deliveryRegion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                >
                  <option value="dhaka_city">Inside Dhaka City — {formatBDT(shippingSettings.dhakaCityFee)}</option>
                  <option value="dhaka_subarea">Dhaka Sub-area — {formatBDT(shippingSettings.dhakaSubAreaFee)}</option>
                  <option value="outside_dhaka">Outside Dhaka — {formatBDT(shippingSettings.outsideDhakaFee)}</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1.5">Select the correct zone so your order uses the right courier fee.</p>
              </div>
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Tawhid Namikaze"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-slate-50 rounded-xl border text-sm text-slate-800 focus:bg-white outline-none transition-all ${
                    errors.fullName ? 'border-rose-300 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10'
                  }`}
                />
                {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-slate-50 rounded-xl border text-sm text-slate-800 focus:bg-white outline-none transition-all ${
                    errors.email ? 'border-rose-300 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10'
                  }`}
                />
                {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Phone (Bangladesh) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="01712345678"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-slate-50 rounded-xl border text-sm text-slate-800 focus:bg-white outline-none transition-all ${
                    errors.phone ? 'border-rose-300 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10'
                  }`}
                />
                {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
              </div>

              {/* Street Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Street Address & House / Flat No. <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="streetAddress"
                  placeholder="House 42, Road 11, Block C"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-slate-50 rounded-xl border text-sm text-slate-800 focus:bg-white outline-none transition-all ${
                    errors.streetAddress ? 'border-rose-300 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10'
                  }`}
                />
                {errors.streetAddress && <p className="text-xs text-rose-500 mt-1">{errors.streetAddress}</p>}
              </div>

              {/* Area */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Area / Thana <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="area"
                  placeholder="e.g. Banani, Gulshan, Uttara"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                />
                {errors.area && <p className="text-xs text-rose-500 mt-1">{errors.area}</p>}
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  City / District <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Dhaka, Chittagong, Sylhet"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                />
                {errors.city && <p className="text-xs text-rose-500 mt-1">{errors.city}</p>}
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Postal Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="e.g. 1213"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                />
                {errors.postalCode && <p className="text-xs text-rose-500 mt-1">{errors.postalCode}</p>}
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  disabled
                  value="Bangladesh"
                  className="w-full px-4 py-2.5 bg-slate-100 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Delivery Method */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-sm shadow-indigo-600/30">
                2
              </span>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Select Delivery Speed
                </h2>
                <p className="text-xs text-slate-400">Choose your preferred shipping tier</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Standard */}
              <label
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  selectedDeliveryMethod === 'standard'
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={selectedDeliveryMethod === 'standard'}
                    onChange={() => setSelectedDeliveryMethod('standard')}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">Standard Courier</span>
                    <span className="text-xs text-slate-500">Delivered within 3-4 business days</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {standardDeliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : formatBDT(standardDeliveryFee)}
                </span>
              </label>

              {/* Express */}
              <label
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  selectedDeliveryMethod === 'express'
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={selectedDeliveryMethod === 'express'}
                    onChange={() => setSelectedDeliveryMethod('express')}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-900 block flex items-center gap-1.5">
                      Express Courier <Truck className="w-3.5 h-3.5 text-indigo-600" />
                    </span>
                    <span className="text-xs text-slate-500">Guaranteed 24-48 hours priority</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {expressDeliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : formatBDT(expressDeliveryFee)}
                </span>
              </label>
            </div>
          </div>

          {/* Step 3: Payment Method (Demo) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-sm shadow-indigo-600/30">
                  3
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Payment Method
                  </h2>
                  <p className="text-xs text-slate-400">Demo sandbox simulation (No real charge)</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {/* COD */}
              <label
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'cod'
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex items-center gap-2.5">
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-xs text-slate-500">
                        Pay cash upon receiving the parcel at your doorstep
                      </span>
                    </div>
                  </div>
                </div>
                <CheckCircle2 className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-indigo-600' : 'text-transparent'}`} />
              </label>

              {/* Demo Mobile Payment */}
              <label
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-3 ${
                  paymentMethod === 'mobile_payment'
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'mobile_payment'}
                      onChange={() => setPaymentMethod('mobile_payment')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-5 h-5 text-pink-600" />
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">
                          Demo Mobile Wallet (bKash / Nagad / Rocket)
                        </span>
                        <span className="text-xs text-slate-500">
                          Instant mobile account verification
                        </span>
                      </div>
                    </div>
                  </div>
                  <CheckCircle2 className={`w-5 h-5 ${paymentMethod === 'mobile_payment' ? 'text-indigo-600' : 'text-transparent'}`} />
                </div>

                {paymentMethod === 'mobile_payment' && (
                  <div className="pt-3 border-t border-indigo-100 flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Enter bKash/Nagad Number"
                      value={mobileWalletNumber}
                      onChange={(e) => setMobileWalletNumber(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                    />
                    <span className="text-[11px] text-slate-400 self-center">
                      Auto-validated demo simulator
                    </span>
                  </div>
                )}
              </label>

              {/* Demo Card */}
              <label
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-3 ${
                  paymentMethod === 'card'
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">
                          Demo Credit / Debit Card
                        </span>
                        <span className="text-xs text-slate-500">
                          Visa, Mastercard, AMEX simulation
                        </span>
                      </div>
                    </div>
                  </div>
                  <CheckCircle2 className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-indigo-600' : 'text-transparent'}`} />
                </div>

                {paymentMethod === 'card' && (
                  <div className="pt-3 border-t border-indigo-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Card Number"
                        value={cardData.cardNumber}
                        onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardData.cardExpiry}
                        onChange={(e) => setCardData({ ...cardData, cardExpiry: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono text-center font-semibold text-slate-800"
                      />
                    </div>
                  </div>
                )}
              </label>
            </div>

            {errors.payment && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.payment}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Sticky Order Breakdown (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 sticky top-28">
          {/* Order Items Preview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Order Items ({cartCount})
            </h3>
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
              {cart.map((item: CartItem) => (
                <div key={item.cartItemId} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-10 h-12 object-cover rounded-lg bg-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate">{item.product.name}</p>
                      <p className="text-slate-400">
                        Qty: {item.quantity} {item.selectedSize ? `• ${item.selectedSize}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    {formatBDT(item.priceAtAddition * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Order Summary with "Place Order" CTA */}
          <OrderSummaryCard
            showCheckoutButton
            onCheckoutClick={handlePlaceOrder}
            customActionText="Place Order Now"
            isProcessing={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};
