import React from 'react';

export default function ProductDetailLoading() {
  return (
    <div className="max-w-5xl mx-auto px-3.5 sm:px-6 py-4 sm:py-8 md:py-12 animate-pulse space-y-6">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-12 bg-stone-200 dark:bg-stone-800 rounded-md" />
        <div className="h-4 w-4 bg-stone-200 dark:bg-stone-800 rounded-md" />
        <div className="h-4 w-16 bg-stone-200 dark:bg-stone-800 rounded-md" />
        <div className="h-4 w-4 bg-stone-200 dark:bg-stone-800 rounded-md" />
        <div className="h-4 w-28 bg-stone-200 dark:bg-stone-800 rounded-md" />
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10">
        {/* Visual Showcase Skeleton */}
        <div className="md:col-span-6 space-y-3">
          <div className="aspect-square w-full rounded-2xl sm:rounded-3xl bg-stone-200 dark:bg-stone-800" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-16 h-16 rounded-xl bg-stone-200 dark:bg-stone-800" />
            ))}
          </div>
        </div>

        {/* Product Details Skeleton */}
        <div className="md:col-span-6 space-y-5">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-stone-200 dark:bg-stone-800 rounded-md" />
            <div className="h-8 w-4/5 bg-stone-200 dark:bg-stone-800 rounded-xl" />
            <div className="h-6 w-32 bg-stone-200 dark:bg-stone-800 rounded-lg" />
          </div>

          <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
            <div className="h-4 w-28 bg-stone-200 dark:bg-stone-800 rounded-md" />
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-9 h-9 rounded-xl bg-stone-200 dark:bg-stone-800" />
              ))}
            </div>
          </div>

          <div className="h-12 w-full rounded-2xl bg-stone-200 dark:bg-stone-800" />
        </div>
      </div>
    </div>
  );
}
