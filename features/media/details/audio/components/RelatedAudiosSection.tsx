'use client'

import { AudioItem } from '@/shared/types'
import { SectionHeader } from '@/shared/components/navigation'
import { AudioCard } from '@/shared/components/dataDisplay'
import { ResponsiveGrid, ResponsiveGridItem } from '@/shared/components/general'

/**
 * RelatedAudiosSection Props
 */
interface RelatedAudiosSectionProps {
  audios?: AudioItem[]
  skeleton?: boolean
}

/**
 * RelatedAudiosSection Skeleton Component
 */
function RelatedAudiosSectionSkeleton() {
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
      <ResponsiveGrid type="audio">
        {[...Array(5)].map((_, i) => (
          <ResponsiveGridItem key={i} type="audio">
            <AudioCard skeleton />
          </ResponsiveGridItem>
        ))}
      </ResponsiveGrid>
    </div>
  )
}

/**
 * RelatedAudiosSection Component
 * بخش صوت‌های جدید - مطابق طرح Figma
 */
export function RelatedAudiosSection({
  audios,
  skeleton = false,
}: RelatedAudiosSectionProps) {
  if (skeleton) {
    return <RelatedAudiosSectionSkeleton />
  }

  // اگر صوتی وجود نداشت، چیزی نمایش نده
  if (!audios || audios.length === 0) return null

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header with divider */}
      <SectionHeader
        title="صوت های جدید"
        icon={<i className="fa-light fa-waveform-lines text-theme-gray text-lg" />}
        className="px-0"
        showViewAll={true}
        viewAllHref="/audio"
        viewAllText="مشاهده همه"
      />

      {/* Cards Grid */}
      <ResponsiveGrid type="audio">
        {audios.slice(0, 5).map((audio) => (
          <ResponsiveGridItem key={audio.id} type="audio">
            <AudioCard item={audio} />
          </ResponsiveGridItem>
        ))}
      </ResponsiveGrid>
    </div>
  )
}
