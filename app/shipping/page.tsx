import React from 'react';
import { Metadata } from 'next';
import { Truck, ShieldCheck, Clock, PackageCheck, AlertCircle, Sparkles } from 'lucide-react';
import { getPublicSettings } from '@/lib/supabase';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'سياسة الشحن والتوصيل والعربون | Gogo Designs',
  description: 'تعرف على سياسة الشحن والتوصيل، مدة تجهيز القطع اليدوية، نظام العربون 50% وضمان وصول المنتجات سليمة إلى باب منزلك.',
  alternates: {
    canonical: '/shipping',
  },
};

export default async function ShippingPage() {
  const settings = await getPublicSettings();

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 py-6 sm:py-12 md:py-16 space-y-8 sm:space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-2.5 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-200/80 dark:bg-stone-800 text-brass-700 dark:text-brass-300 text-xs font-bold shadow-xs">
          <Truck className="w-3.5 h-3.5 text-brass-500" />
          <span>{settings.shipping_eyebrow || 'الشحن الآمن والعربون'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
          {settings.shipping_title || 'سياسة الشحن والتسليم وضمان الجودة'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          {settings.shipping_subtitle || 'نحرص على أن تصلك كل قطعة يدوية بأعلى معايير الأمان والتغليف الفاخر وبأسرع وقت ممكن.'}
        </p>
      </div>

      {/* Main Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-sand-200 dark:bg-stone-800 text-brass-700 dark:text-brass-400 flex items-center justify-center font-bold">
            <Clock className="w-4.5 h-4.5" />
          </div>
          <h3 className="text-sm font-extrabold text-stone-900 dark:text-white">مدة التجهيز والتنفيذ</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            {settings.shipping_prep_time || 'نظراً لأن القطع تُصب وتُعالج يدوياً، يستغرق التجهيز من 2 إلى 4 أيام عمل لضمان جفاف وتشطيب مثالي.'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-sand-200 dark:bg-stone-800 text-brass-700 dark:text-brass-400 flex items-center justify-center font-bold">
            <PackageCheck className="w-4.5 h-4.5" />
          </div>
          <h3 className="text-sm font-extrabold text-stone-900 dark:text-white">تغليف مصفح ضد الكسر</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            يتم تغليف كل قطعة بطبقات متعددة من البابلز والفوم المقوى داخل صناديق محكمة لتصلك سليمة تماماً.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-sand-200 dark:bg-stone-800 text-brass-700 dark:text-brass-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <h3 className="text-sm font-extrabold text-stone-900 dark:text-white">فحص الطلب عند الاستلام</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            يحق للعميل فحص وتفقد القطع والتأكد من سلامتها قبل سداد المبلغ المتبقي مع مندوب الشحن.
          </p>
        </div>
      </div>

      {/* Detailed Policies */}
      <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-sand-100/90 dark:bg-stone-850 border border-sand-300/80 dark:border-stone-700 space-y-6">
        
        <div className="space-y-2">
          <h2 className="text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brass-600 dark:text-brass-400" />
            <span>نظام عربون الـ {settings.deposit_percentage || 50}% لتأكيد الحجز</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {settings.shipping_instructions || `نظراً لأن جميع القطع يتم تنفيذها وتخصيص ألوانها وعباراتها خصيصاً لكل عميل، يُشترط تحويل عربون بنسبة ${settings.deposit_percentage || 50}% عبر محفظة فودافون كاش أو إنستاباي، ويتم سداد المتبقي مع مصاريف الشحن عند الاستلام.`}
          </p>
        </div>

        <div className="space-y-2 pt-4 border-t border-sand-200 dark:border-stone-700">
          <h2 className="text-base font-extrabold text-stone-900 dark:text-white">
            مدة التوصيل بالمحافظات
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {settings.shipping_coverage_details || 'القاهرة والجيزة والإسكندرية: 24-48 ساعة بعد انتهاء التجهيز | باقي المحافظات: 2-4 أيام عمل.'}
          </p>
        </div>

        <div className="space-y-2 pt-4 border-t border-sand-200 dark:border-stone-700">
          <h2 className="text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>ضمان الاستبدال في حالة التلف أثناء الشحن</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {settings.shipping_damage_guarantee || 'في حال وصول أي قطعة متضررة أو مكسورة بسبب شركة الشحن، نتحمل إعادة صبها وإرسالها لكِ مجاناً أو رد قيمة القطعة بالكامل فور إبلاغنا بصورة التلف أثناء وجود المندوب.'}
          </p>
        </div>

      </div>

    </div>
  );
}
