import React from 'react';
import { Metadata } from 'next';
import { MessageCircle, Phone, Instagram, MapPin, Clock, Send, Sparkles } from 'lucide-react';
import { getPublicSettings } from '@/lib/supabase';
import { generateWhatsAppInquiryUrl } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'تواصل معنا واستفسر عن طلبك | Gogo Designs',
  description: 'تواصل مع فريق Gogo Designs للاستفسار عن المنتجات، تنسيق الألوان، تنفيذ الطلبات الخاصة ونقش الأسماء عبر واتساب.',
  alternates: {
    canonical: '/contact',
  },
};

export default async function ContactPage() {
  const settings = await getPublicSettings();
  const whatsappUrl = generateWhatsAppInquiryUrl(settings.whatsapp_number);

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 py-6 sm:py-12 md:py-16 space-y-6 sm:space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-2.5 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-200/80 dark:bg-stone-800 text-brass-700 dark:text-brass-300 text-xs font-bold shadow-xs">
          <MessageCircle className="w-3.5 h-3.5 text-brass-500" />
          <span>{settings.contact_eyebrow || 'خدمة العملاء والطلبات الخاصة'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
          {settings.contact_title || 'يسعدنا تواصلك واستقبال استفساراتك 🤍'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          {settings.contact_subtitle || 'سواء كان لديكِ استفسار عن قطعة معينة، أو رغبة في تنسيق طقم بألوان مخصصة أو إضافة نقش إهداء بالاسم، نحن دائماً هنا لمساعدتك.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8 items-start">
        
        {/* Direct Contact Channels (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          
          {/* WhatsApp Primary Card */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/20 border-2 border-emerald-500/40 dark:border-emerald-500/50 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-stone-900 dark:text-white">محادثة واتساب المباشرة</h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">الرد الأسرع لتأكيد وتنسيق الطلبات ({settings.whatsapp_number})</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold">
                متاح الآن ✔
              </span>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              يمكنك مراسلتنا فوراً لإرسال صور طلبك، اختيار الألوان المناسبة، أو الاستفسار عن تفاصيل الشحن والعربون.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="primary" size="md" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm">
                بدء المحادثة على واتساب الآن
              </Button>
            </a>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-1.5">
              <div className="flex items-center gap-2 text-stone-900 dark:text-white font-bold text-xs">
                <Clock className="w-4 h-4 text-brass-600 dark:text-brass-400" />
                <span>أوقات العمل واستقبال الطلبات</span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
                {settings.contact_hours || 'يومياً من الساعة 10:00 صباحاً حتى 11:00 مساءً (الطلبات عبر الموقع متاحة 24/7).'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-1.5">
              <div className="flex items-center gap-2 text-stone-900 dark:text-white font-bold text-xs">
                <MapPin className="w-4 h-4 text-brass-600 dark:text-brass-400" />
                <span>نطاق الشحن والتوصيل</span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
                {settings.contact_coverage || 'شحن سريع ومغلف بعناية فائقة ضد الكسر لكافة محافظات جمهورية مصر العربية.'}
              </p>
            </div>
          </div>

        </div>

        {/* Custom Order Guidance Card (5 cols) */}
        <div className="md:col-span-5 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-sand-100/90 dark:bg-stone-850 border border-sand-300/80 dark:border-stone-700 space-y-3.5">
          <div className="flex items-center gap-2 text-stone-900 dark:text-white font-black text-sm">
            <Sparkles className="w-4 h-4 text-brass-600 dark:text-brass-400" />
            <span>كيف تطلبين تصميماً خاصاً؟</span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            إذا أردتِ طقماً أو ألواناً غير معروضة في الكتالوج:
          </p>
          <ol className="text-xs text-stone-600 dark:text-stone-300 space-y-2 list-decimal pr-4 leading-normal">
            <li>تواصلي معنا عبر واتساب بصورة أو فكرة القطعة.</li>
            <li>نحدد معكِ درجات الألوان والتفاصيل المطلوبة.</li>
            <li>نؤكد التكلفة وموعد التنفيذ (عادة 2-4 أيام عمل).</li>
            <li>يتم تحويل العربون ({settings.deposit_percentage || 50}%) والبدء الفوري في صب وتجهيز طلبك ✨</li>
          </ol>
        </div>

      </div>

    </div>
  );
}
