import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { contentService } from '@/shared/services'
import { PrintContent } from './components'
import { PrintContentSkeleton } from './components'
import type { ContentDetail } from '@/shared/types/content'

/**
 * Print Version Feature - Server Component با fetch مستقیم از API
 * صفحه نسخه چاپی محتوا
 * 
 * اگر محتوا یافت نشد، صفحه 404 نمایش داده می‌شود
 */
interface PrintVersionProps {
  contentId: string
  locale?: string
}

/**
 * Print Data Fetcher - کامپوننت داخلی برای fetch داده
 */
async function PrintDataFetcher({ contentId, locale = 'fa' }: PrintVersionProps) {
  // دریافت محتوا - خطاها توسط error.tsx handle می‌شوند
  let content: ContentDetail | null = null
  try {
    content = await contentService.getContentDetail(contentId, locale)
  } catch (error) {
    console.error('Error fetching content for print:', error)
    notFound()
  }

  if (!content) {
    notFound()
  }

  return <PrintContent content={content} />
}

/**
 * PrintVersion Component با Suspense
 */
const PrintVersion = ({ contentId, locale = 'fa' }: PrintVersionProps) => {
  return (
    <Suspense fallback={<PrintContentSkeleton />}>
      <PrintDataFetcher contentId={contentId} locale={locale} />
    </Suspense>
  )
}

export default PrintVersion