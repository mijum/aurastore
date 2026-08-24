import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Address, Order, OrderItem } from '../types';
import { formatBDT, formatDate } from '../utils/formatters';
import { Modal } from '../components/common/Modal';
import {
  User as UserIcon,
  Package,
  MapPin,
  Heart,
  LogOut,
  Plus,
  Trash2,
  Eye,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const {
    currentUser,
    orders,
    logout,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
  } = useStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentTab = (searchParams.get('tab') as 'profile' | 'orders' | 'addresses') || 'profile';

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Edit Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
  });

  // Add Address Modal & Form State
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState<Omit<Address, 'id'>>({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    streetAddress: '',
    area: '',
    city: 'Dhaka',
    district: 'Dhaka',
    postalCode: '',
    country: 'Bangladesh',
    isDefault: false,
  });

  // Selected Order for Receipt Modal
  const [selectedOrderReceipt, setSelectedOrderReceipt] = useState<Order | null>(null);

  if (!currentUser) return null;

  // Account history only includes orders explicitly owned by this account.
  const userOrders = orders.filter((o: Order) => o.userId === currentUser.id);

  const handleTabChange = (tab: 'profile' | 'orders' | 'addresses') => {
    setSearchParams({ tab });
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim(),
    });
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.streetAddress.trim() || !addressForm.area.trim()) return;

    addAddress(addressForm);
    setAddressModalOpen(false);
    setAddressForm({
      fullName: currentUser.name,
      phone: currentUser.phone,
      streetAddress: '',
      area: '',
      city: 'Dhaka',
      district: 'Dhaka',
      postalCode: '',
      country: 'Bangladesh',
      isDefault: false,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover bg-indigo-500/20 border-2 border-indigo-400/40 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-extrabold">{currentUser.name}</h1>
              {currentUser.isDemoUser && (
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded-full border border-indigo-400/30">
                  Demo Account
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Member since {formatDate(currentUser.joinedDate)} • {userOrders.length} Total Orders
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>

      {/* Main Grid: Sidebar (3 Cols) & Content (9 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          <button
            onClick={() => handleTabChange('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
              currentTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            Profile & Settings
          </button>

          <button
            onClick={() => handleTabChange('orders')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
              currentTab === 'orders'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              Order History
            </div>
            {userOrders.length > 0 && (
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  currentTab === 'orders' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
                }`}
              >
                {userOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabChange('addresses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
              currentTab === 'addresses'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Saved Addresses
          </button>

          <Link
            to="/wishlist"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all text-left"
          >
            <Heart className="w-4 h-4" />
            My Wishlist
          </Link>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          {/* TAB 1: PROFILE */}
          {currentTab === 'profile' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-extrabold text-slate-900">Personal Information</h2>
                <p className="text-xs text-slate-500">Update your public profile details</p>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full px-4 py-2.5 bg-slate-100 rounded-xl border border-slate-200 text-sm text-slate-500 cursor-not-allowed"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Email address cannot be changed</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-600/20"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: ORDER HISTORY */}
          {currentTab === 'orders' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-extrabold text-slate-900">Your Order History</h2>
                <p className="text-xs text-slate-500">Track current shipments and view historical invoices</p>
              </div>

              {userOrders.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl">
                  <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-800 mb-1">No Orders Found</p>
                  <p className="text-xs text-slate-500 mb-4">You have not placed any orders yet.</p>
                  <Link
                    to="/shop"
                    className="inline-flex px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((ord: Order) => (
                    <div
                      key={ord.id}
                      className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-indigo-200 transition-all space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-200/60 pb-3">
                        <div>
                          <span className="text-slate-400 font-semibold block">Order Ref</span>
                          <span className="font-mono font-bold text-slate-900">{ord.orderNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block">Placed On</span>
                          <span className="font-bold text-slate-700">{formatDate(ord.date)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block">Total</span>
                          <span className="font-extrabold text-indigo-600">{formatBDT(ord.total)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block">Status</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                            {ord.status}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedOrderReceipt(ord)}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                      </div>

                      {/* Items thumbnails preview */}
                      <div className="flex flex-wrap gap-2">
                        {ord.items.map((item: OrderItem, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200/60 pr-3">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-8 h-10 object-cover rounded-lg bg-slate-100"
                            />
                            <div className="text-[11px]">
                              <p className="font-bold text-slate-800 line-clamp-1 max-w-[140px]">{item.productName}</p>
                              <p className="text-slate-400">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAVED ADDRESSES */}
          {currentTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Saved Addresses</h2>
                  <p className="text-xs text-slate-500">Manage your shipping and billing locations</p>
                </div>
                <button
                  onClick={() => setAddressModalOpen(true)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Address
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(currentUser.addresses || []).map((addr: Address) => (
                  <div
                    key={addr.id}
                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                      addr.isDefault
                        ? 'border-indigo-600 bg-indigo-50/30'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-slate-900">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {addr.streetAddress}, {addr.area}
                      </p>
                      <p className="text-xs text-slate-600">
                        {addr.city}, {addr.district} - {addr.postalCode}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">Phone: {addr.phone}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4 text-xs">
                      {!addr.isDefault && (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="font-bold text-indigo-600 hover:underline"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-rose-500 hover:text-rose-700 ml-auto flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        title="Add New Delivery Address"
      >
        <form onSubmit={handleAddressSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={addressForm.fullName}
              onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              required
              value={addressForm.phone}
              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Street Address & Flat / House
            </label>
            <input
              type="text"
              required
              placeholder="e.g. House 14, Road 4"
              value={addressForm.streetAddress}
              onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:bg-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Area / Thana
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dhanmondi"
                value={addressForm.area}
                onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:bg-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                City
              </label>
              <input
                type="text"
                required
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:bg-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                District
              </label>
              <input
                type="text"
                required
                value={addressForm.district}
                onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:bg-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                required
                placeholder="1209"
                value={addressForm.postalCode}
                onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:bg-white outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md"
          >
            Save Address
          </button>
        </form>
      </Modal>

      {/* Order Details Receipt Modal */}
      {selectedOrderReceipt && (
        <Modal
          isOpen={!!selectedOrderReceipt}
          onClose={() => setSelectedOrderReceipt(null)}
          title={`Order #${selectedOrderReceipt.orderNumber}`}
        >
          <div className="space-y-6 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
              <span>Date: <strong>{formatDate(selectedOrderReceipt.date)}</strong></span>
              <span>Status: <strong className="text-amber-700">{selectedOrderReceipt.status}</strong></span>
            </div>

            <div className="divide-y divide-slate-100">
              {selectedOrderReceipt.items.map((item: OrderItem, idx: number) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={item.productImage} alt="" className="w-10 h-12 object-cover rounded-lg bg-slate-100" />
                    <div>
                      <p className="font-bold text-slate-900">{item.productName}</p>
                      <p className="text-slate-400">Qty: {item.quantity} {item.selectedSize ? `• ${item.selectedSize}` : ''}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">{formatBDT(item.total)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-1 text-right">
              <div>Subtotal: <strong>{formatBDT(selectedOrderReceipt.subtotal)}</strong></div>
              <div>Shipping: <strong>{selectedOrderReceipt.shippingFee === 0 ? 'FREE' : formatBDT(selectedOrderReceipt.shippingFee)}</strong></div>
              {selectedOrderReceipt.discount > 0 && (
                <div className="text-emerald-600">Discount: -{formatBDT(selectedOrderReceipt.discount)}</div>
              )}
              <div className="text-sm font-black text-indigo-600 pt-1">
                Total: {formatBDT(selectedOrderReceipt.total)}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
