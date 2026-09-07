/**
 * Link Types
 * تایپ‌های مربوط به صفحه لینک‌ها
 */

/**
 * Social Link Type
 * تایپ لینک شبکه اجتماعی
 */
export interface SocialLink {
  id: string;
  title: string;
  url: string;
  icon: string; // FontAwesome icon class
}

/**
 * Link Page Response Type
 * تایپ پاسخ صفحه لینک
 */
export interface LinkPageResponse {
  id: string;
  name: string;
  description: string;
  image: string;
  links: SocialLink[];
}
