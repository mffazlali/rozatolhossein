import './globals.css'
import Link from 'next/link'
import { themeScript } from '@/shared/lib/themeScript'

export default function NotFoundPage() {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <div className="min-h-screen bg-theme-black flex flex-col items-center justify-center gap-8 px-4">
          {/* Content */}
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-8xl font-bold text-theme-white">404</h1>
            <h2 className="text-2xl font-bold text-theme-white">صفحه مورد نظر یافت نشد</h2>
            <p className="text-theme-gray text-lg max-w-md">
              متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.
            </p>
          </div>

          {/* Action Button */}
          <Link
            href="/"
            className="gap-2 bg-theme-black border border-white/10 flex items-center justify-center p-[21px] rounded-[6px] hover:text-theme-white transition-colors text-theme-gray text-center">
            <i className="fa-light fa-home text-lg" />
            <span>بازگشت به صفحه اصلی</span>
          </Link>
        </div>
      </body>
    </html>
  )
}
