/**
 * Search Service
 * سرویس جستجو - API روضة الحسین
 *
 * @endpoint GET /page/search?lang=fa&service={serviceId}&phrase={phrase}&page={page}
 * @updated January 2025
 */

import { apiClient } from '@/shared/lib/apiClient';
import type {
  SearchApiResponse,
  SearchParams,
  SearchResult,
  SearchContentItem,
} from '@/shared/types/search';

/**
 * تبدیل SearchApiResponse به SearchResult
 */
function mapApiResponseToSearchResult(response: SearchApiResponse): SearchResult {
  const original = response.data?.search?.original;
  const contents = original?.contents;
  const pagination = contents?.pagination;

  // اصلاح currentPage - اگر 0 بود، 1 قرار بده
  const currentPage = pagination?.currentPage || 1;
  const lastPage = pagination?.lastPage || 1;

  return {
    items: contents?.data || [],
    pagination: {
      lastPage,
      currentPage: currentPage === 0 ? 1 : currentPage,
    },
    category: original?.category,
    totalResults: contents?.data?.length || 0,
  };
}

export const searchService = {
  /**
   * جستجوی محتوا
   * @endpoint GET /page/search?lang=fa&service={serviceId}&phrase={phrase}&page={page}
   * @param params - پارامترهای جستجو
   */
  async search(params: SearchParams): Promise<SearchResult> {
    try {
      const queryParams: Record<string, string> = {
        lang: 'fa',
      };

      if (params.phrase) {
        queryParams.phrase = params.phrase;
      }

      if (params.service) {
        queryParams.service = params.service;
      }

      if (params.tag) {
        queryParams.tag = params.tag;
      }

      if (params.people) {
        queryParams.people = params.people;
      }

      if (params.style) {
        queryParams.style = params.style;
      }

      if (params.occasion) {
        queryParams.occasion = params.occasion;
      }

      if (params.place) {
        queryParams.place = params.place;
      }

      if (params.heyat) {
        queryParams.heyat = params.heyat;
      }

      if (params.page !== undefined && params.page > 0) {
        queryParams.page = String(params.page);
      }

      const response = await apiClient.get<SearchApiResponse>('page/search', queryParams);

      const result = mapApiResponseToSearchResult(response);

      return result;
    } catch (error) {
      console.error('❌ Search Error:', error);
      return {
        items: [],
        pagination: { lastPage: 1, currentPage: 1 },
        totalResults: 0,
      };
    }
  },

  /**
   * جستجو با عبارت
   * @param phrase - عبارت جستجو
   * @param page - شماره صفحه (اختیاری)
   */
  async searchByPhrase(phrase: string, page?: number): Promise<SearchResult> {
    return this.search({ phrase, page });
  },

  /**
   * جستجو در سرویس خاص
   * @param serviceId - شناسه سرویس
   * @param phrase - عبارت جستجو (اختیاری)
   * @param page - شماره صفحه (اختیاری)
   */
  async searchByService(serviceId: string, phrase?: string, page?: number): Promise<SearchResult> {
    return this.search({ service: serviceId, phrase, page });
  },

  /**
   * جستجو بر اساس کلیدواژه
   * @param tagId - شناسه کلیدواژه
   * @param phrase - عبارت جستجو (اختیاری)
   * @param page - شماره صفحه (اختیاری)
   */
  async searchByTag(tagId: string, phrase?: string, page?: number): Promise<SearchResult> {
    return this.search({ tag: tagId, phrase, page });
  },

  /**
   * جستجو بر اساس شخص
   * @param peopleId - شناسه شخص
   * @param phrase - عبارت جستجو (اختیاری)
   * @param page - شماره صفحه (اختیاری)
   */
  async searchByPeople(peopleId: string, phrase?: string, page?: number): Promise<SearchResult> {
    return this.search({ people: peopleId, phrase, page });
  },

  /**
   * جستجو بر اساس سبک
   * @param styleId - شناسه سبک
   * @param phrase - عبارت جستجو (اختیاری)
   * @param page - شماره صفحه (اختیاری)
   */
  async searchByStyle(styleId: string, phrase?: string, page?: number): Promise<SearchResult> {
    return this.search({ style: styleId, phrase, page });
  },

  /**
   * جستجو بر اساس مناسبت
   * @param occasionId - شناسه مناسبت
   * @param phrase - عبارت جستجو (اختیاری)
   * @param page - شماره صفحه (اختیاری)
   */
  async searchByOccasion(occasionId: string, phrase?: string, page?: number): Promise<SearchResult> {
    return this.search({ occasion: occasionId, phrase, page });
  },

  /**
   * جستجو بر اساس مکان
   * @param placeId - شناسه مکان
   * @param phrase - عبارت جستجو (اختیاری)
   * @param page - شماره صفحه (اختیاری)
   */
  async searchByPlace(placeId: string, phrase?: string, page?: number): Promise<SearchResult> {
    return this.search({ place: placeId, phrase, page });
  },

  /**
   * جستجو بر اساس هیئت
   * @param heyatId - شناسه هیئت
   * @param phrase - عبارت جستجو (اختیاری)
   * @param page - شماره صفحه (اختیاری)
   */
  async searchByHeyat(heyatId: string, phrase?: string, page?: number): Promise<SearchResult> {
    return this.search({ heyat: heyatId, phrase, page });
  },

  /**
   * دریافت آیتم‌های جستجو
   * @param params - پارامترهای جستجو
   */
  async getSearchItems(params: SearchParams): Promise<SearchContentItem[]> {
    const result = await this.search(params);
    return result.items;
  },
};
