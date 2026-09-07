'use client'
/**
 * usePagination Hook
 * هوک مدیریت صفحه‌بندی
 * 
 * مطابق استانداردهای پروژه روضة الحسین
 * - Generic hook قابل استفاده در تمام پروژه
 * - مدیریت state صفحه فعلی
 * - محاسبه آیتم‌های صفحه فعلی
 * - Auto scroll به بالای صفحه
 */

import { useState, useMemo } from 'react';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  paginatedItems: T[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export function usePagination<T>(
  items: T[],
  { totalItems, itemsPerPage, initialPage = 1 }: UsePaginationProps
): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // محاسبه تعداد کل صفحات
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // محاسبه آیتم‌های صفحه فعلی
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  // رفتن به صفحه مشخص
  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
    
    // اسکرول به بالای صفحه
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // صفحه بعد
  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // صفحه قبل
  const previousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    previousPage,
    canGoNext: currentPage < totalPages,
    canGoPrevious: currentPage > 1,
  };
}
