'use client'

import React from 'react'
import Link from 'next/link'

interface ErrorFallbackProps {
  error: Error
  retry: () => void
}

/**
 * Default Error Fallback Component
 * Displays a user-friendly error message
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, retry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-gray-dark p-4">
      <div className="flex flex-col items-center gap-6 max-w-md w-full bg-theme-black rounded-xl p-8 border border-theme-border">
        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-theme-primary-red/10 border border-theme-primary-red/20">
          <i className="fa-light fa-triangle-exclamation text-5xl text-theme-primary-red" />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-2xl font-bold text-theme-white">خطایی رخ داده است</h1>
          <p className="text-theme-gray text-base">
            متأسفانه در بارگذاری این بخش مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={retry}
            className="flex items-center gap-2 bg-theme-primary-teal text-theme-white px-6 py-3 rounded-xl hover:bg-theme-primary-teal/80 transition-colors"
          >
            <i className="fa-light fa-rotate-right text-lg" />
            <span>تلاش مجدد</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 bg-theme-gray-dark text-theme-white px-6 py-3 rounded-xl hover:bg-theme-gray-dark/80 transition-colors border border-theme-border"
          >
            <i className="fa-light fa-home text-lg" />
            <span>صفحه اصلی</span>
          </Link>
        </div>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="w-full">
            <summary className="cursor-pointer text-sm text-theme-gray hover:text-theme-white transition-colors">
              جزئیات خطا
            </summary>
            <pre className="mt-2 p-4 bg-theme-gray-dark rounded-lg text-xs text-theme-gray overflow-auto border border-theme-border">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
