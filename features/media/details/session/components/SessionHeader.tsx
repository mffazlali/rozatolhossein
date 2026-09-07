/**
 * SessionHeader Component - روضة الحسین
 * هدر جلسه شامل عنوان، نام هیئت و دکمه سال
 */

'use client'

import Link from 'next/link'

interface SessionHeaderProps {
  title?: string
  heyatName?: string
  heyatHref?: string
  year?: string
  className?: string
  skeleton?: boolean
}

/**
 * SessionHeader Skeleton Component
 */
function SessionHeaderSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-2 w-full bg-theme-black border border-theme-border rounded-[10px] px-4 py-4 sm:px-5 sm:py-5">
      {/* بخش عنوان و هیئت - سمت راست */}
      <div className="flex flex-col gap-2 flex-1 w-full sm:w-auto">
        <div className="h-4 sm:h-5 w-full sm:w-3/4 bg-theme-gray/20 rounded animate-pulse" />
        <div className="h-3 sm:h-4 w-2/3 sm:w-1/3 bg-theme-gray/20 rounded animate-pulse" />
      </div>
      {/* دکمه سال - سمت چپ */}
      <div className="w-16 sm:w-20 h-8 sm:h-10 bg-theme-gray/20 rounded-md animate-pulse self-end sm:self-auto" />
    </div>
  )
}

export const SessionHeader = ({
  title = '',
  heyatName = '',
  heyatHref = '',
  year = '',
  className = '',
  skeleton = false,
}: SessionHeaderProps) => {
  if (skeleton) {
    return <SessionHeaderSkeleton />
  }

  return (
    <div
      className={`flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-2 w-full px-4 py-4 sm:px-5 sm:py-5 ${className}`}>
      {/* بخش عنوان و هیئت - سمت راست */}
      <div className="flex flex-col gap-1 flex-1 w-full sm:w-auto">
        <Link href={heyatHref}>
          <h1 className="text-base sm:text-lg font-bold text-theme-white leading-tight">
            {title}
          </h1>
        </Link>
        <Link href={heyatHref} className="text-xs sm:text-sm text-theme-gray ">
          {heyatName}
        </Link>
      </div>

      {/* دکمه سال - سمت چپ */}
      <div className="flex items-center gap-1 bg-theme-gray rounded-md px-4 py-2 sm:px-5 sm:py-2.5 self-end sm:self-auto cursor-pointer">
        <i className="fa-light fa-calendar-days text-theme-black text-xs sm:text-sm" />
        <span className="text-xs font-medium text-theme-black">{year}</span>
      </div>
    </div>
  )
}
