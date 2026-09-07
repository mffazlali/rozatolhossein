/**
 * Term Types
 * تایپ‌های اصطلاحات از API روضة الحسین
 *
 * @endpoint GET /page/term?lang=fa&tid={termId}
 * @updated February 2026
 */

/**
 * Term Item
 * آیتم اصطلاح
 */
export interface TermItem {
  tid: string;
  title: string;
}

/**
 * Term API Response
 * پاسخ کامل API اصطلاحات
 */
export interface TermApiResponse {
  status: number;
  message: string;
  site: unknown[];
  data: TermItem[];
}

/**
 * Term Params
 * پارامترهای دریافت اصطلاح
 */
export interface TermParams {
  tid: string;
  lang?: string;
}
