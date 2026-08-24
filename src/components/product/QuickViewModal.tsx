import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Heart, ShoppingBag, Plus, Minus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatBDT, calculateDiscountPercentage } from '../../utils/formatters';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct: product,
    closeQuickView,
    addToCart,
    isInWishlist,
    toggleWishlist,
  } = useStore();

  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | undefined>();
  const [quantity, setQuantity] = useState(1);

  // Sync state whenever quickViewProduct changes
  React.useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0]);
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : undefined);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const discountPercentage = calculateDiscountPercentage(product.price, product.discountPrice);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const added = addToCart(product, quantity, selectedSize || undefined, selectedColor);
    if (added) {
      closeQuickView();
    }
  };

  const handleViewFullPage = () => {
    closeQuickView();
    navigate(`/product/${product.slug}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      onClick={closeQuickView}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden transform transition-all animate-slide-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 hover:bg-slate-100 text-slate-400 hover:text-slate-700 shadow-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery */}
          <div className="p-6 bg-slate-50 flex flex-col justify-between">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-white shadow-inner mb-3">
              <img
                src={selectedImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      (selectedImage || product.images[0]) === img
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
            <div>
              {/* Category & Wishlist */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  {product.category}
                </span>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2 rounded-full transition-colors ${
                    inWishlist
                      ? 'text-rose-500 bg-rose-50'
                      : 'text-slate-400 hover:text-rose-500 hover:bg-slate-50'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
                {product.name}
              </h2>

              <div className="flex items-center gap-3 mb-4">
                <RatingStars rating={product.rating} reviewCount={product.reviewCount} showScore />
                <span className="text-slate-300">•</span>
                {isOutOfStock ? (
                  <Badge variant="slate">Out of Stock</Badge>
                ) : isLowStock ? (
                  <span className="text-xs font-semibold text-amber-600">
                    Low Stock: {product.stock} left
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.stock})
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 mb-4">
                <span className="text-2xl font-black text-slate-900">
                  {formatBDT(product.discountPrice ?? product.price)}
                </span>
                {product.discountPrice && (
                  <>
                    <span className="text-sm text-slate-400 line-through">
                      {formatBDT(product.price)}
                    </span>
                    <Badge variant="danger">-{discountPercentage}%</Badge>
                  </>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-5 leading-relaxed">
                {product.description}
              </p>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                    <span>Select Size</span>
                    <span className="text-indigo-600 font-semibold">{selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          selectedSize === size
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-5">
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                    <span>Select Color</span>
                    <span className="text-indigo-600 font-semibold">{selectedColor?.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 ${
                          selectedColor?.name === color.name
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 scale-110'
                            : 'border-transparent hover:scale-105'
                        }`}
                        title={color.name}
                      >
                        <span
                          className="block w-full h-full rounded-full border border-black/10"
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions: Quantity & Add to Cart */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="px-3 py-2.5 text-slate-500 hover:bg-slate-200 disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 text-sm font-bold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="px-3 py-2.5 text-slate-500 hover:bg-slate-200 disabled:opacity-30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3 px-5 text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                </button>
              </div>

              {/* View full page */}
              <button
                onClick={handleViewFullPage}
                className="w-full text-center text-xs font-semibold text-slate-500 hover:text-indigo-600 py-1 transition-colors flex items-center justify-center gap-1"
              >
                View Full Product Details & Reviews <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
