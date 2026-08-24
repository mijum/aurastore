import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatBDT, calculateDiscountPercentage } from '../../utils/formatters';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';
import { useCartAnimation } from '../../context/CartAnimationContext';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode = 'grid',
}) => {
  const { isInWishlist, toggleWishlist, openQuickView } = useStore();
  const { animateAddToCart } = useCartAnimation();
  const productImageRef = useRef<HTMLImageElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const discountPercentage = calculateDiscountPercentage(product.price, product.discountPrice);

  const fallbackImage =
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    const added = await animateAddToCart({
      product,
      sourceElement: productImageRef.current,
    });
    if (added) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  // ---------------- LIST VIEW ----------------
  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all flex flex-col sm:flex-row gap-5">
        {/* Image */}
        <div 
          onClick={() => openQuickView(product)}
          className="relative w-full sm:w-52 aspect-square sm:aspect-auto rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer"
        >
          <img
            ref={productImageRef}
            src={imageError ? fallbackImage : product.images[0]}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {discountPercentage > 0 && (
              <Badge variant="danger">-{discountPercentage}%</Badge>
            )}
            {product.newArrival && (
              <Badge variant="primary">New</Badge>
            )}
            {isOutOfStock && (
              <Badge variant="slate">Sold Out</Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                {product.category}
              </span>
              <button
                onClick={handleWishlistToggle}
                className={`p-2 rounded-full transition-colors ${
                  inWishlist
                    ? 'text-rose-500 bg-rose-50'
                    : 'text-slate-400 hover:text-rose-500 hover:bg-slate-50'
                }`}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => openQuickView(product)}
              className="text-left text-base sm:text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer"
            >
              {product.name}
            </button>

            <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-1.5 mb-3 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-2 mb-3">
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} showScore />
              {isLowStock && (
                <span className="text-xs font-medium text-amber-600">
                  • Only {product.stock} left!
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                {formatBDT(product.discountPrice ?? product.price)}
              </span>
              {product.discountPrice && (
                <span className="text-xs sm:text-sm text-slate-400 line-through">
                  {formatBDT(product.price)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleQuickView}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Quick preview"
              >
                <Eye className="w-3.5 h-3.5" />
                Quick View
              </button>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-sm ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : justAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 cursor-pointer'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Added
                  </>
                ) : isOutOfStock ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- GRID VIEW (Default) ----------------
  return (
    <div
      className="group bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div 
        onClick={() => openQuickView(product)}
        className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 mb-3.5 cursor-pointer"
      >
        <img
          ref={productImageRef}
          src={imageError ? fallbackImage : product.images[0]}
          alt={product.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercentage > 0 && (
            <Badge variant="danger">-{discountPercentage}%</Badge>
          )}
          {product.newArrival && (
            <Badge variant="primary">New</Badge>
          )}
          {isOutOfStock && (
            <Badge variant="slate">Sold Out</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-all z-10 ${
            inWishlist
              ? 'bg-rose-50 text-rose-500'
              : 'bg-white/90 text-slate-500 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Quick View overlay button on desktop */}
        <div
          className={`hidden sm:flex absolute inset-x-3 bottom-3 items-center justify-center transition-all duration-300 z-10 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <button
            onClick={handleQuickView}
            className="w-full py-2 px-3 bg-white/95 hover:bg-white text-slate-800 text-xs font-bold rounded-xl shadow-lg backdrop-blur-md transition-all flex items-center justify-center gap-1.5 hover:text-indigo-600 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
            {product.category}
          </span>
          {isLowStock && (
            <span className="text-[10px] font-semibold text-amber-600">
              Only {product.stock} left
            </span>
          )}
        </div>

        <button
          onClick={() => openQuickView(product)}
          className="text-left text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 mb-1.5 cursor-pointer"
        >
          {product.name}
        </button>

        <div className="mb-3">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} showScore />
        </div>

        {/* Price & Add to Cart button */}
        <div className="mt-auto flex items-center justify-between pt-2.5 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-slate-900 leading-tight">
              {formatBDT(product.discountPrice ?? product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-slate-400 line-through">
                {formatBDT(product.price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
            }`}
            aria-label="Add to cart"
            title={isOutOfStock ? 'Sold out' : 'Add to cart'}
          >
            {justAdded ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
