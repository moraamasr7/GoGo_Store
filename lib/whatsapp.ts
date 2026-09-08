// lib/whatsapp.ts

export function generateWhatsAppOrderUrl(
  whatsappNumber: string,
  orderNumber: string,
  customerName: string,
  totalAmount: number,
  depositAmount: number,
  currency: string = "ج.م"
): string {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const message = `مرحباً Gogo Concrete 👋
أنا العميل: ${customerName}
قمت بإتمام الطلب رقم: *#${orderNumber}*
• إجمالي الطلب: ${totalAmount} ${currency}
• العربون المحول: ${depositAmount} ${currency}

أرجو تأكيد استلام التحويل وبدء الصب والتنفيذ 🏺✨`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppInquiryUrl(whatsappNumber: string, productName?: string): string {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const message = productName 
    ? `مرحباً Gogo Concrete، لدي استفسار بخصوص منتج: *${productName}*`
    : `مرحباً Gogo Concrete، أود الاستفسار عن منتجات الكونكريت والطلبات الخاصة 🙏`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
