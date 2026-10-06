// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Product, Offer, StorePublicSettings, DEFAULT_CATEGORY_CONFIGS, DEFAULT_COLLECTION_CONFIGS, CategoryConfig, CollectionConfig } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zbmogwlpmamgiyijwobw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpibW9nd2xwbWFtZ2l5aWp3b2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4OTU5NDIsImV4cCI6MjEwNDQ3MTk0Mn0.xPxeAeTEQdJb3qB_5BjMkNPBSfg54lA1xnt5-GGfUIo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
  global: {
    fetch: (url, init) => {
      return fetch(url, {
        ...init,
        cache: 'no-store',
      });
    },
  },
});

export interface ProductQueryFilters {
  category?: string;
  collection?: string;
  is_unfinished?: boolean;
  limit?: number;
}

export async function getActiveProducts(params?: string | ProductQueryFilters): Promise<Product[]> {
  const filters: ProductQueryFilters = typeof params === 'string' ? { category: params } : (params || {});

  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }

  if (filters.collection) {
    query = query.eq('collection', filters.collection);
  }

  if (filters.is_unfinished !== undefined) {
    query = query.eq('is_unfinished', filters.is_unfinished);
  }

  if (filters.limit && filters.limit > 0) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    decodedSlug = slug;
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', decodedSlug)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return null;
  }
  return data as Product;
}

export async function getPublicSettings(): Promise<StorePublicSettings> {
  const defaultSettings: StorePublicSettings = {
    store_name: 'Gogo Designs',
    store_subtitle: 'براند مصري لديكورات وتحف منزلية مصبوبة يدوياً بتشطيب ناعم وألوان هادئة تضيف لمسة فنية دافئة وأنيقة لكل زاوية في منزلك.',
    whatsapp_number: '201150014792',
    vodafone_cash: '01150014792',
    instapay: 'gogo.designs@instapay',
    deposit_percentage: 50,
    currency: 'ج.م',
    payment_instructions: 'حوّل 50% من قيمة طلبك عبر فودافون كاش أو إنستاباي، وارفع لقطة شاشة للإيصال لتأكيد بدء الصب والتنفيذ اليدوي.',
    shipping_instructions: 'مدة التنفيذ اليدوي من 3 إلى 7 أيام عمل. مصاريف الشحن تُحسب حسب المحافظة وتُسدد للمندوب عند الاستلام.',
    maintenance_mode: false,
    hero_eyebrow: 'تصاميم فاخرة وقطع ديكور مصنوعة يدوياً بمحبة ✨',
    hero_title: 'قطع مميزة لبيتك وهداياك / معمولـة بتركيز ودقة 🤍',
    hero_subtitle: 'تصميمات مودرن وبسيطة تليق بأي مساحة في بيتك. كل قطعة بنفذها يدويًا باهتمام فائق بالتفاصيل، بتشطيب ناعم وألوان هادية تمنح بيتك لمسة فنية دافئة.',
    section_categories_enabled: true,
    section_featured_enabled: true,
    section_seasonal_enabled: true,
    section_custom_request_enabled: true,
    catalog_categories_config: DEFAULT_CATEGORY_CONFIGS,
    catalog_collections_config: DEFAULT_COLLECTION_CONFIGS,
    catalog_featured_product_ids: [],
    // Public Content Defaults (Brand Safe)
    about_eyebrow: 'حرفية يدوية مصرية معاصرة',
    about_title: 'شغف بالجمال، وصناعة يدوية / معمولة بتركيز ودقة 🤍',
    about_story: 'في Gogo Concrete Designs، نؤمن بأن تفاصيل المنزل الصغيرة هي التي تصنع روحه ودفئه. بدأنا من فكرة بسيطة: ابتكار قطع فنية راقية وناعمة الملمس، تدوم طويلاً وتضفي لمسة من الدفء والجمال على كل ركن.',
    about_craft_title: 'فلسفة التصميم والتشطيب',
    about_craft_text: 'تتميز منتجاتنا بالتوازن بين البساطة والعملية؛ سواء كانت صينية تقديم ديكورية، مبخرة عصرية، حامل شموع دافئ، أو طقم هدايا متناسق. كل قطعة تمر بالصب الدقيق، الصنفرة الحريرية، طبقات العزل والحماية، مع لبادات حماية الطاولات.',
    contact_eyebrow: 'خدمة العملاء والطلبات الخاصة',
    contact_title: 'يسعدنا تواصلك واستقبال استفساراتك 🤍',
    contact_subtitle: 'سواء كان لديكِ استفسار عن قطعة معينة، أو رغبة في تنسيق طقم بألوان مخصصة أو إضافة نقش إهداء بالاسم، نحن دائماً هنا لمساعدتك.',
    contact_hours: 'يومياً من الساعة 10:00 صباحاً حتى 11:00 مساءً (الطلبات عبر الموقع متاحة 24/7).',
    contact_coverage: 'شحن سريع ومغلف بعناية فائقة ضد الكسر لكافة محافظات جمهورية مصر العربية.',
    shipping_eyebrow: 'الشحن الآمن والعربون',
    shipping_title: 'سياسة الشحن والتسليم وضمان الجودة',
    shipping_subtitle: 'نحرص على أن تصلك كل قطعة يدوية بأعلى معايير الأمان والتغليف الفاخر وبأسرع وقت ممكن.',
    shipping_prep_time: 'نظراً لأن القطع تُصب وتُعالج يدوياً، يستغرق التجهيز من 2 إلى 4 أيام عمل لضمان جفاف وتشطيب مثالي.',
    shipping_coverage_details: 'القاهرة والجيزة والإسكندرية: 24-48 ساعة بعد انتهاء التجهيز | باقي المحافظات: 2-4 أيام عمل.',
    shipping_damage_guarantee: 'في حال وصول أي قطعة متضررة أثناء الشحن، نتحمل إعادة تنفيذها وشحنها لكِ مجاناً أو رد قيمتها بالكامل فور إبلاغنا بصورة التلف.',
    terms_title: 'الشروط والأحكام',
    terms_subtitle: 'توضح هذه الشروط حقوق والتزامات كل من العميل ومتجر Gogo Designs لضمان تجربة شراء شفافة وموثوقة.',
    terms_craft_nature: 'جميع القطع مصنوعة ومصبوبة يدوياً، ولذلك قد توجد اختلافات طفيفة جداً في تموجات الألوان أو الملامس، وهو ما يعكس أصالة الحرفة اليدوية ولا يُعد عيباً.',
    terms_deposit_policy: 'يُعد الطلب مؤكداً فقط بعد تحويل عربون 50% من إجمالي قيمة المنتجات، حيث يبدأ تجهيز وصب القطع خصيصاً بناءً على هذا التأكيد.',
    terms_cancellation_policy: 'يمكن للعميل طلب تعديل الألوان أو إلغاء الطلب واسترداد العربون كاملاً خلال 12 ساعة من تقديم الطلب وقبل بدء مرحلة التنفيذ.',
    terms_custom_orders_policy: 'القطع المنقوشة بأسماء أو عبارات خاصة لا يمكن استرجاعها بعد التنفيذ إلا في حال وجود خطأ من جانبنا مخالف للمكتوب في نموذج الطلب.',
    terms_inspection_policy: 'يلتزم العميل بمعاينة الطرد في حضور مندوب شركة الشحن وسداد المبلغ المتبقي، وفي حال وجود تلف يتم توثيقه بالصورة فوراً للاستبدال الفوري.',
    privacy_title: 'سياسة الخصوصية',
    privacy_subtitle: 'نلتزم بحماية خصوصيتك وضمان سرية كافة البيانات التي تشاركينها معنا أثناء إتمام وتوصيل طلبك.',
    privacy_collected_data: 'نجمع فقط البيانات الأساسية اللازمة لتجهيز وشحن طلبك: الاسم، رقم الهاتف للتواصل عبر واتساب، عنوان الشحن بالتفصيل، وملاحظات التخصيص.',
    privacy_usage: 'تُستخدم بياناتك حصرياً لتنفيذ طلبك، وتزويد مندوب الشحن بالعنوان، وإرسال إشعارات التتبع وتأكيد العربون عبر واتساب.',
    privacy_third_party: 'نتعهد بعدم بيع أو تأجير أو مشاركة أي من بياناتك الشخصية مع أي أطراف ثالثة لأغراض دعائية أو إعلانية. بياناتك في سرية تامة.',
    privacy_receipts_security: 'يتم تخزين صور إيصالات التحويل المرفوعة عبر قنوات آمنة ومشفرة، وتُستخدم فقط من قِبل إدارة المتجر لمطابقة مبالغ العربون.',
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
      if (item.key === 'store_subtitle') result.store_subtitle = item.value;
      if (item.key === 'whatsapp_number') result.whatsapp_number = item.value;
      if (item.key === 'contact_email') result.contact_email = item.value;
      if (item.key === 'instagram_url') result.instagram_url = item.value;
      if (item.key === 'vodafone_cash') result.vodafone_cash = item.value;
      if (item.key === 'instapay') result.instapay = item.value;
      if (item.key === 'deposit_percentage') result.deposit_percentage = Math.min(100, Math.max(10, Number(item.value) || 50));
      if (item.key === 'currency') result.currency = item.value;
      if (item.key === 'payment_instructions') result.payment_instructions = item.value;
      if (item.key === 'shipping_instructions') result.shipping_instructions = item.value;
      if (item.key === 'maintenance_mode') result.maintenance_mode = item.value === 'true';
      if (item.key === 'header_logo_url') result.header_logo_url = item.value || undefined;
      if (item.key === 'hero_eyebrow') result.hero_eyebrow = item.value || undefined;
      if (item.key === 'hero_title') result.hero_title = item.value || undefined;
      if (item.key === 'hero_subtitle') result.hero_subtitle = item.value || undefined;
      if (item.key === 'hero_banner_url') result.hero_banner_url = item.value || undefined;
      if (item.key === 'promo_banner_active') result.promo_banner_active = item.value !== 'false';
      if (item.key === 'promo_banner_title') result.promo_banner_title = item.value || undefined;
      if (item.key === 'promo_banner_badge') result.promo_banner_badge = item.value || undefined;
      if (item.key === 'promo_banner_image_url') result.promo_banner_image_url = item.value || undefined;
      if (item.key === 'promo_banner_link') result.promo_banner_link = item.value || undefined;
      if (item.key === 'section_categories_enabled') result.section_categories_enabled = item.value !== 'false';
      if (item.key === 'section_featured_enabled') result.section_featured_enabled = item.value !== 'false';
      if (item.key === 'section_seasonal_enabled') result.section_seasonal_enabled = item.value !== 'false';
      if (item.key === 'section_custom_request_enabled') result.section_custom_request_enabled = item.value !== 'false';
      if (item.key === 'catalog_categories_config' && item.value) {
        try {
          const parsed = JSON.parse(item.value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            result.catalog_categories_config = parsed;
          }
        } catch { }
      }
      if (item.key === 'catalog_collections_config' && item.value) {
        try {
          const parsed = JSON.parse(item.value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            result.catalog_collections_config = parsed;
          }
        } catch { }
      }
      if (item.key === 'catalog_featured_product_ids' && item.value) {
        try {
          const parsed = JSON.parse(item.value);
          if (Array.isArray(parsed)) {
            result.catalog_featured_product_ids = parsed;
          }
        } catch { }
      }
      if (item.key === 'seo_meta_title') result.seo_meta_title = item.value || undefined;
      if (item.key === 'seo_meta_description') result.seo_meta_description = item.value || undefined;
      if (item.key === 'seo_og_image_url') result.seo_og_image_url = item.value || undefined;
      // Public Content Key Mappings
      if (item.key === 'about_eyebrow') result.about_eyebrow = item.value || undefined;
      if (item.key === 'about_title') result.about_title = item.value || undefined;
      if (item.key === 'about_story') result.about_story = item.value || undefined;
      if (item.key === 'about_craft_title') result.about_craft_title = item.value || undefined;
      if (item.key === 'about_craft_text') result.about_craft_text = item.value || undefined;
      if (item.key === 'contact_eyebrow') result.contact_eyebrow = item.value || undefined;
      if (item.key === 'contact_title') result.contact_title = item.value || undefined;
      if (item.key === 'contact_subtitle') result.contact_subtitle = item.value || undefined;
      if (item.key === 'contact_hours') result.contact_hours = item.value || undefined;
      if (item.key === 'contact_coverage') result.contact_coverage = item.value || undefined;
      if (item.key === 'shipping_eyebrow') result.shipping_eyebrow = item.value || undefined;
      if (item.key === 'shipping_title') result.shipping_title = item.value || undefined;
      if (item.key === 'shipping_subtitle') result.shipping_subtitle = item.value || undefined;
      if (item.key === 'shipping_prep_time') result.shipping_prep_time = item.value || undefined;
      if (item.key === 'shipping_coverage_details') result.shipping_coverage_details = item.value || undefined;
      if (item.key === 'shipping_damage_guarantee') result.shipping_damage_guarantee = item.value || undefined;
      if (item.key === 'terms_title') result.terms_title = item.value || undefined;
      if (item.key === 'terms_subtitle') result.terms_subtitle = item.value || undefined;
      if (item.key === 'terms_craft_nature') result.terms_craft_nature = item.value || undefined;
      if (item.key === 'terms_deposit_policy') result.terms_deposit_policy = item.value || undefined;
      if (item.key === 'terms_cancellation_policy') result.terms_cancellation_policy = item.value || undefined;
      if (item.key === 'terms_custom_orders_policy') result.terms_custom_orders_policy = item.value || undefined;
      if (item.key === 'terms_inspection_policy') result.terms_inspection_policy = item.value || undefined;
      if (item.key === 'privacy_title') result.privacy_title = item.value || undefined;
      if (item.key === 'privacy_subtitle') result.privacy_subtitle = item.value || undefined;
      if (item.key === 'privacy_collected_data') result.privacy_collected_data = item.value || undefined;
      if (item.key === 'privacy_usage') result.privacy_usage = item.value || undefined;
      if (item.key === 'privacy_third_party') result.privacy_third_party = item.value || undefined;
      if (item.key === 'privacy_receipts_security') result.privacy_receipts_security = item.value || undefined;
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
