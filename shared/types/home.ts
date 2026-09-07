/**
 * Home Page Types
 * تایپ‌های صفحه اصلی از API روضة الحسین
 *
 * @endpoint GET /page/home?lang=fa
 * @collection asrepayesh / asrepayesh-rozatolhossein / Home Page Blocks
 * @updated January 2026
 */

/**
 * Content Item Fields
 * فیلدهای تاریخ آیتم
 */
export interface ContentItemFields {
  data: {
    value: string; // "2025/12/28"
    text: string; // "۱۴۰۴/۱۰/۰۷"
  };
}

/**
 * Home Content Item
 * آیتم محتوا در صفحه اصلی (جلسات، صوت، ویدیو)
 */
export interface HomeContentItem {
  id: string;
  title: string;
  surtitle: string;
  subtitle: string;
  image_path: string;
  thumb_path: string;
  thump_path: string;
  fields: ContentItemFields;
  content_type_id: number | string;
  service: string;
  created_at: string;
  body?: string;
  summary?: string;
}

/**
 * Main Slider Item
 * آیتم اسلایدر اصلی صفحه
 */
export interface MainSliderItem {
  thumb: string;
}

/**
 * Main Slider Block
 * بلاک اسلایدر اصلی
 */
export interface MainSliderBlock {
  contents: MainSliderItem[];
}

/**
 * Home Block Contents
 * محتوای هر بلاک در صفحه اصلی
 */
export interface HomeBlockContents {
  data: HomeContentItem[];
}

/**
 * Home Block Meta
 * متادیتای بلاک
 */
export interface HomeBlockMeta {
  block_type: string;
  category_id: number;
}

/**
 * Home Block
 * بلاک صفحه اصلی
 */
export interface HomeBlock {
  contents: HomeBlockContents;
  meta?: HomeBlockMeta;
}

/**
 * Home Page Data
 * داده‌های صفحه اصلی
 */
export interface HomePageData {
  main_slider: MainSliderBlock;
  last_jalasat: HomeBlock;
  multimedia_sounds: HomeBlock;
  multimedia_video: HomeBlock;
}

/**
 * Home Page API Response
 * پاسخ API صفحه اصلی
 */
export interface HomePageResponse {
  status: number;
  message: string;
  site: unknown[];
  data: HomePageData;
}
