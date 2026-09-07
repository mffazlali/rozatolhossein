/**
 * i18n Configuration
 * تنظیمات چندزبانگی پروژه
 */

export const locales = ['fa', 'en'] as const;
export const defaultLocale = 'fa' as const;

export type Locale = (typeof locales)[number];

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
