import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatBDT, formatDate } from '../utils/formatters';
import { OrderItem } from '../types';
import {
  CheckCircle2,
  Truck,
  ArrowRight,
  MapPin,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { getOrderById, orders } = useStore();

  const order = orderId ? getOrderById(orderId) : orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Order Completed</h1>
        <p className="text-sm text-slate-500 mb-6">
          Thank you! Your order has been registered in our system.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-600/20"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Celebratory Banner */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/20 animate-slide-up">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Order Successfully Placed
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Thank You For Your Order!
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          We've received your order and our dispatch warehouse is preparing your parcel.
        </p>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg space-y-8">
        {/* Key Info Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 font-semibold block">Order Reference</span>
            <span className="font-mono font-bold text-indigo-600 text-sm">{order.orderNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block">Order Date</span>
            <span className="font-bold text-slate-700">{formatDate(order.date)}</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block">Est. Delivery</span>
            <span className="font-bold text-slate-900">{formatDate(order.estimatedDelivery)}</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block">Payment Method</span>
            <span className="font-bold text-slate-900 uppercase">
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
            </span>
          </div>
        </div>

        {/* Shipping & Delivery Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-xs">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Delivery Address
            </h4>
            <p className="font-bold text-slate-800 text-sm">{order.customerName}</p>
            <p className="text-slate-600">
              {order.shippingAddress.streetAddress}, {order.shippingAddress.area}
            </p>
            <p className="text-slate-600">
              {order.shippingAddress.city}, {order.shippingAddress.district} - {order.shippingAddress.postalCode}
            </p>
            <p className="text-slate-500">Phone: {order.customerPhone}</p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-xs">
              <Truck className="w-3.5 h-3.5 text-indigo-600" /> Courier & Status
            </h4>
            <p className="text-slate-700">
              Method: <strong className="capitalize">{order.deliveryMethod} Delivery</strong>
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                Status: {order.status}
              </span>
            </div>
            <p className="text-slate-400 pt-1">A confirmation SMS & tracking code has been dispatched.</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Order Items Breakdown
          </h3>
          <div className="divide-y divide-slate-100">
            {order.items.map((item: OrderItem, idx: number) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-14 h-16 object-cover rounded-xl bg-slate-100 border border-slate-100 shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.productName}</h4>
                    <p className="text-xs text-slate-500">
                      Qty: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}{' '}
                      {item.selectedColor ? `• Color: ${item.selectedColor.name}` : ''}
                    </p>
                    <p className="text-xs font-semibold text-slate-700 sm:hidden">
                      {formatBDT(item.price)} each
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900">{formatBDT(item.total)}</span>
                  <p className="text-[11px] text-slate-400 hidden sm:block">
                    {formatBDT(item.price)} x {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Totals */}
        <div className="pt-4 border-t border-slate-200 space-y-2.5 text-xs text-slate-600 max-w-xs ml-auto">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-slate-900">{formatBDT(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Discount ({order.couponCode || 'Promo'})</span>
              <span>-{formatBDT(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-semibold text-slate-900">
              {order.shippingFee === 0 ? 'FREE' : formatBDT(order.shippingFee)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>VAT (5%)</span>
            <span className="font-semibold text-slate-900">{formatBDT(order.tax)}</span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-base font-extrabold text-slate-900">
            <span>Total Paid</span>
            <span className="text-xl text-indigo-600">{formatBDT(order.total)}</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/shop"
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors text-center"
          >
            Continue Shopping
          </Link>

          <Link
            to="/account?tab=orders"
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5"
          >
            View in Order History <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
