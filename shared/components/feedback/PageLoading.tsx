'use client'

/**
 * PageLoading Component
 * کامپوننت لودینگ صفحه با انیمیشن
 */

interface PageLoadingProps {
  /** متن نمایشی (اختیاری) */
  text?: string
  /** نمایش تمام صفحه */
  fullPage?: boolean
  /** کلاس اضافی */
  className?: string
}

export function PageLoading({ 
  text, 
  fullPage = true,
  className = '' 
}: PageLoadingProps) {
  return (
    <div 
      className={`
        flex flex-col items-center justify-center gap-4
        ${fullPage ? 'fixed inset-0 z-9999 bg-theme-black/95 backdrop-blur-sm' : 'w-full h-full min-h-[300px]'}
        ${className}
      `}
    >
      {/* Spinner Animation */}
      <div className="relative w-16 h-16">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-theme-gray/20" />
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-theme-white animate-spin" />
        {/* Inner pulse */}
        <div className="absolute inset-3 rounded-full bg-theme-white/20 animate-pulse" />
      </div>

      {/* Loading text */}
      {text && (
        <p className="text-theme-gray-light text-sm font-light animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

/**
 * PageLoadingSkeleton Component
 * اسکلتون صفحه برای نمایش ساختار کلی
 */
export function PageLoadingSkeleton() {
  return (
    <div className="w-full min-h-screen bg-theme-black">
      {/* Hero Skeleton */}
      <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] bg-theme-gray-dark animate-pulse" />
      
      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-32 h-6 bg-theme-gray/20 rounded animate-pulse" />
          <div className="w-20 h-4 bg-theme-gray/20 rounded animate-pulse" />
        </div>
        
        {/* Cards Grid */}
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] aspect-video bg-theme-gray/20 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
