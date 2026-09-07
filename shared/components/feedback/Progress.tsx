/**
 * Progress Component
 * کامپوننت نوار پیشرفت قابل استفاده مجدد
 */

'use client';

import { Progress as HeroProgress } from '@heroui/react';

interface ProgressProps {
  value: number;
  maxValue?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
  showValueLabel?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
}

/**
 * Progress Component
 * نوار پیشرفت با قابلیت‌های مختلف
 * 
 * Features:
 * - نمایش درصد پیشرفت
 * - رنگ‌های مختلف
 * - سایزهای مختلف
 * - قابلیت نمایش label
 * - انیمیشن smooth
 */
export const Progress = ({
  value,
  maxValue = 100,
  size = 'md',
  color = 'primary',
  className = '',
  showValueLabel = false,
  formatOptions,
}: ProgressProps) => {
  return (
    <HeroProgress
      value={value}
      maxValue={maxValue}
      size={size}
      color={color}
      showValueLabel={showValueLabel}
      formatOptions={formatOptions}
      className={className}
      classNames={{
        base: 'w-full',
        track: 'bg-theme-athens-gray',
        indicator: 'bg-theme-secondary-blue',
        label: 'text-theme-gray text-sm',
        value: 'text-theme-secondary-blue text-sm font-bold',
      }}
    />
  );
};