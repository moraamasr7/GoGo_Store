import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Heart, CheckCircle2, ShieldCheck, ArrowLeft, Palette, Award } from 'lucide-react';
import { getPublicSettings } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'قصتنا وعالمنا الحرفي | Gogo Designs',
  description: 'تعرف على قصة Gogo Designs، علامة تجارية مصرية متخصصة في ابتكار تحف وديكورات منزلية مصبوبة يدوياً بتركيز ودقة وتشطيب ناعم وألوان هادئة.',
  alternates: {
    canonical: '/about',
  },
};

export default async function AboutPage() {
  const settings = await getPublicSettings();

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 py-6 sm:py-12 md:py-16 space-y-8 sm:space-y-12">
      
      {/* Hero / Brand Story Header */}
      <div className="text-center space-y-3 sm:space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-200/80 dark:bg-stone-800 text-brass-700 dark:text-brass-300 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-brass-500" />
          <span>{settings.about_eyebrow || 'حرفية يدوية مصرية معاصرة'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">
          {settings.about_title ? (
            settings.about_title.includes('/') ? (
              <>
                {settings.about_title.split('/')[0].trim()} <br className="hidden sm:inline" />
                <span className="text-brass-600 dark:text-brass-400">{settings.about_title.split('/')[1].trim()}</span>
              </>
            ) : (
              settings.about_title
            )
          ) : (
            <>
              شغف بالجمال، وصناعة يدوية <br className="hidden sm:inline" />
              <span className="text-brass-600 dark:text-brass-400">معمولة بتركيز ودقة 🤍</span>
            </>
          )}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          {settings.about_story || 'في Gogo Concrete Designs، نؤمن بأن تفاصيل المنزل الصغيرة هي التي تصنع روحه ودفئه. بدأنا من فكرة بسيطة: تحويل الخامات الديكورية إلى قطع فنية ناعمة، تدوم طويلاً وتضفي لمسة من الرقي على كل ركن.'}
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-sand-200 dark:bg-stone-800 text-brass-700 dark:text-brass-400 flex items-center justify-center font-bold">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white">صنع يدوي خالص</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            كل قطعة تُصب وتُعالج وتُصنفر يدوياً حبة بحبة، لنضمن خلوها من العيوب وحصولك على ملمس ناعم يشبه السيراميك الراقي.
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-sand-200 dark:bg-stone-800 text-brass-700 dark:text-brass-400 flex items-center justify-center font-bold">
            <Palette className="w-5 h-5" />
          </div>
          <h3 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white">ألوان هادئة وتخصيص</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            نعتمد درجات ألوان ترابية ومودرن تناسب مختلف ديكورات البيوت، مع إمكانية نقش الأسماء والعبارات الخاصة بالطلب.
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-sand-200 dark:bg-stone-800 text-brass-700 dark:text-brass-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white">جودة وأمانة التنفيذ</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            نستخدم أفضل المواد العازلة للرطوبة ونوفر تغليفاً آمناً ضد الكسر للشحن إلى كافة محافظات جمهورية مصر العربية.
          </p>
        </div>
      </div>

      {/* Craftsmanship Details */}
      <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-sand-100/90 dark:bg-stone-850 border border-sand-300/80 dark:border-stone-700 space-y-4">
        <h2 className="text-base sm:text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
          <span>{settings.about_craft_title || 'فلسفة التصميم والتشطيب'}</span>
        </h2>
        <div className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 space-y-3 leading-relaxed">
          <p>
            {settings.about_craft_text || 'تتميز منتجاتنا بالتوازن بين البساطة والعملية؛ سواء كانت صينية تقديم ديكورية، مبخرة عصرية، حامل شموع دافئ، أو طقم هدايا متناسق. كل قطعة تمر بعدة مراحل من الصب المتقن والصنفرة الناعمة وطبقات الحماية.'}
          </p>
          <ul className="space-y-2 pr-4 text-xs list-disc text-stone-700 dark:text-stone-300 font-medium">
            <li>الخلط والصب الدقيق بنسب محكمة لضمان المتانة العالية.</li>
            <li>المعالجة البطيئة وصنفرة الحواف بدقة للحصول على ملمس فائق النعومة.</li>
            <li>تطبيق طبقة عزل وحماية غير لامعة لحفظ الألوان ومقاومة البقع.</li>
            <li>إضافة لبادات حماية ناعمة أسفل القطع لحماية أسطح طاولاتك من الخدش.</li>
          </ul>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-sand-200 dark:border-stone-700">
          <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
            جاهزة لاختيار قطعتك الأولى أو تكوين طقمك الخاص؟
          </span>
          <Link href="/products">
            <Button variant="primary" size="sm" rightIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
              تصفحي تشكيلة المنتجات
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}
