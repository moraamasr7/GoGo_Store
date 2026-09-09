'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShoppingBag, Gift, Sparkles } from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    depositPercentage,
    depositAmount,
    remainingAmount,
    isLoading
  } = useCart();

  // Smart Gift Threshold: 2,500 EGP for 3 free craft gifts
  const GIFT_THRESHOLD = 2500;
  const isGiftQualified = subtotal >= GIFT_THRESHOLD;
  const amountToGift = Math.max(0, GIFT_THRESHOLD - subtotal);
  const giftProgress = Math.min(100, Math.round((subtotal / GIFT_THRESHOLD) * 100));

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-3 border-stone-800 dark:border-brass-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold text-stone-500 dark:text-stone-400">جاري تجهيز سلتك...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-3xl bg-sand-200/80 dark:bg-stone-800 text-stone-700 dark:text-sand-200 flex items-center justify-center mx-auto mb-6 shadow-sm border border-sand-300/60 dark:border-stone-700">
          <ShoppingBag className="w-10 h-10 text-stone-600 dark:text-brass-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mb-2">سلة مشترياتك فاضية 🌸</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-8 leading-relaxed max-w-sm mx-auto">
          لسة ما اخترتيش أي قطعة ديكور. خدي لفة في المعرض واختاري قطعة أو كوّني طقم على ذوقك ✨
        </p>
        <Link href="/products" className="inline-block">
          <Button variant="primary" size="lg" rightIcon={<ArrowLeft className="w-4 h-4" />}>
            تصفحي المعرض واختاري ستايلك
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-3.5 sm:px-6 py-5 sm:py-8 md:py-14 space-y-5 sm:space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">سلة مشترياتك 🤍</h1>
          <p className="text-[11px] sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5 sm:mt-1">
            مراجعة القطع وتنسيق طقمك وعربون الـ 50% لتأكيد التنفيذ
          </p>
        </div>
        <Link href="/products">
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            متابعة اختيار القطع
          </Button>
        </Link>
      </div>

      {/* Smart Dynamic Gift Progress Bar ("هديتك علينا 🤍") */}
      <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-sand-100 via-white to-sand-200/80 dark:from-stone-900 dark:via-stone-900 dark:to-stone-800 border border-sand-300/80 dark:border-stone-700/80 shadow-xs space-y-2.5 sm:space-y-3">
        <div className="flex items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-brass-500/20 text-brass-700 dark:text-brass-400 flex items-center justify-center font-bold shrink-0">
              <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="font-extrabold text-stone-900 dark:text-white text-xs sm:text-sm truncate">
              {isGiftQualified ? 'مبروك! هديتك علينا 🤍 (مؤهلة لـ 3 قطع مجانية)' : 'عرض خاص: هديتك علينا 🤍'}
            </span>
          </div>

          <span className="font-mono font-bold text-[11px] sm:text-xs text-stone-700 dark:text-stone-300 whitespace-nowrap shrink-0">
            {isGiftQualified ? 'مكتمل 100% ✨' : `باقي ${formatPrice(amountToGift)}`}
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2 sm:h-2.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brass-500 to-amber-600 transition-all duration-500 rounded-full"
            style={{ width: `${giftProgress}%` }}
          />
        </div>

        <p className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
          {isGiftQualified
            ? 'طلبك تجاوز 2,500 ج.م! هنضيف 3 قطع إضافية هدية لطلبك ✨'
            : 'اطلبي بـ 2,500 ج.م أو أكثر واحصلي على 3 قطع هدية تضاف لطلبك.'}
        </p>
      </div>

      {/* Grid: Items vs Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
        
        {/* Items List */}
        <div className="lg:col-span-7 space-y-3 sm:space-y-4">
          {items.map(({ product, quantity, selected_color }) => {
            const itemTotal = product.price * quantity;

            return (
              <div
                key={`${product.id}-${selected_color || ''}`}
                className="flex gap-3 sm:gap-4 p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-sm"
              >
                {/* Product Thumbnail: Exactly 64x64 on mobile, 80x80 on sm */}
                <Link
                  href={`/product/${product.slug}`}
                  className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden bg-sand-100 dark:bg-stone-800 shrink-0 border border-stone-100 dark:border-stone-800"
                >
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name_ar}
                      fill
                      sizes="(max-width: 640px) 64px, 80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">
                      صورة
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-1.5">
                      <Link href={`/product/${product.slug}`} className="min-w-0">
                        <h3 className="font-extrabold text-stone-900 dark:text-white text-xs sm:text-base hover:text-brass-500 transition-colors line-clamp-1">
                          {product.name_ar}
                        </h3>
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1 shrink-0"
                        aria-label="حذف القطعة"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>

                    {selected_color && (
                      <div className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                        اللون: <span className="font-bold text-stone-800 dark:text-stone-200">{selected_color}</span>
                      </div>
                    )}

                    <div className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-mono whitespace-nowrap">
                      {formatPrice(product.price)} × {quantity}
                    </div>
                  </div>

                  {/* Quantity and Subtotal */}
                  <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-stone-100 dark:border-stone-800/80 gap-2">
                    <div className="flex items-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
                        aria-label="إنقاص الكمية"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 sm:w-8 text-center text-xs font-mono font-bold text-stone-900 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-30"
                        aria-label="زيادة الكمية"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="font-mono font-black text-stone-900 dark:text-white text-xs sm:text-base whitespace-nowrap">
                      {formatPrice(itemTotal)}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Financial Summary */}
        <div className="lg:col-span-5 p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-sm sticky top-20 sm:top-24 space-y-4 sm:space-y-5">
          <h2 className="text-sm sm:text-base font-black text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-800 pb-2.5 sm:pb-3">
            ملخص الحساب والعربون
          </h2>

          <div className="space-y-2.5 sm:space-y-3 text-xs">
            <div className="flex justify-between items-center text-stone-600 dark:text-stone-400">
              <span>إجمالي قيمة المعروضات:</span>
              <span className="font-mono font-bold text-stone-900 dark:text-white whitespace-nowrap">{formatPrice(subtotal)}</span>
            </div>

            {/* Deposit Breakdown */}
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-sand-100/90 dark:bg-stone-800/80 border border-sand-200 dark:border-stone-700 space-y-1.5 sm:space-y-2">
              <div className="flex justify-between items-center font-extrabold text-stone-900 dark:text-white">
                <span className="text-xs">عربون التأكيد ({depositPercentage}%):</span>
                <span className="text-xs sm:text-sm font-mono text-brass-600 dark:text-brass-400 whitespace-nowrap">{formatPrice(depositAmount)}</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
                يتم تحويل عربون 50% لتأكيد تنفيذ وحجز طلبك، والمتبقي يُسدد عند استلام وتفقد القطع مع مندوب الشحن.
              </p>
            </div>

            <div className="flex justify-between items-center text-stone-500 dark:text-stone-400 pt-0.5">
              <span>المتبقي عند استلام القطع:</span>
              <span className="font-mono font-bold text-stone-700 dark:text-stone-300 whitespace-nowrap">{formatPrice(remainingAmount)}</span>
            </div>
          </div>

          <div className="pt-1">
            <Link href="/checkout" className="block w-full">
              <Button
                variant="primary"
                size="lg"
                className="w-full h-11 sm:h-12 text-xs sm:text-sm font-bold shadow-md"
                rightIcon={<ArrowLeft className="w-4 h-4 text-brass-400 dark:text-stone-950" />}
              >
                متابعة لإرفاق الإيصال والتأكيد
              </Button>
            </Link>
          </div>

          <p className="text-[10px] sm:text-[11px] text-center text-stone-400 dark:text-stone-500">
            🔒 لا يتم خصم أي مبالغ إلكترونية مباشرة. التحويل يدوي بالكامل لراحتك.
          </p>
        </div>

      </div>

    </div>
  );
}
