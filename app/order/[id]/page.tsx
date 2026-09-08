import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, PackageCheck, Truck, Check, MessageCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice, getStatusLabel } from '@/lib/utils';
import { generateWhatsAppOrderUrl } from '@/lib/whatsapp';
import { getPublicSettings } from '@/lib/supabase';

interface OrderPageProps {
  params: {
    id: string;
  };
}

export default async function OrderTrackingPage({ params }: OrderPageProps) {
  const query = params.id;
  const settings = await getPublicSettings();

  // Call the secure tracking RPC get_order_tracking
  const { data: order, error } = await supabase.rpc('get_order_tracking', {
    p_query: query,
  });

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8 text-stone-500 dark:text-stone-400" />
        </div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">لم يتم العثور على الطلب</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-8">
          تأكد من كتابة رقم الطلب بشكل صحيح (مثال: GOGO-8F42A) أو تواصل معنا عبر واتساب للمساعدة.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/order/track"
            className="px-5 py-3 rounded-xl bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 text-xs font-bold hover:bg-stone-800"
          >
            البحث عن طلب آخر
          </Link>
          <Link
            href="/"
            className="px-5 py-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-stone-50 dark:hover:bg-stone-800"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'pending', label: 'تم استلام الطلب', desc: 'في انتظار تأكيد التحويل' },
    { key: 'confirmed', label: 'تم تأكيد العربون', desc: 'تم تثبيت الحجز والبدء' },
    { key: 'processing', label: 'قيد الصب والمعالجة', desc: 'تجهيز خلطة الكونكريت والجفاف' },
    { key: 'ready_for_shipping', label: 'جاهز للتسليم والشحن', desc: 'تم التغليف والتسليم لشركة الشحن' },
    { key: 'completed', label: 'تم التسليم', desc: 'وصلت القطع بحمد الله' },
  ];

  const statusOrder = ['pending', 'confirmed', 'processing', 'ready_for_shipping', 'completed'];
  const currentIndex = statusOrder.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  const whatsappUrl = generateWhatsAppOrderUrl(
    settings.whatsapp_number,
    order.order_number,
    order.customer_name,
    order.total_amount,
    order.deposit_amount,
    settings.currency
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-14">
      
      {/* Top Banner */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-200 dark:bg-stone-800 text-stone-800 dark:text-brass-400 text-xs font-mono font-bold mb-3 border border-sand-300 dark:border-stone-700">
          <span>رقم الطلب: #{order.order_number}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mb-2">
          شكراً لك، {order.customer_name}! 🏺✨
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
          تم تسجيل طلبك بنجاح، يمكنك متابعة مراحل التنفيذ والصب اليدوي من هذه الصفحة.
        </p>
      </div>

      {/* Progress Timeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm mb-8">
        <h2 className="text-sm font-black text-stone-900 dark:text-white mb-6">مراحل تنفيذ الطلب</h2>

        {isCancelled ? (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs text-center font-bold">
            تم إلغاء هذا الطلب. لأي استفسار يرجى التواصل مع إدارة المتجر.
          </div>
        ) : (
          <div className="relative">
            <div className="space-y-6">
              {steps.map((step, index) => {
                const isPassed = index <= currentIndex;
                const isCurrent = index === currentIndex;

                return (
                  <div key={step.key} className="flex items-start gap-4">
                    {/* Step Icon */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-sm ${
                        isCurrent
                          ? 'bg-brass-500 text-stone-950 font-bold ring-4 ring-brass-500/20'
                          : isPassed
                          ? 'bg-stone-900 dark:bg-stone-800 text-sand-50'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {isPassed ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-mono font-bold">{index + 1}</span>
                      )}
                    </div>

                    {/* Step Label */}
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            isCurrent
                              ? 'text-stone-950 dark:text-brass-400'
                              : isPassed
                              ? 'text-stone-800 dark:text-stone-200'
                              : 'text-stone-400 dark:text-stone-600'
                          }`}
                        >
                          {step.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brass-500/20 text-brass-700 dark:text-brass-300 font-bold border border-brass-500/30">
                            المرحلة الحالية
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Order Summary & Customer Details */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
        <h2 className="text-sm font-black text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-800 pb-3">
          تفاصيل الحساب والتوصيل
        </h2>

        {/* Financial Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700">
            <span className="text-[11px] text-stone-400 dark:text-stone-500 block mb-1">إجمالي الطلب</span>
            <span className="text-base font-black font-mono text-stone-900 dark:text-white">
              {formatPrice(order.total_amount)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-sand-100 dark:bg-stone-800/80 border border-sand-200 dark:border-stone-700">
            <span className="text-[11px] text-brass-700 dark:text-brass-400 font-bold block mb-1">العربون المسدد</span>
            <span className="text-base font-black font-mono text-brass-700 dark:text-brass-400">
              {formatPrice(order.deposit_amount)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700">
            <span className="text-[11px] text-stone-400 dark:text-stone-500 block mb-1">المتبقي عند الاستلام</span>
            <span className="text-base font-black font-mono text-stone-700 dark:text-stone-300">
              {formatPrice(order.remaining_amount)}
            </span>
          </div>
        </div>

        {/* Action Button: WhatsApp */}
        <div className="pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>تواصل مع الإدارة بشأن هذا الطلب عبر واتساب</span>
          </a>
        </div>
      </div>

    </div>
  );
}
