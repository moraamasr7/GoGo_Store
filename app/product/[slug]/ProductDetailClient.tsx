'use client';

import React, { useState } from 'react';
import { ShoppingBag, Minus, Plus, Check } from 'lucide-react';
import { Product } from '@/types/database';
import { useCart } from '@/components/cart/CartContext';
import Link from 'next/link';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem, items } = useCart();
  const colors = Array.isArray(product.colors) ? product.colors : [];
  
  const [selectedColor, setSelectedColor] = useState<string>(colors.length > 0 ? colors[0] : '');
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const isOutOfStock = product.stock <= 0;
  const isInCart = items.some(item => item.product_id === product.id);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, quantity, selectedColor || undefined);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Colors Selector (if any) */}
      {colors.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-2">
            اللون / التأثير المفضل:
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-stone-900 text-white shadow-sm ring-2 ring-stone-900 ring-offset-2'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock availability indicator */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-stone-600">حالة المخزون:</span>
        {isOutOfStock ? (
          <span className="font-bold text-rose-600">غير متوفر حالياً</span>
        ) : (
          <span className="text-emerald-700 font-medium">
            متوفر ({product.stock} قطعة جاهزة)
          </span>
        )}
      </div>

      {/* Quantity Selector & Add Button */}
      {!isOutOfStock && (
        <div className="flex items-center gap-3 pt-2">
          
          {/* Quantity Controls */}
          <div className="flex items-center bg-white border border-stone-200 rounded-xl p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-600 hover:bg-stone-100 disabled:opacity-30"
              aria-label="تقليل الكمية"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="w-10 text-center font-mono font-bold text-sm text-stone-900">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
              disabled={quantity >= product.stock}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-600 hover:bg-stone-100 disabled:opacity-30"
              aria-label="زيادة الكمية"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
              justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-900 text-sand-50 hover:bg-stone-800'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>تمت الإضافة!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-brass-400" />
                <span>أضف للسلة</span>
              </>
            )}
          </button>

        </div>
      )}

      {/* Cart quick link if already added */}
      {isInCart && (
        <div className="pt-2">
          <Link
            href="/cart"
            className="block text-center py-2.5 px-4 rounded-xl bg-sand-200/80 hover:bg-sand-300/80 text-stone-900 text-xs font-semibold transition-colors"
          >
            الذهاب إلى السلة للمعاينة وإتمام الطلب ←
          </Link>
        </div>
      )}

    </div>
  );
}
