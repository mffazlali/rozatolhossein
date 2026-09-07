/**
 * ContentActionButtons Component
 * دکمه‌های عملیات محتوا: زوم، اشتراک‌گذاری، ایمیل، چاپ
 */

'use client'

import { Tooltip } from '@heroui/react'
import { useRouter } from 'next/navigation'

interface ContentActionButtonsProps {
  onZoomIn?: () => void
  onZoomOut?: () => void
  canZoomIn?: boolean
  canZoomOut?: boolean
  title?: string
  url?: string
  contentId?: string
  /** تعداد بازدید */
  viewCount?: number
  shareData?: {
    title?: string
    text?: string
    url?: string
  }
  /** حالت skeleton */
  skeleton?: boolean
}

/**
 * ContentActionButtons Component
 * دکمه‌های عملیات محتوا: زوم، اشتراک‌گذاری، ایمیل، چاپ
 * 
 * @example
 * ```tsx
 * const { zoomLevel, handleZoomIn, handleZoomOut, canZoomIn, canZoomOut } = useZoom()
 * 
 * <ContentActionButtons
 *   onZoomIn={handleZoomIn}
 *   onZoomOut={handleZoomOut}
 *   canZoomIn={canZoomIn}
 *   canZoomOut={canZoomOut}
 *   viewCount={1234}
 *   contentId="39645"
 *   title="عنوان محتوا"
 * />
 * ```
 */
export const ContentActionButtons = ({
  onZoomIn,
  onZoomOut,
  canZoomIn = true,
  canZoomOut = true,
  title,
  url,
  contentId,
  viewCount,
  shareData,
  skeleton = false,
}: ContentActionButtonsProps) => {
  const router = useRouter()

  // Skeleton state
  if (skeleton) {
    return (
      <div className="flex items-center justify-end w-full animate-pulse">
        {/* View count skeleton */}
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-theme-gray/20 rounded" />
          <div className="w-20 h-4 bg-theme-gray/20 rounded" />
        </div>
        {/* Action buttons skeleton */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-4 h-4 bg-theme-gray/20 rounded" />
          ))}
        </div>
      </div>
    )
  }

  // باز کردن صفحه نسخه چاپی
  const handlePrint = () => {
    if (contentId) {
      router.push(`/content/${contentId}/print-version`)
    } else {
      window.print()
    }
  }

  // ارسال ایمیل با عنوان و لینک صفحه
  const handleEmail = () => {
    const pageTitle = title || document.title
    const pageUrl = url || window.location.href
    const subject = encodeURIComponent(pageTitle)
    const body = encodeURIComponent(`${pageTitle}\n\n${pageUrl}`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  // Native Share API handler - باز کردن صفحه native اشتراک‌گذاری دستگاه
  const handleNativeShare = async () => {
    // بررسی پشتیبانی از Web Share API
    if (navigator.share) {
      try {
        // آماده‌سازی داده‌های اشتراک‌گذاری
        const sharePayload = {
          title: shareData?.title || title || document.title,
          text: shareData?.text || 'مشاهده این محتوا در روضة الحسین',
          url: shareData?.url || url || window.location.href,
        }

        // باز کردن صفحه native اشتراک‌گذاری دستگاه
        await navigator.share(sharePayload)
      } catch (error) {
        // اگر کاربر share را کنسل کرد یا خطایی رخ داد
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Share was cancelled by user')
        } else {
          console.error('Share failed:', error)
          // در صورت خطا، fallback به کپی کردن لینک
          await fallbackCopyToClipboard()
        }
      }
    } else {
      // Fallback برای مرورگرهایی که Web Share API را پشتیبانی نمی‌کنند
      await fallbackCopyToClipboard()
    }
  }

  // تابع کمکی برای fallback کپی کردن لینک
  const fallbackCopyToClipboard = async () => {
    const urlToCopy = shareData?.url || url || window.location.href

    try {
      // استفاده از Clipboard API مدرن
      await navigator.clipboard.writeText(urlToCopy)
      alert('لینک در کلیپ‌بورد کپی شد')
    } catch (error) {
      console.error('Clipboard API failed, using legacy method:', error)

      // Fallback برای مرورگرهای قدیمی
      try {
        const textArea = document.createElement('textarea')
        textArea.value = urlToCopy
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        alert('لینک در کلیپ‌بورد کپی شد')
      } catch (legacyError) {
        console.error('All clipboard methods failed:', legacyError)
        alert('خطا در کپی کردن لینک')
      }
    }
  }

  return (
    <div className="flex items-center justify-end w-full">
      {/* View count - سمت چپ */}
      {viewCount !== undefined && (
        <div className="flex items-center gap-1">
          <i className="fa-light fa-eye text-sm text-theme-gray" />
          <span className="text-sm text-theme-gray">
            بازدید: {viewCount.toLocaleString('fa-IR')}
          </span>
        </div>
      )}

      {/* Action buttons - سمت راست */}
      <div className="flex items-center gap-1">
        <Tooltip content="بزرگ‌نمایی" placement="top">
          <button
            type="button"
            aria-label="بزرگ‌نمایی"
            className={`p-2 transition-colors ${
              canZoomIn
                ? 'hover:text-theme-primary-teal cursor-pointer text-theme-gray'
                : 'opacity-40 cursor-not-allowed text-theme-gray'
            }`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onZoomIn?.()
            }}
            disabled={!canZoomIn}>
            <i className="fa-light fa-magnifying-glass-plus text-sm" />
          </button>
        </Tooltip>
        <Tooltip content="کوچک‌نمایی" placement="top">
          <button
            type="button"
            aria-label="کوچک‌نمایی"
            className={`p-2 transition-colors ${
              canZoomOut
                ? 'hover:text-theme-primary-teal cursor-pointer text-theme-gray'
                : 'opacity-40 cursor-not-allowed text-theme-gray'
            }`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onZoomOut?.()
            }}
            disabled={!canZoomOut}>
            <i className="fa-light fa-magnifying-glass-minus text-sm" />
          </button>
        </Tooltip>
        <Tooltip content="اشتراک‌گذاری" placement="top">
          <button
            type="button"
            aria-label="اشتراک‌گذاری"
            className="p-2 text-theme-gray hover:text-theme-primary-teal transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleNativeShare()
            }}>
            <i className="fa-light fa-share-nodes text-sm" />
          </button>
        </Tooltip>
        <Tooltip content="ارسال ایمیل" placement="top">
          <button
            type="button"
            aria-label="ارسال ایمیل"
            className="p-2 text-theme-gray hover:text-theme-primary-teal transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleEmail()
            }}>
            <i className="fa-light fa-envelope text-sm" />
          </button>
        </Tooltip>
        <Tooltip content="چاپ" placement="top">
          <button
            type="button"
            aria-label="چاپ"
            className="p-2 text-theme-gray hover:text-theme-primary-teal transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handlePrint()
            }}>
            <i className="fa-light fa-print text-sm" />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}
