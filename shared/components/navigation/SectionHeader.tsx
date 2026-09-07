import Link from 'next/link'
import { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  icon?: ReactNode
  showViewAll?: boolean
  viewAllHref?: string
  viewAllText?: string
  className?: string
}

/**
 * Section Header Component
 * کامپوننت هدر بخش‌ها - قابل استفاده مجدد
 *
 * دو نوع layout:
 * - audio: آیکون + عنوان (چپ) | خط تقسیم (وسط) | مشاهده همه (راست)
 * - standard: مشاهده همه (چپ) | خط تقسیم (وسط) | عنوان + آیکون (راست)
 */
export const SectionHeader = ({
  title,
  icon,
  showViewAll = false,
  viewAllHref = '#',
  viewAllText = 'مشاهده همه',
  className = '',
}: SectionHeaderProps) => {
  // AudioSection layout: Icon + Title (right) | Divider (middle) | View All (left)
  return (
    <div className={`flex gap-2 sm:gap-[10px] items-center w-full px-4 sm:px-6 lg:px-0 overflow-hidden ${className}`}>
      {/* Title and Icon */}
      <div className="flex items-center gap-1 sm:gap-[5px] shrink min-w-0">
        {icon && (
          <div className="shrink-0">{icon}</div>
        )}
        <h2 className="text-theme-white font-bold text-sm sm:text-base md:text-[18.4px] leading-tight sm:leading-[16px] text-right truncate">
          {title}
        </h2>
      </div>

      {/* Divider */}
      <div className="flex-1 min-w-4 sm:min-w-8">
        <div className="w-full border-t border-theme-border" />
      </div>

      {/* View All Button */}
      {showViewAll && (
        <Link
          href={viewAllHref}
          className="bg-theme-gray-dark flex items-center gap-0.5 px-2 py-1 rounded-[3px] hover:bg-theme-gray-dark/80 transition-colors shrink-0">
          <span className="text-theme-white text-xs sm:text-sm font-normal whitespace-nowrap">
            {viewAllText}
          </span>
          <i className="fa-light fa-chevron-left text-theme-white text-xs sm:text-sm -scale-y-100" />
        </Link>
      )}
    </div>
  )
}
