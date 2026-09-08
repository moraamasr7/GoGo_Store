import React from 'react';
import Link from 'next/link';
import { getActiveProducts } from '@/lib/supabase';
import ProductCard from '@/components/products/ProductCard';
import { CategoryKey } from '@/types/database';

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-stone-900 mb-2">
          مجموعة قطع الكونكريت
        </h1>
        <p className="text-sm text-stone-600">
          تصفح جميع القطع المصنوعة يدوياً المتاحة للطلب الفوري أو الصب المخصص
        </p>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.key;
          return (
            <Link
              key={cat.key}
              href={cat.key === 'all' ? '/products' : `/products?category=${cat.key}`}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-stone-900 text-sand-50 shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
          <p className="text-stone-500 text-sm mb-3">لا توجد منتجات ضمن هذه الفئة حالياً.</p>
          <Link
            href="/products"
            className="text-xs font-semibold text-stone-800 underline hover:text-stone-950"
          >
            عرض جميع المنتجات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
