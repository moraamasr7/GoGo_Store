'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Check, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/database';
import { formatPrice, getCategoryLabel } from '@/lib/utils';
import { useCart } from '@/components/cart/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCart();
  const isOutOfStock = product.stock <= 0;
  const isInCart = items.some(item => item.product_id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product, 1);
  };

  return (
    <div className="group relative flex flex-col bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* Product Image Box */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square w-full bg-sand-100 dark:bg-stone-800 overflow-hidden block">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name_ar}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400 bg-sand-100 dark:bg-stone-800">
            <span className="text-xs">بدون صورة</span>
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-sand-50/90 dark:bg-stone-950/90 backdrop-blur-md text-stone-800 dark:text-stone-200 rounded-full border border-stone-200 dark:border-stone-700 shadow-sm">
            {getCategoryLabel(product.category)}
          </span>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="px-3.5 py-1.5 rounded-full bg-rose-600 text-white text-xs font-bold shadow-md">
              نفذت الكمية
            </span>
          </div>
        )}
      </Link>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base line-clamp-1 hover:text-brass-500 transition-colors">
              {product.name_ar}
            </h3>
          </Link>
          
          {product.dimensions && (
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 font-mono" dir="ltr">
              {product.dimensions}
            </p>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-400 dark:text-stone-500 block -mb-0.5">السعر</span>
            <span className="text-base font-extrabold text-stone-950 dark:text-white font-mono">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Touch-Friendly Action Button */}
          {isOutOfStock ? (
            <span className="px-3 py-1.5 text-xs text-stone-400 bg-stone-100 dark:bg-stone-800 rounded-xl cursor-not-allowed">
              غير متوفر
            </span>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-90 ${
                isInCart 
                  ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700' 
                  : 'bg-stone-900 dark:bg-brass-500 text-white dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-brass-400 shadow-sm'
              }`}
              title="أضف للسلة"
              aria-label={`أضف ${product.name_ar} للسلة`}
            >
              {isInCart ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden sm:inline">أضف مجدداً</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-brass-400 dark:text-stone-950" />
                  <span className="hidden sm:inline">أضف</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
