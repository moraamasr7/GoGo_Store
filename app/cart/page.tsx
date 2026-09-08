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
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mb-2">حقيبة مشترياتك فارغة</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-8 leading-relaxed max-w-sm mx-auto">
          لم تقومي بإضافة أي قطع فنية بعد. استكشفي معرضنا الحجري واختاري ما يبهج مساحتك.
        </p>
        <Link href="/products" className="inline-block">
          <Button variant="primary" size="lg" rightIcon={<ArrowLeft className="w-4 h-4" />}>
            تصفح المعرض واقتني الآن
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-14 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">حقيبة مشترياتك</h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            مراجعة القطع المختارة وعربون الصب الحجري قبل الانتقال لإتمام الطلب
          </p>
        </div>
        <Link href="/products">
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            متابعة استكشاف المعرض
          </Button>
        </Link>
      </div>

      {/* Smart Dynamic Gift Progress Bar ("هديتك علينا 🤍") */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-sand-100 via-white to-sand-200/80 dark:from-stone-900 dark:via-stone-900 dark:to-stone-800 border border-sand-300/80 dark:border-stone-700/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-brass-500/20 text-brass-700 dark:text-brass-400 flex items-center justify-center font-bold">
              <Gift className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-stone-900 dark:text-white text-sm">
              {isGiftQualified ? 'مبروك! هديتك علينا 🤍 (مؤهلة لـ 3 قطع مجانية)' : 'عرض الهدايا الفاخرة'}
            </span>
          </div>

          <span className="font-mono font-bold text-xs text-stone-700 dark:text-stone-300">
            {isGiftQualified ? 'مكتمل 100% ✨' : `باقي ${formatPrice(amountToGift)} فقط`}
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brass-500 to-amber-600 transition-all duration-500 rounded-full"
            style={{ width: `${giftProgress}%` }}
          />
        </div>

        <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
          {isGiftQualified
            ? 'طلبك تجاوز 2,500 ج.م! يمكنك اختيار 3 قطع هدية وذكرها في ملاحظات الطلب.'
            : 'اطلبي بـ 2,500 ج.م أو أكثر واحصلي على 3 قطع فاخرة هدية من مجموعة التحف.'}
        </p>
      </div>

      {/* Grid: Items vs Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Items List */}
        <div className="lg:col-span-7 space-y-4">
          {items.map(({ product, quantity, selected_color }) => {
            const itemTotal = product.price * quantity;

            return (
              <div
                key={`${product.id}-${selected_color || ''}`}
                className="flex gap-4 p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-sm"
              >
                {/* Product Thumbnail */}
                <Link
                  href={`/product/${product.slug}`}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-sand-100 dark:bg-stone-800 shrink-0 border border-stone-100 dark:border-stone-800"
                >
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name_ar}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">
                      صورة
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="font-extrabold text-stone-900 dark:text-white text-sm sm:text-base hover:text-brass-500 transition-colors">
                          {product.name_ar}
                        </h3>
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        aria-label="حذف القطعة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {selected_color && (
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                        اللون: <span className="font-bold text-stone-800 dark:text-stone-200">{selected_color}</span>
                      </div>
                    )}

                    <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
                      {formatPrice(product.price)} × {quantity}
                    </div>
                  </div>

                  {/* Quantity and Subtotal */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80">
                    <div className="flex items-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-bold text-stone-900 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-30"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="font-mono font-black text-stone-900 dark:text-white text-sm sm:text-base">
                      {formatPrice(itemTotal)}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Financial Summary */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-sm sticky top-24 space-y-5">
          <h2 className="text-base font-black text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-800 pb-3">
            ملخص الحساب والعربون
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-stone-600 dark:text-stone-400">
              <span>إجمالي قيمة المعروضات:</span>
              <span className="font-mono font-bold text-stone-900 dark:text-white">{formatPrice(subtotal)}</span>
            </div>

            {/* Deposit Breakdown */}
            <div className="p-4 rounded-2xl bg-sand-100/90 dark:bg-stone-800/80 border border-sand-200 dark:border-stone-700 space-y-2">
              <div className="flex justify-between font-extrabold text-stone-900 dark:text-white">
                <span className="text-xs">عربون التأكيد المطلوب ({depositPercentage}%):</span>
                <span className="text-sm font-mono text-brass-600 dark:text-brass-400">{formatPrice(depositAmount)}</span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
                يتم تحويل العربون لتثبيت صب الألوان وتجهيز طلبك، ورفع الإيصال في الخطوة التالية.
              </p>
            </div>

            <div className="flex justify-between text-stone-500 dark:text-stone-400 pt-1">
              <span>المتبقي عند استلام القطع:</span>
              <span className="font-mono font-bold text-stone-700 dark:text-stone-300">{formatPrice(remainingAmount)}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/checkout" className="block w-full">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                rightIcon={<ArrowLeft className="w-4 h-4 text-brass-400 dark:text-stone-950" />}
              >
                متابعة لإرفاق الإيصال والتأكيد
              </Button>
            </Link>
          </div>

          <p className="text-[11px] text-center text-stone-400 dark:text-stone-500">
            🔒 لا يتم خصم أي مبالغ إلكترونية مباشرة. التحويل يدوي بالكامل لراحتك.
          </p>
        </div>

      </div>

    </div>
  );
}
