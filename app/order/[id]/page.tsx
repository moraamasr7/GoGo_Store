import React from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getPublicSettings } from '@/lib/supabase';
import OrderTrackingClient from './OrderTrackingClient';

export const revalidate = 0;

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

  return <OrderTrackingClient initialOrder={order} settings={settings} />;
}
