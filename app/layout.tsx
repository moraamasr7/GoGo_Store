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

export const metadata: Metadata = {
  title: "Gogo Concrete | تحف وديكورات مصنوعة بتركيز ودقة وبأعلي جودة 🤍",
  description: "شغل كونكريت / ديكوري يدوي من البيت بأشكال كتير. تصميمات مودرن وبسيطة وتشطيب ناعم وألوان هادية تناسب أي بيت.",
  keywords: ["كونكريت", "هاند ميد", "ديكورات يدوية", "صواني ديكورية", "كوسترات", "مباخر", "حوامل شموع", "علب مجوهرات", "تحف", "Gogo Concrete"],
  openGraph: {
    title: "Gogo Concrete | تحف وديكورات كونكريت معمولـة بتركيز ودقة وبأعلي جودة 🤍",
    description: "شغل كونكريت / ديكوري يدوي من البيت بأشكال كتير، تشطيب ناعم وألوان هادية ومودرن.",
    type: "website",
    locale: "ar_EG",
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPublicSettings();

  return (
    <html lang="ar" dir="rtl" className={`scroll-smooth ${cairo.variable}`}>
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
              <Header logoUrl={settings.header_logo_url} storeName={settings.store_name} />
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
