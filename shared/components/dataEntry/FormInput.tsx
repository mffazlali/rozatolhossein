'use client';

import { Input } from '@heroui/react';

/**
 * FormInput Props Interface
 */
export interface FormInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  errorMessage?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  className?: string;
}

/**
 * FormInput Component
 * کامپوننت فیلد ورودی فرم قابل استفاده مجدد
 * 
 * فیلد ورودی استاندارد برای فرم‌ها با استایل یکسان
 * لیبل بیرون از کنترل قرار دارد
 * 
 * Features:
 * - لیبل جداگانه در بالای کنترل
 * - ارتفاع ثابت 38px (مطابق Figma)
 * - عرض 295px (قابل تغییر با className)
 * - RTL support
 * - بدون placeholder (اختیاری)
 */
export const FormInput = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  isDisabled = false,
  isRequired = false,
  isReadOnly = false,
  errorMessage,
  startContent,
  endContent,
  className = '',
}: FormInputProps) => {
  return (
    <div className={`flex flex-col items-start gap-1 ${className}`}>
      {/* Label */}
      <label className="text-theme-black text-sm font-normal">
        {label}
        {isRequired && <span className="text-red-500 mr-1">*</span>}
      </label>

      {/* Input */}
      <Input
        type={type}
        value={value}
        onValueChange={onChange}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isInvalid={!!errorMessage}
        errorMessage={errorMessage}
        startContent={startContent}
        endContent={endContent}
        classNames={{
          base: 'w-full',
          inputWrapper: 'bg-theme-white border border-theme-border rounded-md h-[38px] min-h-[38px]',
          input: 'text-theme-gray-dark text-base font-normal',
          errorMessage: 'text-red-500 text-xs mt-1',
        }}
        aria-label={label}
      />
    </div>
  );
};
