'use client'

import { ErrorBoundary, FeatureErrorFallback } from '@/shared'
import { AudioList, AudioListSkeleton } from './AudioList'
import { usePagination } from '@/shared/hooks'
import { Pagination } from '@/shared/components/navigation'
import type { AudioItem } from '@/shared/types'

interface AudioContentProps {
  audioItems: AudioItem[]
  serviceId: string
}

/**
 * AudioGeneralSkeleton Component
 * اسکلتون کامل صفحه لیست صوت‌ها
 */
export const AudioGeneralSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1140px] mx-auto px-4 py-8">
      <AudioListSkeleton count={5} />
      
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
 * Main Audio Content Client Component
 * کامپوننت اصلی محتوای صفحه صوت
 */
export const AudioContent = ({ audioItems, serviceId }: AudioContentProps) => {
  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination(
    audioItems,
    {
      totalItems: audioItems.length,
      itemsPerPage: 20,
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
            featureName="صوت‌ها"
          />
        )}
        resetOnPropsChange>
        <AudioList
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
