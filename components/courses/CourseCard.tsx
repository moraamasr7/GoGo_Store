'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, Clock, Video, BookOpen, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

import { Course, sampleCourses } from '@/lib/coursesData';
export type { Course };
export { sampleCourses };

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const handleRegister = () => {
    toast.success(`تم حفظ رغبتك في حجز ورشة "${course.title}". تواصلي معنا عبر واتساب لتأكيد المقعد! ✨`);
    const cleanPhone = '201012345678';
    const msg = `مرحباً Gogo Concrete، أود الاشتراك في ${course.title} المقررة بتاريخ ${course.liveDate}.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="group relative flex flex-col lg:flex-row bg-white dark:bg-stone-900/90 rounded-3xl border border-stone-200/80 dark:border-stone-800/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
      
      {/* Visual / Cover */}
      <div className="relative lg:w-2/5 aspect-[16/10] lg:aspect-auto overflow-hidden bg-sand-100 dark:bg-stone-800">
        <Image
          src={course.imageUrl}
          alt={course.title}
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent lg:hidden" />
        
        {/* Floating badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-900/90 dark:bg-brass-500 text-white dark:text-stone-950 backdrop-blur-md shadow-md">
            {course.badge || 'ورشة تعليمية'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between gap-6">
        
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded-lg bg-sand-200/80 dark:bg-stone-800 text-stone-800 dark:text-brass-300 font-bold">
              المستوى: {course.level}
            </span>
            <span className="flex items-center gap-1 text-stone-500 dark:text-stone-400 font-medium">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{course.lessonsCount} محاور تدريبية</span>
            </span>
            <span className="flex items-center gap-1 text-stone-500 dark:text-stone-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.duration}</span>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
            {course.title}
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {course.subtitle}
          </p>

          {/* Live Date Box */}
          <div className="p-3.5 rounded-2xl bg-sand-50 dark:bg-stone-800/60 border border-sand-200/80 dark:border-stone-700/60 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-stone-800 dark:text-stone-200 font-bold">
              <Calendar className="w-4 h-4 text-brass-500" />
              <span>موعد البث التفاعلي: {course.liveDate}</span>
            </div>
            {course.spotsLeft && (
              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md border border-rose-200/80 dark:border-rose-900/60">
                باقي {course.spotsLeft} مقاعد
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 block">رسوم الورشة</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-stone-950 dark:text-sand-100">
                {formatPrice(course.price)}
              </span>
              {course.originalPrice && (
                <span className="text-xs text-stone-400 line-through font-mono">
                  {formatPrice(course.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <Button
            onClick={handleRegister}
            variant="primary"
            size="md"
            rightIcon={<ArrowLeft className="w-4 h-4" />}
          >
            حجز المقعد الآن
          </Button>
        </div>

      </div>

    </div>
  );
}
