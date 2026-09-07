/**
 * ActiveFilters Component
 * نمایش فیلترهای فعال با امکان حذف - Generic & Reusable
 */
'use client';

import { Button } from '@heroui/react';

export interface FilterItem {
  key: string;
  label: string;
  value: string;
}

interface ActiveFiltersProps {
  filters: FilterItem[];
  onRemoveFilter: (filterKey: string) => void;
  title?: string;
  className?: string;
}

export const ActiveFilters = ({
  filters,
  onRemoveFilter,
  title = 'فیلترهای فعال:',
  className = '',
}: ActiveFiltersProps) => {
  // اگر فیلتری فعال نیست، چیزی نمایش نده
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {title && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-theme-gray">{title}</span>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <div
            key={filter.key}
            className="flex items-center gap-2 px-3 py-1.5 bg-theme-gray-dark rounded-lg border border-theme-border"
          >
            <span className="text-xs text-theme-gray">{filter.label}:</span>
            <span className="text-xs text-theme-white">{filter.value}</span>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="min-w-4 w-4 h-4 p-0 text-theme-gray hover:text-theme-white"
              onPress={() => onRemoveFilter(filter.key)}
            >
              <i className="fa-light fa-times text-xs" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
