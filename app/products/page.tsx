import React from 'react';
import Link from 'next/link';
import { getActiveProducts } from '@/lib/supabase';
import ProductCard from '@/components/products/ProductCard';

export const revalidate = 60;

interface ProductsPageProps {
  searchParams?: {
    category?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const selectedCategory = searchParams?.category || 'all';
  const products = await getActiveProducts(selectedCategory);

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'جميع القطع' },
    { key: 'trays', label: 'صواني ديكورية' },
    { key: 'coasters', label: 'قواعد أكواب (Coasters)' },
    { key: 'planters', label: 'أحواض وميني زريعة' },
    { key: 'candle_holders', label: 'شمعدانات ومباخر' },
    { key: 'decor', label: 'تحف وفازات' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-3.5 sm:px-6 py-5 sm:py-10 md:py-12">
      
      {/* Header */}
      <div className="mb-4 sm:mb-6 space-y-1.5 sm:space-y-2">
        <span className="text-[11px] sm:text-xs font-bold text-brass-600 dark:text-brass-400">
          الصور موجودة وأسعار بسيطة ✨
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
          القطع والأشكال المتاحة للتنفيذ 🌸
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
          شغل كونكريت / ديكوري يدوي من البيت بأشكال كتير وتصميمات مودرن وبسيطة. تقدري تختاري قطعة واحدة أو تكوّني الطقم اللي يعجبك وتنسقيه بنفسك 🤍
        </p>
      </div>

      {/* Build your set banner */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-sand-100/80 dark:bg-stone-900 border border-sand-200 dark:border-stone-800 text-[11px] sm:text-xs text-stone-700 dark:text-stone-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-sand-200 dark:bg-stone-800 font-bold text-stone-900 dark:text-white text-[10px] sm:text-[11px] shrink-0">
            اختاري وركّبي ✨
          </span>
          <span className="leading-relaxed">
            الأشكال والألوان المعروضة حالياً متاحة للتنفيذ بأمر الله، ومتاح طلب أي لون أو شكل معين على الخاص 🙋‍♀️💜
          </span>
        </div>
      </div>

      {/* Categories Filter Tabs: Compact horizontal scroll without overflow */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 mb-5 sm:mb-8 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.key;
          return (
            <Link
              key={cat.key}
              href={cat.key === 'all' ? '/products' : `/products?category=${cat.key}`}
              className={`whitespace-nowrap px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 shadow-md shadow-stone-900/10 dark:shadow-brass-500/20 -translate-y-0.5'
                  : 'bg-white dark:bg-[#181715] text-stone-700 dark:text-stone-300 hover:border-brass-500/50 dark:hover:border-brass-400/50 hover:text-stone-950 dark:hover:text-white border border-stone-200/90 dark:border-stone-800 shadow-xs'
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>

      {/* Products Grid: Exact 2-col on mobile, gap-2.5 sm:gap-4 md:gap-6 */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-2xl sm:rounded-3xl border border-stone-200 dark:border-stone-800">
          <p className="text-stone-500 dark:text-stone-400 text-sm mb-3">لا توجد منتجات ضمن هذه الفئة حالياً.</p>
          <Link
            href="/products"
            className="text-xs font-bold text-stone-800 dark:text-brass-400 underline hover:text-stone-950"
          >
            عرض جميع المنتجات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
