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
        <div className="w-8 h-8 border-3 border-stone-800 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-stone-500">جاري تحميل السلة...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-sand-200/80 text-stone-700 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShoppingBag className="w-8 h-8 text-stone-600" />
        </div>
        <h1 className="text-2xl font-bold text-stone-900 mb-2">سلة المشتريات فارغة</h1>
        <p className="text-sm text-stone-500 mb-8 leading-relaxed">
          لم تقم بإضافة أي قطع كونكريت إلى سلتك بعد. استكشف مجموعتنا اليدوية واختر ما يناسب ذوقك.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-stone-900 text-sand-50 font-semibold text-sm hover:bg-stone-800 transition-all shadow-md active:scale-95"
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">سلة المشتريات</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            راجع قطعك المحددة ومبالغ العربون قبل الانتقال لإتمام الطلب
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs font-semibold text-stone-700 hover:text-stone-950 flex items-center gap-1"
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
                className="flex gap-4 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-sm"
              >
                {/* Product Thumbnail */}
                <Link
                  href={`/product/${product.slug}`}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-sand-100 shrink-0 border border-stone-100"
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

                {/* Info & Quantity */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${product.slug}`}
                        className="font-semibold text-stone-900 text-sm hover:text-stone-700 line-clamp-1"
                      >
                        {product.name_ar}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1 -mt-1 -mr-1"
                        title="حذف من السلة"
                        aria-label={`حذف ${product.name_ar}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {selected_color && (
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        اللون: <span className="text-stone-800 font-medium">{selected_color}</span>
                      </p>
                    )}

                    <p className="text-xs font-mono text-stone-500 mt-1">
                      {formatPrice(product.price)} للقطعة
                    </p>
                  </div>

                  {/* Quantity and Subtotal Row */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100">
                    <div className="flex items-center bg-sand-50 border border-stone-200 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-200 rounded"
                        aria-label="إنقاص الكمية"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center font-mono text-xs font-bold text-stone-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-200 rounded disabled:opacity-30"
                        aria-label="زيادة الكمية"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono font-bold text-sm text-stone-900">
                      {formatPrice(itemTotal)}
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary & Deposit Calculation */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-100">
              ملخص الحساب المالي
            </h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>إجمالي قيمة المنتجات:</span>
                <span className="font-mono font-bold text-stone-900">{formatPrice(subtotal)}</span>
              </div>

              {/* Deposit Requirement */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>العربون المطلوب تحويله ({depositPercentage}%):</span>
                  <span className="font-mono text-sm">{formatPrice(depositAmount)}</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-tight">
                  يلزم تحويل العربون لتأكيد حجز القطعة وبدء الصب والتصنيع اليدوي.
                </p>
              </div>

              <div className="flex justify-between text-stone-600 pt-1 text-xs">
                <span>المبلغ المتبقي عند الاستلام:</span>
                <span className="font-mono font-bold text-stone-800">{formatPrice(remainingAmount)}</span>
              </div>

              <div className="text-[11px] text-stone-400">
                * تكلفة الشحن تُحسب حسب المحافظة وتُدفع لمندوب التوصيل عند الاستلام.
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <Link
                href="/checkout"
                className="w-full py-4 px-6 rounded-xl bg-stone-900 text-sand-50 font-bold text-sm flex items-center justify-center gap-2 hover:bg-stone-800 transition-all shadow-md active:scale-95 text-center"
              >
                <span>متابعة لإتمام الطلب وسداد العربون</span>
                <ArrowLeft className="w-4 h-4 text-brass-400" />
              </Link>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
