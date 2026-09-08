export interface Course {
  id: string;
  title: string;
  subtitle: string;
  level: 'مبتدئ' | 'متوسط' | 'شامل ومتقدم';
  price: number;
  originalPrice?: number;
  liveDate: string;
  duration: string;
  lessonsCount: number;
  imageUrl: string;
  spotsLeft?: number;
  badge?: string;
}

export const sampleCourses: Course[] = [
  {
    id: 'course-master-concrete',
    title: 'أسرار صب ومعالجة الكونكريت الديكوري الملون',
    subtitle: 'تعلمي خطوة بخطوة كيفية خلط البودرة، صب القوالب بدون فقاعات هواء، واستخراج ألوان متموجة رخامية فاخرة مع طبقات العزل الحجرية.',
    level: 'شامل ومتقدم',
    price: 850,
    originalPrice: 1200,
    liveDate: 'الجمعة، 18 سبتمبر 2026 - 7:00 م',
    duration: '4 ساعات بث مباشر تفاعلي',
    lessonsCount: 6,
    imageUrl: 'https://images.unsplash.com/photo-1594913785162-e678a0c23ee9?auto=format&fit=crop&w=1000&q=80',
    spotsLeft: 4,
    badge: 'الورشة التفاعلية القادمة 🔥',
  },
  {
    id: 'course-terrazzo-craft',
    title: 'ورشة فن التيرازو (Terrazzo) والتشطيب المعماري',
    subtitle: 'فن كسر الحجر والرقائق الملونة داخل القطع الخرسانية لتصميم صواني وكوسترز فنية بلمسة إيطالية يدوية.',
    level: 'مبتدئ',
    price: 600,
    originalPrice: 850,
    liveDate: 'الأحد، 27 سبتمبر 2026 - 6:00 م',
    duration: '3 ساعات عملية',
    lessonsCount: 4,
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
    spotsLeft: 7,
    badge: 'مقاعد محدودة',
  }
];
