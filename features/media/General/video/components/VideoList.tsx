'use client'

import { VideoCard, ResponsiveGrid, ResponsiveGridItem, MediaEmpty, FeatureErrorFallback } from '@/shared'
import { VideoItem } from '@/shared/types'

interface VideoListProps {
  items: VideoItem[]
  isLoading: boolean
  error: Error | null
  onRetry: () => void
}

/**
 * VideoList Skeleton Component
 * اسکلتون لیست ویدئوها
 */
export function VideoListSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className="w-full">
      <ResponsiveGrid type="video">
        {Array.from({ length: count }).map((_, index) => (
          <ResponsiveGridItem key={index} type="video">
            <VideoCard skeleton />
          </ResponsiveGridItem>
        ))}
      </ResponsiveGrid>
    </div>
  )
}

/**
 * VideoList Component
 * لیست کارت‌های ویدیویی با grid responsive
 *
 * مطابق استانداردهای پروژه روضة الحسین
 * - استفاده از ResponsiveGrid از shared
 * - استفاده از VideoCard از shared
 * - Loading و Error states
 */
export function VideoList({
  items,
  error,
  onRetry,
}: VideoListProps) {

  // Error state
  if (error) {
    return <FeatureErrorFallback error={error} retry={onRetry} featureName="ویدئوها" />
  }

  // Empty state
  if (!items || items.length === 0) {
    return <MediaEmpty type="video" />
  }

  // Data state
  return (
    <ResponsiveGrid type="video">
      {items.map((item) => (
        <ResponsiveGridItem key={item.id} type="video">
          <VideoCard item={item} linkMode/>
        </ResponsiveGridItem>
      ))}
    </ResponsiveGrid>
  )
}
