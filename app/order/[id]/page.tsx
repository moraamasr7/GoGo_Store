import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, PackageCheck, Truck, Check, MessageCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice, getStatusLabel } from '@/lib/utils';
import { generateWhatsAppOrderUrl } from '@/lib/whatsapp';
import { getPublicSettings } from '@/lib/supabase';

interface OrderPageProps {
  params: {
    id: string; // Order Number or UUID
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
        <div className="w-16 h-16 rounded-2xl bg-stone-200 text-stone-700 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8 text-stone-500" />
        </div>
        <h1 className="text-2xl font-bold text-stone-900 mb-2">لم يتم العثور على الطلب</h1>
        <p className="text-sm text-stone-500 mb-8">
          تأكد من كتابة رقم الطلب بشكل صحيح (مثال: GOGO-8F42A) أو تواصل معنا عبر واتساب للمساعدة.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/order/track"
            className="px-5 py-3 rounded-xl bg-stone-900 text-sand-50 text-xs font-semibold hover:bg-stone-800"
          >
            البحث عن طلب آخر
          </Link>
          <Link
            href="/"
            className="px-5 py-3 rounded-xl bg-white border border-stone-200 text-stone-800 text-xs font-semibold hover:bg-stone-50"
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-200 text-stone-800 text-xs font-mono font-bold mb-3">
          <span>رقم الطلب: #{order.order_number}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">
          شكراً لك، {order.customer_name}! 🏺✨
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          تم تسجيل طلبك بنجاح، يمكنك متابعة مراحل التنفيذ والصب اليدوي من هذه الصفحة.
        </p>
      </div>

      {/* Progress Timeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm mb-8">
        <h2 className="text-sm font-bold text-stone-900 mb-6">مراحل تنفيذ الطلب</h2>

        {isCancelled ? (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center font-bold">
            تم إلغاء هذا الطلب. لأي استفسار يرجى التواصل مع إدارة المتجر.
          </div>
        ) : (
          <div className="relative">
            <div className="space-y-6">
              {steps.map((step, index) => {
                const isPassed = currentIndex >= index;
                const isCurrent = currentIndex === index;

                return (
                  <div key={step.key} className="flex items-start gap-4">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors z-10 ${
                          isPassed
                            ? 'bg-stone-900 text-sand-50'
                            : 'bg-stone-100 text-stone-400 border border-stone-200'
                        }`}
                      >
                        {isPassed ? <Check className="w-4 h-4 text-brass-400" /> : index + 1}
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`w-0.5 h-10 -mb-2 ${
                            currentIndex > index ? 'bg-stone-900' : 'bg-stone-200'
                          }`}
                        />
                      )}
                    </div>

                    <div className="pt-1">
                      <p
                        className={`text-sm font-bold ${
                          isCurrent
                            ? 'text-stone-950'
                            : isPassed
                            ? 'text-stone-800'
                            : 'text-stone-400'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Financial Summary & Items */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm mb-8 space-y-4">
        <h2 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100">
          تفاصيل القطع المطلوبة
        </h2>

        <div className="space-y-2.5 divide-y divide-stone-100">
          {Array.isArray(order.items) && order.items.map((it: any, i: number) => (
            <div key={i} className="pt-2 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-stone-900">{it.product_name}</span>
                {it.color && <span className="text-stone-500 mr-2 font-normal">({it.color})</span>}
              </div>
              <span className="font-mono text-stone-700 bg-sand-100 px-2 py-0.5 rounded-md">
                الكمية: {it.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-stone-100 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-3 rounded-2xl bg-sand-50 border border-stone-200">
            <span className="text-stone-500 block text-[10px] mb-0.5">الإجمالي</span>
            <span className="font-mono font-bold text-stone-900">{formatPrice(order.total_amount)}</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            <span className="block text-[10px] mb-0.5 font-medium">العربون</span>
            <span className="font-mono font-bold">{formatPrice(order.deposit_amount)}</span>
          </div>
          <div className="p-3 rounded-2xl bg-sand-50 border border-stone-200">
            <span className="text-stone-500 block text-[10px] mb-0.5">المتبقي للتسليم</span>
            <span className="font-mono font-bold text-stone-900">{formatPrice(order.remaining_amount)}</span>
          </div>
        </div>
      </div>

      {/* WhatsApp Action Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
        >
          <MessageCircle className="w-4 h-4" />
          <span>تواصل مع المتجر عبر واتساب لتأكيد الاستلام</span>
        </a>

        <Link
          href="/products"
          className="py-3.5 px-6 rounded-xl bg-white border border-stone-200 text-stone-800 text-xs font-semibold hover:bg-stone-50 flex items-center justify-center gap-1.5 transition-colors text-center"
        >
          <span>تصفح المزيد من القطع</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
