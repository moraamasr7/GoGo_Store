import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartContext";
import { Toaster } from "react-hot-toast";
import { getPublicSettings } from "@/lib/supabase";
import { Hammer } from "lucide-react";

export const metadata: Metadata = {
  title: "Gogo Concrete Store | قطع وديكورات كونكريت يدوية فاخرة",
  description: "متجر متخصص في صناعة الديكورات المنزلية والمكتبية اليدوية من الكونكريت والأسمنت الناعم. صواني، قواعد أكواب، أحواض نباتات وشمعدانات بتصاميم عصرية.",
  keywords: ["كونكريت", "ديكورات يدوية", "صواني ديكورية", "كوسترز", "أحواض نباتات", "Gogo Concrete", "هاند ميد"],
  openGraph: {
    title: "Gogo Concrete Store | هاند ميد كونكريت ديكور",
    description: "قطع ديكورية معمارية مصبوبة يدوياً بكل حب ودقة في مصر.",
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
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body className="min-h-screen flex flex-col font-sans bg-sand-50 text-stone-900 antialiased selection:bg-brass-400/30 selection:text-stone-900">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1D1C19',
              color: '#FAF8F5',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 500,
              fontFamily: 'inherit',
            },
          }}
        />

        {settings.maintenance_mode ? (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-sand-100">
            <div className="w-16 h-16 rounded-2xl bg-stone-900 text-sand-50 flex items-center justify-center mb-6 shadow-md">
              <Hammer className="w-8 h-8 text-brass-400 animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold text-stone-900 mb-3">المتجر في تحديث بسيط...</h1>
            <p className="text-stone-600 max-w-md text-base leading-relaxed mb-6">
              نقوم بإضافة قطع جديدة وتحديث المتجر، هنرجع متاحين للطلب قريب جداً ❤️
            </p>
            <p className="text-xs text-stone-500">
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
      </body>
    </html>
  );
}
