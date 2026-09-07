import LinkFeature from '@/features/link';

/**
 * Link Page
 * صفحه لینک‌ها
 */
export default async function LinkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  return <LinkFeature locale={locale} />;
}

export const metadata = {
  title: 'لینک‌ها | هیئت روضة الحسین علیه السلام',
  description: 'آدرس رسانه های رسمی هیئت روضة الحسین علیه السلام',
};
