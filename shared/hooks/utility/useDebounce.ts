/**
 * useDebounce Hook
 * هوک برای اعمال تاخیر (debounce) به توابع
 * 
 * @param delay - مدت زمان تاخیر به میلی‌ثانیه
 * @returns تابع debounce که callback را با تاخیر اجرا می‌کند
 * 
 * @example
 * const debounce = useDebounce(500);
 * const debouncedSearch = debounce((value: string) => {
 *   console.log('Search:', value);
 * });
 * debouncedSearch('test');
 */

'use client';

import { useRef, useCallback, useEffect } from 'react';

export function useDebounce(delay: number) {
  const timeoutId = useRef<NodeJS.Timeout | undefined>(undefined);

  const debounce = useCallback(
    <T extends (...args: unknown[]) => void>(callback: T) => {
      return (...args: Parameters<T>) => {
        clearTimeout(timeoutId.current);

        timeoutId.current = setTimeout(() => {
          callback(...args);
        }, delay);
      };
    },
    [delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  return debounce;
}
