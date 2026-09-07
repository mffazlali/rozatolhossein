'use client';

import { useEffect, useState } from 'react';

/**
 * OnlineStatus - نمایش وضعیت اتصال به اینترنت
 * 
 * این کامپوننت وضعیت آنلاین/آفلاین را نمایش می‌دهد
 */
export const OnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // تنظیم وضعیت اولیه
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus) return null;

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 ${
        isOnline
          ? 'bg-green-500/90 text-white'
          : 'bg-theme-primary-red/90 text-white'
      }`}
    >
      <i
        className={`fa-light ${
          isOnline ? 'fa-wifi' : 'fa-wifi-slash'
        } text-lg`}
      />
      <span className="text-sm font-medium">
        {isOnline ? 'اتصال برقرار شد' : 'اتصال به اینترنت قطع است'}
      </span>
    </div>
  );
};
