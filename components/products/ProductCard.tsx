'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Check, Eye } from 'lucide-react';
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
    <div className="group relative flex flex-col bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* Product Image Box */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square w-full bg-sand-100 overflow-hidden block">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name_ar}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400 bg-sand-100">
            <span className="text-xs">بدون صورة</span>
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 text-[11px] font-medium bg-sand-50/90 backdrop-blur-md text-stone-800 rounded-full border border-stone-200 shadow-sm">
            {getCategoryLabel(product.category)}
          </span>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center z-20">
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
            <h3 className="font-semibold text-stone-900 text-base line-clamp-1 hover:text-stone-700 transition-colors">
              {product.name_ar}
            </h3>
          </Link>
          
          {product.dimensions && (
            <p className="text-[11px] text-stone-500 mt-0.5" dir="ltr">
              {product.dimensions}
            </p>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 block -mb-0.5">السعر</span>
            <span className="text-base font-bold text-stone-950 font-mono">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Touch-Friendly Action Button */}
          {isOutOfStock ? (
            <span className="px-3 py-1.5 text-xs text-stone-400 bg-stone-100 rounded-xl cursor-not-allowed">
              غير متوفر
            </span>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-90 ${
                isInCart 
                  ? 'bg-stone-100 text-stone-800 hover:bg-stone-200' 
                  : 'bg-stone-900 text-white hover:bg-stone-800 shadow-sm'
              }`}
              title="أضف للسلة"
              aria-label={`أضف ${product.name_ar} للسلة`}
            >
              {isInCart ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">أضف مجدداً</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-brass-400" />
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
