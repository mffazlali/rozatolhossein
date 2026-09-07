

import React from 'react'

interface FeatureErrorFallbackProps {
  error: Error
  retry: () => void
  featureName?: string
}

/**
 * Feature-specific Error Fallback Component
 * Displays a compact error message for feature sections
 */
export const FeatureErrorFallback: React.FC<FeatureErrorFallbackProps> = ({
  error,
  retry,
  featureName = 'این بخش',
}) => {
  return (
    <div className="w-full p-8 bg-theme-black rounded-xl border border-theme-border">
      <div className="flex flex-col items-center gap-4">
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-theme-primary-red/10 border border-theme-primary-red/20">
          <i className="fa-light fa-circle-exclamation text-3xl text-theme-primary-red" />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="text-lg font-bold text-theme-white">خطا در بارگذاری {featureName}</h3>
          <p className="text-sm text-theme-gray">متأسفانه در بارگذاری این بخش مشکلی پیش آمده است.</p>
        </div>

        {/* Action Button */}
        <button
          onClick={retry}
          className="flex items-center gap-2 bg-theme-primary-teal text-theme-white px-4 py-2 rounded-lg text-sm hover:bg-theme-primary-teal/80 transition-colors"
        >
          <i className="fa-light fa-rotate-right" />
          <span>تلاش مجدد</span>
        </button>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="w-full mt-2">
            <summary className="cursor-pointer text-xs text-theme-gray hover:text-theme-white transition-colors">
              جزئیات خطا
            </summary>
            <pre className="mt-2 p-3 bg-theme-gray-dark rounded-lg text-xs text-theme-gray overflow-auto border border-theme-border">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
