'use client'

import { ErrorBoundary, FeatureErrorFallback } from '@/shared'
import { SessionList, SessionListSkeleton } from './SessionList'
import { usePagination } from '@/shared/hooks'
import { Pagination } from '@/shared/components/navigation'
import type { SessionItem } from '@/shared/types'

interface SessionContentProps {
  sessionItems: SessionItem[]
  serviceId: string
}

/**
 * SessionGeneralSkeleton Component
 * اسکلتون کامل صفحه لیست جلسات
 */
export const SessionGeneralSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1140px] mx-auto px-4 py-8">
      <SessionListSkeleton count={3} />
      
      {/* Pagination Skeleton */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="w-10 h-10 bg-figma-gray/20 rounded animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Main Session Content Client Component
 * کامپوننت اصلی محتوای صفحه جلسات
 */
export const SessionContent = ({ sessionItems, serviceId }: SessionContentProps) => {
  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination(
    sessionItems,
    {
      totalItems: sessionItems.length,
      itemsPerPage: 18,
      initialPage: 1,
    }
  )

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1140px] mx-auto px-4 py-8">
      <ErrorBoundary
        fallback={({ error, retry }) => (
          <FeatureErrorFallback
            error={error}
            retry={retry}
            featureName="جلسات"
          />
        )}
        resetOnPropsChange>
        <SessionList
          items={paginatedItems}
          isLoading={false}
          error={null}
          onRetry={() => {}}
        />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            className="mt-8"
          />
        )}
      </ErrorBoundary>
    </div>
  )
}
