'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Sparkles } from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';

export default function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-sand-50/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-sand-50 shadow-sm group-hover:bg-stone-900 transition-colors">
            <span className="font-bold text-lg tracking-wider">G</span>
          </div>
          <div>
            <div className="font-bold text-lg tracking-wide text-stone-900 flex items-center gap-1.5">
              <span>GOGO CONCRETE</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-sand-200 text-stone-800 font-medium">يدوي</span>
            </div>
            <p className="text-[11px] text-stone-500 tracking-tight">قطع كونكريت ديكورية فريدة</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <Link 
            href="/" 
            className={`transition-colors hover:text-stone-950 ${pathname === '/' ? 'text-stone-950 font-semibold' : ''}`}
          >
            الرئيسية
          </Link>
          <Link 
            href="/products" 
            className={`transition-colors hover:text-stone-950 ${pathname.startsWith('/product') ? 'text-stone-950 font-semibold' : ''}`}
          >
            المنتجات
          </Link>
          <Link 
            href="/order/track" 
            className={`transition-colors hover:text-stone-950 ${pathname.startsWith('/order') ? 'text-stone-950 font-semibold' : ''}`}
          >
            تتبع طلبك
          </Link>
        </nav>

        {/* Action Buttons: Cart */}
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="md:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-200/60 transition-colors"
            title="تصفح المنتجات"
          >
            <Search className="w-5 h-5" />
          </Link>

          <Link
            href="/cart"
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 text-sand-50 hover:bg-stone-800 transition-all shadow-sm active:scale-95"
            aria-label="سلة التسوق"
          >
            <ShoppingBag className="w-4 h-4 text-brass-400" />
            <span className="text-xs font-semibold hidden sm:inline">السلة</span>
            {itemCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold rounded-full bg-brass-500 text-stone-900">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
}
