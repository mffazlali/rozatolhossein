'use client';

import { useEffect } from 'react';

/**
 * ServiceWorkerRegistration - ثبت Service Worker
 * 
 * این کامپوننت Service Worker را ثبت می‌کند و به‌روزرسانی‌های آن را مدیریت می‌کند
 */
export const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // ثبت Service Worker
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then(registration => {
          console.log('[SW] Service Worker registered successfully:', registration.scope);

          // بررسی به‌روزرسانی هر 1 ساعت
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);

          // گوش دادن به به‌روزرسانی‌ها
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // نسخه جدید آماده است
                  console.log('[SW] New version available! Please refresh.');
                  
                  // می‌توانید اینجا یک notification نمایش دهید
                  if (confirm('نسخه جدید در دسترس است. صفحه را بارگذاری مجدد کنید؟')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch(error => {
          console.error('[SW] Service Worker registration failed:', error);
        });

      // گوش دادن به پیام‌های Service Worker
      navigator.serviceWorker.addEventListener('message', event => {
        console.log('[SW] Message from Service Worker:', event.data);
      });

      // گوش دادن به تغییر controller
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[SW] Controller changed, reloading page...');
        window.location.reload();
      });
    }
  }, []);

  return null;
};
