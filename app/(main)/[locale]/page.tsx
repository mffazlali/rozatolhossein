import Home from '@/features/home';

/**
 * Main Home Page
 * صفحه اصلی وبسایت
 */
export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  return <Home locale={locale} />;
}

export const metadata = {
  title: 'هیئت روضة الحسین علیه السلام',
  description:
    'هیئت روضة الحسین علیه السلام - صوت ها، ویدئوها، جلسات و محتوای مذهبی',
};
