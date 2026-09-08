import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Sparkles, Feather, Layers, ShieldCheck, Tag } from 'lucide-react';
import { getActiveProducts, getActiveOffers } from '@/lib/supabase';
import ProductCard from '@/components/products/ProductCard';

export const revalidate = 60;

export default async function HomePage() {
  const [products, offers] = await Promise.all([
    getActiveProducts(),
    getActiveOffers(),
  ]);

  const activeOffer = offers.length > 0 ? offers[0] : null;
  const featuredProducts = products.slice(0, 6);

  const categories = [
    { key: 'all', label: 'الكل', href: '/products' },
    { key: 'trays', label: 'صواني', href: '/products?category=trays' },
    { key: 'coasters', label: 'Coasters', href: '/products?category=coasters' },
    { key: 'planters', label: 'أحواض', href: '/products?category=planters' },
    { key: 'candle_holders', label: 'شمعدانات ومباخر', href: '/products?category=candle_holders' },
    { key: 'decor', label: 'تحف وديكور', href: '/products?category=decor' },
  ];

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-12">
      
      {/* 1. Hero Section */}
      <section className="relative pt-8 md:pt-14 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Text Column */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand-200/80 dark:bg-stone-800 border border-sand-300/60 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5 text-brass-500" />
                <span>براند يدوي مصري للكونكريت المعماري</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 dark:text-white tracking-tight leading-[1.2] mb-5">
                قطع معمولة بإيد... <br />
                <span className="text-stone-500 dark:text-stone-400 font-normal">تعيش معاك.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl mb-8">
                تحف وصواني وقواعد أكواب مصنوعة يدوياً من بودرة الكونكريت فائقة النعومة ومواد عزل تحميها من البقع.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-brass-400 font-bold text-sm transition-all shadow-md active:scale-95"
                >
                  <span>اكتشف المجموعة</span>
                  <ArrowLeft className="w-4 h-4 text-brass-400 dark:text-stone-950" />
                </Link>

                <Link
                  href="/order/track"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 font-semibold text-sm transition-all"
                >
                  <span>تتبع طلب سابق</span>
                </Link>
              </div>
            </div>

            {/* Visual Column: Hero Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800 bg-sand-200 dark:bg-stone-800">
                <Image
                  src="https://images.unsplash.com/photo-1594913785162-e678a0c23ee9?auto=format&fit=crop&w=1000&q=80"
                  alt="Gogo Concrete Handmade Tray & Coaster"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 right-5 left-5 p-4 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-white/40 dark:border-stone-700 text-stone-900 dark:text-white shadow-lg">
                  <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">خامة استثنائية</p>
                  <p className="text-sm font-bold text-stone-900 dark:text-white">ملمس حجري ناعم خالٍ من المسامات الخشنة</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Active Offer Banner (if present) */}
      {activeOffer && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <div className="relative rounded-3xl bg-gradient-to-r from-stone-900 to-stone-800 dark:from-stone-900 dark:to-stone-950 text-white p-6 sm:p-8 overflow-hidden shadow-lg border border-stone-700/60">
            <div className="relative z-10 max-w-2xl">
              {activeOffer.badge_text && (
                <span className="inline-block px-3 py-1 rounded-full bg-brass-500/20 text-brass-400 border border-brass-500/30 text-xs font-bold mb-3">
                  {activeOffer.badge_text}
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                {activeOffer.title}
              </h2>
              {activeOffer.description && (
                <p className="text-stone-300 text-sm leading-relaxed mb-6">
                  {activeOffer.description}
                </p>
              )}
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brass-500 text-stone-950 font-bold text-xs hover:bg-brass-400 transition-all shadow-sm"
              >
                <span>تسوق العرض الآن</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="absolute left-[-20px] bottom-[-30px] opacity-10 pointer-events-none">
              <Tag className="w-64 h-64 text-brass-400" />
            </div>
          </div>
        </section>
      )}

      {/* 3. Category Quick Tabs */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">تصنيفات القطع</h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">اختر ما تبحث عنه لتنسيق ركنك المميز</p>
          </div>
          <Link href="/products" className="text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-brass-500 flex items-center gap-1">
            <span>عرض الكل</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="whitespace-nowrap px-4 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-brass-500 hover:text-brass-600 dark:hover:text-brass-400 text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Products Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">أحدث القطع المصبوبة</h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">قطع جاهزة للشحن أو للتخصيص بالألوان التي تختارها</p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-bold transition-colors"
          >
            <span>عرض كافة المنتجات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 text-stone-400">
            <p className="text-sm">لا توجد منتجات منشورة حالياً، تابعنا قريباً!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-stone-900 dark:bg-brass-500 text-white dark:text-stone-950 font-bold text-xs shadow-sm"
          >
            <span>عرض كل المنتجات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 5. Craftsmanship & Assurance Value Props */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-sand-100/90 dark:bg-stone-900 border border-sand-200/80 dark:border-stone-800">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-2">ليه تختار Gogo Concrete؟</h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">نحن لا نبيع مجرد قطع خرسانية، بل نهتم بأدق تفاصيل الصب والمعالجة لتناسب ديكور منزلك</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-sand-200 dark:bg-stone-700 flex items-center justify-center text-stone-900 dark:text-brass-400 mb-4">
                <Feather className="w-6 h-6 text-stone-800 dark:text-brass-400" />
              </div>
              <h3 className="font-bold text-stone-900 dark:text-white text-base mb-1.5">ملمس ناعم وعزل مائي</h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                معالجة سطحية بطبقة حماية ضد الرطوبة والبقع تجعل تنظيفها بقطعة قماش ناعمة أمراً بسيطاً.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-sand-200 dark:bg-stone-700 flex items-center justify-center text-stone-900 dark:text-brass-400 mb-4">
                <Layers className="w-6 h-6 text-stone-800 dark:text-brass-400" />
              </div>
              <h3 className="font-bold text-stone-900 dark:text-white text-base mb-1.5">قواعد فلين للحماية</h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                كل صينية وكوستر مزود بقواعد حماية ناعمة من الأسفل لضمان عدم خدش أسطح الزجاج أو الخشب.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-sand-200 dark:bg-stone-700 flex items-center justify-center text-stone-900 dark:text-brass-400 mb-4">
                <ShieldCheck className="w-6 h-6 text-stone-800 dark:text-brass-400" />
              </div>
              <h3 className="font-bold text-stone-900 dark:text-white text-base mb-1.5">نظام عربون عادل وآمن</h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                تدفع فقط 50% كعربون لتأكيد الصب وتجهيز الألوان، والباقي عند استلام القطع وشحنها.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
