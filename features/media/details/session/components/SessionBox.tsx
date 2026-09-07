/**
 * SessionHeader Component - روضة الحسین
 * هدر جلسه شامل عنوان، نام هیئت و دکمه سال
 */

'use client'

interface SessionProps {
  className?: string
  children: React.ReactNode
}

/**
 * SessionHeader Skeleton Component
 */
export function SessionHBoxSkeleton({ children }: SessionProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-2 w-full bg-theme-black border border-theme-border rounded-[10px] px-4 py-4 sm:px-5 sm:py-5">
      {children}
    </div>
  )
}

export const SessionBox = ({ children, className }: SessionProps) => {
  return (
    <div
      className={`flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-2 w-full bg-theme-black border border-theme-border rounded-[10px] px-4 py-4 sm:px-5 sm:py-5 ${className}`}>
      {children}
    </div>
  )
}
