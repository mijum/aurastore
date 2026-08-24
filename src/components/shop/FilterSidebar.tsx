import React from 'react';
import { ProductCategory, FilterState } from '../../types';
import { RotateCcw, Check, Star } from 'lucide-react';
import { formatBDT } from '../../utils/formatters';

const CATEGORIES: ProductCategory[] = [
  'All',
  'Clothing',
  'Shoes',
  'Accessories',
  'Electronics',
  'Bags',
  'Watches',
];

interface FilterSidebarProps {
  filters: FilterState;
  onCategoryChange: (category: ProductCategory) => void;
  onPriceChange: (min: number, max: number) => void;
  onRatingChange: (rating: number) => void;
  onInStockChange: (inStock: boolean) => void;
  onReset: () => void;
  productCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onCategoryChange,
  onPriceChange,
  onRatingChange,
  onInStockChange,
  onReset,
  productCount,
}) => {
  return (
    <aside aria-label="Product Filters" className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">Filters</h3>
          <p className="text-xs text-slate-500">{productCount} items found</p>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 p-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Category
        </h4>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Price Range
          </h4>
          <span className="text-xs font-semibold text-slate-500">
            Max: {formatBDT(filters.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="20000"
          step="500"
          value={filters.maxPrice}
          onChange={(e) => onPriceChange(filters.minPrice, Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>{formatBDT(0)}</span>
          <span>{formatBDT(20000)}</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Rating
        </h4>
        <div className="space-y-1.5">
          {[0, 4, 4.5].map((ratingVal) => {
            const isSelected = filters.minRating === ratingVal;
            return (
              <button
                key={ratingVal}
                onClick={() => onRatingChange(ratingVal)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {ratingVal === 0 ? (
                    'All Ratings'
                  ) : (
                    <>
                      {ratingVal}★ & above <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
                    </>
                  )}
                </span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* In-Stock Toggle */}
      <div className="pt-4 border-t border-slate-200">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
            In Stock Only
          </span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 transition cursor-pointer"
          />
        </label>
      </div>
    </aside>
  );
};
