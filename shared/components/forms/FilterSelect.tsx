/**
 * FilterSelect Component
 * کامپوننت انتخاب فیلتر از لیست vocab با دکمه پاک کردن
 */
'use client';

import { Select, SelectItem, Button } from '@heroui/react';
import type { VocabTerm } from '@/shared/types';

interface FilterSelectProps {
  label: string;
  items: VocabTerm[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showClearButton?: boolean;
}

export const FilterSelect = ({
  label,
  items,
  value,
  onChange,
  placeholder = 'انتخاب کنید',
  className = '',
  disabled = false,
  showClearButton = true,
}: FilterSelectProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <Select
        label={label}
        placeholder={placeholder}
        selectedKeys={value ? [value] : []}
        onChange={handleChange}
        isDisabled={disabled}
        classNames={{
          trigger: 'bg-theme-gray-dark border-theme-border',
          label: 'text-theme-gray',
          value: 'text-theme-white',
          popoverContent: 'bg-theme-gray-dark',
        }}
        dir="rtl"
      >
        {items.map((item) => (
          <SelectItem key={item.id} className="text-theme-white">
            {item.name}
          </SelectItem>
        ))}
      </Select>

      {/* دکمه پاک کردن */}
      {showClearButton && value && !disabled && (
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="absolute left-10 top-1/2 -translate-y-1/2 min-w-6 w-6 h-6 p-0 text-theme-gray hover:text-theme-white z-10"
          onPress={handleClear}
        >
          <i className="fa-light fa-times text-sm" />
        </Button>
      )}
    </div>
  );
};
