'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function TrackOrderSearchPage() {
  const router = useRouter();
  const [orderQuery, setOrderQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = orderQuery.trim().toUpperCase();
    if (!clean) {
      toast.error('يرجى كتابة رقم الطلب');
      return;
    }
    router.push(`/order/${clean}`);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 text-center">
      <div className="w-14 h-14 rounded-2xl bg-stone-900 text-sand-50 flex items-center justify-center mx-auto mb-6 shadow-sm">
        <Package className="w-7 h-7 text-brass-400" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">
        تتبع حالة طلبك
      </h1>
      <p className="text-xs sm:text-sm text-stone-600 mb-8 leading-relaxed">
        أدخل رقم الطلب الذي استلمته بعد إتمام الحجز لمعرفة مرحلة الصب والتجهيز والشحن.
      </p>

      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <input
            type="text"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            placeholder="مثال: GOGO-8F42A"
            className="w-full px-4 py-3.5 rounded-xl border border-stone-200 text-center font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white shadow-sm tracking-wider uppercase placeholder:normal-case placeholder:font-sans placeholder:text-stone-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-xl bg-stone-900 text-sand-50 font-bold text-sm flex items-center justify-center gap-2 hover:bg-stone-800 transition-all shadow-md active:scale-95"
        >
          <Search className="w-4 h-4 text-brass-400" />
          <span>بحث عن الطلب</span>
        </button>
      </form>

      <div className="mt-8 text-xs text-stone-400">
        فقدت رقم الطلب؟ تواصل معنا على واتساب برقم هاتفك المسجل وسنرسله لك فوراً.
      </div>
    </div>
  );
}
