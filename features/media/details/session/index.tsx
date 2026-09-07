/**
 * Session Detail Page - روضة الحسین
 * صفحه جزئیات جلسه
 */

import { Suspense } from 'react'
import { contentService } from '@/shared/services'
import { SessionDetailContent, SessionViewMode } from './components'
import { SessionDetailSkeleton } from './components'
import { defaultLocale } from '@/shared/lib/i18n'
import type { SessionDetailResponse } from '@/shared/services'

interface SessionDetailProps {
  sessionId: string
  locale?: string
  viewMode?: SessionViewMode
}

/**
 * Session Data Fetcher - کامپوننت داخلی برای fetch داده
 */
async function SessionDetailDataFetcher({
  sessionId,
  locale = defaultLocale,
  viewMode,
}: SessionDetailProps) {
  // Fetch session data - errors will be caught by error.tsx
  let sessionData: SessionDetailResponse | null = null
  try {
    sessionData = await contentService.getSessionDetail(sessionId, locale)
  } catch (error) {
    console.error('Error fetching session detail:', error)
    throw error // Re-throw to be caught by error.tsx
  }

  if (!sessionData) {
    throw new Error('Session not found')
  }

  return <SessionDetailContent sessionData={sessionData} viewMode={viewMode} />
}

/**
 * SessionDetail Feature Component با Suspense
 * صفحه جزئیات جلسه - Server Component با fetch مستقیم از API
 * خطاها توسط error.tsx مدیریت می‌شوند
 */
const SessionDetail = ({
  sessionId,
  locale = defaultLocale,
  viewMode,
}: SessionDetailProps) => {
  return (
    <Suspense fallback={<SessionDetailSkeleton />}>
      <SessionDetailDataFetcher
        sessionId={sessionId}
        locale={locale}
        viewMode={viewMode}
      />
    </Suspense>
  )
}

export default SessionDetail
