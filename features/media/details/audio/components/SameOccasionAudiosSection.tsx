'use client'

import { AudioItem } from '@/shared/types'
import { SectionHeader } from '@/shared/components/navigation'
import { AudioCard } from '@/shared/components/dataDisplay'
import { ResponsiveGrid, ResponsiveGridItem } from '@/shared/components/general'

/**
 * SameOccasionAudiosSection Props
 */
interface SameOccasionAudiosSectionProps {
  audios?: AudioItem[]
  occasionTitle?: string
  skeleton?: boolean
}

/**
 * SameOccasionAudiosSection Skeleton Component
 */
function SameOccasionAudiosSectionSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header Skeleton */}
      <div className="flex items-center gap-2 w-full">
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 bg-theme-gray/20 rounded animate-pulse" />
          <div className="h-5 w-40 bg-theme-gray/20 rounded animate-pulse" />
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
 * SameOccasionAudiosSection Component
 * بخش صوت‌های همان مناسبت - مطابق طرح Figma
 */
export function SameOccasionAudiosSection({
  audios,
  occasionTitle = 'این مناسبت',
  skeleton = false,
}: SameOccasionAudiosSectionProps) {
  if (skeleton) {
    return <SameOccasionAudiosSectionSkeleton />
  }

  // اگر صوتی وجود نداشت، چیزی نمایش نده
  if (!audios || audios.length === 0) return null

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header with divider */}
      <SectionHeader
        title={`${occasionTitle}`}
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
