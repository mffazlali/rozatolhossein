'use client'

import {
  VideoCard,
  MediaEmpty,
  ResponsiveGrid,
  ResponsiveGridItem,
} from '@/shared'
import { SectionHeader } from '@/shared/components/navigation'
import { HeaderIcon } from '@/shared/icons'
import type { VideoItem } from '@/shared/types/media'
import { getServiceListHref, ServiceId } from '@/shared/types'

interface VideoSectionProps {
  videoItems: VideoItem[]
}

/**
 * VideoSectionSkeleton Component
 * اسکلتون بخش ویدیوها در صفحه اصلی - مطابق oldFeatures
 */
export function VideoSectionSkeleton() {
  return (
    <section className="flex flex-col gap-2 items-end w-full max-w-[1140px] pt-22 -mb-5">
      {/* Header */}
      <SectionHeader
        title="جدیدترین ویدیو ها"
        icon={<HeaderIcon className="w-[24px] h-[24px] text-figma-gray" />}
        showViewAll={true}
        viewAllHref="#"
        viewAllText="مشاهده همه"
      />

      {/* Content Skeleton */}
      <div className="py-12 w-full max-w-[1140px]">
        <ResponsiveGrid type="video">
          {Array.from({ length:3 }).map((_, index) => (
            <ResponsiveGridItem key={index} type="video">
              <VideoCard skeleton />
            </ResponsiveGridItem>
          ))}
        </ResponsiveGrid>
      </div>
    </section>
  )
}

/**
 * Video Section Component
 * بخش جدیدترین ویدئوها
 */
export function VideoSection({ videoItems }: VideoSectionProps) {
  // حذف setPlaylist - دیگه نباید اینجا playlist رو set کنیم
  // چون باعث می‌شه playlist فعلی (مثلاً از session) پاک بشه

  return (
    <section className="flex flex-col gap-2 items-end w-full max-w-[1140px] pt-22 -mb-5">
      {/* Header */}
      <SectionHeader
        title="جدیدترین ویدئو ها"
        icon={<HeaderIcon className="w-[24px] h-[24px] text-theme-gray" />}
        showViewAll={true}
        viewAllHref={getServiceListHref('fa', ServiceId.VIDEO)}
        viewAllText="مشاهده همه"
      />

      {/* Content */}
      <div className="w-full max-w-[1140px]">
        {!videoItems || videoItems.length === 0 ? (
          <MediaEmpty type="video" />
        ) : (
          <ResponsiveGrid type="video">
            {videoItems.map((item) => (
              <ResponsiveGridItem key={item.id} type="video">
                <VideoCard item={item} linkMode />
              </ResponsiveGridItem>
            ))}
          </ResponsiveGrid>
        )}
      </div>
    </section>
  )
}
