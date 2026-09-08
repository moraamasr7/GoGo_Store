// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Product, Offer, StorePublicSettings } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zbmogwlpmamgiyijwobw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpibW9nd2xwbWFtZ2l5aWp3b2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4OTU5NDIsImV4cCI6MjEwNDQ3MTk0Mn0.xPxeAeTEQdJb3qB_5BjMkNPBSfg54lA1xnt5-GGfUIo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getActiveProducts(category?: string): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return null;
  }
  return data as Product;
}

export async function getPublicSettings(): Promise<StorePublicSettings> {
  const defaultSettings: StorePublicSettings = {
    store_name: 'Gogo Concrete Store',
    whatsapp_number: '201012345678',
    vodafone_cash: '01012345678',
    instapay: 'gogo.concrete@instapay',
    deposit_percentage: 50,
    currency: 'ج.م',
    payment_instructions: 'حوّل 50% من قيمة طلبك عبر فودافون كاش أو إنستاباي، وارفع لقطة شاشة للإيصال لتأكيد بدء الصب والتنفيذ اليدوي.',
    shipping_instructions: 'مدة التنفيذ اليدوي من 3 إلى 7 أيام عمل. مصاريف الشحن تُحسب حسب المحافظة وتُسدد للمندوب عند الاستلام.',
    maintenance_mode: false,
  };

  try {
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')
      .eq('is_public', true);

    if (error || !data) return defaultSettings;

    const result = { ...defaultSettings };
    for (const item of data) {
      if (item.key === 'store_name') result.store_name = item.value;
      if (item.key === 'whatsapp_number') result.whatsapp_number = item.value;
      if (item.key === 'vodafone_cash') result.vodafone_cash = item.value;
      if (item.key === 'instapay') result.instapay = item.value;
      if (item.key === 'deposit_percentage') result.deposit_percentage = Number(item.value) || 50;
      if (item.key === 'currency') result.currency = item.value;
      if (item.key === 'payment_instructions') result.payment_instructions = item.value;
      if (item.key === 'shipping_instructions') result.shipping_instructions = item.value;
      if (item.key === 'maintenance_mode') result.maintenance_mode = item.value === 'true';
    }
    return result;
  } catch {
    return defaultSettings;
  }
}

export async function getActiveOffers(): Promise<Offer[]> {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error || !data) return [];
  return data as Offer[];
}
