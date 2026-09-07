/**
 * Home Service
 * سرویس صفحه اصلی - API روضة الحسین
 *
 * @endpoint GET /page/home?lang=fa
 * @collection asrepayesh / asrepayesh-rozatolhossein / Home Page Blocks
 * @updated January 2026
 */

import { apiClient } from '@/shared/lib/apiClient';
import type { HomePageResponse } from '@/shared/types/home';
import { defaultLocale } from '@/shared/lib/i18n';

export const homeService = {
  /**
   * دریافت داده‌های صفحه اصلی
   * @endpoint GET /page/home?lang={lang}
   */
  async getHomeData(lang: string = defaultLocale): Promise<HomePageResponse | null> {
    try {
      const response = await apiClient.get<HomePageResponse>('page/home', {
        lang,
      });
      return response;
    } catch (error) {
      console.error('Error fetching home data:', error);
      return null;
    }
  },
};
