'use client';

import { Select, SelectItem } from '@heroui/react';

/**
 * FormSelect Option Interface
 */
export interface FormSelectOption {
  key: string;
  label: string;
}

/**
 * FormSelect Props Interface
 */
export interface FormSelectProps {
  label: string;
  placeholder?: string;
  options: FormSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  isRequired?: boolean;
  errorMessage?: string;
  className?: string;
}

/**
 * FormSelect Component
 * کامپوننت دراپ‌داون فرم قابل استفاده مجدد
 * 
 * دراپ‌داون استاندارد برای فرم‌ها با استایل یکسان
 * لیبل بیرون از کنترل قرار دارد
 * 
 * Features:
 * - لیبل جداگانه در بالای کنترل
 * - ارتفاع ثابت 38px (مطابق Figma)
 * - عرض 238px (قابل تغییر با className)
 * - RTL support
 */
export const FormSelect = ({
  label,
  placeholder = '- هر -',
  options,
  value,
  onChange,
  isDisabled = false,
  isRequired = false,
  errorMessage,
  className = '',
}: FormSelectProps) => {
  return (
    <div className={`flex flex-col items-start gap-1 ${className}`}>
      {/* Label */}
      <label className="text-theme-black text-sm font-normal">
        {label}
        {isRequired && <span className="text-red-500 mr-1">*</span>}
      </label>

      {/* Select */}
      <Select
        placeholder={placeholder}
        selectedKeys={value ? [value] : []}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string;
          if (onChange) {
            onChange(selected);
          }
        }}
        isDisabled={isDisabled}
        isInvalid={!!errorMessage}
        errorMessage={errorMessage}
        classNames={{
          base: 'w-full',
          trigger: 'bg-theme-white border border-theme-border rounded-md h-[38px] min-h-[38px]',
          value: 'text-theme-gray-dark text-[13.6px] font-normal',
          errorMessage: 'text-red-500 text-xs mt-1',
        }}
        aria-label={label}
      >
        {options.map((option) => (
          <SelectItem key={option.key}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};
