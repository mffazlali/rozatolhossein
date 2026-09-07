/**
 * Term Service
 * سرویس اصطلاحات - API روضة الحسین
 *
 * @collection asrepayesh-rozatolhossein
 * @workspace asrepayesh
 * @endpoint GET /page/term?lang=fa&tid={termId}
 * @updated February 2026
 */

import { cache } from 'react';
import { apiClient } from '@/shared/lib/apiClient';
import type { TermApiResponse, TermItem, TermParams } from '@/shared/types/term';

/**
 * دریافت اطلاعات اصطلاح بر اساس tid (با cache)
 * این تابع با استفاده از React cache، درخواست‌های تکراری را در یک render cycle کش می‌کند
 */
const getCachedTerm = cache(async (params: TermParams): Promise<TermItem | null> => {
  try {
    const queryParams: Record<string, string> = {
      lang: params.lang || 'fa',
      tid: params.tid,
    };

    const response = await apiClient.get<TermApiResponse>('page/term', queryParams);

    if (response.data && response.data.length > 0) {
      return response.data[0];
    }

    return null;
  } catch (error) {
    console.error('Error fetching term:', error);
    return null;
  }
});

export const termService = {
  /**
   * دریافت اطلاعات اصطلاح بر اساس tid
   * @endpoint GET /page/term?lang=fa&tid={termId}
   * @param params - پارامترهای دریافت اصطلاح
   */
  async getTerm(params: TermParams): Promise<TermItem | null> {
    return getCachedTerm(params);
  },

  /**
   * دریافت اصطلاح با tid
   * @param tid - شناسه اصطلاح
   */
  async getTermById(tid: string): Promise<TermItem | null> {
    return getCachedTerm({ tid });
  },

  /**
   * دریافت لیست اصطلاحات (در صورت نیاز به چند tid)
   * @param tids - لیست شناسه‌های اصطلاح
   */
  async getTerms(tids: string[]): Promise<TermItem[]> {
    try {
      const promises = tids.map(tid => getCachedTerm({ tid }));
      const results = await Promise.all(promises);
      return results.filter((item): item is TermItem => item !== null);
    } catch (error) {
      console.error('Error fetching terms:', error);
      return [];
    }
  },
};
