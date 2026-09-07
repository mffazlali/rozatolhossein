'use client'

import Link from 'next/link'

/**
 * MetaTag Item Type
 */
export interface MetaTagItem {
  label: string
  value: string
  href?: string
  icon?: string
}

/**
 * MetaTags Props
 */
interface MetaTagsProps {
  items?: MetaTagItem[]
  className?: string
  skeleton?: boolean
  skeletonCount?: number
}

/**
 * MetaTags Skeleton Component
 */
function MetaTagsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 border border-theme-border rounded-lg">
          <div className="w-3 md:w-4 h-3 md:h-4 bg-theme-gray/20 rounded animate-pulse" />
          <div className="w-12 md:w-16 h-3 md:h-4 bg-theme-gray/20 rounded animate-pulse" />
        </div>
      ))}
    </div>
  )
}

/**
 * MetaTags Component
 * نمایش تگ‌های متا - قابل استفاده مجدد
 *
 * @param items - آیتم‌های متا
 * @param className - کلاس اضافی
 * @param skeleton - نمایش حالت اسکلتون
 * @param skeletonCount - تعداد آیتم‌های اسکلتون
 *
 * @example
 * <MetaTags items={[
 *   { label: 'سال', value: '۱۴۰۴', icon: 'fa-diamond' },
 *   { label: 'مناسبت', value: 'محرم', href: '/occasion/moharram', icon: 'fa-calendar' },
 * ]} />
 */
export function MetaTags({
  items = [],
  className = '',
  skeleton = false,
  skeletonCount = 4,
}: MetaTagsProps) {
  if (skeleton) {
    return <MetaTagsSkeleton count={skeletonCount} />
  }

  if (!items.length) return null

  return (
    <div
      className={`flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 ${className}`}>
      {items.map((tag, index) =>
        tag.href ? (
          <Link
            key={index}
            href={tag.href}
            className="text-theme-gray text-xs md:text-sm group transition-colors">
            <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 border border-theme-border rounded-lg">
              {tag.icon && (
                <i
                  className={`fa-light ${tag.icon} text-theme-gray text-xs md:text-sm group-hover:text-theme-white`}
                />
              )}
              <span className="text-theme-gray text-xs md:text-sm group-hover:text-theme-white">
                {tag.value}
              </span>
            </div>
          </Link>
        ) : (
          <div
            key={index}
            className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 border border-theme-border rounded-lg">
            {tag.icon && (
              <i
                className={`fa-light ${tag.icon} text-theme-gray text-xs md:text-sm`}
              />
            )}
            <span className="text-theme-gray text-xs md:text-sm">
              {tag.value}
            </span>
          </div>
        )
      )}
    </div>
  )
}
