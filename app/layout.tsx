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
  title: "Gogo Concrete | تحف وديكورات مصنوعة بحب 🤍",
  description: "شغل كونكريت / ديكوري يدوي من البيت بأشكال كتير. تصميمات مودرن وبسيطة وتشطيب ناعم وألوان هادية تناسب أي بيت.",
  keywords: ["كونكريت", "هاند ميد", "ديكورات يدوية", "صواني ديكورية", "كوسترات", "مباخر", "حوامل شموع", "علب مجوهرات", "تحف", "Gogo Concrete"],
  openGraph: {
    title: "Gogo Concrete | تحف وديكورات كونكريت معمولـة بحب 🤍",
    description: "شغل كونكريت / ديكوري يدوي من البيت بأشكال كتير، تشطيب ناعم وألوان هادية ومودرن.",
    type: "website",
    locale: "ar_EG",
  },
};

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
              <div className="w-16 h-16 rounded-2xl bg-stone-900 dark:bg-stone-800 text-sand-50 flex items-center justify-center mb-6 shadow-md">
                <Hammer className="w-8 h-8 text-brass-400 animate-pulse" />
              </div>
              <h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-3">المتجر في تحديث بسيط...</h1>
              <p className="text-stone-600 dark:text-stone-400 max-w-md text-base leading-relaxed mb-6">
                نقوم بإضافة قطع جديدة وتحديث المتجر، هنرجع متاحين للطلب قريب جداً ❤️
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                للطلبات العاجلة يمكنك مراسلتنا مباشرة على واتساب
              </p>
            </div>
          ) : (
            <CartProvider>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </CartProvider>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
