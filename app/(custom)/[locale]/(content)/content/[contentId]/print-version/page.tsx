import PrintVersion from '@/features/printVersion';

/**
 * Print Version Page
 * صفحه نسخه چاپی محتوا با React Query Prefetch
 * 
 * این صفحه:
 * - داده‌های محتوا را در سرور prefetch می‌کند
 * - cache را به client منتقل می‌کند (hydration)
 */
export default async function PrintVersionPage({
  params,
}: {
  params: Promise<{ locale: string; contentId: string }>;
}) {
  const resolvedParams = await params;
  const { contentId, locale } = resolvedParams;

  return <PrintVersion contentId={contentId} locale={locale} />;
}
