import React from 'react';
import Link from 'next/link';
import { Sparkles, MessageCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
    <footer className="bg-stone-900 dark:bg-stone-950 text-stone-300 pt-12 sm:pt-16 pb-10 mt-16 sm:mt-20 border-t border-stone-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pb-10 sm:pb-12 border-b border-stone-800/90">
          
          {/* Brand Column (4 cols) */}
          <div className="md:col-span-4 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2.5">
              {activeLogo ? (
                <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-xs border border-stone-700">
                  <Image
                    src={activeLogo}
                    alt={activeStoreName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-brass-500 flex items-center justify-center text-stone-950 font-black text-base shadow-xs">
                  G
                </div>
              )}
              <h3 className="font-extrabold text-white text-base sm:text-lg tracking-wide">{activeStoreName}</h3>
            </div>
            
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              {settings.store_subtitle || 'براند مصري لديكورات وتحف منزلية مصبوبة يدوياً بتشطيب ناعم وألوان هادئة تضيف لمسة فنية دافئة وأنيقة لكل زاوية في منزلك.'}
            </p>

            <div className="flex items-center gap-2 text-xs text-brass-400 font-bold pt-1">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>صناعة يدوية فاخرة • تشطيب ناعم وأنيق ✨</span>
            </div>
          </div>

          {/* Navigation Links Column (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-white text-xs sm:text-sm tracking-wide">روابط وتصنيفات</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/products" className="hover:text-white dark:hover:text-brass-400 transition-colors block py-0.5">
                  جميع القطع والمعروضات
                </Link>
              </li>
              <li>
                <Link href="/products?category=gift_sets" className="hover:text-white dark:hover:text-brass-400 transition-colors block py-0.5">
                  أطقم الهدايا الفاخرة
                </Link>
              </li>
              <li>
                <Link href="/products?category=ready_sets" className="hover:text-white dark:hover:text-brass-400 transition-colors block py-0.5">
                  أطقم ديكورات جاهزة
                </Link>
              </li>
              <li>
                <Link href="/set-builder" className="hover:text-white dark:hover:text-brass-400 transition-colors block py-0.5">
                  كوّني طقمك بنفسك ✨
                </Link>
              </li>
              <li>
                <Link href="/products?filter=unfinished" className="hover:text-white dark:hover:text-brass-400 transition-colors block py-0.5">
                  قطع بدون فنش (للتلوين)
                </Link>
              </li>
              <li>
                <Link href="/order/track" className="hover:text-white dark:hover:text-brass-400 transition-colors block py-0.5">
                  تتبع حالة طلبك بالرقم
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust Pages Column (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bold text-white text-xs sm:text-sm tracking-wide">عن المتجر</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/about" className="hover:text-white dark:hover:text-brass-400 transition-colors block py-0.5">
                  قصتنا والصناعة
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white dark:hover:text-brass-400 transition-colors block py-0.5">
                  تواصل معنا
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white dark:hover:text-brass-400 transition-colors block py-0.5">
                  الشحن والعربون
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white dark:hover:text-brass-400 transition-colors block py-0.5">
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white dark:hover:text-brass-400 transition-colors block py-0.5">
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support & Payment Verification Column (3 cols) */}
          <div className="md:col-span-3 space-y-3 sm:space-y-4">
            <h4 className="font-bold text-white text-xs sm:text-sm tracking-wide">سداد العربون والتواصل</h4>
            
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-sm active:scale-95 border border-emerald-500/40"
            >
              <MessageCircle className="w-4 h-4" />
              <span>محادثة الإدارة عبر واتساب</span>
            </a>

            <div className="text-xs text-stone-300 space-y-2 bg-stone-950/70 p-3 rounded-2xl border border-stone-800">
              <div className="flex items-center justify-between pb-1.5 border-b border-stone-800/80">
                <span className="text-[10px] font-bold text-stone-400">حسابات التحويل المعتمدة:</span>
                <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  <span>معتمد ورسمي</span>
                </span>
              </div>
              <div className="flex justify-between items-center bg-stone-900/80 p-1.5 rounded-xl border border-stone-800">
                <span className="text-stone-400 text-[10px]">فودافون كاش:</span>
                <span className="font-mono font-bold text-emerald-400 text-xs tracking-wider" dir="ltr">{settings.vodafone_cash}</span>
              </div>
              <div className="flex justify-between items-center bg-stone-900/80 p-1.5 rounded-xl border border-stone-800">
                <span className="text-stone-400 text-[10px]">إنستاباي:</span>
                <span className="font-mono font-bold text-emerald-400 text-xs tracking-wide truncate max-w-[130px]" dir="ltr">{settings.instapay}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
          <p>© {new Date().getFullYear()} {activeStoreName}. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-1 font-medium text-stone-400 text-[11px]">
            <span>صناعة يدوية بمحبة وعناية</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
