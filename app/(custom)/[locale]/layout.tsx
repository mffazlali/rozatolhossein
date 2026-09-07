import { Providers } from '@/shared/providers';
import '../../globals.css';
import '../../../public/fonts/fontawesome/all.css';
import { getThemeScript } from '@/shared/lib/themeScript';
import { menuService } from '@/shared/services/menuService';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  const direction = locale === 'fa' ? 'rtl' : 'ltr';

  // دریافت تم پیش‌فرض از API
  const defaultTheme = await menuService.getDefaultTheme(locale);

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeScript(defaultTheme) }} />
      </head>
      <body>
        <Providers defaultTheme={defaultTheme}>
          <div className="min-h-screen flex flex-col bg-theme-gray-dark">
            <main className='flex-1'>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
