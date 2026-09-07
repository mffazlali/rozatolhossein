/**
 * RelatedSessions Component - روضة الحسین
 * بخش جلسات مرتبط
 */

'use client';

import {
  SectionHeader,
  SessionCard,
  ResponsiveGrid,
  ResponsiveGridItem,
} from '@/shared';
import type { SessionItem } from '@/shared/types';

interface RelatedSessionsProps {
  sessions?: SessionItem[];
  viewAllHref?: string;
  className?: string;
  skeleton?: boolean;
}

/**
 * RelatedSessions Skeleton Component
 */
function RelatedSessionsSkeleton() {
  return (
    <div className="flex flex-col gap-[7.5px] items-end pt-12">
      {/* Header Skeleton */}
      <div className="flex items-center gap-2 w-full">
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 bg-theme-gray/20 rounded animate-pulse" />
          <div className="h-5 w-24 bg-theme-gray/20 rounded animate-pulse" />
        </div>
        <div className="flex-1 h-px bg-theme-gray/30" />
      </div>

      {/* Cards Grid Skeleton */}
      <ResponsiveGrid type="session">
        {[...Array(3)].map((_, i) => (
          <ResponsiveGridItem
            key={i}
            type="session"
            className={i === 0 ? 'z-3' : i === 1 ? 'z-2' : 'z-1'}
          >
            <SessionCard skeleton />
          </ResponsiveGridItem>
        ))}
      </ResponsiveGrid>
    </div>
  );
}

export const RelatedSessions = ({
  sessions,
  viewAllHref = '/session',
  className = '',
  skeleton = false,
}: RelatedSessionsProps) => {
  if (skeleton) {
    return <RelatedSessionsSkeleton />;
  }

  if (!sessions || sessions.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-[7.5px] items-end pt-12 ${className}`}>
      {/* هدر با عنوان و لینک مشاهده همه */}
      <SectionHeader
        title="جلسات دیگر"
        icon={<i className="fa-light fa-layer-group text-theme-gray text-2xl" />}
        showViewAll
        viewAllHref={viewAllHref}
      />

      {/* لیست جلسات */}
      <ResponsiveGrid type="session">
        {sessions.map((item, index) => (
          <ResponsiveGridItem
            key={item.id}
            type="session"
            className={index === 0 ? 'z-3' : index === 1 ? 'z-2' : 'z-1'}
          >
            <SessionCard item={item} />
          </ResponsiveGridItem>
        ))}
      </ResponsiveGrid>
    </div>
  );
};
