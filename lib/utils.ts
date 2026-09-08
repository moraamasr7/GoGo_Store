// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CategoryKey, OrderStatus } from "@/types/database";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = "ج.م"): string {
  return `${Number(amount).toLocaleString('ar-EG', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${currency}`;
}

export function getCategoryLabel(category: CategoryKey): string {
  const map: Record<CategoryKey, string> = {
    trays: "صواني ديكورية",
    coasters: "قواعد أكواب (Coasters)",
    planters: "أحواض نباتات",
    candle_holders: "حوامل شموع ومباخر",
    decor: "تحف وفازات",
  };
  return map[category] || category;
}

export function getStatusLabel(status: OrderStatus): { label: string; color: string } {
  const map: Record<OrderStatus, { label: string; color: string }> = {
    pending: { label: "قيد المراجعة وتأكيد العربون", color: "bg-amber-100 text-amber-800 border-amber-300" },
    confirmed: { label: "تم تأكيد الطلب والعربون", color: "bg-blue-100 text-blue-800 border-blue-300" },
    processing: { label: "قيد الصب والتنفيذ اليدوي", color: "bg-purple-100 text-purple-800 border-purple-300" },
    ready_for_shipping: { label: "جاهز للتسليم والشحن", color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
    completed: { label: "تم الاستلام بنجاح", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
    cancelled: { label: "ملغي", color: "bg-rose-100 text-rose-800 border-rose-300" },
  };
  return map[status] || { label: status, color: "bg-gray-100 text-gray-800 border-gray-300" };
}
