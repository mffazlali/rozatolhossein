'use client';

import Link from 'next/link';

/**
 * Breadcrumb Item Type
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Breadcrumb Props
 */
interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  separator?: string;
  className?: string;
  skeleton?: boolean;
  skeletonCount?: number;
}

/**
 * Breadcrumb Skeleton Component
 */
function BreadcrumbSkeleton({ count = 3, separator = '/' }: { count?: number; separator?: string }) {
  return (
    <nav className="flex items-center gap-1 sm:gap-2 px-4 sm:px-0" aria-label="در حال بارگذاری">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-1 sm:gap-2">
          {index > 0 && (
            <span className="text-theme-gray text-xs sm:text-sm">{separator}</span>
          )}
          <div className="h-3 sm:h-4 w-12 sm:w-16 bg-theme-gray/20 rounded animate-pulse" />
        </div>
      ))}
    </nav>
  );
}

/**
 * Breadcrumb Component
 * کامپوننت مسیر ناوبری قابل استفاده مجدد - ریسپانسیو
 * 
 * @param items - آیتم‌های مسیر ناوبری
 * @param separator - جداکننده بین آیتم‌ها (پیش‌فرض: /)
 * @param className - کلاس اضافی
 * @param skeleton - نمایش حالت اسکلتون
 * @param skeletonCount - تعداد آیتم‌های اسکلتون
 */
export function Breadcrumb({ 
  items = [], 
  separator = '/',
  className = '',
  skeleton = false,
  skeletonCount = 3,
}: BreadcrumbProps) {
  if (skeleton) {
    return <BreadcrumbSkeleton count={skeletonCount} separator={separator} />;
  }

  return (
    <nav 
      className={`flex flex-wrap items-center gap-1 sm:gap-2 text-theme-gray text-xs sm:text-sm px-4 sm:px-0 ${className}`} 
      aria-label="مسیر ناوبری"
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1 sm:gap-2">
          {index > 0 && (
            <span className="text-theme-gray">{separator}</span>
          )}
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:text-theme-white transition-colors truncate max-w-[100px] sm:max-w-[150px] md:max-w-none"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-theme-white truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
