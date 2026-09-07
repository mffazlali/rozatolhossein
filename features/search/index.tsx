/**
 * Search Feature
 * فیچر جستجو - Server Component با Initial Fetch
 */

import { vocabService, searchService } from '@/shared/services';
import { SearchContent } from './components';
import type { VocabData, SearchResult } from '@/shared/types';

interface SearchFeatureProps {
  searchParams: {
    phrase?: string;
    service?: string;
    place?: string;
    heyat?: string;
    style?: string;
    people?: string;
    occasion?: string;
    page?: string;
  };
}

export async function Search({ searchParams }: SearchFeatureProps) {
  // لیست vocab names برای fetch
  const vocabNames = [
    { key: 'categories', name: 'categories' },
    { key: 'places', name: 'place' },
    { key: 'heyats', name: 'heyat' },
    { key: 'styles', name: 'style' },
    { key: 'people', name: 'persons' },
    { key: 'occasions', name: 'occasions' },
  ] as const;

  // Fetch همه vocab data به صورت موازی
  const vocabResults = await Promise.all(
    vocabNames.map(({ name }) => vocabService.getVocabByName(name))
  );

  // ساخت vocabData object
  const vocabData = vocabNames.reduce(
    (acc, { key }, index) => {
      acc[key] = vocabResults[index];
      return acc;
    },
    {} as {
      categories: VocabData | null;
      places: VocabData | null;
      heyats: VocabData | null;
      styles: VocabData | null;
      people: VocabData | null;
      occasions: VocabData | null;
    }
  );

  // اگر فیلتری فعال است، جستجو را در سرور انجام بده
  let initialResults: SearchResult | null = null;
    try {
      initialResults = await searchService.search({
        phrase: searchParams.phrase,
        service: searchParams.service,
        place: searchParams.place,
        heyat: searchParams.heyat,
        style: searchParams.style,
        people: searchParams.people,
        occasion: searchParams.occasion,
        page: searchParams.page ? parseInt(searchParams.page, 10) : 1,
      });
    } catch (error) {
      console.error('❌ Initial search error:', error);
      initialResults = null;
    }
  

  return (
    <SearchContent
      vocabData={vocabData}
      currentParams={searchParams}
      initialResults={initialResults}
    />
  );
}
