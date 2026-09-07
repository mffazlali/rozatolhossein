/**
 * Media Types
 * تایپ‌های مربوط به رسانه (صوت و تصویر)
 * 
 * مطابق استانداردهای پروژه روضة الحسین
 */

/**
 * Audio Item Type
 * تایپ آیتم صوتی
 */
export interface AudioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  href: string;
  audioUrl: string;
  duration: string;
}

/**
 * Video Item Type
 * تایپ آیتم ویدیویی
 */
export interface VideoItem {
  id: string;
  title: string;
  category: string;
  speaker?: string;
  image: string;
  videoUrl?: string;
  href: string;
  duration: string;
  views?: number;
  likes?: number;
  publishedAt?: string;
}

/**
 * Session Item Type
 * تایپ آیتم جلسه
 */
export interface SessionItem {
  id: string;
  title: string;
  date: string;
  image: string;
  href: string;
}
