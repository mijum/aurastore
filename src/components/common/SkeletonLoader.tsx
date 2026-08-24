import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm flex flex-col">
      <div className="w-full aspect-[4/5] rounded-xl skeleton-shimmer mb-3" />
      <div className="h-4 w-20 rounded-md skeleton-shimmer mb-2" />
      <div className="h-5 w-4/5 rounded-md skeleton-shimmer mb-2" />
      <div className="h-4 w-28 rounded-md skeleton-shimmer mb-3" />
      <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="h-6 w-24 rounded-md skeleton-shimmer" />
        <div className="h-9 w-9 rounded-xl skeleton-shimmer" />
      </div>
    </div>
  );
};

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-square rounded-2xl skeleton-shimmer" />
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-20 h-20 rounded-xl skeleton-shimmer" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-6 w-28 rounded-full skeleton-shimmer" />
          <div className="h-10 w-3/4 rounded-lg skeleton-shimmer" />
          <div className="h-5 w-40 rounded-md skeleton-shimmer" />
          <div className="h-8 w-48 rounded-lg skeleton-shimmer" />
          <div className="h-24 w-full rounded-xl skeleton-shimmer" />
          <div className="h-12 w-full rounded-xl skeleton-shimmer mt-4" />
        </div>
      </div>
    </div>
  );
};
