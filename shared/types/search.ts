/**
 * Search Types
 * تایپ‌های جستجو از API روضة الحسین
 *
 * @endpoint GET /page/search?lang=fa&service={serviceId}&phrase={phrase}
 * @updated January 2025
 */

/**
 * Search Content Field Data
 * فیلد تاریخ محتوای جستجو
 */
export interface SearchFieldData {
  value: string;
  text: string;
}

/**
 * Search Content Fields
 */
export interface SearchContentFields {
  data: SearchFieldData;
}

/**
 * Search Content Item
 * آیتم محتوا در نتایج جستجو
 */
export interface SearchContentItem {
  id: string;
  title: string;
  surtitle: string;
  subtitle: string;
  image_path: string;
  thumb_path: string;
  thump_path: string;
  fields: SearchContentFields;
  content_type_id: string;
  service: string;
  created_at: string;
  summary: string;
}

/**
 * Search Pagination
 * اطلاعات صفحه‌بندی جستجو
 */
export interface SearchPagination {
  lastPage: number;
  currentPage: number;
}

/**
 * Search Contents
 * محتوای نتایج جستجو
 */
export interface SearchContents {
  data: SearchContentItem[];
  pagination: SearchPagination;
}

/**
 * Search Category
 * دسته‌بندی جستجو (وقتی service یا پارامترهای دیگر داده شود)
 */
export interface SearchCategory {
  id: string;
  title: string;
  description?: string;
}

/**
 * Search Original Data
 * داده‌های اصلی جستجو
 */
export interface SearchOriginalData {
  contents: SearchContents;
  category?: SearchCategory;
}

/**
 * Search Data
 * داده‌های جستجو
 */
export interface SearchData {
  original: SearchOriginalData;
}

/**
 * Search Response Data
 * داده‌های پاسخ جستجو
 */
export interface SearchResponseData {
  search: SearchData;
}

/**
 * Search API Response
 * پاسخ کامل API جستجو
 */
export interface SearchApiResponse {
  status: number;
  message: string;
  site: unknown[];
  data: SearchResponseData;
}

/**
 * Search Params
 * پارامترهای جستجو
 */
export interface SearchParams {
  phrase?: string;
  service?: string;
  tag?: string;
  people?: string;
  style?: string;
  occasion?: string;
  place?: string;
  heyat?: string;
  page?: number;
}

/**
 * Search Result
 * نتیجه جستجو برای استفاده در کامپوننت‌ها
 */
export interface SearchResult {
  items: SearchContentItem[];
  pagination: SearchPagination;
  category?: SearchCategory;
  totalResults: number;
}
