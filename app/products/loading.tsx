import React from 'react';

export default function ProductsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-3.5 sm:px-6 py-5 sm:py-10 md:py-12 animate-pulse space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-5 w-32 bg-stone-200 dark:bg-stone-800 rounded-full" />
        <div className="h-9 w-64 bg-stone-200 dark:bg-stone-800 rounded-2xl" />
        <div className="h-4 w-96 max-w-full bg-stone-200 dark:bg-stone-800 rounded-xl" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-9 w-24 bg-stone-200 dark:bg-stone-800 rounded-xl shrink-0" />
        ))}
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col"
          >
            <div className="aspect-square bg-stone-200 dark:bg-stone-800" />
            <div className="p-3 sm:p-4 space-y-2.5 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="h-3 w-16 bg-stone-200 dark:bg-stone-800 rounded-md" />
                <div className="h-4 w-full bg-stone-200 dark:bg-stone-800 rounded-md" />
              </div>
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <div className="h-4 w-12 bg-stone-200 dark:bg-stone-800 rounded-md" />
                <div className="h-8 w-16 bg-stone-200 dark:bg-stone-800 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
