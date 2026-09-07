/**
 * SearchResults Component
 * نمایش نتایج جستجو - Grid Layout با Pagination
 */
'use client';

import { useMemo } from 'react';
import { SearchResultCard } from '@/shared/components/dataDisplay';
import { ActiveFilters, Pagination } from '@/shared/components/navigation';
import type { FilterItem } from '@/shared/components/navigation';
import type { SearchResult, VocabData, SearchContentItem } from '@/shared/types';

interface SearchResultsProps {
  results: SearchResult | null;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  vocabData: {
    categories: VocabData | null;
    places: VocabData | null;
    heyats: VocabData | null;
    styles: VocabData | null;
    people: VocabData | null;
    occasions: VocabData | null;
  };
  activeFilters: {
    phrase?: string;
    service?: string;
    place?: string;
    heyat?: string;
    style?: string;
    people?: string;
    occasion?: string;
  };
  onRemoveFilter?: (filterKey: string) => void;
  className?: string;
}

interface SearchResultsGridProps {
  items?: SearchContentItem[];
  skeleton?: boolean;
}

const SearchResultsGrid = ({ items, skeleton = false }: SearchResultsGridProps) => {
  if (skeleton) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <SearchResultCard key={index} skeleton />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <SearchResultCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export const SearchResults = ({
  results,
  isLoading = false,
  onPageChange,
  vocabData,
  activeFilters,
  onRemoveFilter,
  className = '',
}: SearchResultsProps) => {
  // تبدیل activeFilters به فرمت FilterItem[]
  const filterItems = useMemo<FilterItem[]>(() => {
    // تابع برای پیدا کردن نام فیلتر از vocab
    const getFilterLabel = (filterKey: string, filterId: string): string => {
      const vocabMap: Record<string, VocabData | null> = {
        service: vocabData.categories,
        place: vocabData.places,
        heyat: vocabData.heyats,
        style: vocabData.styles,
        people: vocabData.people,
        occasion: vocabData.occasions,
      };

      const vocab = vocabMap[filterKey];
      if (!vocab) return filterId;

      const term = vocab.terms.find((t) => t.id === filterId);
      return term ? term.name : filterId;
    };

    // تابع برای گرفتن عنوان فارسی فیلتر
    const getFilterTypeLabel = (filterKey: string): string => {
      const labels: Record<string, string> = {
        phrase: 'عبارت',
        service: 'موضوع',
        place: 'مکان',
        heyat: 'هیئت',
        style: 'سبک',
        people: 'افراد',
        occasion: 'مناسبت',
      };
      return labels[filterKey] || filterKey;
    };

    // ساخت لیست فیلترهای فعال (بدون page)
    return Object.entries(activeFilters)
      .filter(([key, value]) => value && key !== 'page') // حذف page از فیلترها
      .map(([key, value]) => ({
        key,
        label: getFilterTypeLabel(key),
        value: key === 'phrase' ? value : getFilterLabel(key, value as string),
      }));
  }, [activeFilters, vocabData]);

  // حالت اولیه - هنوز جستجو نشده
  if (!results) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[400px] ${className}`}>
        <i className="fa-light fa-search text-6xl text-theme-gray mb-4" />
        <p className="text-lg text-theme-gray">برای جستجو، عبارت یا فیلتر مورد نظر را انتخاب کنید</p>
      </div>
    );
  }

  // نتیجه‌ای یافت نشد
  if (results.items.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[400px] ${className}`}>
        <i className="fa-light fa-search text-6xl text-theme-gray mb-4" />
        <p className="text-lg text-theme-white mb-2">نتیجه‌ای یافت نشد</p>
        <p className="text-sm text-theme-gray">لطفاً عبارت یا فیلتر دیگری را امتحان کنید</p>
      </div>
    );
  }

  // نمایش نتایج
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* هدر نتایج */}
      <div className="flex items-center justify-between pb-4 border-b border-theme-border">
        <h2 className="text-lg font-semibold text-theme-white">نتایج جستجو</h2>
        {/* <span className="text-sm text-theme-gray">{results.totalResults} مورد</span> */}
      </div>

      {/* فیلترهای فعال */}
      {onRemoveFilter && (
        <ActiveFilters filters={filterItems} onRemoveFilter={onRemoveFilter} />
      )}

      {/* Grid نتایج */}
      <SearchResultsGrid items={results.items} skeleton={isLoading} />

      {/* Pagination */}
      {results.pagination && results.pagination.lastPage > 1 && onPageChange && (
        <div className="flex justify-center pt-6">
          <Pagination
            currentPage={results.pagination.currentPage}
            totalPages={results.pagination.lastPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};
