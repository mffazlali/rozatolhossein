'use client'

import { useCallback } from 'react'
import { ErrorBoundary, FeatureErrorFallback } from '@/shared'
import type { ContentDetail } from '@/shared/types/content'
import { PrintHeader } from './PrintHeader'
import { PrintTitle } from './PrintTitle'
import { PrintMainImage } from './PrintMainImage'
import { PrintContentText } from './PrintContentText'
import { PrintTimeInfo } from './PrintTimeInfo'

/**
 * PrintContentSkeleton Component
 * اسکلتون کامل محتوای صفحه نسخه چاپی
 */
export const PrintContentSkeleton = () => {
  return (
    <>
      {/* Page Title */}
      <div className="flex flex-col items-start pb-2 w-full bg-light-black light">
        <div className="h-10 w-32 bg-light-gray-dark rounded animate-pulse" />
      </div>

      <div className="bg-light-black flex flex-col items-center w-full min-h-screen p-4 light">
        <div className="flex flex-col w-full max-w-[1320px] animate-pulse">
          {/* Header Skeleton */}
          <header className="flex flex-col md:flex-row items-start w-full min-h-[196px] gap-4 md:gap-0">
            <div className="w-full md:w-1/2 lg:w-[50%] px-3">
              <div className="w-[250px] h-[99px] bg-light-gray-dark rounded" />
            </div>
            <div className="w-full md:w-1/3 lg:w-[33%] px-3 flex items-end justify-center h-[196px]">
              <div className="h-6 w-48 bg-light-gray-dark rounded" />
            </div>
            <div className="w-full md:w-1/6 lg:w-[17%] px-3">
              <div className="w-[196px] h-[196px] bg-light-gray-dark rounded" />
            </div>
          </header>

          {/* Separator */}
          <div className="w-full h-px bg-light-gray-dark my-4" />

          {/* Time Info Skeleton */}
          <div className="flex justify-between w-full px-4">
            <div className="h-6 w-32 bg-light-gray-dark rounded" />
            <div className="h-6 w-16 bg-light-gray-dark rounded" />
          </div>

          {/* Title Skeleton */}
          <div className="py-4">
            <div className="h-12 w-3/4 bg-light-gray-dark rounded" />
          </div>

          {/* Image Skeleton */}
          <div className="py-4">
            <div className="w-full h-[400px] md:h-[600px] bg-light-gray-dark rounded-lg" />
          </div>

          {/* Content Skeleton */}
          <div className="py-6 space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-6 w-full bg-light-gray-dark rounded" />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * PrintContentProps Interface
 */
interface PrintContentProps {
  content: ContentDetail
  locale?: string
}

/**
 * PrintContent Component (Client Component)
 * کامپوننت اصلی محتوای صفحه نسخه چاپی با ErrorBoundary
 */
export const PrintContent = ({
  content,
  locale = 'fa',
}: PrintContentProps) => {
  const handleRetry = useCallback(
    (resetErrorBoundary: () => void) => {
      resetErrorBoundary()
      // Refresh page to refetch data from server
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    },
    []
  )

  const parseContentToArray = (htmlContent?: string): string[] => {
    if (!htmlContent) return []
    const textContent = htmlContent
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim()

    const paragraphs = textContent
      .split(/\n\n|\. (?=[A-Za-z\u0600-\u06FF])/)
      .filter((p) => p.trim().length > 0)
      .map((p) => p.trim())

    return paragraphs
  }

  const contentArray = parseContentToArray(content.body)
  const contentUrl = `https://rozatolhosein.com/${locale}/content/${content.id}`

  return (
    <ErrorBoundary
      fallback={({ error, retry }) => (
        <FeatureErrorFallback
          error={error}
          retry={() => handleRetry(retry)}
          featureName="نسخه چاپی"
        />
      )}
      resetOnPropsChange>
      <div className="bg-light-black flex flex-col items-center w-full min-h-screen p-4 light">
        <div className="flex flex-col w-full max-w-[1320px]">
          <PrintHeader url={contentUrl} contentId={String(content.id)} />
          <div className="w-full h-px bg-light-gray opacity-25 my-4" />
          <PrintTimeInfo
            time={content.fields.data.text}
            contentId={String(content.id)}
          />
          <PrintTitle title={content.title} />
          {content.image_path && (
            <PrintMainImage image={content.image_path} title={content.title} />
          )}
          <PrintContentText content={contentArray} />
        </div>
      </div>
    </ErrorBoundary>
  )
}
