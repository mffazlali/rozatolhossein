'use client'

import { SessionCard, ResponsiveGrid, ResponsiveGridItem, MediaEmpty, FeatureErrorFallback } from '@/shared'
import { SessionItem } from '@/shared/types'

interface SessionListProps {
  items: SessionItem[]
  isLoading: boolean
  error: Error | null
  onRetry: () => void
}

/**
 * SessionList Skeleton Component
 * اسکلتون لیست جلسات
 */
export function SessionListSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className="w-full">
      <ResponsiveGrid type="session">
        {Array.from({ length: count }).map((_, index) => (
          <ResponsiveGridItem key={index} type="session">
            <SessionCard skeleton />
          </ResponsiveGridItem>
        ))}
      </ResponsiveGrid>
    </div>
  )
}

/**
 * SessionList Component
 * لیست کارت‌های جلسات با grid responsive
 *
 * مطابق استانداردهای پروژه روضة الحسین
 * - استفاده از ResponsiveGrid از shared
 * - استفاده از SessionCard از shared
 * - Loading و Error states
 */
export function SessionList({
  items,
  error,
  onRetry,
}: SessionListProps) {
  // Error state
  if (error) {
    return <FeatureErrorFallback error={error} retry={onRetry} featureName="جلسات" />
  }

  // Empty state
  if (!items || items.length === 0) {
    return <MediaEmpty type="session" />
  }

  // Data state
  return (
    <ResponsiveGrid type="session">
      {items.map((item, index) => (
        <ResponsiveGridItem
          key={item.id}
          type="session"
          className={index === 0 ? 'z-3' : index === 1 ? 'z-2' : 'z-1'}>
          <SessionCard item={item} />
        </ResponsiveGridItem>
      ))}
    </ResponsiveGrid>
  )
}
