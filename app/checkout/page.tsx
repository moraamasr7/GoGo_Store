'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Upload, CheckCircle2, ShieldCheck, AlertCircle, Copy, Check } from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';
import { formatPrice } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { StorePublicSettings } from '@/types/database';
import { Button } from '@/components/ui/Button';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, depositAmount, remainingAmount, depositPercentage, clearCart, isLoading } = useCart();

  const [settings, setSettings] = useState<StorePublicSettings | null>(null);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load public settings for payment numbers
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    }
    loadSettings();
  }, []);

  // Handle image select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('يرجى اختيار صورة بصيغة JPG أو PNG أو WEBP');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة يجب ألا يتجاوز 5 ميجابايت');
      return;
    }

    setScreenshotFile(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('تم النسخ بنجاح');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('السلة فارغة!');
      return;
    }

    setIsSubmitting(true);
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    // Attach minimal items payload (NO client prices!)
    const itemsMinimal = items.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      selected_color: item.selected_color || null,
    }));
    formData.append('items', JSON.stringify(itemsMinimal));

    if (screenshotFile) {
      formData.append('screenshot', screenshotFile);
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'فشل إرسال الطلب');
      }

      toast.success('تم استلام طلبك بنجاح! ✨');
      clearCart();
      router.push(`/order/${data.order_number}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'حدث خطأ أثناء إتمام الطلب';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-3 border-stone-800 dark:border-brass-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-stone-500 dark:text-stone-400">جاري التحميل...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-stone-900 dark:text-white mb-2">لا توجد منتجات في السلة</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">يرجى إضافة قطع للطلب قبل الانتقال للدفع.</p>
        <Link
          href="/products"
          className="inline-block px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 text-xs font-bold"
        >
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
          إتمام الطلب وسداد العربون
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
          خطوة بسيطة لتأكيد حجز وتنفيذ القطع يدويًا بكل حب 🤍
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left/Main Column: Form Inputs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Customer Details Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-stone-900 dark:text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 text-[11px] font-mono flex items-center justify-center">1</span>
              <span>بيانات التوصيل والتواصل</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  الاسم بالكامل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="customer_name"
                  required
                  placeholder="مثال: منى أحمد"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    رقم الهاتف / واتساب <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    required
                    placeholder="010XXXXXXXX"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    البريد الإلكتروني (اختياري)
                  </label>
                  <input
                    type="email"
                    name="customer_email"
                    placeholder="example@mail.com"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  عنوان الشحن بالتفصيل <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="customer_address"
                  required
                  rows={2}
                  placeholder="المحافظة، المنطقة، اسم الشارع، رقم العمارة والشقة..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  ملاحظات أو تخصيص للألوان (اختياري)
                </label>
                <textarea
                  name="customer_notes"
                  rows={2}
                  placeholder="مثال: لو حابة تنسيق لون معين أو كتابة ملاحظة خاصة لتنفيذ طلبك..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment & Deposit Transfer Instructions */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-stone-900 dark:text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 text-[11px] font-mono flex items-center justify-center">2</span>
              <span>تحويل العربون المطلوب ({formatPrice(depositAmount)})</span>
            </h2>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              يرجى تحويل مبلغ العربون (أو القيمة كاملة إن أردت) عبر إحدى الوسائل التالية، ثم رفع صورة التحويل بالأسفل:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              
              {/* Vodafone Cash Box */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/90 dark:border-stone-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-900 dark:text-white">فودافون كاش</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold">محفظة</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-stone-950 dark:text-white tracking-wider block mt-1" dir="ltr">
                    {settings?.vodafone_cash || '010XXXXXXXX'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(settings?.vodafone_cash || '', 'vodafone')}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-200 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-600 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'vodafone' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'vodafone' ? 'تم النسخ!' : 'نسخ الرقم'}</span>
                </button>
              </div>

              {/* InstaPay Box */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/90 dark:border-stone-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-900 dark:text-white">إنستاباي (InstaPay)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold">IPA</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-stone-950 dark:text-white block mt-1" dir="ltr">
                    {settings?.instapay || 'gogo@instapay'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(settings?.instapay || '', 'instapay')}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-200 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-600 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'instapay' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'instapay' ? 'تم النسخ!' : 'نسخ المعرف'}</span>
                </button>
              </div>

            </div>

            {/* 3. Screenshot Upload Box */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                صورة إيصال التحويل (Screenshot) <span className="text-rose-500">*</span>
              </label>

              <div className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl p-4 text-center hover:border-stone-400 dark:hover:border-stone-500 transition-colors bg-stone-50/50 dark:bg-stone-800/50">
                <input
                  type="file"
                  id="screenshot-input"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {screenshotPreview ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-sm">
                      <Image
                        src={screenshotPreview}
                        alt="إيصال التحويل"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <label
                      htmlFor="screenshot-input"
                      className="text-xs text-brass-600 dark:text-brass-400 font-bold cursor-pointer hover:underline"
                    >
                      تغيير الصورة المرفقة
                    </label>
                  </div>
                ) : (
                  <label
                    htmlFor="screenshot-input"
                    className="flex flex-col items-center justify-center gap-2 cursor-pointer py-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-sand-200 dark:bg-stone-700 text-stone-700 dark:text-sand-100 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-stone-700 dark:text-brass-400" />
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-stone-900 dark:text-white">اضغط لرفع صورة الإيصال</span>
                      <p className="text-stone-400 dark:text-stone-500 text-[11px] mt-0.5">JPG, PNG, WEBP حتى 5 ميجابايت</p>
                    </div>
                  </label>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Order Summary & Submit Button */}
        <div className="lg:col-span-5 space-y-4 sticky top-24">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-800 pb-3">
              مراجعة الطلب ({items.reduce((s, i) => s + i.quantity, 0)} قطعة)
            </h2>

            {/* Items mini list */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {items.map(({ product, quantity, selected_color }) => (
                <div key={`${product.id}-${selected_color || ''}`} className="flex items-center justify-between text-xs">
                  <div className="flex-1 pr-2">
                    <p className="font-bold text-stone-900 dark:text-white line-clamp-1">{product.name_ar}</p>
                    <p className="text-[11px] text-stone-400">
                      {quantity} × {formatPrice(product.price)} {selected_color ? `(${selected_color})` : ''}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-100 dark:border-stone-800 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>إجمالي الطلب:</span>
                <span className="font-mono font-bold text-stone-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 dark:text-white bg-sand-100 dark:bg-stone-800 p-3 rounded-xl border border-sand-200 dark:border-stone-700">
                <span>العربون المطلوب الآن ({depositPercentage}%):</span>
                <span className="font-mono text-brass-600 dark:text-brass-400">{formatPrice(depositAmount)}</span>
              </div>
              <div className="flex justify-between text-stone-500 dark:text-stone-400">
                <span>المتبقي عند الشحن:</span>
                <span className="font-mono">{formatPrice(remainingAmount)}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full shadow-md py-4"
              rightIcon={<CheckCircle2 className="w-4 h-4 text-brass-400 dark:text-stone-950" />}
            >
              تأكيد الطلب وإرسال الإيصال
            </Button>

            <div className="text-[11px] text-stone-500 dark:text-stone-400 space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>يتم مراجعة الإيصال وتأكيد بدء الصب خلال ساعتين.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-brass-500 shrink-0" />
                <span>ستحصل على رقم طلب لتتبع مراحل الصب والشحن فوراً.</span>
              </div>
            </div>

          </div>

        </div>

      </form>

    </div>
  );
}
