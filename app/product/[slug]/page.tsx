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
      <nav className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-8">
        <Link href="/" className="hover:text-stone-900 dark:hover:text-white">الرئيسية</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-stone-900 dark:hover:text-white">المنتجات</Link>
        <span>/</span>
        <span className="text-stone-900 dark:text-stone-200 font-bold">{product.name_ar}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Gallery / Image Column */}
        <div className="md:col-span-6 sticky top-24">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-sand-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
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
              <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center">
                <span className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-sm shadow-md">
                  نفذت الكمية حالياً
                </span>
              </div>
            )}
          </div>

          {/* Handmade Notice Card */}
          <div className="mt-4 p-4 rounded-2xl bg-sand-100/80 dark:bg-stone-900 border border-sand-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-brass-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>شغل يدوي معمول بتركيز ودقة:</strong> كل قطعة بنفذها يدويًا من البيت بتشطيب ناعم بأعلي جودة وبأحتراف يشبه السيراميك في نعومته وأناقته لتضيف لمسة راقية لبيتك ✨
            </p>
          </div>
        </div>

        {/* Product Details & Purchase Form Column */}
        <div className="md:col-span-6 flex flex-col">
          
          <div className="mb-2">
            <span className="inline-block px-3 py-1 text-xs font-bold bg-sand-200 dark:bg-stone-800 text-stone-800 dark:text-brass-400 rounded-full mb-3">
              {getCategoryLabel(product.category)}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight mb-2">
              {product.name_ar}
            </h1>
            {product.name_en && (
              <p className="text-xs text-stone-500 dark:text-stone-400 font-mono" dir="ltr">
                {product.name_en}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="py-4 border-y border-stone-200/80 dark:border-stone-800 my-4 flex items-baseline gap-3">
            <span className="text-3xl font-black text-stone-950 dark:text-white font-mono">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              (عربون 50% لتأكيد تنفيذ وحجز القطعة)
            </span>
          </div>

          {/* Description & Real Supporting Copy */}
          <div className="mb-6 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed space-y-2">
            {product.description_ar && <p>{product.description_ar}</p>}
            <p className="text-stone-500 dark:text-stone-400 text-xs">
              قطعة ديكور مصنوعة يدويًا بتشطيب ناعم تشبه السيراميك في نعومتها وأناقتها وألوان هادية راقية تضيف لمسة ذوق عالي لأي مكان. تصميم مودرن يناسب البيوت البسيطة والديكور العصري، عملية وجمالية في نفس الوقت ✨
            </p>
          </div>

          {/* Technical Specifications */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-xs">
            {product.dimensions && (
              <div>
                <span className="text-stone-400 dark:text-stone-500 block mb-0.5">الأبعاد والمقاس</span>
                <span className="font-mono font-bold text-stone-800 dark:text-stone-200" dir="ltr">{product.dimensions}</span>
              </div>
            )}
            {product.weight_approx && (
              <div>
                <span className="text-stone-400 dark:text-stone-500 block mb-0.5">الوزن التقريبي</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{product.weight_approx}</span>
              </div>
            )}
            <div>
              <span className="text-stone-400 dark:text-stone-500 block mb-0.5">الخامة والصنع</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">كونكريت Handmade من البيت</span>
            </div>
            <div>
              <span className="text-stone-400 dark:text-stone-500 block mb-0.5">التشطيب والمظهر</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">ناعم وهادئ يشبه السيراميك</span>
            </div>
          </div>

          {/* Client Interactive Area (Colors, Quantity, Add to Cart) */}
          <ProductDetailClient product={product} />

        </div>

      </div>

    </div>
  );
}
