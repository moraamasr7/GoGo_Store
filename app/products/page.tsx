import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getActiveProducts, getPublicSettings } from '@/lib/supabase';
import { DEFAULT_CATEGORY_CONFIGS, DEFAULT_COLLECTION_CONFIGS } from '@/types/database';
import ProductCard from '@/components/products/ProductCard';
import { Sparkles, Gift, SlidersHorizontal, MessageCircle, X } from 'lucide-react';
import { getCategoryLabel } from '@/lib/utils';
import { CategoryKey } from '@/types/database';

export const revalidate = 60;

interface ProductsPageProps {
  searchParams?: {
    category?: string;
    collection?: string;
    filter?: string;
  };
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gogodesigns.com';

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const category = searchParams?.category;
  const collection = searchParams?.collection;
  const isUnfinished = searchParams?.filter === 'unfinished';

  let title = 'جميع القطع والمعروضات الديكورية اليدوية';
  let description = 'تصفح أحدث التحف والديكورات المنزلية وأطقم الهدايا المصبوبة يدوياً بتشطيب ناعم وألوان متناسقة مع إمكانية التخصيص.';
  let canonicalPath = '/products';

  if (isUnfinished) {
    title = 'قطع بدون فنش للتلوين والإبداع';
    description = 'قطع ديكورية مصبوبة يدوياً ومجهزة بدون ألوان أو لمعة، مخصصة لتبدعي بتلوينها وتنسيقها بذوقك الخاص.';
    canonicalPath = '/products?filter=unfinished';
  } else if (collection === 'ramadan') {
    title = 'تشكيلة رمضان المبارك وديكورات الضيافة';
    description = 'مباخر، صواني ضيافة، وشمعدانات صُممت خصيصاً لتضفي لمسة روحانية دافئة على منزلك في شهر رمضان.';
    canonicalPath = '/products?collection=ramadan';
  } else if (category === 'gift_sets') {
    title = 'أطقم هدايا راقية وتوزيعات فاخرة';
    description = 'مجموعات ديكورية متناسقة ومغلفة بأناقة، جاهزة لتكون أرقى هدية للأحباب والمناسبات السعيدة.';
    canonicalPath = '/products?category=gift_sets';
  } else if (category === 'ready_sets') {
    title = 'أطقم ديكورات متناسقة للمنزل';
    description = 'تنسيقات متكاملة من الصواني والمباخر والشمعدانات لتجميل طاولاتك وزوايا منزلك بتناغم مثالي.';
    canonicalPath = '/products?category=ready_sets';
  } else if (category && category !== 'all') {
    const label = getCategoryLabel(category as CategoryKey);
    title = `${label} | تشكيلة ديكورية يدوية`;
    description = `اكتشف أجمل تشكيلات ${label} المصنوعة يدوياً بتشطيب ناعم وألوان هادئة تناسب الديكور العصري.`;
    canonicalPath = `/products?category=${category}`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${title} | Gogo Designs`,
      description,
      url: `${siteUrl}${canonicalPath}`,
      type: 'website',
    },
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const categoryParam = searchParams?.category;
  const collectionParam = searchParams?.collection;
  const isUnfinished = searchParams?.filter === 'unfinished';

  // Fetch settings & products concurrently
  const [settings, products] = await Promise.all([
    getPublicSettings(),
    getActiveProducts({
      category: categoryParam && categoryParam !== 'all' ? categoryParam : undefined,
      collection: collectionParam || undefined,
      is_unfinished: isUnfinished ? true : undefined,
    }),
  ]);

  const categories = ((settings.catalog_categories_config && settings.catalog_categories_config.length > 0)
    ? settings.catalog_categories_config
    : DEFAULT_CATEGORY_CONFIGS)
    .filter(c => c.is_active !== false)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  const collections = ((settings.catalog_collections_config && settings.catalog_collections_config.length > 0)
    ? settings.catalog_collections_config
    : DEFAULT_COLLECTION_CONFIGS)
    .filter(c => c.is_active !== false)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  const filterTabs = [
    { id: 'all', label: 'جميع القطع', href: '/products', active: !categoryParam && !collectionParam && !isUnfinished },
    ...categories.map(cat => ({
      id: cat.key,
      label: `${cat.icon ? `${cat.icon} ` : ''}${cat.label}`,
      href: `/products?category=${cat.key}`,
      active: categoryParam === cat.key,
    })),
    ...collections.map(col => ({
      id: col.key,
      label: `${col.icon ? `${col.icon} ` : ''}${col.label}`,
      href: `/products?collection=${col.key}`,
      active: collectionParam === col.key,
    })),
    { id: 'unfinished', label: '🎨 قطع بدون فنش (للتلوين)', href: '/products?filter=unfinished', active: isUnfinished },
  ];

  // Dynamic header copy based on filter
  let pageBadge = '✨ صناعة يدوية فاخرة';
  let pageTitle = 'القطع والتصميمات المتاحة للتنفيذ 🌸';
  let pageDescription = 'تحف وديكورات منزلية يدوية بأشكال عصرية وألوان متناسقة تناسب جميع أركان منزلك. يمكنك طلب القطع منفردة أو تكوين طقمك الخاص.';

  const matchedCat = categories.find(c => c.key === categoryParam);
  const matchedCol = collections.find(c => c.key === collectionParam);

  if (isUnfinished) {
    pageBadge = '🎨 ورشة وإبداع';
    pageTitle = 'قطع بدون فنش (للتلوين والإبداع) 🎨';
    pageDescription = 'قطع ديكورية مصبوبة يدوياً ومجهزة بنعومة بدون ألوان أو لمعة، مخصصة لكِ لتبدعي بتلوينها وتنسيقها بلمستك الخاصة.';
  } else if (matchedCol) {
    pageBadge = matchedCol.badge || `✨ ${matchedCol.label}`;
    pageTitle = `${matchedCol.label} ${matchedCol.icon || ''}`;
    pageDescription = matchedCol.description || 'تشكيلة مميزة ومختارة بعناية للمناسبات والأوقات السعيدة.';
  } else if (matchedCat) {
    pageBadge = matchedCat.badge || `✨ ${matchedCat.label}`;
    pageTitle = `${matchedCat.label} ${matchedCat.icon || ''}`;
    pageDescription = matchedCat.description || 'مجموعات ديكورية متناسقة ومصبوبة يدوياً بتشطيب ناعم وأنيق.';
  }

  const hasActiveFilter = Boolean(categoryParam || collectionParam || isUnfinished);

  // Breadcrumb Schema
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: `${siteUrl}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'المنتجات',
        item: `${siteUrl}/products`,
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-3.5 sm:px-6 py-5 sm:py-10 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Header */}
      <div className="mb-4 sm:mb-6 space-y-1.5 sm:space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] sm:text-xs font-bold text-brass-600 dark:text-brass-400">
            {pageBadge}
          </span>
          {hasActiveFilter && (
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-700 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>إلغاء التصفية</span>
            </Link>
          )}
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
          {pageTitle}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
          {pageDescription}
        </p>
      </div>

      {/* Build your set / Custom order info banner */}
      <div className="mb-5 sm:mb-7 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-sand-100/90 dark:bg-stone-900 border border-sand-200 dark:border-stone-800 text-[11px] sm:text-xs text-stone-700 dark:text-stone-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-brass-500/20 text-brass-700 dark:text-brass-400 font-bold text-[10px] sm:text-[11px] shrink-0">
            اختاري ونسّقي ✨
          </span>
          <span className="leading-relaxed">
            جميع القطع والألوان المعروضة متاحة للتنفيذ اليدوي، ومتاح طلب أي لون أو تخصيص كتابة على القطع المفضلة لديكِ 🤍
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/set-builder"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 text-xs font-bold shadow-xs hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>كوّني طقمك بنفسك</span>
          </Link>
          <a
            href="https://wa.me/201150014792?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AA%D9%86%D9%81%D9%8A%D8%B0%20%D8%B7%D9%84%D8%A8%20%D8%AE%D8%A7%D8%B5"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline px-2 py-1"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">طلب خاص</span>
          </a>
        </div>
      </div>

      {/* Categories & Collections Filter Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 mb-5 sm:mb-8 scrollbar-none">
        {filterTabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`whitespace-nowrap px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold transition-all duration-200 active:scale-95 ${tab.active
              ? 'bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 shadow-md shadow-stone-900/10 dark:shadow-brass-500/20 -translate-y-0.5'
              : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:border-brass-500/50 dark:hover:border-brass-400/50 hover:text-stone-950 dark:hover:text-white border border-stone-200/90 dark:border-stone-800 shadow-xs'
              }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-stone-900 rounded-2xl sm:rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-sand-100 dark:bg-stone-800 flex items-center justify-center text-brass-500">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              لا توجد قطع معروضة ضمن هذا التصنيف حالياً
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
              يمكننا تنفيذ أي تصميم أو مقاس تطلبينه يدوياً بأعلى معايير الدقة والأناقة.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/products"
              className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 text-xs font-bold hover:opacity-90 transition-opacity"
            >
              عرض جميع القطع
            </Link>
            <a
              href="https://wa.me/201150014792?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%AA%D9%86%D9%81%D9%8A%D8%B0%20%D9%82%D8%B7%D8%B9%D8%A9%20%D8%AE%D8%A7%D8%B5%D8%A9"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-sand-200 dark:bg-stone-800 text-stone-800 dark:text-sand-100 text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>طلب تفصيل خاص</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
