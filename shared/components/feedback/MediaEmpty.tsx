/**
 * Media Empty Type
 * نوع مدیا برای تعیین آیکون و پیام
 */
export type MediaEmptyType = 'audio' | 'video' | 'session'

/**
 * MediaEmpty Props
 */
interface MediaEmptyProps {
  type: MediaEmptyType
  message?: string
}

/**
 * MediaEmpty Component
 * کامپوننت empty state یکپارچه برای بخش‌های مدیا - قابل استفاده مجدد
 *
 * مطابق استانداردهای پروژه روضة الحسین
 * - استفاده از FontAwesome Light icons
 * - پیام‌های فارسی
 * - Responsive design
 *
 * @param type - نوع مدیا (audio, video, یا session)
 * @param message - پیام سفارشی (اختیاری)
 */
export function MediaEmpty({ type, message }: MediaEmptyProps) {
  // Default messages based on type
  const defaultMessages = {
    audio: 'هیچ صوتی یافت نشد',
    video: 'هیچ ویدیویی یافت نشد',
    session: 'هیچ جلسه‌ای یافت نشد',
  }

  // Icons based on type
  const icons = {
    audio: 'fa-music',
    video: 'fa-video',
    session: 'fa-calendar',
  }

  return (
    <div className="flex items-center justify-center w-full py-24">
      <div className="flex flex-col items-center gap-4">
        <i className={`fa-light ${icons[type]} text-theme-gray text-4xl`} />
        <p className="text-theme-gray text-sm">
          {message || defaultMessages[type]}
        </p>
      </div>
    </div>
  )
}
