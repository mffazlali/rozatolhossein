/**
 * Content Types
 * تایپ‌های محتوا از API روضة الحسین
 *
 * @endpoint GET /page/content_view?lang=fa&content_id={id}
 * @updated December 2024
 */

/**
 * Content Field Data
 * فیلد تاریخ محتوا
 */
export interface ContentFieldData {
  id: number;
  field_type_id: number;
  title: string;
  value: string;
  text: string;
}

/**
 * Content Fields
 */
export interface ContentFields {
  data: ContentFieldData;
}

/**
 * Content Category/Tag Item
 * آیتم دسته‌بندی یا تگ
 */
export interface ContentTagItem {
  id: string;
  title: string;
}

/**
 * Content File (Image/Audio)
 * فایل محتوا
 */
export interface ContentFile {
  id: string;
  file_name: string;
  file_type: string;
  file_size: string;
  file_path?: string;
  thumb_path?: string;
  thump_path?: string;
  url?: string;
}

/**
 * Content Video File
 * فایل ویدیو با رزولوشن‌های مختلف
 */
export interface ContentVideoFile {
  file_path: string;
  file: {
    id: string;
    file_name: string;
    file_type: string;
    file_size: string;
    url: string;
  };
  resolution: {
    [key: string]: string;
  };
}

/**
 * Content Files
 * فایل‌های محتوا
 */
export interface ContentFiles {
  pics: ContentFile[];
  videos: ContentVideoFile[];
  sounds: ContentFile[];
}

/**
 * Content Detail
 * جزئیات محتوا از API
 */
export interface ContentDetail {
  id: string;
  parent_id: string;
  title: string;
  surtitle: string;
  subtitle: string;
  hidden_thumb: boolean;
  summary: string;
  body: string;
  active: string;
  content_type_id: number;
  owner_user_id: string;
  user_id: string;
  fields: ContentFields;
  language_id: string;
  image_path: string;
  thumb_path: string;
  thump_path: string;
  image_path_contentpage: string;
  thumb_path_contentpage: string;
  categories: ContentTagItem[];
  created_at: string;
  persons: ContentTagItem[];
  style: ContentTagItem[];
  occasions: ContentTagItem[];
  place: ContentTagItem[];
  heyat: ContentTagItem[];
  package: ContentTagItem[];
  tags: ContentTagItem[];
  related: ContentTagItem[];
  related_context: ContentTagItem[];
  sections: ContentTagItem[];
  rel_date: ContentFieldData;
  files: ContentFiles;
  seo_markup: string;
  marasem_type?: string;
}

/**
 * Content View API Response
 * پاسخ API جزئیات محتوا
 */
export interface ContentViewResponse {
  content: ContentDetail;
  connections: unknown[];
}

export function getContentHref(locale: string, contentId?: string): string {
  return `/${locale}/content/${contentId}`;
}
