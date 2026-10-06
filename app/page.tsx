import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Sparkles, 
  Gift, 
  Heart, 
  Star, 
  MessageCircle, 
  SlidersHorizontal,
  Check,
  Moon,
  Flame,
  Coffee,
  PackageCheck
} from 'lucide-react';
import { getActiveProducts, getActiveOffers, getPublicSettings } from '@/lib/supabase';
import { DEFAULT_CATEGORY_CONFIGS, DEFAULT_COLLECTION_CONFIGS } from '@/types/database';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const settings = await getPublicSettings();

  // Find active seasonal collection
  const collectionsList = (settings.catalog_collections_config && settings.catalog_collections_config.length > 0)
    ? settings.catalog_collections_config
    : DEFAULT_COLLECTION_CONFIGS;
  
  const activeSeasonalCollection = collectionsList.find(c => c.is_active && c.homepage_visible) || collectionsList[0];
  const seasonalKey = activeSeasonalCollection?.key || 'ramadan';

  const [allProducts, offers, seasonalProducts] = await Promise.all([
    getActiveProducts({ limit: 12 }),
    getActiveOffers(),
    getActiveProducts({ collection: seasonalKey, limit: 4 }),
  ]);

  const activeOffer = offers.length > 0 ? offers[0] : null;

  // Prioritize configured featured product IDs if any, otherwise take latest 6
  let featuredProducts = allProducts.slice(0, 6);
  if (settings.catalog_featured_product_ids && settings.catalog_featured_product_ids.length > 0) {
    const featuredMap = new Map(allProducts.map(p => [p.id, p]));
    const customFeatured = settings.catalog_featured_product_ids
      .map(id => featuredMap.get(id))
      .filter((p): p is typeof allProducts[0] => Boolean(p));
    
    if (customFeatured.length > 0) {
      const remaining = allProducts.filter(p => !settings.catalog_featured_product_ids!.includes(p.id));
      featuredProducts = [...customFeatured, ...remaining].slice(0, 6);
    }
  }

  // Dynamic Visual Categories from SSoT
  const categoriesList = ((settings.catalog_categories_config && settings.catalog_categories_config.length > 0)
    ? settings.catalog_categories_config
    : DEFAULT_CATEGORY_CONFIGS)
    .filter(c => c.is_active !== false && c.homepage_visible !== false)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  const whatsappSpecialUrl = `https://wa.me/${(settings.whatsapp_number || '201000000000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'مرحباً Gogo Designs 🌸 أود الاستفسار عن تنفيذ طقم أو لون معين أو نقش بالاسم ✨'
  )}`;

  return (
    <div className="flex flex-col gap-10 sm:gap-16 md:gap-24 pb-14 sm:pb-20">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: قطع ديكورية وهدايا معمولـة بتركيز ودقة                    */}
      {/* ========================================================================= */}
      <section className="relative pt-3 sm:pt-8 md:pt-12 pb-6 sm:pb-8 overflow-hidden">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-14 items-center">
            
            {/* Story & Typography Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-right">
              
              {/* Natural Eyebrow */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-sand-200/80 dark:bg-stone-800/80 border border-sand-300/60 dark:border-stone-700/60 text-stone-800 dark:text-brass-300 text-[11px] sm:text-xs font-bold mb-3 sm:mb-5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-brass-500" />
                <span>{settings.hero_eyebrow || 'قطع ديكورية وهدايا مصنوعة يدوياً بمحبة ✨'}</span>
              </div>

              {/* Bold Real Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-stone-900 dark:text-white tracking-tight leading-[1.25] sm:leading-[1.2] mb-3 sm:mb-5">
                {settings.hero_title ? (
                  settings.hero_title.includes('/') ? (
                    <>
                      {settings.hero_title.split('/')[0].trim()} <br className="hidden sm:inline" />
                      <span className="text-brass-600 dark:text-brass-400 font-extrabold">{settings.hero_title.split('/')[1].trim()}</span>
                    </>
                  ) : (
                    settings.hero_title
                  )
                ) : (
                  <>
                    قطع مميزة لبيتك وهداياك <br className="hidden sm:inline" />
                    <span className="text-brass-600 dark:text-brass-400 font-extrabold">معمولـة بتركيز ودقة 🤍</span>
                  </>
                )}
              </h1>

              {/* Product Concept Subtitle */}
              <p className="text-xs sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl mb-4 sm:mb-7 font-normal">
                {settings.hero_subtitle || 'تصميمات مودرن وبسيطة تليق بأي مساحة في بيتك. كل قطعة بنفذها يدويًا باهتمام فائق بالتفاصيل، بتشطيب ناعم وألوان هادية تمنح بيتك لمسة فنية دافئة.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full sm:w-auto mb-5 sm:mb-8">
                <Link href="/products" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto shadow-md h-11 sm:h-12 text-xs sm:text-sm font-bold"
                    rightIcon={<ArrowLeft className="w-4 h-4 text-brass-400 dark:text-stone-950" />}
                  >
                    تصفحي المعرض واختاري ستايلك ✨
                  </Button>
                </Link>

                <Link href="/products?category=gift_sets" className="w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto h-11 sm:h-12 text-xs sm:text-sm font-bold"
                    leftIcon={<Gift className="w-4 h-4 text-brass-600 dark:text-brass-400" />}
                  >
                    أطقم الهدايا الجاهزة
                  </Button>
                </Link>
              </div>

              {/* Real Value Pillars Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full pt-3.5 sm:pt-5 border-t border-stone-200/80 dark:border-stone-800/80 text-[11px] sm:text-xs text-stone-700 dark:text-stone-300 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>شغل Handmade</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>تشطيب ناعم وأنيق</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>تخصيص ونقش بالاسم</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>أسعار معلنة وبسيطة</span>
                </div>
              </div>

            </div>

            {/* Visual Column: Showcase Piece */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-[4/5] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl shadow-stone-900/10 dark:shadow-stone-950/50 border-2 sm:border-4 border-white dark:border-stone-800 bg-sand-200 dark:bg-stone-800">
                <Image
                  src={settings.hero_banner_url || "https://images.unsplash.com/photo-1594913785162-e678a0c23ee9?auto=format&fit=crop&w=1000&q=80"}
                  alt={`${settings.store_name} تحف وديكورات هاند ميد`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center transition-transform duration-700 hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
                
                {/* Floating Micro-Card */}
                <div className="absolute bottom-3 right-3 left-3 sm:bottom-5 sm:right-5 sm:left-5 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-white/50 dark:border-stone-700 text-stone-900 dark:text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] sm:text-[11px] font-bold text-brass-600 dark:text-brass-400">تشطيب ناعم وأنيق</p>
                      <p className="text-xs sm:text-sm font-black text-stone-900 dark:text-white mt-0.5">لمسات فنية هادئة تليق ببيتك 🤍</p>
                    </div>
                    <span className="text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-sand-100 dark:bg-stone-800 font-bold text-stone-800 dark:text-sand-200 border border-sand-200 dark:border-stone-700">
                      بأعلي جودة ✨
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. VISUAL CATEGORIES GRID: الأقسام الرئيسية السريعة                       */}
      {/* ========================================================================= */}
      {settings.section_categories_enabled !== false && (
        <section className="relative py-8 sm:py-12 bg-sand-100/60 dark:bg-stone-900/40 border-y border-sand-200/70 dark:border-stone-800/80">
          <div className="max-w-6xl mx-auto px-3.5 sm:px-6 w-full space-y-5 sm:space-y-7">
          
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-sand-200/50 dark:border-stone-800/50">
              <div>
                <span className="text-[11px] sm:text-xs font-bold text-brass-600 dark:text-brass-400">
                  اختاري واكتشفي معروضاتنا 🌸
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                  أقسام وتشكيلات المتجر
                </h2>
              </div>
              <Link href="/products" className="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white flex items-center gap-1">
                <span>تصفحي كافة القطع</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {categoriesList.map((cat) => (
              <Link
                key={cat.key}
                href={`/products?category=${cat.key}`}
                className="group p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-sand-200/90 dark:border-stone-800 shadow-xs hover:shadow-xl hover:shadow-stone-900/5 dark:hover:shadow-stone-950/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl sm:text-3xl">{cat.icon || '✨'}</span>
                    {cat.badge && (
                      <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-sand-100 dark:bg-stone-800 text-stone-700 dark:text-sand-200 border border-sand-200 dark:border-stone-700">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-stone-900 dark:text-white text-xs sm:text-sm group-hover:text-brass-600 dark:group-hover:text-brass-400 transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-brass-700 dark:text-brass-400">
                  <span>تصفحي القسم</span>
                  <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 2.5 PROMO BANNER (من الإعدادات والعروض إن وجدت)                            */}
      {/* ========================================================================= */}
      {(settings.promo_banner_active !== false && (settings.promo_banner_image_url || activeOffer)) && (
        <section className="max-w-6xl mx-auto px-3.5 sm:px-6 w-full">
          <Link
            href={settings.promo_banner_link || '/products'}
            className="group relative block w-full aspect-[16/9] sm:aspect-[24/8] md:aspect-[28/8] rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-lg shadow-stone-950/5 dark:shadow-stone-950/60 transition-all duration-500 hover:shadow-2xl hover:border-brass-500/50"
          >
            <Image
              src={settings.promo_banner_image_url || activeOffer?.image_url || "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1400&q=80"}
              alt={settings.promo_banner_title || activeOffer?.title || "عرض خاص"}
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/55 to-transparent flex flex-col justify-center px-4 sm:px-12 md:px-16 text-white space-y-1.5 sm:space-y-2.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-brass-500 text-stone-950 font-black text-[10px] sm:text-xs self-start shadow-md">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{settings.promo_banner_badge || activeOffer?.badge_text || 'عرض خاص 🔥'}</span>
              </span>
              <h3 className="text-sm sm:text-2xl md:text-3xl font-black tracking-tight max-w-xl text-sand-50 group-hover:text-brass-300 transition-colors line-clamp-2">
                {settings.promo_banner_title || activeOffer?.title || 'تشكيلة مميزة من الديكورات بأعلي جودة'}
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-sand-200 pt-0.5">
                <span>تصفحي العرض الآن</span>
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-brass-400" />
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. CURATED SHOWCASE: الأكثر طلباً والقطع المميزة                           */}
      {/* ========================================================================= */}
      {settings.section_featured_enabled !== false && (
        <section className="max-w-6xl mx-auto px-3.5 sm:px-6 w-full space-y-4 sm:space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-brass-600 dark:text-brass-400 mb-1">
                <span>الأكثر طلباً واختياراً 🤍</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                القطع الأكثر تميزاً وإعجاباً
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5 sm:mt-1">
                كل قطعة معمولة بتركيز ودقة وتشطيب ناعم. اختاري قطعة واحدة أو اجمعي طقم حسب رغبتك.
              </p>
            </div>

            <Link href="/products" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm" rightIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
                عرض كافة المعروضات
              </Button>
            </Link>
          </div>

          {/* Products Grid: Exact 2-col on mobile, gap-2.5 sm:gap-4 md:gap-6 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center sm:hidden pt-1">
            <Link href="/products" className="w-full inline-block">
              <Button variant="primary" size="md" className="w-full h-11 text-xs font-bold shadow-sm">
                عرض جميع القطع في المعرض
              </Button>
            </Link>
          </div>

        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. SEASONAL COLLECTION (ديناميكي: يظهر فقط إذا وجدت قطع مسجلة للمجموعة)    */}
      {/* ========================================================================= */}
      {settings.section_seasonal_enabled !== false && seasonalProducts.length > 0 && activeSeasonalCollection && (
        <section className="max-w-6xl mx-auto px-3.5 sm:px-6 w-full">
          <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-500/10 via-sand-100/60 to-sand-200/40 dark:from-stone-900 dark:via-stone-900 dark:to-stone-800 border border-amber-500/30 dark:border-stone-800 space-y-4 sm:space-y-6">
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-brass-400">
                  <Moon className="w-3.5 h-3.5" />
                  <span>{activeSeasonalCollection.badge || 'الموسم والبركة 🌙'}</span>
                </span>
                <h3 className="text-xl sm:text-3xl font-black text-stone-900 dark:text-white">
                  {activeSeasonalCollection.label || 'ركن رمضان والأجواء الدافئة'}
                </h3>
              </div>
              <Link href={`/products?collection=${activeSeasonalCollection.key}`}>
                <Button variant="outline" size="sm" rightIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
                  عرض تشكيلة {activeSeasonalCollection.label}
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
              {seasonalProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 5. CUSTOM REQUEST & INQUIRY: لو حابة لون أو شكل أو نقش خاص               */}
      {/* ========================================================================= */}
      {settings.section_custom_request_enabled !== false && (
        <section className="max-w-6xl mx-auto px-3.5 sm:px-6 w-full">
          <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-sand-100/90 dark:bg-stone-900 border border-sand-300/80 dark:border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 shadow-xs">
            
            <div className="space-y-1.5 sm:space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-sand-200 dark:bg-stone-800 text-stone-800 dark:text-brass-400 text-[11px] sm:text-xs font-bold">
                <span>طلب خاص وتنسيق ألوان 🙋‍♀️💜</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
                ومتاح تنفيذ أي ألوان، أو نقش عبارة إهداء مخصصة بالطلب 🌸
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                كل قطعة معمولة بتركيز ودقة وبأعلي جودة وتشطيب هادي. لو أردتي لوناً معيناً، طقماً مخصصاً، أو نقش أسماء خاصة للهدايا وكتب الكتاب، تواصلي معنا وسننفذها لكِ بكل سرور ✨
              </p>
            </div>

            <a
              href={whatsappSpecialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 w-full md:w-auto"
            >
              <Button
                variant="primary"
                size="lg"
                className="w-full md:w-auto shadow-sm h-11 sm:h-12 text-xs sm:text-sm font-bold"
                leftIcon={<MessageCircle className="w-4 h-4 text-brass-400 dark:text-stone-950" />}
              >
                تواصلي معنا عبر واتساب 💬
              </Button>
            </a>

          </div>
        </section>
      )}

    </div>
  );
}
