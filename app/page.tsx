import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Sparkles, Feather, Layers, ShieldCheck, Tag } from 'lucide-react';
import { getActiveProducts, getActiveOffers } from '@/lib/supabase';
import ProductCard from '@/components/products/ProductCard';

export const revalidate = 60; // Revalidate every minute

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
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand-200/80 border border-sand-300/60 text-stone-800 text-xs font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5 text-brass-500" />
                <span>براند يدوي مصري للكونكريت المعماري</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15] mb-5">
                قطع معمولة بإيد... <br />
                <span className="text-stone-600 font-medium">تعيش معاك.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl mb-8">
                تحف وصواني وقواعد أكواب مصنوعة يدوياً من بودرة الكونكريت فائقة النعومة ومواد عزل تحميها من البقع.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-stone-900 text-sand-50 hover:bg-stone-800 font-semibold text-sm transition-all shadow-md active:scale-95"
                >
                  <span>اكتشف المجموعة</span>
                  <ArrowLeft className="w-4 h-4 text-brass-400" />
                </Link>

                <Link
                  href="/order/track"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-stone-200 text-stone-800 hover:bg-stone-50 font-medium text-sm transition-all"
                >
                  <span>تتبع طلب سابق</span>
                </Link>
              </div>
            </div>

            {/* Visual Column: Hero Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-sand-200">
                <Image
                  src="https://images.unsplash.com/photo-1594913785162-e678a0c23ee9?auto=format&fit=crop&w=1000&q=80"
                  alt="Gogo Concrete Handmade Tray & Coaster"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-transparent" />
                <div className="absolute bottom-5 right-5 left-5 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 text-stone-900 shadow-lg">
                  <p className="text-xs font-semibold text-stone-500">خامة استثنائية</p>
                  <p className="text-sm font-bold text-stone-900">ملمس حجري ناعم خالٍ من المسامات الخشنة</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Active Offer Banner (if present) */}
      {activeOffer && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <div className="relative rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 text-white p-6 sm:p-8 overflow-hidden shadow-lg border border-stone-700">
            <div className="relative z-10 max-w-2xl">
              {activeOffer.badge_text && (
                <span className="inline-block px-3 py-1 rounded-full bg-brass-500/20 text-brass-400 border border-brass-500/30 text-xs font-semibold mb-3">
                  {activeOffer.badge_text}
                </span>
              )}
              <h2 className="text-xl sm:text-2xl font-bold mb-2 text-sand-50">
                {activeOffer.title}
              </h2>
              {activeOffer.description && (
                <p className="text-stone-300 text-sm leading-relaxed mb-5">
                  {activeOffer.description}
                </p>
              )}
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sand-50 text-stone-950 text-xs font-bold hover:bg-white transition-colors"
              >
                <span>تسوق العرض الآن</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-brass-500/10 rounded-full blur-2xl pointer-events-none" />
          </div>
        </section>
      )}

      {/* 3. Categories Chips */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-stone-900">الفئات</h2>
          <Link href="/products" className="text-xs font-semibold text-stone-600 hover:text-stone-900">
            عرض كل المنتجات ←
          </Link>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-medium bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 shadow-sm transition-colors active:scale-95"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Products */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-1">
              مختارات من المتجر
            </h2>
            <p className="text-sm text-stone-500">
              أحدث القطع المصبوبة يدوياً وجاهزة للطلب
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800 hover:text-stone-950 pb-1"
          >
            <span>كل المجموعة ({products.length})</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
            <p className="text-stone-500 text-sm">لا توجد منتجات متاحة حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Why Gogo - 3 Points Only */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="bg-sand-100/70 border border-sand-200 rounded-3xl p-8 sm:p-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
              ليه تختار قطع Gogo؟
            </h2>
            <p className="text-sm text-stone-600">
              سر الصنعة وخامات العزل التي تجعل كل قطعة تحفة معمرة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-right">
            
            {/* Point 1 */}
            <div className="flex flex-col items-center sm:items-start p-5 rounded-2xl bg-white/70 border border-white">
              <div className="w-12 h-12 rounded-xl bg-stone-900 text-brass-400 flex items-center justify-center mb-4 shadow-sm">
                <Feather className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base mb-1.5">صناعة يدوية</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                تُخلط وتُصب في قوالب سيليكون خاصة بعناية تامة بدون استخدام ركام أو حصى خشن.
              </p>
            </div>

            {/* Point 2 */}
            <div className="flex flex-col items-center sm:items-start p-5 rounded-2xl bg-white/70 border border-white">
              <div className="w-12 h-12 rounded-xl bg-stone-900 text-brass-400 flex items-center justify-center mb-4 shadow-sm">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base mb-1.5">خامات مختارة</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                بودرة ناعمة فائقة الجودة وبوليمرات رابطة مع طبقة حماية عازلة للماء والبقع والحرارة.
              </p>
            </div>

            {/* Point 3 */}
            <div className="flex flex-col items-center sm:items-start p-5 rounded-2xl bg-white/70 border border-white">
              <div className="w-12 h-12 rounded-xl bg-stone-900 text-brass-400 flex items-center justify-center mb-4 shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base mb-1.5">كل قطعة مختلفة</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                التأثير المارمري والتموجات الحجرية فريدة تماماً في كل صبة، ولا تتكرر قطعة مثل الأخرى.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-stone-900 text-sand-50 shadow-xl border border-stone-800 flex flex-col items-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-3 text-white">
            جاهز تختار قطعتك؟
          </h2>
          <p className="text-sm sm:text-base text-stone-300 max-w-md mb-8 leading-relaxed">
            اختر القطع التي تناسب ذوق مساحتك، وثبّت طلبك بعربون 50% لنبدأ في صبها خصيصاً لك.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-sand-50 text-stone-950 font-bold text-sm hover:bg-white transition-all shadow-md active:scale-95"
          >
            <span>تسوق الآن</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
