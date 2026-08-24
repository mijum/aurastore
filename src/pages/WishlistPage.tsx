import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { EmptyState } from '../components/common/EmptyState';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';

export const WishlistPage: React.FC = () => {
  const { wishlist, getProductById, moveToCartFromWishlist } = useStore();

  const wishlistProducts = wishlist
    .map((id: string) => getProductById(id))
    .filter(Boolean) as Product[];

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Explore our catalog and click the heart icon on any product to save your favorites here."
          actionText="Discover Products"
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
            My Saved Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        <Link
          to="/shop"
          className="text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid of Wishlist Items */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlistProducts.map((product: Product) => (
          <div key={product.id} className="flex flex-col">
            <ProductCard product={product} />
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => moveToCartFromWishlist(product.id)}
                disabled={product.stock <= 0}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
