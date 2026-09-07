'use client'

import {
  SessionCard,
  MediaEmpty,
  ResponsiveGrid,
  ResponsiveGridItem,
} from '@/shared'
import { SectionHeader } from '@/shared/components/navigation'
import { HeaderIcon } from '@/shared/icons'
import { getServiceListHref, ServiceId } from '@/shared/types'
import type { SessionItem } from '@/shared/types/media'

interface SessionsSectionProps {
  sessionItems: SessionItem[]
}

/**
 * SessionsSectionSkeleton Component
 * اسکلتون بخش جلسات در صفحه اصلی - مطابق oldFeatures
 */
export function SessionsSectionSkeleton() {
  return (
    <section className="flex flex-col  gap-2 items-center w-full max-w-[1140px] pt-22 -mb-5">
      {/* Header */}
      <SectionHeader
        title="آخرین جلسات"
        icon={<HeaderIcon className="w-[24px] h-[24px] text-figma-gray" />}
        showViewAll={true}
        viewAllHref="#"
        viewAllText="مشاهده همه"
      />

      {/* Content Skeleton */}
      <div className="py-12 w-full max-w-[1140px]">
        <ResponsiveGrid type="session">
          {Array.from({ length: 3 }).map((_, index) => (
            <ResponsiveGridItem key={index} type="session">
              <SessionCard skeleton />
            </ResponsiveGridItem>
          ))}
        </ResponsiveGrid>
      </div>
    </section>
  )
}

/**
 * Sessions Section Component
 * بخش آخرین جلسات
 */
export function SessionsSection({ sessionItems }: SessionsSectionProps) {
  return (
    <section className="flex flex-col gap-2 items-center w-full max-w-[1140px] pt-22 -mb-5">
      {/* Header */}
      <SectionHeader
        title="آخرین جلسات"
        icon={<HeaderIcon className="w-[24px] h-[24px] text-theme-gray" />}
        showViewAll={true}
        viewAllHref={getServiceListHref('fa', ServiceId.SESSION)}
        viewAllText="مشاهده همه"
      />

      {/* Content */}
      <div className="w-full max-w-[1140px]">
        {!sessionItems || sessionItems.length === 0 ? (
          <MediaEmpty type="session" />
        ) : (
          <ResponsiveGrid type="session">
            {sessionItems.map((item, index) => (
              <ResponsiveGridItem
                key={item.id}
                type="session"
                className={index === 0 ? 'z-3' : index === 1 ? 'z-2' : 'z-1'}>
                <SessionCard item={item} />
              </ResponsiveGridItem>
            ))}
          </ResponsiveGrid>
        )}
      </div>
    </section>
  )
}
