'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Home,
  Sparkles,
  Gift,
  Layers,
  Flame,
  Palette,
  Clock,
  MessageCircle,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';
import ThemeToggle from '@/components/theme/ThemeToggle';
import Image from 'next/image';

interface HeaderProps {
  logoUrl?: string;
  storeName?: string;
  whatsappNumber?: string;
}

export default function Header({ logoUrl, storeName, whatsappNumber = '201150014792' }: HeaderProps) {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'الرئيسية', href: '/', icon: Home, active: pathname === '/' },
    { label: 'جميع القطع', href: '/products', icon: Sparkles, active: pathname === '/products' },
    { label: 'كوّني طقمك ✨', href: '/set-builder', icon: Layers, active: pathname === '/set-builder' },
    { label: 'أطقم الهدايا', href: '/products?category=gift_sets', icon: Gift, active: pathname.includes('gift_sets') },
    { label: 'تتبع طلبك', href: '/order/track', icon: Clock, active: pathname.startsWith('/order') },
  ];

  const categoryShortcuts = [
    { label: 'صواني ديكورية', href: '/products?category=trays' },
    { label: 'شمعدانات ومباخر', href: '/products?category=candle_holders' },
    { label: 'فازات وتحف', href: '/products?category=decor' },
    { label: 'قطع بدون فنش (للتلوين)', href: '/products?filter=unfinished' },
  ];

  const whatsappInquiryUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'مرحباً Gogo Designs 🌸 أود الاستفسار عن تفصيل طلب أو الاستفسار عن القطع المتاحة ✨'
  )}`;

  return (
    <>
      <header className="sticky top-0 z-40 bg-sand-50/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/90 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">

          {/* Right Section: Mobile Menu Trigger + Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors focus:outline-none"
              aria-label="فتح القائمة الرئيسية"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo & Name */}
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
              {logoUrl ? (
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shadow-xs border border-stone-200 dark:border-stone-700">
                  <Image
                    src={logoUrl}
                    alt={storeName || 'GOGO CONCRETE'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-900 dark:bg-stone-800 flex items-center justify-center text-sand-50 shadow-xs border border-stone-700/40">
                  <span className="font-extrabold text-sm sm:text-base tracking-wider text-brass-400">G</span>
                </div>
              )}
              <div className="flex flex-col">
                <div className="font-extrabold text-xs sm:text-sm md:text-base tracking-wide text-stone-900 dark:text-white flex items-center gap-1.5 leading-none">
                  <span>{storeName || 'GOGO CONCRETE'}</span>
                  <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.5 rounded-full bg-sand-200 dark:bg-stone-800 text-stone-800 dark:text-sand-200 font-medium">Handmade</span>
                </div>
                <p className="hidden md:block text-[10px] text-stone-500 dark:text-stone-400 tracking-tight mt-0.5">
                  تحف وديكورات يدوية فاخرة
                </p>
              </div>
            </Link>
          </div>

          {/* Center Section: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-300">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1 hover:text-stone-950 dark:hover:text-white relative ${link.active
                    ? 'text-stone-950 dark:text-white font-bold'
                    : ''
                  }`}
              >
                <span>{link.label}</span>
                {link.active && (
                  <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-brass-500 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Left Section: Theme + Search + Cart */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Quick Search / Catalog Link */}
            <Link
              href="/products"
              className="w-10 h-10 flex items-center justify-center rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
              title="تصفح كافة القطع"
              aria-label="تصفح القطع"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Cart Button with Count Badge */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center gap-1.5 h-10 px-3 sm:px-3.5 rounded-xl bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-brass-400 transition-all shadow-xs active:scale-95"
              aria-label="سلة المشتريات"
            >
              <ShoppingBag className="w-4 h-4 text-brass-400 dark:text-stone-950 shrink-0" />
              <span className="text-xs font-bold hidden sm:inline">السلة</span>
              {itemCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] sm:min-w-[20px] h-4.5 sm:h-5 px-1 text-[10px] sm:text-[11px] font-bold rounded-full bg-brass-500 dark:bg-stone-950 text-stone-900 dark:text-brass-400">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* MOBILE NAVIGATION DRAWER                                                  */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Drawer from Right */}
          <div className="relative mr-auto w-full max-w-xs bg-white dark:bg-stone-900 h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto border-l border-stone-200 dark:border-stone-800 animate-in slide-in-from-right duration-250">

            {/* Drawer Header */}
            <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-stone-900 dark:bg-stone-800 flex items-center justify-center text-brass-400 font-black text-xs">
                  G
                </div>
                <span className="font-extrabold text-sm text-stone-900 dark:text-white">
                  {storeName || 'GOGO CONCRETE'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="p-4 space-y-6 flex-1">

              {/* Primary Links */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 px-3 block mb-2">
                  التصفح الرئيسي
                </span>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-colors min-h-[44px] ${link.active
                          ? 'bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 shadow-xs'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${link.active ? 'text-brass-400 dark:text-stone-950' : 'text-stone-400 dark:text-stone-500'}`} />
                        <span>{link.label}</span>
                      </div>
                      <ArrowLeft className="w-3.5 h-3.5 opacity-60" />
                    </Link>
                  );
                })}
              </div>

              {/* Category Shortcuts */}
              <div className="space-y-1 pt-3 border-t border-stone-100 dark:border-stone-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 px-3 block mb-2">
                  الأقسام الشائعة
                </span>
                {categoryShortcuts.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors min-h-[44px]"
                  >
                    <span>{cat.label}</span>
                    <ArrowLeft className="w-3 h-3 text-stone-300 dark:text-stone-600" />
                  </Link>
                ))}
              </div>

            </div>

            {/* Drawer Footer & Direct WhatsApp Link */}
            <div className="p-4 border-t border-stone-100 dark:border-stone-800 space-y-3 bg-stone-50/50 dark:bg-stone-950/40">
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>طلب تصميم خاص عبر واتساب</span>
              </a>
              <p className="text-[10px] text-center text-stone-400 dark:text-stone-500">
                صناعة يدوية فاخرة • تشطيب ناعم وأنيق
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

