import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, MessageCircle, CheckCircle2 } from 'lucide-react';
import { getPublicSettings } from '@/lib/supabase';
import { generateWhatsAppInquiryUrl } from '@/lib/whatsapp';

import Image from 'next/image';

interface FooterProps {
  logoUrl?: string;
  storeName?: string;
}

export default async function Footer({ logoUrl, storeName }: FooterProps = {}) {
  const settings = await getPublicSettings();
  const whatsappUrl = generateWhatsAppInquiryUrl(settings.whatsapp_number);
  const activeLogo = logoUrl || settings.header_logo_url;
  const activeStoreName = storeName || settings.store_name;

  return (
    <footer className="bg-stone-900 dark:bg-stone-950 text-stone-300 pt-16 pb-12 mt-20 border-t border-stone-800 dark:border-stone-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand & Handmade statement */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              {activeLogo ? (
                <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm border border-stone-700">
                  <Image
                    src={activeLogo}
                    alt={activeStoreName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-brass-500 flex items-center justify-center text-stone-950 font-black text-base shadow-sm">
                  G
                </div>
              )}
              <h3 className="font-extrabold text-white text-lg tracking-wide">{activeStoreName}</h3>
            </div>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-4">
              شغل كونكريت وديكور يدوي من البيت بأشكال كتير، تصميمات مودرن وبسيطة وتشطيب ناعم يشبه السيراميك، معمول بتركيز ودقة وبأعلي جودة لكل بيت ومساحة.
            </p>
            <div className="flex items-center gap-2 text-xs text-brass-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>كونكريت | هاند ميد | تحف وديكورات بأعلي جودة وبأحتراف ✨</span>
            </div>
          </div>

          {/* Quick Links & Policy */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">روابط سريعة</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-400">
              <li>
                <Link href="/products" className="hover:text-sand-100 dark:hover:text-brass-300 transition-colors">
                  تصفح كافة المعروضات
                </Link>
              </li>
              <li>
                <Link href="/order/track" className="hover:text-sand-100 dark:hover:text-brass-300 transition-colors">
                  تتبع حالة طلبك بالرقم
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-sand-100 dark:hover:text-brass-300 transition-colors">
                  سلة المشتريات والعربون
                </Link>
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-2xl bg-stone-800/80 dark:bg-stone-900 border border-stone-700/60 text-xs text-stone-300 space-y-1">
              <p className="font-bold text-sand-200 dark:text-brass-400">🏺 طبيعة الشغل اليدوي:</p>
              <p className="leading-relaxed text-stone-400 text-[11px]">
                الأشكال والألوان المعروضة حالياً متاحة للتنفيذ بأمر الله، ومتاح تنفيذ أي ألوان أو أشكال خاصة عبر مراسلتنا على الخاص 🌸
              </p>
            </div>
          </div>

          {/* Customer Support & Payment */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">الدعم وسداد العربون</h4>
            <p className="text-xs sm:text-sm text-stone-400 mb-4 leading-relaxed">
              يسعدنا تلقي استفساراتكم والطلبات الخاصة بالألوان والمناسبات عبر واتساب مباشرة.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm transition-all shadow-md active:scale-95 border border-emerald-400/40"
            >
              <MessageCircle className="w-4 h-4" />
              <span>تواصل معنا على واتساب (متاح الآن)</span>
            </a>

            <div className="mt-5 text-xs text-stone-300 space-y-2.5 bg-stone-900/90 p-4 rounded-2xl border border-emerald-500/30 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <span className="text-[11px] font-bold text-stone-400">طرق سداد العربون المعتمدة:</span>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>نشط وموثوق</span>
                </span>
              </div>
              <div className="flex justify-between items-center bg-stone-950/60 p-2 rounded-xl border border-stone-800">
                <span className="text-stone-400 font-semibold">فودافون كاش:</span>
                <span className="font-mono font-black text-emerald-400 text-sm tracking-wider" dir="ltr">{settings.vodafone_cash}</span>
              </div>
              <div className="flex justify-between items-center bg-stone-950/60 p-2 rounded-xl border border-stone-800">
                <span className="text-stone-400 font-semibold">إنستاباي:</span>
                <span className="font-mono font-black text-emerald-400 text-xs tracking-wide" dir="ltr">{settings.instapay}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} Gogo Concrete Store. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-1.5 font-medium text-stone-400">
            <span>صنع من قبل / AmrTec✔</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
