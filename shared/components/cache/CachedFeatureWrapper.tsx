/**
 * Cached Feature Wrapper
 * Wrapper برای Features با پشتیبانی کش
 * 
 * این کامپوننت:
 * 1. داده اولیه را از Server Component دریافت می‌کند
 * 2. در Client Component، داده را در IndexedDB کش می‌کند
 * 3. در رفرش بعدی، اگر آفلاین بود، از کش استفاده می‌کند
 */

'use client';

import { useEffect, useState } from 'react';
import { indexedDBManager } from '@/shared/lib/indexedDB';

/**
 * بررسی معتبر بودن داده برای کش
 * داده معتبر است اگر:
 * 1. null یا undefined نباشد
 * 2. اگر object است، حداقل یکی از properties آن معتبر باشد
 * 3. اگر array است، حداقل یک آیتم داشته باشد
 */
function isValidDataForCache<T>(data: T | null): boolean {
  if (!data) return false;

  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    const values = Object.values(data);
    
    return values.some(value => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (value === null || value === undefined) {
        return false;
      }
      if (typeof value === 'object') {
        return isValidDataForCache(value);
      }
      return true;
    });
  }
  
  if (Array.isArray(data)) {
    return data.length > 0;
  }
  
  return true;
}

interface CachedFeatureWrapperProps<T> {
  /**
   * داده اولیه از Server Component
   */
  initialData: T | null;
  
  /**
   * کلید کش (باید یکتا باشد)
   */
  cacheKey: string;
  
  /**
   * مدت زمان اعتبار کش (میلی‌ثانیه)
   */
  ttl?: number;
  
  /**
   * کامپوننت نمایش داده
   */
  children: (data: T, isFromCache: boolean) => React.ReactNode;
  
  /**
   * کامپوننت Loading
   */
  loadingComponent?: React.ReactNode;
  
  /**
   * کامپوننت Error
   */
  errorComponent?: (error: Error) => React.ReactNode;
}

export function CachedFeatureWrapper<T>({
  initialData,
  cacheKey,
  ttl = 3600000, // 1 ساعت
  children,
  loadingComponent,
  errorComponent,
}: CachedFeatureWrapperProps<T>) {
  const [data, setData] = useState<T | null>(initialData);
  const [isFromCache, setIsFromCache] = useState(false);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // بررسی وضعیت آنلاین/آفلاین
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    setIsOnline(navigator.onLine);

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // بارگذاری از کش در صورت آفلاین بودن یا نبود داده اولیه
  useEffect(() => {
    const loadFromCache = async () => {
      const hasValidInitialData = initialData && isValidDataForCache(initialData);

      if (hasValidInitialData && isOnline) {
        setData(initialData);
        setIsFromCache(false);
        setLoading(false);
        return;
      }

      if (!isOnline || !hasValidInitialData) {
        setLoading(true);
        setError(null);
        
        try {
          if (!indexedDBManager) {
            throw new Error('IndexedDB Manager not available');
          }

          const cachedData = await indexedDBManager.get<T>(cacheKey);

          if (cachedData) {
            setData(cachedData);
            setIsFromCache(true);
            setError(null);
          } else {
            if (!hasValidInitialData) {
              setError(new Error('داده‌ای در کش موجود نیست'));
            }
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error('خطای ناشناخته');
          setError(error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadFromCache();
  }, [initialData, isOnline, cacheKey]);

  // کش کردن داده اولیه (فقط اگر معتبر باشد)
  useEffect(() => {
    const cacheInitialData = async () => {
      if (!isOnline || !initialData || !indexedDBManager) {
        return;
      }

      if (!isValidDataForCache(initialData)) {
        return;
      }

      try {
        await indexedDBManager.set(cacheKey, initialData, ttl);
      } catch (err) {
        console.error(`Failed to cache data for ${cacheKey}:`, err);
      }
    };

    cacheInitialData();
  }, [initialData, cacheKey, ttl, isOnline]);

  if (loading && !data) {
    return <>{loadingComponent || <div>در حال بارگذاری...</div>}</>;
  }

  if (error && !data) {
    return (
      <>
        {errorComponent ? (
          errorComponent(error)
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <i className="fa-light fa-triangle-exclamation text-4xl text-dark-primary-red" />
            <p className="text-theme-gray">خطا: {error.message}</p>
          </div>
        )}
      </>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <i className="fa-light fa-wifi-slash text-4xl text-dark-gray" />
        <p className="text-theme-gray text-center">
          شما آفلاین هستید و داده‌ای در کش موجود نیست.
          <br />
          لطفاً اتصال اینترنت خود را بررسی کنید.
        </p>
      </div>
    );
  }

  return <>{children(data, isFromCache)}</>;
}
