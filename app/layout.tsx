import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartContext";
import { ThemeProvider } from "@/components/theme/ThemeContext";
import { Toaster } from "react-hot-toast";
import { getPublicSettings } from "@/lib/supabase";
import { Hammer } from "lucide-react";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gogodesigns.com';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  const storeTitle = settings.seo_meta_title || `${settings.store_name || 'Gogo Designs'} | تحف وديكورات منزلية مصنوعة يدوياً بتركيز ودقة 🤍`;
  const storeDesc = settings.seo_meta_description || 'متجر Gogo Designs للتحف والديكورات المنزلية وأطقم الهدايا المصبوبة يدوياً. صواني تقديم، مباخر، شمعدانات، كوسترات، وفازات بتشطيب ناعم وألوان هادئة ونقش مخصص بالاسم.';
  const ogImage = settings.seo_og_image_url || settings.hero_banner_url || `${siteUrl}/og-image.jpg`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: storeTitle,
      template: `%s | ${settings.store_name || 'Gogo Designs'}`,
    },
    description: storeDesc,
    keywords: [
      "صواني ديكورية",
      "كوسترات",
      "شمعدانات",
      "مباخر",
      "فازات",
      "أطقم هدايا",
      "ديكور منزلي",
      "قطع مخصصة",
      "أسماء مخصصة",
      "هاند ميد",
      "تحف منزلية",
      settings.store_name || "Gogo Designs",
    ],
    authors: [{ name: settings.store_name || "Gogo Designs" }],
    creator: settings.store_name || "Gogo Designs",
    publisher: settings.store_name || "Gogo Designs",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: storeTitle,
      description: storeDesc,
      url: siteUrl,
      siteName: settings.store_name || "Gogo Designs",
      locale: "ar_EG",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: storeTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: storeTitle,
      description: storeDesc,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPublicSettings();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings.store_name || "Gogo Designs",
    "url": siteUrl,
    "logo": settings.header_logo_url || `${siteUrl}/logo.png`,
    "description": "براند مصري متخصص في ابتكار التحف والديكورات المنزلية وأطقم الهدايا المصبوبة يدوياً بأعلى معايير الجودة والنعومة.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": settings.whatsapp_number ? `+${settings.whatsapp_number.replace(/[^0-9]/g, '')}` : "+201000000000",
      "contactType": "customer service",
      "areaServed": "EG",
      "availableLanguage": ["Arabic", "English"]
    }
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": settings.store_name || "Gogo Designs",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="ar" dir="rtl" className={`scroll-smooth ${cairo.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('gogo_theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(!s&&d)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-sand-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 antialiased selection:bg-brass-400/30 selection:text-stone-900 dark:selection:text-white transition-colors duration-300">
        <ThemeProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1D1C19',
                color: '#FAF8F5',
                borderRadius: '14px',
                fontSize: '13px',
                fontWeight: 500,
                fontFamily: 'var(--font-cairo), Cairo, sans-serif',
              },
            }}
          />

          {settings.maintenance_mode ? (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-sand-100 dark:bg-stone-900">
              <div className="w-16 h-16 rounded-2xl bg-stone-900 dark:bg-stone-800 text-sand-50 flex items-center justify-center mb-6 shadow-md border border-sand-300 dark:border-stone-700">
                <Hammer className="w-8 h-8 text-brass-400 animate-pulse" />
              </div>
              <h1 className="text-3xl font-black text-stone-900 dark:text-white mb-3">المتجر في تحديث بسيط...</h1>
              <p className="text-stone-600 dark:text-stone-400 max-w-md text-sm sm:text-base leading-relaxed mb-6">
                نقوم بإضافة معروضات وتحديثات جديدة، وسنعود متاحين للطلب بأعلى جودة قريباً جداً ✨
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href="/"
                  className="px-5 py-2.5 rounded-xl bg-stone-900 text-sand-50 dark:bg-brass-500 dark:text-stone-950 text-xs font-bold shadow hover:opacity-90 transition-opacity"
                >
                  إعادة التحقق من فتح المتجر 🔄
                </a>
                {settings.whatsapp_number && (
                  <a
                    href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-colors"
                  >
                    مراسلتنا عبر واتساب
                  </a>
                )}
              </div>
            </div>
          ) : (
            <CartProvider>
              <Header 
                logoUrl={settings.header_logo_url} 
                storeName={settings.store_name}
                whatsappNumber={settings.whatsapp_number}
              />
              <main className="flex-1">
                {children}
              </main>
              <Footer logoUrl={settings.header_logo_url} storeName={settings.store_name} />
            </CartProvider>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
