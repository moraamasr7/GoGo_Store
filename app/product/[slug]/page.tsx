import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Clock, Check } from 'lucide-react';
import { getProductBySlug } from '@/lib/supabase';
import { formatPrice, getCategoryLabel } from '@/lib/utils';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 60;

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8">
        <Link href="/" className="hover:text-stone-900">الرئيسية</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-stone-900">المنتجات</Link>
        <span>/</span>
        <span className="text-stone-900 font-medium">{product.name_ar}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Gallery / Image Column */}
        <div className="md:col-span-6 sticky top-24">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-sand-100 border border-stone-200/80 shadow-sm">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name_ar}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400">
                <span>بدون صورة</span>
              </div>
            )}

            {/* Out of Stock Overlay */}
            {product.stock <= 0 && (
              <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center">
                <span className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-sm shadow-md">
                  نفذت الكمية حالياً
                </span>
              </div>
            )}
          </div>

          {/* Handmade Notice Card */}
          <div className="mt-4 p-4 rounded-2xl bg-sand-100/80 border border-sand-200 text-xs text-stone-700 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-brass-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>ملاحظة الصناعة اليدوية:</strong> كل قطعة مصنوعة يدوياً، لذلك قد توجد اختلافات بسيطة وجميلة في التموجات والمسام الحجرية بين قطعة وأخرى.
            </p>
          </div>
        </div>

        {/* Product Details & Purchase Form Column */}
        <div className="md:col-span-6 flex flex-col">
          
          <div className="mb-2">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-sand-200 text-stone-800 rounded-full mb-3">
              {getCategoryLabel(product.category)}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mb-2">
              {product.name_ar}
            </h1>
            {product.name_en && (
              <p className="text-xs text-stone-500 font-mono" dir="ltr">
                {product.name_en}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="py-4 border-y border-stone-200/80 my-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-stone-950 font-mono">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-stone-500">
              (عربون 50% مطلوب لتأكيد الصب)
            </span>
          </div>

          {/* Description */}
          {product.description_ar && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-stone-500 uppercase mb-2">عن القطعة</h3>
              <p className="text-sm text-stone-700 leading-relaxed">
                {product.description_ar}
              </p>
            </div>
          )}

          {/* Dimensions & Specs */}
          {(product.dimensions || product.weight_approx) && (
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white border border-stone-200 mb-6 text-xs">
              {product.dimensions && (
                <div>
                  <span className="text-stone-400 block mb-0.5">الأبعاد:</span>
                  <span className="font-semibold text-stone-800">{product.dimensions}</span>
                </div>
              )}
              {product.weight_approx && (
                <div>
                  <span className="text-stone-400 block mb-0.5">الوزن التقريبي:</span>
                  <span className="font-semibold text-stone-800">{product.weight_approx}</span>
                </div>
              )}
            </div>
          )}

          {/* Interactive Client Component for Options, Quantity & Add to Cart */}
          <ProductDetailClient product={product} />

          {/* Trust Guarantees */}
          <div className="mt-8 pt-6 border-t border-stone-200/80 space-y-3 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-stone-500" />
              <span>مدة التنفيذ: من 3 إلى 7 أيام عمل حسب دورة جفاف ومعالجة الكونكريت.</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-stone-500" />
              <span>معالج بطبقة حماية ضد الماء وتأثير الرطوبة.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
