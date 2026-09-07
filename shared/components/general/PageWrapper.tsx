import type { ReactNode } from 'react'

/**
 * PageWrapper Props
 */
interface PageWrapperProps {
  title?: string
  children: ReactNode
  className?: string
}

/**
 * PageWrapper Component
 * کامپوننت wrapper برای صفحات با نمایش عنوان
 *
 * @param title - عنوان صفحه (از termService)
 * @param children - محتوای اصلی صفحه
 * @param className - کلاس اضافی
 */
export function PageWrapper({ title, children, className = '' }: PageWrapperProps) {
  return (
    <div className={`flex flex-col gap-6 w-full max-w-[1140px] mx-auto px-4 py-8 ${className}`}>
      {/* نمایش عنوان */}
      {title && (
        <h1 className="text-2xl md:text-3xl font-bold text-figma-white">
          {title}
        </h1>
      )}

      {/* محتوای اصلی */}
      {children}
    </div>
  )
}
