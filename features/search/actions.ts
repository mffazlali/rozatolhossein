/**
 * Search Server Actions
 * اکشن‌های سرور برای جستجو
 */
'use server';

import { searchService } from '@/shared/services';
import type { SearchResult } from '@/shared/types';

interface SearchParams {
  phrase?: string;
  service?: string;
  place?: string;
  heyat?: string;
  style?: string;
  people?: string;
  occasion?: string;
  page?: number;
}

/**
 * Server Action برای جستجو
 * این اکشن از Client Component صدا زده می‌شه و نیازی به re-render کل صفحه نیست
 */
export async function searchAction(params: SearchParams): Promise<SearchResult | null> {
  try {
    // بررسی اینکه آیا فیلتری فعال است
    
    // فراخوانی سرویس جستجو
    const results = await searchService.search(params);
    return results;
  } catch (error) {
    console.error('Search action error:', error);
    throw error;
  }
}
