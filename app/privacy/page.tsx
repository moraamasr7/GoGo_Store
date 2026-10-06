import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck, Lock, Eye } from 'lucide-react';
import { getPublicSettings } from '@/lib/supabase';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'سياسة الخصوصية وأمان البيانات | Gogo Designs',
  description: 'تعرف على سياسة الخصوصية في متجر Gogo Designs وكيفية حماية بياناتك الشخصية وبيانات التوصيل والتواصل بأعلى درجات السرية.',
  alternates: {
    canonical: '/privacy',
  },
};

export default async function PrivacyPage() {
  const settings = await getPublicSettings();

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 py-6 sm:py-12 md:py-16 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2.5 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-200/80 dark:bg-stone-800 text-brass-700 dark:text-brass-300 text-xs font-bold shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-brass-500" />
          <span>خصوصية وأمان بياناتك</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
          {settings.privacy_title || 'سياسة الخصوصية'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
          {settings.privacy_subtitle || 'نلتزم بحماية خصوصيتك وضمان سرية كافة البيانات التي تشاركينها معنا أثناء إتمام طلبك.'}
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-6 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-brass-600 dark:text-brass-400" />
            <span>1. البيانات التي نجمعها</span>
          </h2>
          <p>
            {settings.privacy_collected_data || 'نجمع فقط البيانات الأساسية اللازمة لتجهيز وشحن طلبك، وتشمل: الاسم، رقم الهاتف للتواصل عبر واتساب، عنوان الشحن بالتفصيل، وأي ملاحظات خاصة بتنسيق الألوان أو نقش الأسماء.'}
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-stone-100 dark:border-stone-800">
          <h2 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-brass-600 dark:text-brass-400" />
            <span>2. كيف نستخدم بياناتك</span>
          </h2>
          <p>
            {settings.privacy_usage || 'تُستخدم بياناتك حصرياً لتنفيذ وتجهيز طلبك، وتزويد مندوب شركة الشحن بالعنوان ورقم الهاتف للتسليم، وإرسال تحديثات تتبع الطلب وتأكيد استلام العربون عبر واتساب.'}
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-stone-100 dark:border-stone-800">
          <h2 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brass-600 dark:text-brass-400" />
            <span>3. عدم مشاركة البيانات</span>
          </h2>
          <p>
            {settings.privacy_third_party || 'نتعهد بعدم بيع أو تأجير أو مشاركة أي من بياناتك الشخصية مع أي أطراف ثالثة لأغراض دعائية أو إعلانية. بياناتك تبقى في سرية تامة.'}
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-stone-100 dark:border-stone-800">
          <h2 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-brass-600 dark:text-brass-400" />
            <span>4. صور إيصالات التحويل</span>
          </h2>
          <p>
            {settings.privacy_receipts_security || 'يتم تخزين صور إيصالات التحويل المرفوعة عبر خوادم آمنة ومشفرة، وتُستخدم فقط من قِبل إدارة المتجر لمطابقة مبالغ العربون وتأكيد بدء الصب والتنفيذ.'}
          </p>
        </section>

      </div>

    </div>
  );
}
