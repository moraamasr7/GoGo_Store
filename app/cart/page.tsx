'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';
import { formatPrice } from '@/lib/utils';

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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-3 border-stone-800 dark:border-brass-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-stone-500 dark:text-stone-400">جاري تحميل السلة...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-sand-200/80 dark:bg-stone-800 text-stone-700 dark:text-sand-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShoppingBag className="w-8 h-8 text-stone-600 dark:text-brass-400" />
        </div>
        <h1 className="text-2xl font-black text-stone-900 dark:text-white mb-2">سلة المشتريات فارغة</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-8 leading-relaxed">
          لم تقم بإضافة أي قطع كونكريت إلى سلتك بعد. استكشف مجموعتنا اليدوية واختر ما يناسب ذوقك.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 font-bold text-sm hover:bg-stone-800 dark:hover:bg-brass-400 transition-all shadow-md active:scale-95"
        >
          <span>تصفح المنتجات الآن</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">سلة المشتريات</h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            راجع قطعك المحددة ومبالغ العربون قبل الانتقال لإتمام الطلب
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white flex items-center gap-1"
        >
          <span>متابعة التسوق</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Items List */}
        <div className="lg:col-span-7 space-y-4">
          {items.map(({ product, quantity, selected_color }) => {
            const itemTotal = product.price * quantity;

            return (
              <div
                key={`${product.id}-${selected_color || ''}`}
                className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-sm"
              >
                {/* Product Thumbnail */}
                <Link
                  href={`/product/${product.slug}`}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-sand-100 dark:bg-stone-800 shrink-0 border border-stone-100 dark:border-stone-800"
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
                        <h3 className="font-bold text-stone-900 dark:text-white text-sm sm:text-base hover:text-brass-500 transition-colors">
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
                        اللون: <span className="font-semibold text-stone-800 dark:text-stone-200">{selected_color}</span>
                      </div>
                    )}

                    <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
                      {formatPrice(product.price)} × {quantity}
                    </div>
                  </div>

                  {/* Quantity and Subtotal */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80">
                    <div className="flex items-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
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
                        className="w-7 h-7 flex items-center justify-center rounded text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-30"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="font-mono font-bold text-stone-900 dark:text-white text-sm sm:text-base">
                      {formatPrice(itemTotal)}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Financial Summary */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-sm sticky top-24 space-y-5">
          <h2 className="text-base font-black text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-800 pb-3">
            ملخص الحساب والعربون
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-stone-600 dark:text-stone-400">
              <span>إجمالي قيمة المنتجات:</span>
              <span className="font-mono font-bold text-stone-900 dark:text-white">{formatPrice(subtotal)}</span>
            </div>

            {/* Deposit Breakdown */}
            <div className="p-4 rounded-2xl bg-sand-100/90 dark:bg-stone-800/80 border border-sand-200 dark:border-stone-700 space-y-2">
              <div className="flex justify-between font-bold text-stone-900 dark:text-white">
                <span className="text-xs">العربون المطلوب لتأكيد الصب ({depositPercentage}%):</span>
                <span className="text-sm font-mono text-brass-600 dark:text-brass-400">{formatPrice(depositAmount)}</span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
                يتم تحويل هذا المبلغ عبر فودافون كاش أو إنستاباي، ورفع صورة الإيصال في الخطوة التالية.
              </p>
            </div>

            <div className="flex justify-between text-stone-500 dark:text-stone-400 pt-1">
              <span>المتبقي عند الاستلام:</span>
              <span className="font-mono font-bold text-stone-700 dark:text-stone-300">{formatPrice(remainingAmount)}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/checkout"
              className="w-full py-4 px-6 rounded-xl bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 font-bold text-sm flex items-center justify-center gap-2 hover:bg-stone-800 dark:hover:bg-brass-400 transition-all shadow-md active:scale-95"
            >
              <span>متابعة للدفع وإرفاق الإيصال</span>
              <ArrowLeft className="w-4 h-4 text-brass-400 dark:text-stone-950" />
            </Link>
          </div>

          <p className="text-[11px] text-center text-stone-400 dark:text-stone-500">
            🔒 لا يتم خصم أي مبالغ إلكترونية مباشرة. الدفع يتم بالتحويل اليدوي لراحتك.
          </p>
        </div>

      </div>

    </div>
  );
}
