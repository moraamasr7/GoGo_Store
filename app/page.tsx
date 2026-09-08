import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Sparkles, 
  Gift, 
  Heart, 
  Star, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  MessageCircle, 
  Palette, 
  SlidersHorizontal,
  Box,
  Check
} from 'lucide-react';
import { getActiveProducts, getActiveOffers, getPublicSettings } from '@/lib/supabase';
import ProductCard from '@/components/products/ProductCard';
import { CourseCard } from '@/components/courses/CourseCard';
import { sampleCourses } from '@/lib/coursesData';
import { Button } from '@/components/ui/Button';

export const revalidate = 60;

export default async function HomePage() {
  const [products, offers, settings] = await Promise.all([
    getActiveProducts(),
    getActiveOffers(),
    getPublicSettings(),
  ]);

  const activeOffer = offers.length > 0 ? offers[0] : null;
  const featuredProducts = products.slice(0, 6);

  const categories = [
    { key: 'all', label: 'كافة المعروضات', href: '/products' },
    { key: 'coasters', label: 'الكوسترات', href: '/products?category=coasters' },
    { key: 'trays', label: 'الصواني الديكورية', href: '/products?category=trays' },
    { key: 'candle_holders', label: 'المباخر وحوامل الشموع', href: '/products?category=candle_holders' },
    { key: 'planters', label: 'أحواض وميني زريعة', href: '/products?category=planters' },
    { key: 'decor', label: 'قطع الديكور والتحف', href: '/products?category=decor' },
  ];

  const whatsappSpecialUrl = `https://wa.me/${(settings.whatsapp_number || '201000000000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'مرحباً Gogo Concrete 🌸 حابة استفسر عن تنفيذ لون أو شكل معين لديكورات الكونكريت 🤍'
  )}`;

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: كونكريت Handmade + ديكور وتحف + تصميمات مودرن            */}
      {/* ========================================================================= */}
      <section className="relative pt-6 sm:pt-10 md:pt-14 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Story & Typography Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-right">
              
              {/* Natural Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand-200/80 dark:bg-stone-800/80 border border-sand-300/60 dark:border-stone-700/60 text-stone-800 dark:text-brass-300 text-xs font-bold mb-5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-brass-500" />
                <span>شغل كونكريت وديكور يدوي من البيت ✨</span>
              </div>

              {/* Bold Real Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 dark:text-white tracking-tight leading-[1.2] mb-5">
                تحف وديكورات كونكريت <br />
                <span className="text-brass-600 dark:text-brass-400 font-extrabold">معمولـة بحب 🤍</span>
              </h1>

              {/* Genuine Product Concept Subtitle */}
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl mb-7 font-normal">
                تصميمات مودرن وبسيطة تناسب أي بيت. كل قطعة بنفذها يدويًا وباهتمام بكل التفاصيل، بتشطيب ناعم وهادي يشبه السيراميك وألوان هادية تليق على مساحتك.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto mb-8">
                <Link href="/products" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto shadow-md"
                    rightIcon={<ArrowLeft className="w-4 h-4 text-brass-400 dark:text-stone-950" />}
                  >
                    اختاري ستايلك وتصفحي المعرض ✨
                  </Button>
                </Link>

                <Link href="/order/track" className="w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    تتبع حالة طلبك
                  </Button>
                </Link>
              </div>

              {/* Real Value Pillars Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full pt-5 border-t border-stone-200/80 dark:border-stone-800/80 text-xs text-stone-700 dark:text-stone-300 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>شغل Handmade</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>تشطيب نضيف وناعم</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>ألوان هادية ومودرن</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>أسعار بسيطة ومناسبة</span>
                </div>
              </div>

            </div>

            {/* Visual Column: Genuine Piece Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-xl shadow-stone-900/10 dark:shadow-stone-950/50 border-4 border-white dark:border-stone-800 bg-sand-200 dark:bg-stone-800">
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
                <div className="absolute bottom-5 right-5 left-5 p-4 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-white/50 dark:border-stone-700 text-stone-900 dark:text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-brass-600 dark:text-brass-400">تشطيب ناعم وأنيق</p>
                      <p className="text-xs sm:text-sm font-black text-stone-900 dark:text-white mt-0.5">يشبه السيراميك في نعومته وأناقته 🤍</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-sand-100 dark:bg-stone-800 font-bold text-stone-800 dark:text-sand-200 border border-sand-200 dark:border-stone-700">
                      معمول بحب ✨
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. NATURE OF WORK / المميزات الحقيقية لطبيعة الشغل اليدوي                  */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="p-6 sm:p-10 rounded-3xl bg-sand-100/70 dark:bg-stone-900 border border-sand-200/80 dark:border-stone-800">
          
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight mb-2">
              شغل كونكريت يدوي من البيت بأشكال كتير ✨
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              تصميمات مودرن وبسيطة تناسب أي بيت، وكل قطعة بتتعمل باهتمام كامل بالتفاصيل
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-800/80 border border-sand-200/70 dark:border-stone-700/60 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-sand-200 dark:bg-stone-700 flex items-center justify-center text-stone-800 dark:text-brass-300 font-bold text-sm">
                ✔️
              </div>
              <h3 className="font-extrabold text-stone-900 dark:text-white text-sm">شغل Handmade</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                كل قطعة تُصنع يدويًا من البداية وباهتمام خاص بكل تفصيلة لتكون مميزة وتعيش في بيتك.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-stone-800/80 border border-sand-200/70 dark:border-stone-700/60 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-sand-200 dark:bg-stone-700 flex items-center justify-center text-stone-800 dark:text-brass-300 font-bold text-sm">
                ✔️
              </div>
              <h3 className="font-extrabold text-stone-900 dark:text-white text-sm">تشطيب نضيف وناعم</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                تشطيب ناعم وهادي يشبه السيراميك في نعومته وأناقته ليضيف لمسة ذوق عالي لأي مكان.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-stone-800/80 border border-sand-200/70 dark:border-stone-700/60 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-sand-200 dark:bg-stone-700 flex items-center justify-center text-stone-800 dark:text-brass-300 font-bold text-sm">
                ✔️
              </div>
              <h3 className="font-extrabold text-stone-900 dark:text-white text-sm">ألوان هادية ومودرن</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                ألوان ترندي وراقية تليق على البيوت البسيطة والديكور العصري وتنسجم مع أي زاوية.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-stone-800/80 border border-sand-200/70 dark:border-stone-700/60 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-sand-200 dark:bg-stone-700 flex items-center justify-center text-stone-800 dark:text-brass-300 font-bold text-sm">
                ✔️
              </div>
              <h3 className="font-extrabold text-stone-900 dark:text-white text-sm">أسعار بسيطة ومناسبة</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                قيمة حقيقية لقطع فنية هاند ميد من صنع إيدي بأسعار مناسبة ومعلنة بكل وضوح.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BUILD YOUR SET: اختاري، ركّبي، واعملي ستايلك بنفسك ✨                  */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="p-7 sm:p-10 rounded-3xl bg-gradient-to-br from-white via-sand-50 to-sand-100 dark:from-stone-900 dark:via-stone-900 dark:to-stone-800/80 border border-sand-300/80 dark:border-stone-800 shadow-sm">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-200 dark:bg-stone-800 text-stone-800 dark:text-brass-400 text-xs font-bold">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>تنسيق على ذوقك واحتياجك</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                اختاري، ركّبي، واعملي ستايلك بنفسك ✨
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                قطع ديكور يدوية بتصميم مينيمال وألوان ترندي تناسب أي مساحة. تقدري تختاري قطعة واحدة أو تكوّني الطقم اللي يعجبك حسب ذوقك واحتياجك، وتنسقيه بطريقتك الخاصة.
              </p>

              {/* 3-Step Flow */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="p-3 rounded-xl bg-white dark:bg-stone-800/70 border border-sand-200 dark:border-stone-700">
                  <span className="text-[11px] font-mono font-bold text-brass-600 dark:text-brass-400 block mb-0.5">1. اختاري</span>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">قطعة واحدة أو أكتر</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-stone-800/70 border border-sand-200 dark:border-stone-700">
                  <span className="text-[11px] font-mono font-bold text-brass-600 dark:text-brass-400 block mb-0.5">2. ركّبي</span>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">نسّقي الأشكال والألوان</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-stone-800/70 border border-sand-200 dark:border-stone-700">
                  <span className="text-[11px] font-mono font-bold text-brass-600 dark:text-brass-400 block mb-0.5">3. كوّني طقمك</span>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">واعملي ستايلك الخاص</span>
                </div>
              </div>

            </div>

            <div className="lg:col-span-5 flex flex-col items-center sm:items-start lg:items-center justify-center gap-3">
              <p className="text-xs font-bold text-stone-500 dark:text-stone-400">جربي وشوفي بنفسك 🌸</p>
              <Link href="/products" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md" rightIcon={<ArrowLeft className="w-4 h-4" />}>
                  تصفحي القطع وكوني طقمك
                </Button>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PRODUCT SHOWCASE: الأشكال والألوان المعروضة حالياً متاحة للتنفيذ       */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-brass-600 dark:text-brass-400 mb-1">
              <span>الصور موجودة وأسعار بسيطة ✨</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
              القطع المتاحة للتنفيذ بأمر الله 🌸
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              كل قطعة معمولة بحب وتشطيب هادي. اختاري قطعة واحدة أو اجمعي طقم حسب رغبتك.
            </p>
          </div>

          <Link href="/products" className="hidden sm:inline-flex">
            <Button variant="outline" size="sm" rightIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
              عرض كافة القطع
            </Button>
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="whitespace-nowrap px-4 py-2 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400 dark:hover:border-stone-600 text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center sm:hidden pt-2">
          <Link href="/products" className="w-full inline-block">
            <Button variant="primary" size="md" className="w-full">
              عرض جميع القطع في المعرض
            </Button>
          </Link>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 5. CUSTOMIZATION & SPECIAL INQUIRY: لو حابة لون أو شكل معين               */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="p-6 sm:p-8 rounded-3xl bg-sand-100/90 dark:bg-stone-900 border border-sand-300/80 dark:border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-200 dark:bg-stone-800 text-stone-800 dark:text-brass-400 text-xs font-bold">
              <span>طلب خاص 🙋‍♀️💜</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
              ومتاح تنفيذ أي ألوان، والأشكال اللي معروضة حالياً متاحة بأمر الله 🌸
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              كل قطعة معمولة بحب وتشطيب هادي. لو حابة لون أو شكل معين أو تنسيق طقم مخصوص على ذوقك، ابعتي لنا خاص وهنساعدك بكل سرور. مبسوطة بوجودكم 🤍
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
              className="w-full md:w-auto shadow-sm"
              leftIcon={<MessageCircle className="w-4 h-4 text-brass-400 dark:text-stone-950" />}
            >
              ابعتي لنا على الخاص (واتساب) 💬
            </Button>
          </a>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BRAND STORY: "من بودرة الكونكريت بتبدأ الحكاية… 🤍"                     */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-stone-900 border border-sand-200/90 dark:border-stone-800 shadow-sm space-y-8">
          
          {/* Story Intro */}
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-brass-600 dark:text-brass-400 block">
              عن الشغل والقصة 🏺🤍
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight leading-snug">
              من بودرة الكونكريت بتبدأ الحكاية… 🤍
            </h2>
            <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
              وبإيدي بتتحول لقطع ديكور وتحف فنية مختلفة، كل قطعة فيها تفاصيل وشغل يدوي معمول بحب.
            </p>
          </div>

          {/* Genuine Types Cards Mentioned in Reference */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-sand-50 dark:bg-stone-800/60 border border-sand-200/60 dark:border-stone-700/60 text-center space-y-1">
              <span className="text-xl block">☕</span>
              <span className="text-xs font-bold text-stone-900 dark:text-white block">الكوسترات</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">بأشكال وتصميمات كتير</span>
            </div>

            <div className="p-4 rounded-2xl bg-sand-50 dark:bg-stone-800/60 border border-sand-200/60 dark:border-stone-700/60 text-center space-y-1">
              <span className="text-xl block">🍽️</span>
              <span className="text-xs font-bold text-stone-900 dark:text-white block">الصواني</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">ديكور وتقديم راقي</span>
            </div>

            <div className="p-4 rounded-2xl bg-sand-50 dark:bg-stone-800/60 border border-sand-200/60 dark:border-stone-700/60 text-center space-y-1">
              <span className="text-xl block">🪵</span>
              <span className="text-xs font-bold text-stone-900 dark:text-white block">المباخر</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">عصرية وأنيقة</span>
            </div>

            <div className="p-4 rounded-2xl bg-sand-50 dark:bg-stone-800/60 border border-sand-200/60 dark:border-stone-700/60 text-center space-y-1">
              <span className="text-xl block">🕯️</span>
              <span className="text-xs font-bold text-stone-900 dark:text-white block">حوامل الشموع</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">دفء وأجواء هادية</span>
            </div>

            <div className="p-4 rounded-2xl bg-sand-50 dark:bg-stone-800/60 border border-sand-200/60 dark:border-stone-700/60 text-center space-y-1">
              <span className="text-xl block">💍</span>
              <span className="text-xs font-bold text-stone-900 dark:text-white block">علب المجوهرات</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">لحفظ مقتنياتك</span>
            </div>

            <div className="p-4 rounded-2xl bg-sand-50 dark:bg-stone-800/60 border border-sand-200/60 dark:border-stone-700/60 text-center space-y-1">
              <span className="text-xl block">🏺</span>
              <span className="text-xs font-bold text-stone-900 dark:text-white block">التحف والفازات</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">قطع ديكور مميزة</span>
            </div>
          </div>

          {/* Story Statement & Tagline */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-3xl">
              من الكوسترات بأشكالها وتصميماتها المختلفة، والصواني، والمباخر، وحوامل الشموع، وعلب المجوهرات، وقطع الديكور والتحف… كل قطعة ليها شكلها وروحها الخاصة. ✨
            </p>
            <p className="text-sm sm:text-base font-bold text-stone-900 dark:text-white leading-relaxed max-w-3xl">
              أنا مش بعمل مجرد ديكورات؛ أنا بحوّل خامة بسيطة لـ قطعة فنية هاند ميد من صنع إيدي تستحق تكون جزء من بيتك. 🏺🤍
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-bold text-brass-700 dark:text-brass-400">
              <span className="px-3 py-1 rounded-full bg-sand-100 dark:bg-stone-800 border border-sand-200 dark:border-stone-700">كونكريت</span>
              <span>•</span>
              <span className="px-3 py-1 rounded-full bg-sand-100 dark:bg-stone-800 border border-sand-200 dark:border-stone-700">هاند ميد</span>
              <span>•</span>
              <span className="px-3 py-1 rounded-full bg-sand-100 dark:bg-stone-800 border border-sand-200 dark:border-stone-700">تحف وديكورات مصنوعة بحب ✨</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. WORKSHOPS & LIVE COURSES: مش بس تشتري... اتعلمي تعمليها بإيدك         */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full space-y-6">
        
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-xs font-bold text-brass-600 dark:text-brass-400 uppercase tracking-wider">
            ورش العمل التفاعلية
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            مش بس تشتري قطعة... ممكن تتعلمي تعمليها بإيدك 👩‍🎨✨
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            ورش تدريبية وتفاعلية أونلاين لتعليم خلط الكونكريت، صب القوالب، واستخراج الألوان الرخامية وتجهيز قطعك بنفسك.
          </p>
        </div>

        <div className="space-y-6">
          {sampleCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

      </section>

    </div>
  );
}

