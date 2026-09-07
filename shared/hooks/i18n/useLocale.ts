/**
 * useLocale Hook
 * هوک استخراج زبان فعلی از URL
 */
'use client';

import { usePathname } from 'next/navigation';
import { Locale, locales, defaultLocale } from '@/shared/lib/i18n';

export function useLocale(): Locale {
  const pathname = usePathname();

  // استخراج locale از pathname
  const segments = pathname.split('/');
  const potentialLocale = segments[1];

  if (locales.includes(potentialLocale as Locale)) {
    return potentialLocale as Locale;
  }

  return defaultLocale;
}
