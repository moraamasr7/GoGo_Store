'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Check, Star, Sparkles, Heart } from 'lucide-react';
import { Product } from '@/types/database';
import { formatPrice, getCategoryLabel } from '@/lib/utils';
import { useCart } from '@/components/cart/CartContext';

interface ProductCardProps {
  product: Product;
  featuredBadge?: string;
  priority?: boolean;
}

export default function ProductCard({ product, featuredBadge, priority = false }: ProductCardProps) {
  const { addItem, items } = useCart();
  const isOutOfStock = product.stock <= 0;
  const isInCart = items.some(item => item.product_id === product.id);

  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [transformStyle, setTransformStyle] = useState<string>('');
  const [lightPos, setLightPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  // Dynamic aesthetic badges
  const badge = featuredBadge || (
    product.stock <= 3 && product.stock > 0
      ? 'متبقي قطع قليلة'
      : product.stock > 10
      ? 'الأكثر طلباً'
      : 'شغل Handmade'
  );

  // Mouse Tracking & 3D Tilt calculation (Strictly capped for luxury feel)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    setLightPos({ x: percentX, y: percentY });

    // Subtle tilt: max ±3.5deg
    const rotateY = ((x / rect.width) - 0.5) * 6; // left-right
    const rotateX = -((y / rect.height) - 0.5) * 6; // top-bottom

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`);
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product, 1);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className="group relative flex flex-col h-full rounded-2xl sm:rounded-3xl overflow-hidden will-change-transform"
      style={{
        transform: isHovered ? transformStyle : isPressed ? 'scale(0.985)' : 'none',
        transition: isHovered 
          ? 'transform 120ms ease-out, box-shadow 350ms cubic-bezier(0.23, 1, 0.32, 1), border-color 350ms cubic-bezier(0.23, 1, 0.32, 1)' 
          : 'transform 450ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 450ms cubic-bezier(0.23, 1, 0.32, 1), border-color 450ms cubic-bezier(0.23, 1, 0.32, 1)',
      }}
    >
      {/* ========================================================================= */}
      {/* 1. OUTER LAYER: Border Highlight & Ambient Shadow                         */}
      {/* ========================================================================= */}
      <div 
        className={`absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none transition-all duration-500 ${
          isHovered
            ? 'border border-brass-500/50 dark:border-brass-400/50 shadow-2xl shadow-stone-900/10 dark:shadow-stone-950/80 ring-1 ring-brass-500/20'
            : 'border border-stone-200/90 dark:border-stone-800/90 shadow-sm sm:shadow-md shadow-stone-900/5 dark:shadow-stone-950/40'
        }`}
      />

      {/* ========================================================================= */}
      {/* 2. CARD SURFACE LAYER (Multi-layered depths in light/dark)                */}
      {/* ========================================================================= */}
      <div className="relative flex flex-col flex-1 bg-white dark:bg-[#181715] rounded-2xl sm:rounded-3xl overflow-hidden">
        
        {/* Dynamic Light Reflection Layer (Follows cursor) */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 opacity-100"
            style={{
              background: `radial-gradient(circle 220px at ${lightPos.x}% ${lightPos.y}%, rgba(223, 177, 91, 0.08), transparent 75%)`,
            }}
          />
        )}

        {/* ========================================================================= */}
        {/* 3. ARTISTIC PRODUCT IMAGE FRAME                                           */}
        {/* ========================================================================= */}
        <Link
          href={`/product/${product.slug}`}
          className="relative aspect-square w-full bg-sand-100/80 dark:bg-[#201F1B] overflow-hidden block shrink-0"
        >
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name_ar}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400 dark:text-stone-600 bg-sand-100 dark:bg-stone-900">
              <span className="text-xs font-semibold">بدون صورة</span>
            </div>
          )}

          {/* Soft Contrast Gradient Layer */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Floating Badges */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 left-2 sm:left-3 z-20 flex items-center justify-between pointer-events-none">
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-stone-900/95 backdrop-blur-md text-stone-800 dark:text-sand-100 rounded-full border border-stone-200/60 dark:border-stone-700/60 shadow-xs pointer-events-auto">
              {badge}
            </span>

            {/* Favorite Wishlist Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md flex items-center justify-center text-stone-400 hover:text-rose-500 dark:hover:text-rose-400 shadow-xs border border-stone-200/60 dark:border-stone-700/60 transition-all duration-200 pointer-events-auto active:scale-90 hover:scale-105"
              aria-label="إعجاب بالقطعة"
            >
              <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
            </button>
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-stone-950/65 backdrop-blur-[2px] flex items-center justify-center z-30">
              <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-[11px] sm:text-xs font-bold shadow-lg tracking-wide">
                نفذت الكمية حالياً
              </span>
            </div>
          )}
        </Link>

        {/* ========================================================================= */}
        {/* 4. CARD CONTENT HIERARCHY (Category -> Title -> Price -> CTA)            */}
        {/* ========================================================================= */}
        <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-2 sm:gap-3 relative z-10 bg-white dark:bg-[#181715]">
          <div>
            {/* Category & Craft Rating */}
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 mb-1 font-semibold">
              <span>{getCategoryLabel(product.category)}</span>
              <div className="flex items-center gap-0.5 sm:gap-1 text-brass-500 font-bold font-mono">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-brass-500" />
                <span>4.9</span>
              </div>
            </div>

            {/* Product Title */}
            <Link 
              href={`/product/${product.slug}`} 
              className="block group-hover:text-brass-600 dark:group-hover:text-brass-400 transition-colors"
            >
              <h3 className="font-extrabold text-stone-900 dark:text-sand-100 text-xs sm:text-sm md:text-base leading-snug line-clamp-1 sm:line-clamp-2">
                {product.name_ar}
              </h3>
            </Link>

            {/* Short Genuine Description */}
            <p className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 sm:mt-1 line-clamp-1 leading-relaxed">
              {product.description_ar || 'قطعة ديكور هاند ميد بتشطيب ناعم وألوان هادية تليق على بيتك.'}
            </p>
          </div>

          {/* ========================================================================= */}
          {/* 5. PRICE & INTERACTIVE CTA                                                */}
          {/* ========================================================================= */}
          <div className="pt-2 sm:pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex flex-col min-w-0 shrink-0">
              <span className="text-[8px] sm:text-[9px] uppercase font-bold text-stone-400 dark:text-stone-500 leading-none mb-0.5">السعر</span>
              <span className="text-xs sm:text-sm md:text-base font-black text-stone-950 dark:text-white font-mono tracking-tight whitespace-nowrap">
                {formatPrice(product.price)}
              </span>
            </div>

            {isOutOfStock ? (
              <span className="h-9 sm:h-10 px-2 sm:px-3 text-[11px] sm:text-xs text-stone-400 bg-stone-100 dark:bg-stone-800 rounded-xl flex items-center justify-center cursor-not-allowed">
                غير متوفر
              </span>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                className={`h-9 sm:h-10 px-2 sm:px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all duration-200 active:scale-95 shadow-xs shrink-0 ${
                  isInCart
                    ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-sand-200 border border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700'
                    : 'bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-brass-400 hover:shadow-md hover:-translate-y-0.5'
                }`}
                title="أضف للحقيبة"
                aria-label={`أضف ${product.name_ar} للسلة`}
              >
                {isInCart ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="whitespace-nowrap text-[10px] sm:text-xs">في السلة</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 text-brass-400 dark:text-stone-950 shrink-0" />
                    <span className="whitespace-nowrap text-[10px] sm:text-xs">اختاري القطعة</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
