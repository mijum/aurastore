import React from 'react';
import { SortOption } from '../../types';
import { ArrowUpDown } from 'lucide-react';

interface SortDropdownProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0 hidden sm:inline" />
      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider hidden sm:inline">
        Sort By:
      </span>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 cursor-pointer transition-all shadow-sm"
      >
        <option value="featured">Featured Items</option>
        <option value="newest">New Arrivals First</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Customer Rating</option>
      </select>
    </div>
  );
};
