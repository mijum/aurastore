import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Package,
  LogOut,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCategory } from '../../types';
import { formatBDT } from '../../utils/formatters';

const CATEGORIES: ProductCategory[] = [
  'Clothing',
  'Shoes',
  'Accessories',
  'Electronics',
  'Bags',
  'Watches',
];

export const Navbar: React.FC = () => {
  const {
    cartCount,
    wishlist,
    currentUser,
    logout,
    isMobileNavOpen,
    setIsMobileNavOpen,
    products,
    setCategory,
    setSearchQuery,
  } = useStore();

  const navigate = useNavigate();
  const location = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);

  // Close dropdowns on route change
  useEffect(() => {
    setCategoryDropdownOpen(false);
    setUserDropdownOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node)
      ) {
        setCategoryDropdownOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products for live search preview
  const searchResults = React.useMemo(() => {
    if (!searchTerm.trim()) return [];
    const query = searchTerm.toLowerCase().trim();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      )
      .slice(0, 5);
  }, [searchTerm, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchQuery(searchTerm.trim());
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  const handleCategoryClick = (cat: ProductCategory) => {
    setCategory(cat);
    navigate(`/shop?category=${encodeURIComponent(cat)}`);
    setCategoryDropdownOpen(false);
  };

  const handleCartClick = () => {
    const button = cartButtonRef.current;
    if (!button) {
      navigate('/cart');
      return;
    }

    if (button.classList.contains('cart-trigger-launching')) return;

    const rect = button.getBoundingClientRect();
    const flyer = document.createElement('span');
    flyer.className = 'cart-button-flyer';
    flyer.setAttribute('aria-hidden', 'true');
    flyer.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';
    const flyX = window.innerWidth / 2 - (rect.left + rect.width / 2);
    const flyY = window.innerHeight / 2 - (rect.top + rect.height / 2);
    flyer.style.setProperty('--cart-fly-x', `${flyX}px`);
    flyer.style.setProperty('--cart-fly-y', `${flyY}px`);
    flyer.style.setProperty('--cart-fly-mid-x', `${flyX * 0.55}px`);
    flyer.style.setProperty('--cart-fly-mid-y', `${flyY * 0.55 - 42}px`);
    flyer.style.left = `${rect.left + rect.width / 2}px`;
    flyer.style.top = `${rect.top + rect.height / 2}px`;

    document.body.appendChild(flyer);
    button.classList.add('cart-trigger-launching');

    window.setTimeout(() => {
      flyer.remove();
      const bloom = document.createElement('span');
      bloom.className = 'cart-flower-bloom';
      bloom.setAttribute('aria-hidden', 'true');
      bloom.innerHTML = `
        <span class="cart-flower-halo"></span>
        <span class="cart-flower-petals">
          <svg viewBox="-120 -120 240 240" focusable="false">
            <defs>
              <linearGradient id="cart-flower-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#c7d2fe" />
                <stop offset="1" stop-color="#6366f1" />
              </linearGradient>
            </defs>
            ${Array.from({ length: 8 }, (_, index) => `<ellipse cx="0" cy="-48" rx="42" ry="76" transform="rotate(${index * 45})" />`).join('')}
          </svg>
        </span>
        <span class="cart-flower-core">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </span>`;
      document.body.appendChild(bloom);

      window.setTimeout(() => {
        bloom.classList.add('cart-flower-exit');
        navigate('/cart');
        window.setTimeout(() => {
          bloom.remove();
          button.classList.remove('cart-trigger-launching');
        }, 320);
      }, 820);
    }, 460);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-white/20 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans group-hover:text-indigo-600 transition-colors">
                Aura<span className="text-indigo-600">Store</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 -mt-1">
                Premium Living
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 font-medium text-sm text-slate-600">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl transition-colors hover:text-indigo-600 hover:bg-indigo-50/50 ${
                location.pathname === '/' ? 'text-indigo-600 font-semibold bg-indigo-50/60' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`px-3.5 py-2 rounded-xl transition-colors hover:text-indigo-600 hover:bg-indigo-50/50 ${
                location.pathname === '/shop' ? 'text-indigo-600 font-semibold bg-indigo-50/60' : ''
              }`}
            >
              Shop All
            </Link>

            {/* Categories Dropdown */}
            <div className="relative" ref={categoryMenuRef}>
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors hover:text-indigo-600 hover:bg-indigo-50/50 text-slate-600"
              >
                Categories
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    categoryDropdownOpen ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-slide-up">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                    Browse Categories
                  </div>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/70 rounded-xl transition-colors flex items-center justify-between"
                    >
                      {cat}
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/wishlist"
              className={`px-3.5 py-2 rounded-xl transition-colors hover:text-indigo-600 hover:bg-indigo-50/50 ${
                location.pathname === '/wishlist' ? 'text-indigo-600 font-semibold bg-indigo-50/60' : ''
              }`}
            >
              Wishlist
            </Link>
          </nav>

          {/* Search bar & Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search container */}
            <div className="relative" ref={searchContainerRef}>
              <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search 20+ products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  className="w-52 lg:w-64 pl-9 pr-4 py-2 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 rounded-full border border-transparent focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Mobile search trigger */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Search results dropdown popup */}
              {searchOpen && searchTerm.trim() && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-slide-up">
                  <div className="text-xs font-semibold text-slate-400 px-3 py-1 mb-1">
                    Matching Products ({searchResults.length})
                  </div>
                  {searchResults.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.slug}`}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchTerm('');
                          }}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-11 h-11 object-cover rounded-lg bg-slate-100"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span>{product.category}</span>
                              <span>•</span>
                              <span className="font-bold text-slate-900">
                                {formatBDT(product.discountPrice ?? product.price)}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="w-full text-center py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors mt-2"
                      >
                        View all results for "{searchTerm}"
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-slate-500">
                      No products found matching "{searchTerm}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none"
              aria-label={`Wishlist, ${wishlist.length} items`}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              ref={cartButtonRef}
              data-cart-animation-target
              onClick={handleCartClick}
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none"
              aria-label={`Shopping cart, ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span data-cart-badge className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm cart-badge-enter">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account dropdown / Login button */}
            <div className="relative" ref={userMenuRef}>
              {currentUser ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition-colors text-sm font-semibold focus:outline-none border border-slate-200/60"
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                >
                  <img
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover bg-indigo-100"
                  />
                  <span className="max-w-[90px] truncate hidden sm:inline">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-indigo-600/20"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}

              {/* User Dropdown Menu */}
              {userDropdownOpen && currentUser && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-slide-up">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-medium text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                  <Link
                    to="/account"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    Account Profile
                  </Link>
                  <Link
                    to="/account?tab=orders"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    My Wishlist
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
