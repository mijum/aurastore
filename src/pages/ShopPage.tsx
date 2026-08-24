import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { FilterSidebar } from '../components/shop/FilterSidebar';
import { MobileFilterModal } from '../components/shop/MobileFilterModal';
import { SortDropdown } from '../components/shop/SortDropdown';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductCategory, SortOption } from '../types';
import { Filter, Grid, List, X, ChevronRight } from 'lucide-react';

const VALID_CATEGORIES: ProductCategory[] = [
  'All',
  'Clothing',
  'Shoes',
  'Accessories',
  'Electronics',
  'Bags',
  'Watches',
];
const VALID_SORT_OPTIONS: SortOption[] = [
  'featured',
  'newest',
  'price-asc',
  'price-desc',
  'rating',
];

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    filters,
    setCategory,
    setSearchQuery,
    setPriceRange,
    setMinRating,
    setInStockOnly,
    setSortBy,
    setViewMode,
    resetFilters,
    filteredProducts,
    productsLoading,
  } = useStore();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync URL search params with store filter state on mount / change
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const urlSearch = searchParams.get('search');
    const sortParam = searchParams.get('sort');
    const urlCategory = VALID_CATEGORIES.includes(categoryParam as ProductCategory)
      ? (categoryParam as ProductCategory)
      : 'All';
    const urlSort = VALID_SORT_OPTIONS.includes(sortParam as SortOption)
      ? (sortParam as SortOption)
      : 'featured';

    setCategory(urlCategory);
    setSearchQuery(urlSearch || '');
    setSortBy(urlSort);
  }, [searchParams]);

  const handleCategorySelect = (cat: ProductCategory) => {
    setCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    const newParams = new URLSearchParams(searchParams);
    if (sort === 'featured') {
      newParams.delete('sort');
    } else {
      newParams.set('sort', sort);
    }
    setSearchParams(newParams);
  };

  const handleResetAll = () => {
    resetFilters();
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Link to="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-bold">Catalog</span>
          {filters.category !== 'All' && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-indigo-600 font-bold">{filters.category}</span>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {filters.searchQuery
                ? `Search: "${filters.searchQuery}"`
                : filters.category === 'All'
                ? 'All Products'
                : `${filters.category} Collection`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing {filteredProducts.length} items with instant filtering and live inventory
            </p>
          </div>

          {/* Active Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
                Search: "{filters.searchQuery}"
                <button onClick={handleClearSearch} className="hover:text-indigo-900">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {filters.category !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
                Category: {filters.category}
                <button
                  onClick={() => handleCategorySelect('All')}
                  className="hover:text-indigo-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar (1 Col) */}
        <div className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm h-fit sticky top-28">
          <FilterSidebar
            filters={filters}
            onCategoryChange={handleCategorySelect}
            onPriceChange={setPriceRange}
            onRatingChange={setMinRating}
            onInStockChange={setInStockOnly}
            onReset={handleResetAll}
            productCount={filteredProducts.length}
          />
        </div>

        {/* Product Grid Area (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Bar Controls: Mobile filter trigger, Sort, View Switcher */}
          <div className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              <Filter className="w-4 h-4 text-indigo-600" />
              Filters ({filteredProducts.length})
            </button>

            <div className="hidden lg:block text-xs font-semibold text-slate-500">
              Showing <strong className="text-slate-900">{filteredProducts.length}</strong> items
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <SortDropdown sortBy={filters.sortBy} onSortChange={handleSortChange} />

              {/* View Switcher */}
              <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    filters.viewMode === 'grid'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    filters.viewMode === 'list'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={filteredProducts}
            isLoading={productsLoading}
            viewMode={filters.viewMode}
            onResetFilters={handleResetAll}
          />
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filters={filters}
        onCategoryChange={handleCategorySelect}
        onPriceChange={setPriceRange}
        onRatingChange={setMinRating}
        onInStockChange={setInStockOnly}
        onReset={handleResetAll}
        productCount={filteredProducts.length}
      />
    </div>
  );
};
