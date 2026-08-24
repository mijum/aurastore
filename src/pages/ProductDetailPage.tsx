import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductGallery } from '../components/product/ProductGallery';
import { VariantSelector } from '../components/product/VariantSelector';
import { ReviewSection } from '../components/product/ReviewSection';
import { ProductCard } from '../components/product/ProductCard';
import { RatingStars } from '../components/common/RatingStars';
import { Badge } from '../components/common/Badge';
import { Product } from '../types';
import { formatBDT, calculateDiscountPercentage } from '../utils/formatters';
import {
  Heart,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  PackageX,
  Share2,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {
    getProductBySlug,
    addToCart,
    isInWishlist,
    toggleWishlist,
    addRecentlyViewed,
    products,
    addToast,
    productsLoading,
    productsError,
    refreshProducts,
  } = useStore();

  const product = slug ? getProductBySlug(slug) : undefined;

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | undefined>();
  const [quantity, setQuantity] = useState<number>(1);

  // Accordion open states
  const [activeAccordion, setActiveAccordion] = useState<'details' | 'shipping' | 'specs' | null>('details');

  // Sync variants & recently viewed when product changes
  useEffect(() => {
    if (product) {
      // Set default size and color
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else {
        setSelectedSize('');
      }

      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      } else {
        setSelectedColor(undefined);
      }

      setQuantity(1);
      addRecentlyViewed(product.id);
      window.scrollTo(0, 0);
    }
  }, [product?.id]);

  if (!product && productsLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-16"><div className="h-[520px] rounded-3xl bg-slate-100 animate-pulse" /></div>;
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <PackageX className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h1>
        <p className="text-sm text-slate-500 mb-6">{productsError || 'The requested product could not be located or may have been removed.'}</p>
        {productsError && <button onClick={() => void refreshProducts()} className="mr-3 px-6 py-3 bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl">Try Again</button>}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-600/20"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const discountPercentage = calculateDiscountPercentage(product.price, product.discountPrice);

  const relatedProducts = products
    .filter((p: Product) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedSize || undefined, selectedColor);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const added = addToCart(product, quantity, selectedSize || undefined, selectedColor);
    if (added) {
      navigate('/checkout');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on AuraStore!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link to="/" className="hover:text-indigo-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-indigo-600 transition-colors">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          to={`/shop?category=${encodeURIComponent(product.category)}`}
          className="hover:text-indigo-600 transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 font-bold truncate max-w-[200px]">
          {product.name}
        </span>
      </div>

      {/* Main Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Gallery (7 Cols) */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Order & Meta (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {/* Category, Badges, Wishlist & Share */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="primary">{product.category}</Badge>
                {product.newArrival && <Badge variant="secondary">New Season</Badge>}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleShare}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                  title="Share product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2 rounded-full transition-colors ${
                    inWishlist
                      ? 'text-rose-500 bg-rose-50'
                      : 'text-slate-400 hover:text-rose-500 hover:bg-slate-50'
                  }`}
                  aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
              {product.name}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-3 mb-4">
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} showScore size={16} />
              <span className="text-slate-300">•</span>
              <a
                href="#reviews"
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                Read all {product.reviewCount} customer reviews
              </a>
            </div>

            {/* Price & Savings */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900">
                  {formatBDT(product.discountPrice ?? product.price)}
                </span>
                {product.discountPrice && (
                  <>
                    <span className="text-base text-slate-400 line-through">
                      {formatBDT(product.price)}
                    </span>
                    <Badge variant="danger">Save {discountPercentage}%</Badge>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Prices include all government VAT. Free delivery on orders over ৳5,000.
              </p>
            </div>

            {/* Stock Status Indicator */}
            <div className="mb-6">
              {isOutOfStock ? (
                <div className="p-3 bg-slate-100 rounded-xl flex items-center gap-2 text-slate-600 text-xs font-bold">
                  <PackageX className="w-4 h-4 text-slate-500" />
                  Currently Out of Stock. Join waitlist to get notified.
                </div>
              ) : isLowStock ? (
                <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-center gap-2 text-amber-800 text-xs font-bold animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  Hurry! Only {product.stock} units left in stock.
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  In Stock ({product.stock} available) — Ready to Dispatch
                </div>
              )}
            </div>

            {/* Description excerpt */}
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {product.description}
            </p>
          </div>

          {/* Variants Selector */}
          <div className="pt-2 pb-4 border-t border-slate-100">
            <VariantSelector
              sizes={product.sizes}
              colors={product.colors}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
            />
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              {/* Stepper */}
              <div className="flex items-center border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 p-0.5">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3.5 py-3 text-slate-500 hover:bg-slate-200 disabled:opacity-30 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="px-3.5 py-3 text-slate-500 hover:bg-slate-200 disabled:opacity-30 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
              </button>
            </div>

            {/* Buy Now Direct Checkout CTA */}
            {!isOutOfStock && (
              <button
                onClick={handleBuyNow}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                Buy Now (Instant Checkout)
              </button>
            )}
          </div>

          {/* Value Micro Props */}
          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50">
              <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Fast Courier Delivery</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50">
              <RotateCcw className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>30-Day Hassle Free Returns</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Genuine Guaranteed</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Cash on Delivery Available</span>
            </div>
          </div>

          {/* Accordion Tabs for Features, Specs, Shipping */}
          <div className="border-t border-slate-200 pt-6 divide-y divide-slate-100">
            {/* Features Accordion */}
            <div className="py-3">
              <button
                onClick={() =>
                  setActiveAccordion(activeAccordion === 'details' ? null : 'details')
                }
                className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-900"
              >
                <span>Highlights & Key Features</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeAccordion === 'details' ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>
              {activeAccordion === 'details' && (
                <ul className="mt-3 space-y-2 text-xs text-slate-600 pl-4 list-disc marker:text-indigo-600 animate-slide-up">
                  {product.details.map((detail: string, idx: number) => (
                    <li key={idx} className="leading-relaxed">
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Specifications Accordion */}
            <div className="py-3">
              <button
                onClick={() =>
                  setActiveAccordion(activeAccordion === 'specs' ? null : 'specs')
                }
                className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-900"
              >
                <span>Technical Specifications</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeAccordion === 'specs' ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>
              {activeAccordion === 'specs' && (
                <div className="mt-3 bg-slate-50 rounded-xl p-3 divide-y divide-slate-200 text-xs animate-slide-up">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="py-2 flex justify-between">
                      <span className="text-slate-500 font-medium">{key}</span>
                      <span className="text-slate-900 font-bold">{String(val)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Shipping & Returns Accordion */}
            <div className="py-3">
              <button
                onClick={() =>
                  setActiveAccordion(activeAccordion === 'shipping' ? null : 'shipping')
                }
                className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-900"
              >
                <span>Shipping, Dispatch & Returns</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeAccordion === 'shipping' ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>
              {activeAccordion === 'shipping' && (
                <div className="mt-3 text-xs text-slate-600 space-y-2 leading-relaxed animate-slide-up">
                  <p>
                    • <strong>Inside Dhaka:</strong> Delivered in 24-48 hours (৳120 standard / ৳250 express).
                  </p>
                  <p>
                    • <strong>Outside Dhaka:</strong> Delivered via express courier in 48-72 hours across all 64 districts.
                  </p>
                  <p>
                    • <strong>Returns Policy:</strong> 30-day money-back guarantee if the item is in unused condition with tags attached.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div id="reviews" className="pt-10 border-t border-slate-200">
        <ReviewSection
          productId={product.id}
          reviews={product.reviews}
          rating={product.rating}
          reviewCount={product.reviewCount}
        />
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                You Might Also Like
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Related {product.category}
              </h2>
            </div>
            <Link
              to={`/shop?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              View More
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel: Product) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
