'use client'

import { VideoItem } from '@/shared/types'
import { SectionHeader } from '@/shared/components/navigation'
import { VideoCard } from '@/shared/components/dataDisplay'
import { ResponsiveGrid, ResponsiveGridItem } from '@/shared/components/general'

/**
 * RelatedVideosSection Props
 */
interface RelatedVideosSectionProps {
  videos?: VideoItem[]
  skeleton?: boolean
}

/**
 * RelatedVideosSection Skeleton Component
 */
function RelatedVideosSectionSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header Skeleton */}
      <div className="flex items-center gap-2 w-full">
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 bg-theme-gray/20 rounded animate-pulse" />
          <div className="h-5 w-28 bg-theme-gray/20 rounded animate-pulse" />
        </div>
        <div className="flex-1 h-px bg-theme-gray/30" />
      </div>

      {/* Cards Grid Skeleton */}
      <ResponsiveGrid type="video">
        {[...Array(3)].map((_, i) => (
          <ResponsiveGridItem key={i} type="video">
            <VideoCard skeleton />
          </ResponsiveGridItem>
        ))}
      </ResponsiveGrid>
    </div>
  )
}

/**
 * RelatedVideosSection Component
 * بخش ویدیوهای مرتبط - مطابق طرح Figma
 */
export function RelatedVideosSection({
  videos,
  skeleton = false,
}: RelatedVideosSectionProps) {
  if (skeleton) {
    return <RelatedVideosSectionSkeleton />
  }

  // اگر ویدیویی وجود نداشت، چیزی نمایش نده
  if (!videos || videos.length === 0) return null

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header with divider */}
      <SectionHeader
        title="ویدیوهای مرتبط"
        icon={<i className="fa-light fa-clapperboard-play text-theme-gray text-lg" />}
        className="px-0"
        showViewAll={true}
        viewAllHref="/video"
        viewAllText="مشاهده همه"
      />

      {/* Cards Grid */}
      <ResponsiveGrid type="video">
        {videos.slice(0, 3).map((video) => (
          <ResponsiveGridItem key={video.id} type="video">
            <VideoCard item={video} />
          </ResponsiveGridItem>
        ))}
      </ResponsiveGrid>
    </div>
  )
}
