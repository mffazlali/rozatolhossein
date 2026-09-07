'use client'

/**
 * LyricsSection Props
 */
export interface LyricsSessionProps {
  /** متن شعر (HTML یا plain text) */
  lyrics?: string
  /** عنوان (اختیاری) */
  title?: string
  /** حالت skeleton */
  skeleton?: boolean
  /** کلاس اضافی */
  className?: string
  /** ارتفاع بخش (پیش‌فرض: 337px) */
  height?: number
  /** سطح زوم (پیش‌فرض: 1) */
  zoomLevel?: number
}

// عرض‌های ثابت برای skeleton lines
const SKELETON_WIDTHS = [
  'w-3/5',
  'w-2/5',
  'w-1/2',
  'w-3/4',
  'w-2/3',
  'w-1/2',
  'w-3/5',
  'w-2/5',
]

/**
 * LyricsSection Skeleton Component
 */
function LyricsSessionSkeleton({ height = 337 }: { height?: number }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Title Skeleton */}
      <div className="h-5 w-48 bg-theme-gray/20 rounded animate-pulse" />
      {/* Lines Skeleton */}
      {SKELETON_WIDTHS.map((width, i) => (
        <div
          key={i}
          className={`h-4 bg-theme-gray/20 rounded animate-pulse ${width}`}
        />
      ))}
    </div>
  )
}

/**
 * LyricsSection Component
 * کامپوننت نمایش متن شعر با scroll و gradient fade
 * پشتیبانی از HTML content از API
 *
 * @example
 * ```tsx
 * <LyricsSection
 *   lyrics="<p>متن شعر...</p>"
 *   title="عنوان شعر"
 * />
 * ```
 */
export function LyricsSession({
  lyrics,
  title,
  skeleton = false,
  className = '',
  height = 337,
  zoomLevel = 1,
}: LyricsSessionProps) {
  if (skeleton) {
    return <LyricsSessionSkeleton height={height} />
  }

  // اگر متنی وجود نداشت، چیزی نمایش نده
  if (!lyrics) return null

  // محاسبه فونت‌سایز بر اساس زوم (14px = 0.875rem base)
  const baseFontSize = 14 // px
  const fontSize = baseFontSize * zoomLevel
  const lineHeight = 32 * zoomLevel // 32px = leading-8

  return (
    <div className={`mx-2 sm:mx-0 ${className}`}>
      <div className="relative">
        <div className="flex flex-col items-center gap-0">
          {/* Title if exists */}
          {title && (
            <p
              className="text-theme-gray font-extrabold text-center mb-4"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: `${lineHeight}px`,
              }}>
              {title}
            </p>
          )}

          {/* Lyrics Content - HTML از API */}
          <div
            className="lyrics-content text-theme-gray font-medium text-center [&_p]:mb-4 [&_br]:leading-8"
            style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px` }}
            dangerouslySetInnerHTML={{ __html: lyrics }}
          />
        </div>
      </div>
    </div>
  )
}
