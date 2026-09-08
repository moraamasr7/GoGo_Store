import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Sparkles, Gift, Heart, Star, Compass, Layers, ShieldCheck } from 'lucide-react';
import { getActiveProducts, getActiveOffers } from '@/lib/supabase';
import ProductCard from '@/components/products/ProductCard';
import { CourseCard } from '@/components/courses/CourseCard';
import { sampleCourses } from '@/lib/coursesData';
import { Button } from '@/components/ui/Button';

export const revalidate = 60;

export default async function HomePage() {
  const [products, offers] = await Promise.all([
    getActiveProducts(),
    getActiveOffers(),
  ]);

  const activeOffer = offers.length > 0 ? offers[0] : null;
  const featuredProducts = products.slice(0, 6);

  const categories = [
    { key: 'all', label: 'كافة المعروضات', href: '/products' },
    { key: 'trays', label: 'صواني تقديم رخامية', href: '/products?category=trays' },
    { key: 'coasters', label: 'قواعد أكواب (Coasters)', href: '/products?category=coasters' },
    { key: 'planters', label: 'أحواض نباتات ميني', href: '/products?category=planters' },
    { key: 'candle_holders', label: 'شمعدانات ومباخر عصرية', href: '/products?category=candle_holders' },
    { key: 'decor', label: 'فازات وتحف ديكورية', href: '/products?category=decor' },
  ];

  return (
    <div className="flex flex-col gap-20 md:gap-32 pb-16">
      
      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO SECTION: Warm, Egyptian Craft, Gallery Entrance         */}
      {/* ========================================================================= */}
      <section className="relative pt-6 sm:pt-12 md:pt-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Story & Typography Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-right">
              
              {/* Subtle Boutique Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sand-200/80 dark:bg-stone-800/80 border border-sand-300/60 dark:border-stone-700/60 text-stone-800 dark:text-brass-300 text-xs font-bold mb-6 backdrop-blur-md shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-brass-500" />
                <span>براند مصري معاصر للتحف والقطع الكونكريتية الفاخرة</span>
              </div>

              {/* Bold Expressive Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 dark:text-white tracking-tight leading-[1.18] mb-6">
                قطع مصنوعة بحب... <br />
                <span className="text-stone-500 dark:text-stone-400 font-light">تغير شكل مساحتك وتعيش.</span>
              </h1>

              {/* Human Warm Story Copy */}
              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl mb-8 font-normal">
                كل قطعة تُخلط وتُصب وتعالج يدويًا بمسامية ناعمة وعزل حراري ومائي، لتكون تحفة فنية تستحق الاقتناء وتضفي دفئاً خاصاً على منزلك ومكتبك.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <Link href="/products" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto shadow-md"
                    rightIcon={<ArrowLeft className="w-4 h-4 text-brass-400 dark:text-stone-950" />}
                  >
                    تصفح المعرض واقتني قطعتك
                  </Button>
                </Link>

                <Link href="/order/track" className="w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    تتبع حالة طلبك بالرقم
                  </Button>
                </Link>
              </div>

              {/* Social Proof Quote */}
              <div className="mt-8 pt-6 border-t border-stone-200/70 dark:border-stone-800/80 flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-stone-900 bg-sand-300 flex items-center justify-center font-bold text-[10px] text-stone-800">م</div>
                  <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-stone-900 bg-brass-400 flex items-center justify-center font-bold text-[10px] text-stone-950">س</div>
                  <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-stone-900 bg-stone-700 flex items-center justify-center font-bold text-[10px] text-white">ن</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex text-brass-500">
                    <Star className="w-3.5 h-3.5 fill-brass-500" />
                    <Star className="w-3.5 h-3.5 fill-brass-500" />
                    <Star className="w-3.5 h-3.5 fill-brass-500" />
                    <Star className="w-3.5 h-3.5 fill-brass-500" />
                    <Star className="w-3.5 h-3.5 fill-brass-500" />
                  </div>
                  <span className="font-bold text-stone-800 dark:text-stone-200">4.9 / 5</span>
                  <span>(أكثر من 300+ عميلة سعيدة باقتنائها)</span>
                </div>
              </div>

            </div>

            {/* Visual Column: Hero Composition with Floating Art Depth */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-2xl shadow-stone-900/10 dark:shadow-stone-950/60 border-4 border-white dark:border-stone-800 bg-sand-200 dark:bg-stone-800">
                <Image
                  src="https://images.unsplash.com/photo-1594913785162-e678a0c23ee9?auto=format&fit=crop&w=1000&q=80"
                  alt="Gogo Concrete Handmade Luxury Decor"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center transition-transform duration-1000 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
                
                {/* Floating Micro-Card */}
                <div className="absolute bottom-5 right-5 left-5 p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-white/50 dark:border-stone-700 text-stone-900 dark:text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-brass-600 dark:text-brass-400">خامة استثنائية معالجة</p>
                      <p className="text-xs sm:text-sm font-black text-stone-900 dark:text-white mt-0.5">ملمس ناعم عازل للبقع والرطوبة</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-sand-100 dark:bg-stone-800 font-mono font-bold text-stone-700 dark:text-sand-200">
                      100% يدوي
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SMART GIFT OFFER BANNER ("هديتك علينا 🤍")                              */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="relative rounded-3xl bg-gradient-to-br from-sand-100 via-white to-sand-200/70 dark:from-stone-900 dark:via-stone-900/90 dark:to-stone-950 p-7 sm:p-10 overflow-hidden shadow-sm border border-sand-300/80 dark:border-stone-800">
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brass-500/15 text-brass-700 dark:text-brass-400 text-xs font-black">
                <Gift className="w-3.5 h-3.5" />
                <span>عرض خاص: هديتك علينا 🤍</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                اطلبي بـ 2,500 جنيه أو أكثر... واختاري 3 قطع فاخرة هدية من اختيارك!
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                يسعدنا تدليل مساحتك أو تجهيز هدايا لأحبابك. يظهر شريط الهدية تلقائياً في السلة لمتابعة تقدمك بسهولة.
              </p>
            </div>

            <div className="shrink-0">
              <Link href="/products">
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowLeft className="w-4 h-4 text-brass-400 dark:text-stone-950" />}
                >
                  اختاري قطعك الآن
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ARTISTIC BOUTIQUE GALLERY (Products Grid)                              */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-brass-600 dark:text-brass-400 mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>معرض القطع الفنية الحجرية</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
              أحدث القطع المصبوبة بعناية
            </h2>
          </div>

          <Link href="/products" className="hidden sm:inline-flex">
            <Button variant="outline" size="sm" rightIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
              مشاهدة المعرض كاملاً
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

        {/* Products 3D Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center sm:hidden pt-4">
          <Link href="/products" className="w-full inline-block">
            <Button variant="primary" size="md" className="w-full">
              عرض جميع القطع في المعرض
            </Button>
          </Link>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4. WORKSHOPS & COURSES SECTION: "مش بس تشتري... اتعلمي تعمليها بإيدك"     */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full space-y-8">
        
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-brass-600 dark:text-brass-400 uppercase tracking-wider">
            أكاديمية وورش Gogo التعليمية
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
            مش بس تشتري قطعة... ممكن تتعلمي تعمليها بإيدك 👩‍🎨✨
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            ورش تدريبية وتفاعلية Live مع مؤسسة البراند لتعليم أسرار الصب، خلط الألوان الرخامية، والتسويق لمنتجك الحجري.
          </p>
        </div>

        <div className="space-y-6">
          {sampleCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 5. BRAND ASSURANCES & CRAFT ETHOS                                         */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-sand-100/70 dark:bg-stone-900 border border-sand-200/80 dark:border-stone-800">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-brass-400 shadow-sm">
                <Sparkles className="w-6 h-6 text-brass-500" />
              </div>
              <h3 className="font-extrabold text-base text-stone-900 dark:text-white">تفرد يدوي أصيل 100%</h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed max-w-xs">
                لا توجد قطعتان متطابقتان تماماً؛ كل صينية أو حوض يحمل تموجات لونية فريدة تعبر عن شخصيتك.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-brass-400 shadow-sm">
                <Layers className="w-6 h-6 text-brass-500" />
              </div>
              <h3 className="font-extrabold text-base text-stone-900 dark:text-white">حماية أسطح منزلك</h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed max-w-xs">
                جميع القطع مزودة بقواعد سفلية ناعمة تحمي أسطح الرخام والخشب من أي خدوش.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-brass-400 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-brass-500" />
              </div>
              <h3 className="font-extrabold text-base text-stone-900 dark:text-white">عربون 50% مطمئن وعادل</h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed max-w-xs">
                تدفعين فقط نصف القيمة لتثبيت الصب والبدء، والمتبقي يُسدد عند استلام وتفقد القطع مع مندوب الشحن.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
