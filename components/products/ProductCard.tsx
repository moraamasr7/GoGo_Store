'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Check, Star, Sparkles, Heart } from 'lucide-react';
import { Product } from '@/types/database';
import { formatPrice, getCategoryLabel } from '@/lib/utils';
import { useCart } from '@/components/cart/CartContext';

interface ProductCardProps {
  product: Product;
  featuredBadge?: string;
}

export default function ProductCard({ product, featuredBadge }: ProductCardProps) {
  const { addItem, items } = useCart();
  const isOutOfStock = product.stock <= 0;
  const isInCart = items.some(item => item.product_id === product.id);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Dynamic aesthetic badges based on stock/order
  const badge = featuredBadge || (
    product.stock <= 3 && product.stock > 0
      ? 'قطعة محدودة'
      : product.stock > 10
      ? 'الأكثر طلباً'
      : 'صناعة يدوية'
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product, 1);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white dark:bg-stone-900/90 rounded-3xl border border-stone-200/80 dark:border-stone-800/80 overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-stone-950/5 dark:hover:shadow-stone-950/40"
      style={{
        perspective: '1000px',
      }}
    >
      
      {/* 1. Artistic Gallery Image Frame */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-[1/1] sm:aspect-[4/4] w-full bg-sand-100/70 dark:bg-stone-800/60 overflow-hidden block"
      >
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name_ar}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-106 group-hover:rotate-[0.5deg]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400 bg-sand-100 dark:bg-stone-800">
            <span className="text-xs font-semibold">بدون صورة</span>
          </div>
        )}

        {/* Soft Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges: Category & Craft status */}
        <div className="absolute top-3.5 right-3.5 left-3.5 z-10 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 text-[11px] font-bold bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-stone-900 dark:text-sand-100 rounded-full border border-white/50 dark:border-stone-700/60 shadow-sm pointer-events-auto">
            {badge}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="w-8 h-8 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md flex items-center justify-center text-stone-400 hover:text-rose-500 dark:hover:text-rose-400 shadow-sm border border-white/50 dark:border-stone-700/60 transition-colors pointer-events-auto active:scale-90"
            aria-label="إعجاب بالقطعة"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-[3px] flex items-center justify-center z-20">
            <span className="px-4 py-1.5 rounded-full bg-rose-600 text-white text-xs font-bold shadow-lg tracking-wide">
              نفذت الكمية حالياً
            </span>
          </div>
        )}
      </Link>

      {/* 2. Card Content & Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Subtle Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 dark:text-stone-400 mb-1 font-medium">
            <span>{getCategoryLabel(product.category)}</span>
            <div className="flex items-center gap-1 text-brass-500 font-bold font-mono">
              <Star className="w-3 h-3 fill-brass-500" />
              <span>4.9</span>
            </div>
          </div>

          <Link href={`/product/${product.slug}`} className="block group-hover:text-brass-600 dark:group-hover:text-brass-400 transition-colors">
            <h3 className="font-extrabold text-stone-900 dark:text-white text-base sm:text-lg line-clamp-1">
              {product.name_ar}
            </h3>
          </Link>
          
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">
            {product.description_ar || 'قطعة مصبوبة يدويًا من الكونكريت الناعم بعناية.'}
          </p>
        </div>

        {/* 3. Pricing & Purchase Interaction */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 block">السعر</span>
            <span className="text-base sm:text-lg font-black text-stone-950 dark:text-sand-100 font-mono">
              {formatPrice(product.price)}
            </span>
          </div>

          {isOutOfStock ? (
            <span className="px-3 py-1.5 text-xs text-stone-400 bg-stone-100 dark:bg-stone-800 rounded-xl cursor-not-allowed">
              غير متوفر
            </span>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`h-11 px-3.5 sm:px-4 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all duration-200 active:scale-95 shadow-sm ${
                isInCart 
                  ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-sand-200 hover:bg-stone-200 dark:hover:bg-stone-700' 
                  : 'bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-brass-400'
              }`}
              title="أضف للحقيبة"
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
                  <span>اقتني القطعة</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
