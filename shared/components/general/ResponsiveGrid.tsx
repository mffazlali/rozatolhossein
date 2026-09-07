import type { ReactNode } from 'react'

/**
 * Grid Type
 * نوع گرید برای تعیین تعداد ستون‌ها
 */
export type GridType = 'audio' | 'video' | 'session' | 'image'

/**
 * ResponsiveGrid Props
 */
interface ResponsiveGridProps {
  children?: ReactNode
  type?: GridType
  gap?: string
  className?: string
}

/**
 * ResponsiveGrid Component
 * گرید ریسپانسیو برای نمایش آیتم‌ها - قابل استفاده مجدد
 *
 * Breakpoints:
 * - audio: Mobile: 1 col, SM: 2 cols, MD: 3 cols, LG: 5 cols
 * - video: Mobile: 1 col, SM: 2 cols, MD: 3 cols
 * - session: Mobile: 1 col, SM: 2 cols, MD: 3 cols
 * - image: Mobile: 2 cols, SM: 2 cols, MD: 4 cols, LG: 4 cols
 *
 * @param children - آیتم‌های گرید
 * @param type - نوع گرید (audio, video, session یا image)
 * @param gap - فاصله بین آیتم‌ها (پیش‌فرض: 7.5px)
 * @param className - کلاس اضافی
 */
export function ResponsiveGrid({
  children,
  gap = '[7.5px]',
  className = '',
}: ResponsiveGridProps) {
  return (
    <div
      className={`flex flex-wrap gap-${gap} justify-start w-full ${className}`}>
      {children}
    </div>
  )
}

/**
 * ResponsiveGridItem Component
 * آیتم گرید ریسپانسیو
 *
 * @param children - محتوای آیتم
 * @param type - نوع گرید (audio یا video)
 * @param className - کلاس اضافی
 */
interface ResponsiveGridItemProps {
  children: ReactNode
  type?: GridType
  className?: string
}

export function ResponsiveGridItem({
  children,
  type = 'audio',
  className = '',
}: ResponsiveGridItemProps) {
  // Audio: 5 columns on large screens
  // Video & Session: 3 columns on medium+ screens
  // Image: 4 columns on medium+ screens
  const getWidthClasses = () => {
    switch (type) {
      case 'audio':
        return 'w-[calc(50%-3.75px)] sm:w-[calc(50%-3.75px)] md:w-[calc(33.333%-5px)] lg:w-[calc(20%-6px)]'
      case 'image':
        return 'w-[calc(50%-3.75px)] sm:w-[calc(50%-3.75px)] md:w-[calc(25%-5.625px)]'
      default:
        return 'w-full sm:w-[calc(50%-3.75px)] md:w-[calc(33.333%-5px)]'
    }
  }

  return (
    <div className={`${getWidthClasses()} p-[7.5px] ${className}`}>
      {children}
    </div>
  )
}
