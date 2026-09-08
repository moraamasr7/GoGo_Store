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
      const orderNumber = data.order?.order_number;
      router.push(`/order/${orderNumber}`);
    } catch (err: any) {
      toast.error(err.message || 'حدث خطأ أثناء إتمام الطلب، يرجى المحاولة ثانية');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoading && items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-stone-900 mb-2">لا توجد عناصر لإتمام الطلب</h1>
        <p className="text-sm text-stone-500 mb-6">سلتك فارغة حالياً. يرجى اختيار المنتجات أولاً.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-sand-50 text-xs font-semibold"
        >
          <span>تصفح المنتجات</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const vodafoneCash = settings?.vodafone_cash || '01012345678';
  const instapay = settings?.instapay || 'gogo.concrete@instapay';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">إتمام الطلب وتأكيد العربون</h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          أدخل بيانات الشحن وقم بتحويل العربون للبدء في صب ومعالجة طلبك اليدوي
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Customer Info & Payment Upload */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer Details Box */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
              <span>1. بيانات العميل والشحن</span>
            </h2>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                الاسم الكامل <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="customer_name"
                required
                placeholder="أدخل اسمك الكريم"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-sand-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                رقم الهاتف (واتساب) <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="customer_phone"
                required
                dir="ltr"
                placeholder="010XXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-left focus:outline-none focus:ring-2 focus:ring-stone-900 bg-sand-50/50 font-mono"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                سنرسل لك تحديثات مراحل تنفيذ طلبك وصور القطع عبر واتساب على هذا الرقم.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                عنوان التوصيل بالتفصيل <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="customer_address"
                required
                rows={2}
                placeholder="المحافظة، المدينة، اسم الشارع، رقم العمارة والشقة"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-sand-50/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  البريد الإلكتروني <span className="text-stone-400 font-normal">(اختياري)</span>
                </label>
                <input
                  type="email"
                  name="customer_email"
                  dir="ltr"
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-sand-50/50 text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  ملاحظات خاصة <span className="text-stone-400 font-normal">(اختياري)</span>
                </label>
                <input
                  type="text"
                  name="customer_notes"
                  placeholder="مثال: تغليف هدية، توصيل بعد الساعة 3..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-sand-50/50"
                />
              </div>
            </div>

          </div>

          {/* Payment Instructions & Receipt Upload */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-100">
              2. سداد العربون ({depositPercentage}%)
            </h2>

            {/* Instruction Banner */}
            <div className="p-4 rounded-2xl bg-sand-100 border border-sand-200 text-xs text-stone-800 space-y-3">
              <p className="font-semibold text-stone-900 text-sm">
                مبلغ العربون المطلوب الآن: <span className="font-mono font-bold text-stone-950">{formatPrice(depositAmount)}</span>
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200">
                  <div>
                    <span className="text-stone-500 block text-[10px]">فودافون كاش:</span>
                    <span className="font-mono font-bold text-stone-900 text-sm" dir="ltr">{vodafoneCash}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(vodafoneCash, 'voda')}
                    className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 flex items-center gap-1 text-[11px]"
                  >
                    {copiedKey === 'voda' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>نسخ</span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200">
                  <div>
                    <span className="text-stone-500 block text-[10px]">إنستاباي (InstaPay):</span>
                    <span className="font-mono font-bold text-stone-900 text-sm" dir="ltr">{instapay}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(instapay, 'insta')}
                    className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 flex items-center gap-1 text-[11px]"
                  >
                    {copiedKey === 'insta' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>نسخ</span>
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-stone-600 leading-normal">
                {settings?.payment_instructions || 'يرجى تحويل مبلغ العربون، ثم رفع لقطة شاشة للإيصال لتأكيد بدء الصب اليدوي.'}
              </p>
            </div>

            {/* Receipt Upload Field */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                إرفاق لقطة شاشة لإيصال التحويل (Screenshot) <span className="text-stone-400 font-normal">(مستحسن للتأكيد الفوري)</span>
              </label>

              <div className="relative border-2 border-dashed border-stone-300 hover:border-stone-500 rounded-2xl p-4 text-center transition-colors bg-sand-50/40">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {screenshotPreview ? (
                  <div className="flex items-center justify-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-300 bg-white">
                      <Image
                        src={screenshotPreview}
                        alt="إيصال التحويل"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>تم اختيار صورة الإيصال</span>
                      </p>
                      <p className="text-[11px] text-stone-500 truncate max-w-[200px]">
                        {screenshotFile?.name}
                      </p>
                      <span className="text-[10px] text-stone-400 underline">انقر للتغيير</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-2">
                    <Upload className="w-6 h-6 text-stone-400 mb-1.5" />
                    <p className="text-xs font-semibold text-stone-700">اضغط لرفع لقطة الشاشة</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">JPG, PNG, WEBP حتى 5MB</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Order Summary & Submit Button */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-100">
              ملخص طلبك
            </h2>

            <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-stone-100 pr-1">
              {items.map(({ product, quantity, selected_color }) => (
                <div key={`${product.id}-${selected_color || ''}`} className="pt-2 flex justify-between text-xs">
                  <div>
                    <span className="font-semibold text-stone-900">{product.name_ar}</span>
                    <span className="text-stone-400 mx-1">×</span>
                    <span className="font-mono text-stone-600">{quantity}</span>
                    {selected_color && (
                      <span className="block text-[10px] text-stone-500">({selected_color})</span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-stone-900">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-100 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>الإجمالي:</span>
                <span className="font-mono font-bold text-stone-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <span>العربون المطلوب الآن ({depositPercentage}%):</span>
                <span className="font-mono text-sm">{formatPrice(depositAmount)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>المتبقي عند الاستلام:</span>
                <span className="font-mono font-bold text-stone-800">{formatPrice(remainingAmount)}</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl bg-stone-900 text-sand-50 font-bold text-sm flex items-center justify-center gap-2 hover:bg-stone-800 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>جاري حفظ الطلب والتحقق...</span>
                  </>
                ) : (
                  <>
                    <span>تأكيد وإرسال الطلب</span>
                    <ArrowLeft className="w-4 h-4 text-brass-400" />
                  </>
                )}
              </button>
            </div>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-stone-500 leading-tight">
                🔒 طلبك محمي، وسيتم تأكيده والبدء في الصب اليدوي فور مراجعة التحويل.
              </p>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
}
