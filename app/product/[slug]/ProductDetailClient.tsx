'use client';

import React, { useState } from 'react';
import { ShoppingBag, Minus, Plus, Check, Sparkles, ArrowLeft } from 'lucide-react';
import { Product } from '@/types/database';
import { useCart } from '@/components/cart/CartContext';
import { Button } from '@/components/ui/Button';
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
    setTimeout(() => setJustAdded(false), 2200);
  };

  return (
    <div className="space-y-6">
      
      {/* Colors Selector (if any) */}
      {colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
              اللون / التموج الرخامي المفضل:
            </label>
            <span className="text-[11px] text-stone-400 font-medium">يُصب مخصصاً لكِ</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-stone-900 dark:bg-brass-500 text-white dark:text-stone-950 shadow-sm ring-2 ring-stone-900 dark:ring-brass-400 ring-offset-2 dark:ring-offset-stone-950 scale-102'
                      : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800'
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
        <span className="font-bold text-stone-600 dark:text-stone-400">حالة القطعة:</span>
        {isOutOfStock ? (
          <span className="font-bold text-rose-600 dark:text-rose-400">نفذت الكمية حالياً</span>
        ) : (
          <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>جاهزة للصب الفوري ({product.stock} قطع متوفرة بالمخزون)</span>
          </span>
        )}
      </div>

      {/* Quantity Selector & Add Button */}
      {!isOutOfStock && (
        <div className="flex items-center gap-3 pt-2">
          
          {/* Quantity Controls */}
          <div className="flex items-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-1 shadow-xs min-h-[48px]">
            <button
              type="button"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 transition-colors"
              aria-label="تقليل الكمية"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="w-10 text-center font-mono font-black text-sm text-stone-900 dark:text-white">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
              disabled={quantity >= product.stock}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 transition-colors"
              aria-label="زيادة الكمية"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            variant="primary"
            size="lg"
            className="flex-1"
            leftIcon={justAdded ? <Check className="w-4 h-4 text-emerald-300" /> : <ShoppingBag className="w-4 h-4 text-brass-400 dark:text-stone-950" />}
          >
            {justAdded ? 'تمت الإضافة للحقيبة! ✨' : 'اقتني القطعة الآن'}
          </Button>

        </div>
      )}

      {/* Cart quick link if already added */}
      {isInCart && (
        <div className="pt-2">
          <Link href="/cart" className="block">
            <Button variant="secondary" size="md" className="w-full" rightIcon={<ArrowLeft className="w-4 h-4" />}>
              الذهاب إلى الحقيبة للمعاينة وسداد العربون
            </Button>
          </Link>
        </div>
      )}

    </div>
  );
}
