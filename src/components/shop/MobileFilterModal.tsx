import React from 'react';
import { FilterState, ProductCategory } from '../../types';
import { FilterSidebar } from './FilterSidebar';
import { X } from 'lucide-react';

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onCategoryChange: (category: ProductCategory) => void;
  onPriceChange: (min: number, max: number) => void;
  onRatingChange: (rating: number) => void;
  onInStockChange: (inStock: boolean) => void;
  onReset: () => void;
  productCount: number;
}

export const MobileFilterModal: React.FC<MobileFilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onCategoryChange,
  onPriceChange,
  onRatingChange,
  onInStockChange,
  onReset,
  productCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto lg:hidden animate-fade-in" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl flex flex-col z-10 animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Filter Products</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <FilterSidebar
            filters={filters}
            onCategoryChange={(c) => {
              onCategoryChange(c);
              onClose();
            }}
            onPriceChange={onPriceChange}
            onRatingChange={onRatingChange}
            onInStockChange={onInStockChange}
            onReset={onReset}
            productCount={productCount}
          />
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-600/20"
          >
            Apply Filters ({productCount} Results)
          </button>
        </div>
      </div>
    </div>
  );
};
