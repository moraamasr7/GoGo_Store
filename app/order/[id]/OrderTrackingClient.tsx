'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Check, MessageCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import { generateWhatsAppOrderUrl } from '@/lib/whatsapp';
import { StorePublicSettings, OrderStatus } from '@/types/database';
import toast from 'react-hot-toast';

interface OrderTrackingClientProps {
  initialOrder: any;
  settings: StorePublicSettings;
}

export default function OrderTrackingClient({ initialOrder, settings }: OrderTrackingClientProps) {
  const [order, setOrder] = useState<any>(initialOrder);
  const [isLiveConnected, setIsLiveConnected] = useState(true);

  // Subscribe to real-time changes for this specific order
  useEffect(() => {
    if (!order?.id) return;

    const channel = supabase
      .channel(`realtime_order_${order.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${order.id}`,
        },
        (payload) => {
          const updated = payload.new;
          if (updated && updated.status !== order.status) {
            setOrder((prev: any) => ({
              ...prev,
              status: updated.status,
              updated_at: updated.updated_at,
            }));

            // Play notification sound
            try {
              const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
              const ctx = new AudioContextClass();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(587.33, ctx.currentTime);
              osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
              gain.gain.setValueAtTime(0.15, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + 0.5);
            } catch {}

            toast.success('تم تحديث حالة طلبك الآن في المتجر! 🏺✨', {
              duration: 6000,
              icon: '🔔',
            });
          }
        }
      )
      .subscribe((status) => {
        setIsLiveConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order?.id, order?.status]);

  const steps = [
    { key: 'pending', label: 'تم استلام الطلب', desc: 'في انتظار تأكيد التحويل' },
    { key: 'confirmed', label: 'تم تأكيد العربون', desc: 'تم تثبيت الحجز والبدء' },
    { key: 'processing', label: 'قيد الصب والمعالجة', desc: 'تجهيز خلطة الكونكريت والجفاف' },
    { key: 'ready_for_shipping', label: 'جاهز للتسليم والشحن', desc: 'تم التغليف والتسليم لشركة الشحن' },
    { key: 'completed', label: 'تم التسليم', desc: 'وصلت القطع بحمد الله' },
  ];

  const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'processing', 'ready_for_shipping', 'completed'];
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
      
      {/* Top Banner with Realtime Status Badge */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-200 dark:bg-stone-800 text-stone-800 dark:text-brass-400 text-xs font-mono font-bold border border-sand-300 dark:border-stone-700">
            <span>رقم الطلب: #{order.order_number}</span>
          </div>

          {/* Realtime Live Indicator */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 text-[11px] font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>تحديث مباشر</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mb-2">
          شكراً لك، {order.customer_name}! 🏺✨
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
          تم تسجيل طلبك بنجاح، وتتحدث هذه الصفحة تلقائياً مع كل مرحلة ينفذها صاحب المتجر.
        </p>
      </div>

      {/* Progress Timeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm mb-8 transition-all">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-stone-100 dark:border-stone-800">
          <h2 className="text-sm font-black text-stone-900 dark:text-white">مراحل تنفيذ الطلب</h2>
          <span className="text-xs text-stone-400 dark:text-stone-500 font-mono">تتحدث فورياً دون الحاجة لتحديث الصفحة</span>
        </div>

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
                  <div key={step.key} className="flex items-start gap-4 transition-all">
                    {/* Step Icon */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-sm ${
                        isCurrent
                          ? 'bg-brass-500 text-stone-950 font-bold ring-4 ring-brass-500/20 scale-105'
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
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-brass-500/20 text-brass-700 dark:text-brass-300 font-bold border border-brass-500/30 animate-pulse">
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
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>تواصل مع الإدارة بشأن هذا الطلب عبر واتساب</span>
          </a>
        </div>
      </div>

    </div>
  );
}
