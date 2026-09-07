/**
 * SearchSidebar Component
 * سایدبار فیلترهای جستجو - Auto Search on Filter Change
 */
'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { SearchInput, FilterSelect } from '@/shared/components/forms';
import { useDebounce } from '@/shared/hooks/utility';
import type { VocabData } from '@/shared/types';

interface SearchSidebarProps {
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
  };
  onSearch: (filters: {
    phrase?: string;
    service?: string;
    place?: string;
    heyat?: string;
    style?: string;
    people?: string;
    occasion?: string;
  }) => void;
  isLoading?: boolean;
  className?: string;
}

export const SearchSidebar = ({
  vocabData,
  currentParams,
  onSearch,
  isLoading = false,
  className = '',
}: SearchSidebarProps) => {
  // ساخت کلید یکتا از currentParams برای reset کردن state
  const paramsKey = JSON.stringify(currentParams);
  
  // State محلی برای همه فیلترها - مقداردهی اولیه از currentParams
  const [phrase, setPhrase] = useState<string>(currentParams.phrase || '');
  const [filters, setFilters] = useState({
    service: currentParams.service || '',
    place: currentParams.place || '',
    heyat: currentParams.heyat || '',
    style: currentParams.style || '',
    people: currentParams.people || '',
    occasion: currentParams.occasion || '',
  });
  const [lastParamsKey, setLastParamsKey] = useState(paramsKey);

  // استفاده از useDebounce hook
  const debounce = useDebounce(500);

  // اگر currentParams تغییر کرد (از بیرون)، state را بروز کن
  if (paramsKey !== lastParamsKey) {
    setPhrase(currentParams.phrase || '');
    setFilters({
      service: currentParams.service || '',
      place: currentParams.place || '',
      heyat: currentParams.heyat || '',
      style: currentParams.style || '',
      people: currentParams.people || '',
      occasion: currentParams.occasion || '',
    });
    setLastParamsKey(paramsKey);
  }

  const handlePhraseChange = (value: string) => {
    setPhrase(value);
    
    // استفاده از debounce برای جستجو
    const debouncedSearch = debounce((searchValue: unknown) => {
      const phrase = searchValue as string;
      onSearch({
        phrase: phrase || undefined,
        service: filters.service || undefined,
        place: filters.place || undefined,
        heyat: filters.heyat || undefined,
        style: filters.style || undefined,
        people: filters.people || undefined,
        occasion: filters.occasion || undefined,
      });
    });
    
    debouncedSearch(value);
  };

  const handleFilterChange = (filterKey: keyof typeof filters, value: string) => {
    const newFilters = {
      ...filters,
      [filterKey]: value,
    };
    setFilters(newFilters);
    
    // جستجو خودکار با تغییر فیلتر
    onSearch({
      phrase: phrase || undefined,
      service: newFilters.service || undefined,
      place: newFilters.place || undefined,
      heyat: newFilters.heyat || undefined,
      style: newFilters.style || undefined,
      people: newFilters.people || undefined,
      occasion: newFilters.occasion || undefined,
    });
  };

  const handleClearAll = () => {
    // پاک کردن همه فیلترها و جستجو خودکار
    setPhrase('');
    setFilters({
      service: '',
      place: '',
      heyat: '',
      style: '',
      people: '',
      occasion: '',
    });
    
    // جستجو با فیلترهای خالی
    onSearch({});
  };

  // بررسی اینکه آیا فیلتری فعال است
  const hasActiveFilters =
    phrase ||
    filters.service ||
    filters.place ||
    filters.heyat ||
    filters.style ||
    filters.people ||
    filters.occasion;

  // لیست فیلترها برای map
  const filterConfigs = [
    {
      key: 'service' as const,
      label: 'موضوع',
      vocabData: vocabData.categories,
    },
    {
      key: 'place' as const,
      label: 'مکان',
      vocabData: vocabData.places,
    },
    {
      key: 'heyat' as const,
      label: 'هیئت',
      vocabData: vocabData.heyats,
    },
    {
      key: 'style' as const,
      label: 'سبک',
      vocabData: vocabData.styles,
    },
    {
      key: 'people' as const,
      label: 'افراد',
      vocabData: vocabData.people,
    },
    {
      key: 'occasion' as const,
      label: 'مناسبت',
      vocabData: vocabData.occasions,
    },
  ];

  return (
    <div className={`flex flex-col gap-4 bg-theme-black p-4 rounded-lg border border-theme-border ${className}`}>
      {/* عنوان */}
      <div className="pb-3 border-b border-theme-border">
        <h2 className="text-lg font-semibold text-theme-white">فیلترهای جستجو</h2>
      </div>

      {/* عبارت جستجو */}
      <SearchInput
        label="عبارت جستجو"
        value={phrase}
        onInput={handlePhraseChange}
        placeholder="جستجو در محتوا..."
        disabled={isLoading}
      />

      {/* فیلترها با map */}
      {filterConfigs.map(
        ({ key, label, vocabData: vocab }) =>
          vocab &&
          vocab.terms.length > 0 && (
            <FilterSelect
              key={key}
              label={label}
              items={vocab.terms}
              value={filters[key]}
              onChange={(value) => handleFilterChange(key, value)}
              disabled={isLoading}
            />
          )
      )}

      {/* دکمه پاک کردن همه */}
      <div className="flex flex-col gap-2">
        {hasActiveFilters && !isLoading && (
          <Button
            color="default"
            variant="bordered"
            className="w-full border-theme-border text-theme-gray hover:text-theme-white"
            startContent={<i className="fa-light fa-times" />}
            onPress={handleClearAll}
          >
            پاک کردن همه فیلترها
          </Button>
        )}
      </div>
    </div>
  );
};
