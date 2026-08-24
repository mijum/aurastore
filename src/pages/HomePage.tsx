import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Tag,
  Clock,
  Flame,
  Star,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { Product, ProductCategory } from '../types';
import { formatBDT } from '../utils/formatters';

const CATEGORY_ITEMS: { name: ProductCategory; count: number; image: string; tag: string }[] = [
  {
    name: 'Clothing',
    count: 5,
    tag: 'Premium Fabrics',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Shoes',
    count: 4,
    tag: 'Engineered Comfort',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Accessories',
    count: 4,
    tag: 'Everyday Essentials',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Electronics',
    count: 4,
    tag: 'Smart Audio & Wearables',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Bags',
    count: 3,
    tag: 'Urban Transit',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Watches',
    count: 3,
    tag: 'Horological Art',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
  },
];

export const HomePage: React.FC = () => {
  const { products, setCategory, setSortBy, addToast, recentlyViewed, getProductById } = useStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'featured' | 'newArrivals'>('featured');

  // Working live countdown timer for promo banner
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 36,
    seconds: 42,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter((p: Product) => p.featured).slice(0, 8);
  const newArrivalProducts = products.filter((p: Product) => p.newArrival).slice(0, 8);

  const displayProducts = activeTab === 'featured' ? featuredProducts : newArrivalProducts;

  const recentProductObjects = recentlyViewed
    .map((id: string) => getProductById(id))
    .filter(Boolean) as Product[];

  const handleCategoryClick = (cat: ProductCategory) => {
    setCategory(cat);
    navigate(`/shop?category=${encodeURIComponent(cat)}`);
  };

  const copyCouponCode = () => {
    navigator.clipboard?.writeText('AURA20');
    addToast('Coupon "AURA20" copied! Use at checkout for 20% discount.', 'success');
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-16 sm:py-24">
        {/* Subtle glowing mesh backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-40 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-bold tracking-wider uppercase backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next-Gen Lifestyle & Apparel 2026</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
                <span className="block hero-reveal hero-reveal-1">
                  <span className="block hero-float-headline-primary">Curated Aesthetics.</span>
                </span>
                <span className="block hero-reveal hero-reveal-2">
                  <span className="block hero-float-headline-accent text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300">
                    Uncompromising Quality.
                  </span>
                </span>
              </h1>

              {/* Subtext */}
              <div className="hero-reveal hero-reveal-3">
                <p className="hero-float-description text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                  Discover exceptional craftsmanship across heavyweight apparel, horology, audiophile electronics, and Italian leather accessories. Designed for everyday modern living.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <div className="hero-reveal hero-reveal-4 w-full sm:w-auto">
                  <div className="hero-float-cta-primary">
                    <Link
                      to="/shop"
                      className="hero-premium-cta w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group"
                    >
                      <span>Shop Collection</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                <div className="hero-reveal hero-reveal-5 w-full sm:w-auto">
                  <div className="hero-float-cta-secondary">
                    <button
                      onClick={() => {
                        setSortBy('newest');
                        navigate('/shop?sort=newest');
                      }}
                      className="hero-premium-cta w-full sm:w-auto px-8 py-4 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm rounded-2xl border border-slate-700 transition-all backdrop-blur-sm text-center"
                    >
                      Explore New Arrivals
                    </button>
                  </div>
                </div>
              </div>

              {/* Micro proof badges */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0 text-left">
                <div className="hero-reveal hero-reveal-6">
                  <div className="hero-float-stat-one">
                    <p className="text-xl sm:text-2xl font-black text-white">20+</p>
                    <p className="text-xs text-slate-400 font-medium">Curated Items</p>
                  </div>
                </div>
                <div className="hero-reveal hero-reveal-7">
                  <div className="hero-float-stat-two">
                    <p className="text-xl sm:text-2xl font-black text-white">4.9★</p>
                    <p className="text-xs text-slate-400 font-medium">Customer Rating</p>
                  </div>
                </div>
                <div className="hero-reveal hero-reveal-8">
                  <div className="hero-float-stat-three">
                    <p className="text-xl sm:text-2xl font-black text-white">48h</p>
                    <p className="text-xs text-slate-400 font-medium">Nationwide Delivery</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Cards */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="hero-visual-reveal relative w-full max-w-md">
                {/* Main Hero Card */}
                <div className="hero-float-product-card relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-850 p-3 group">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 relative">
                    <img
                      src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
                      alt="Studio Wireless ANC Headphones"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    
                    <div className="hero-float-feature-panel absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Featured Drop</span>
                        <h4 className="text-sm font-bold text-white">Studio Wireless ANC</h4>
                        <span className="text-xs font-extrabold text-white">{formatBDT(11990)}</span>
                      </div>
                      <Link
                        to="/product/studio-wireless-anc-headphones"
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Floating Secondary Mini Card */}
                <div className="hero-float-mini-card hidden sm:flex absolute -bottom-6 -left-6 bg-slate-900/90 backdrop-blur-xl border border-white/10 p-3.5 rounded-2xl shadow-2xl items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80"
                      alt="Stealth Runner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Stealth Runner</p>
                    <p className="text-[11px] font-semibold text-emerald-400">In High Demand</p>
                    <p className="text-xs font-extrabold text-slate-200">{formatBDT(5299)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES BROWSER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            All Categories <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORY_ITEMS.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-100 border border-slate-200/80 hover:shadow-xl hover:border-indigo-300 transition-all text-left focus:outline-none"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3.5 text-white">
                <span className="text-[10px] font-semibold text-indigo-300 uppercase tracking-wider block">
                  {cat.tag}
                </span>
                <h3 className="font-extrabold text-sm sm:text-base leading-tight group-hover:text-indigo-200 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-300 font-medium">
                  {cat.count} Products
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. PROMOTIONAL FLASH BANNER WITH LIVE COUNTDOWN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-indigo-700/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-rose-500/30">
                <Flame className="w-4 h-4 text-rose-400" />
                Limited Time Flash Offer
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Enjoy Flat 20% OFF Entire Order
              </h2>

              <p className="text-sm text-indigo-200 max-w-lg leading-relaxed">
                Unlock 20% discount on all premium footwear, horology, and electronics. Use coupon code at checkout.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={copyCouponCode}
                  className="px-5 py-3 bg-white text-indigo-900 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <Tag className="w-4 h-4 text-indigo-600" />
                  Copy Coupon: AURA20
                </button>
                <Link
                  to="/shop"
                  className="px-5 py-3 bg-indigo-600/40 hover:bg-indigo-600 text-white border border-indigo-400/40 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Shop Deal
                </Link>
              </div>
            </div>

            {/* Countdown timer */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300 mb-3">
                <Clock className="w-4 h-4" /> Deal Ends In:
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center justify-center w-16 h-18 sm:w-20 sm:h-22 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 p-2 shadow-inner">
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-300 uppercase">Hours</span>
                </div>
                <span className="text-2xl font-bold text-indigo-400">:</span>
                <div className="flex flex-col items-center justify-center w-16 h-18 sm:w-20 sm:h-22 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 p-2 shadow-inner">
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-300 uppercase">Mins</span>
                </div>
                <span className="text-2xl font-bold text-indigo-400">:</span>
                <div className="flex flex-col items-center justify-center w-16 h-18 sm:w-20 sm:h-22 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 p-2 shadow-inner">
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-300 uppercase">Secs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED & NEW ARRIVALS TABBED SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Curated Picks
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Trending & New Drops
            </h2>
          </div>

          {/* Switcher Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'featured'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Featured Highlights
            </button>
            <button
              onClick={() => setActiveTab('newArrivals')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'newArrivals'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Arrivals
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center pt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-md"
          >
            Browse All 20+ Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. RECENTLY VIEWED SHELF (If any) */}
      {recentProductObjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Your Browsing History
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Recently Viewed Items
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {recentProductObjects.slice(0, 4).map((product: Product) => (
              product && <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
