'use client'

import {
  AudioCard,
  MediaEmpty,
  ResponsiveGrid,
  ResponsiveGridItem,
} from '@/shared'
import { SectionHeader } from '@/shared/components/navigation'
import { HeaderIcon } from '@/shared/icons'
import { getServiceListHref, ServiceId } from '@/shared/types'
import type { AudioItem } from '@/shared/types/media'

interface AudioSectionProps {
  audioItems: AudioItem[]
}

/**
 * AudioSectionSkeleton Component
 * اسکلتون بخش صوت‌ها در صفحه اصلی - مطابق oldFeatures
 */
export function AudioSectionSkeleton() {
  return (
    <section className="flex flex-col gap-[7.5px] items-end w-full max-w-[1140px]">
      {/* Header */}
      <SectionHeader
        title="جدیدترین صوت ها"
        icon={<HeaderIcon className="w-[24px] h-[24px] text-figma-gray" />}
        showViewAll={true}
        viewAllHref="#"
        viewAllText="مشاهده همه"
      />

      {/* Content Skeleton */}
      <div className="py-12 w-full">
        <ResponsiveGrid type="audio">
          {Array.from({ length: 5 }).map((_, index) => (
            <ResponsiveGridItem key={index} type="audio">
              <AudioCard skeleton />
            </ResponsiveGridItem>
          ))}
        </ResponsiveGrid>
      </div>
    </section>
  )
}

/**
 * Audio Section Component
 * بخش جدیدترین صوت‌ها - مطابق طرح Figma
 */
export function AudioSection({ audioItems }: AudioSectionProps) {
  return (
    <section className="flex flex-col gap-[7.5px] items-end w-full max-w-[1140px]">
      {/* Header */}
      <SectionHeader
        title="جدیدترین صوت ها"
        icon={<HeaderIcon className="w-[24px] h-[24px] text-theme-gray" />}
        showViewAll={true}
        viewAllHref={getServiceListHref('fa', ServiceId.AUDIO)}
        viewAllText="مشاهده همه"
      />

      {/* Content */}
      <div className="flex flex-col items-center w-full">
        {!audioItems || audioItems.length === 0 ? (
          <MediaEmpty type="audio" />
        ) : (
          <ResponsiveGrid type="audio">
            {audioItems.slice(0, 20).map((item) => (
              <ResponsiveGridItem key={item.id} type="audio">
                <AudioCard item={item} linkMode />
              </ResponsiveGridItem>
            ))}
          </ResponsiveGrid>
        )}
      </div>
    </section>
  )
}
