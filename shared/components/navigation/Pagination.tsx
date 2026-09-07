/**
 * Pagination Component
 * کامپوننت صفحه‌بندی سفارشی با usePagination از HeroUI
 * 
 * مطابق استانداردهای پروژه روضة الحسین
 * - Custom implementation با usePagination
 * - Client Component
 * - Responsive design
 * - RTL support
 * - رنگ‌های theme پروژه
 * - FontAwesome Light icons
 */

'use client';

import { usePagination, PaginationItemType } from '@heroui/react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) => {
  const { activePage, range, setPage, onNext, onPrevious } = usePagination({
    total: totalPages,
    initialPage: currentPage,
    page: currentPage,
    showControls: true,
    siblings: 1,
    boundaries: 1,
    onChange: onPageChange,
  });

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center w-full ${className}`} dir="rtl">
      <ul className="flex gap-2 items-center">
        {range.map((page, index) => {
          // دکمه بعدی (در RTL سمت چپ)
          if (page === PaginationItemType.NEXT) {
            return (
              <li key={page} aria-label="صفحه بعد">
                <button
                  className="flex items-center justify-center min-w-[40px] h-[40px] px-3 bg-theme-black text-theme-gray rounded-lg transition-colors enabled:hover:bg-theme-gray-dark enabled:text-theme-white disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={onNext}
                  disabled={activePage >= totalPages}
                >
                  <i className="fa-light fa-chevron-left" />
                </button>
              </li>
            );
          }

          // دکمه قبلی (در RTL سمت راست)
          if (page === PaginationItemType.PREV) {
            return (
              <li key={page} aria-label="صفحه قبل">
                <button
                  className="flex items-center justify-center min-w-[40px] h-[40px] px-3 bg-theme-black text-theme-gray rounded-lg transition-colors enabled:hover:bg-theme-gray-dark enabled:hover:text-theme-white disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={onPrevious}
                  disabled={activePage <= 1}
                >
                  <i className="fa-light fa-chevron-right" />
                </button>
              </li>
            );
          }

          // نقاط (...)
          if (page === PaginationItemType.DOTS) {
            return (
              <li key={`dots-${index}`} className="flex items-center justify-center min-w-[40px] h-[40px]">
                <span className="text-theme-gray">...</span>
              </li>
            );
          }

          // شماره صفحه
          const isActive = activePage === page;
          return (
            <li key={page} aria-label={`صفحه ${page}`}>
              <button
                className={`flex items-center justify-center min-w-[40px] h-[40px] px-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-theme-gray-dark text-theme-white'
                    : 'bg-theme-black text-theme-gray hover:bg-theme-gray-dark hover:text-theme-white'
                }`}
                onClick={() => setPage(page as number)}
              >
                {page}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
