/**
 * Vocab Service
 * API integration from Postman
 * 
 * @collection asrepayesh-rozatolhossein
 * @workspace asrepayesh
 * @endpoint GET /ape-api/v1/page/vocab
 * @updated February 2026
 */

import { apiClient } from '@/shared/lib/apiClient';
import type { VocabResponse, VocabData, VocabQueryParams } from '@/shared/types';

export const vocabService = {
  /**
   * دریافت لیست واژگان بر اساس نام
   * @endpoint GET /ape-api/v1/page/vocab
   * @param params - پارامترهای جستجو
   * @returns داده‌های واژگان یا null در صورت خطا
   */
  async getVocab(params: VocabQueryParams): Promise<VocabData | null> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('name', params.name);
      
      if (params.lang) {
        queryParams.append('lang', params.lang);
      }
      if (params.pid) {
        queryParams.append('pid', params.pid);
      }
      if (params.level) {
        queryParams.append('level', params.level);
      }

      const response = await apiClient.get<VocabResponse>(
        `page/vocab?${queryParams.toString()}`
      );

      if (response.status === 1 && response.data?.vocab) {
        return response.data.vocab;
      }

      return null;
    } catch (error) {
      console.error('Error fetching vocab:', error);
      return null;
    }
  },

  /**
   * دریافت واژگان بر اساس نام (با زبان پیش‌فرض فارسی)
   * @param name - نام دسته واژگان (مثل place, person, occasion)
   * @param lang - زبان (پیش‌فرض: fa)
   */
  async getVocabByName(name: string, lang: string = 'fa'): Promise<VocabData | null> {
    return this.getVocab({ name, lang });
  },
};
