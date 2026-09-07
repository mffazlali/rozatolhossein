/**
 * i18n Middleware
 * میان‌افزار مدیریت مسیرهای چندزبانه
 */

import { NextRequest, NextResponse } from 'next/server';

export const locales = ['fa', 'en'] as const;
export const defaultLocale = 'fa' as const;

export type Locale = (typeof locales)[number];

export function getLocale(request: NextRequest): Locale {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) return pathnameLocale;

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = locales.find((locale) =>
      acceptLanguage.toLowerCase().includes(locale)
    );
    if (preferredLocale) return preferredLocale;
  }

  return defaultLocale;
}

export function handleI18nRouting(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname;

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If pathname already has locale, continue
  if (pathnameHasLocale) {
    return null;
  }

  // Redirect if there is no locale
  const locale = getLocale(request);
  const redirectUrl = new URL(`/${locale}${pathname}`, request.url);

  // Preserve search params
  redirectUrl.search = request.nextUrl.search;

  return NextResponse.redirect(redirectUrl);
}
