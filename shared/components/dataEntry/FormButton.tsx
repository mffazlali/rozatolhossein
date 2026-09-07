'use client';

import { Button } from '@heroui/react';

/**
 * FormButton Props Interface
 */
export interface FormButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  type?: 'button' | 'submit' | 'reset';
  isDisabled?: boolean;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * FormButton Component
 * کامپوننت دکمه فرم قابل استفاده مجدد
 * 
 * دکمه استاندارد برای فرم‌ها با استایل یکسان
 * 
 * Variants:
 * - primary: آبی (پیش‌فرض)
 * - secondary: خاکستری
 * - outline: حاشیه‌دار
 * 
 * Sizes:
 * - sm: 32px height
 * - md: 38px height (پیش‌فرض - مطابق Figma)
 * - lg: 44px height
 */
export const FormButton = ({
  children,
  onPress,
  type = 'button',
  isDisabled = false,
  isLoading = false,
  variant = 'primary',
  size = 'md',
  className = '',
}: FormButtonProps) => {
  // Variant styles
  const variantStyles = {
    primary: 'bg-theme-secondary-blue hover:bg-theme-secondary-blue-hover text-theme-white',
    secondary: 'bg-theme-gray-medium hover:bg-theme-gray text-theme-white',
    outline: 'bg-transparent border-2 border-theme-secondary-blue text-theme-secondary-blue hover:bg-theme-secondary-blue hover:text-theme-white',
  };

  // Size styles
  const sizeStyles = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-[38px] px-[13px] text-base',
    lg: 'h-11 px-6 text-lg',
  };

  return (
    <Button
      type={type}
      color="primary"
      onPress={onPress}
      isDisabled={isDisabled}
      isLoading={isLoading}
      className={`${variantStyles[variant]} ${sizeStyles[size]} font-normal rounded-md transition-colors ${className}`}
    >
      {children}
    </Button>
  );
};
