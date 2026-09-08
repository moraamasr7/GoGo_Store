import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, MessageCircle } from 'lucide-react';
import { getPublicSettings } from '@/lib/supabase';
import { generateWhatsAppInquiryUrl } from '@/lib/whatsapp';

export default async function Footer() {
  const settings = await getPublicSettings();
  const whatsappUrl = generateWhatsAppInquiryUrl(settings.whatsapp_number);

  return (
    <footer className="bg-stone-900 dark:bg-stone-950 text-stone-300 pt-16 pb-12 mt-20 border-t border-stone-800 dark:border-stone-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand & Handmade statement */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brass-500 flex items-center justify-center text-stone-950 font-black text-base shadow-sm">
                G
              </div>
              <h3 className="font-extrabold text-white text-lg tracking-wide">GOGO CONCRETE</h3>
            </div>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-4">
              متجر متخصص في صناعة الديكورات والقطع الحجرية اليدوية المعاصرة بخام الكونكريت الديكوري الناعم. قطع تُصب وتُعالج يدوياً بكل دقة لتضفي دفئاً وهدوءاً على منزلك ومكتبك.
            </p>
            <div className="flex items-center gap-2 text-xs text-brass-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>صناعة يدوية أصيلة 100% في مصر</span>
            </div>
          </div>

          {/* Quick Links & Policy */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">روابط سريعة</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-400">
              <li>
                <Link href="/products" className="hover:text-sand-100 dark:hover:text-brass-300 transition-colors">
                  تصفح كافة المنتجات
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
              <p className="font-bold text-sand-200 dark:text-brass-400">🏺 طبيعة المنتج اليدوي:</p>
              <p className="leading-relaxed text-stone-400 text-[11px]">
                كل قطعة تُصب يدوياً بقوالب مخصصة، لذلك قد تظهر فروق طفيفة طبيعية في تداخل الألوان أو المسام الحجرية الدقيقة، وهي سر تفرد كل قطعة.
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
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>تواصل معنا على واتساب</span>
            </a>

            <div className="mt-5 text-xs text-stone-400 space-y-2 bg-stone-800/60 dark:bg-stone-900 p-3.5 rounded-xl border border-stone-700/50">
              <div className="flex justify-between items-center">
                <span>فودافون كاش:</span>
                <span className="font-mono font-bold text-sand-200 dark:text-white" dir="ltr">{settings.vodafone_cash}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>إنستاباي:</span>
                <span className="font-mono font-bold text-sand-200 dark:text-white" dir="ltr">{settings.instapay}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} Gogo Concrete Store. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-1.5">
            <span>صُنع بشغف وحب للمنتج اليدوي في مصر</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>

      </div>
    </footer>
  );
}
