/**
 * SearchContent Component
 * کامپوننت اصلی محتوای جستجو
 */
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { searchAction } from '../actions';
import { SearchSidebar } from './SearchSidebar';
import { SearchResults } from './SearchResults';
import type { VocabData, SearchResult } from '@/shared/types';

interface SearchContentProps {
  vocabData: {
    categories: VocabData | null;
    places: VocabData | null;
    heyats: VocabData | null;
    styles: VocabData | null;
    people: VocabData | null;
    occasions: VocabData | null;
  };
  currentParams: {
    phrase?: string;
    service?: string;
    place?: string;
    heyat?: string;
    style?: string;
    people?: string;
    occasion?: string;
    page?: string;
  };
  initialResults: SearchResult | null;
}

export const SearchContent = ({ vocabData, currentParams, initialResults }: SearchContentProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<SearchResult | null>(initialResults);
  const [activeParams, setActiveParams] = useState(currentParams);

  // تابع برای بروزرسانی URL
  const updateURL = (params: typeof currentParams) => {
    const newSearchParams = new URLSearchParams();

    if (params.phrase) newSearchParams.set('phrase', params.phrase);
    if (params.service) newSearchParams.set('service', params.service);
    if (params.place) newSearchParams.set('place', params.place);
    if (params.heyat) newSearchParams.set('heyat', params.heyat);
    if (params.style) newSearchParams.set('style', params.style);
    if (params.people) newSearchParams.set('people', params.people);
    if (params.occasion) newSearchParams.set('occasion', params.occasion);
    if (params.page && params.page !== '1') newSearchParams.set('page', params.page) ;

    const queryString = newSearchParams.toString();
    const newURL = queryString ? `/search?${queryString}` : '/search';
    
    router.push(newURL, { scroll: false });
  };

  // جستجو با Server Action
  const performSearch = async (params: typeof currentParams) => {
    const searchParams = {
      phrase: params.phrase,
      service: params.service,
      place: params.place,
      heyat: params.heyat,
      style: params.style,
      people: params.people,
      occasion: params.occasion,
      page: params.page ? parseInt(params.page, 10) : 1,
    };

    // بروزرسانی URL
    updateURL(params);

    startTransition(async () => {
      const searchResults = await searchAction(searchParams);
      setResults(searchResults);
      setActiveParams(params);
    });
  };

  const handleFilterChange = (filters: {
    phrase?: string;
    service?: string;
    place?: string;
    heyat?: string;
    style?: string;
    people?: string;
    occasion?: string;
  }) => {
    // ریست کردن صفحه به 1 وقتی فیلتر تغییر می‌کند
    performSearch({ ...filters, page: '1' });
  };

  const handlePageChange = (page: number) => {
    const newParams = {
      ...activeParams,
      page: page.toString(),
    };
    performSearch(newParams);
    
    // اسکرول به بالای صفحه
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveFilter = (filterKey: string) => {
    const newParams = { ...activeParams };
    delete newParams[filterKey as keyof typeof newParams];
    // ریست کردن صفحه به 1 وقتی فیلتر حذف می‌شود
    newParams.page = '1';
    performSearch(newParams);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-[1140px] mx-auto px-4 md:py-8 py-4">
      {/* Sidebar - 1/4 */}
      <aside className="w-full md:w-1/4">
        <SearchSidebar
          vocabData={vocabData}
          currentParams={activeParams}
          onSearch={handleFilterChange}
          isLoading={isPending}
        />
      </aside>

      {/* Results - 3/4 */}
      <main className="w-full md:w-3/4">
        <SearchResults
          results={results}
          isLoading={isPending}
          onPageChange={handlePageChange}
          vocabData={vocabData}
          activeFilters={activeParams}
          onRemoveFilter={handleRemoveFilter}
        />
      </main>
    </div>
  );
};
