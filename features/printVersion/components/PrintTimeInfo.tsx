/**
 * PrintTimeInfo Component
 * نمایش زمان و شناسه خبر در نسخه چاپی
 *
 * @param time - زمان انتشار خبر
 * @param newsId - شناسه خبر
 */

'use client'

// 1. React imports (removed unused React import)

// 2. Internal imports - Types

interface PrintTimeInfoProps {
  time: string;
  contentId: string | number;
}

// Component
export const PrintTimeInfo = ({ time, contentId }: PrintTimeInfoProps) => {
  // استخراج ساعت از رشته تاریخ
  // فرمت معمول: "1403/09/15 - 14:30" یا "14:30"
  const extractTime = (timeString: string): string => {
    // اگر شامل " - " باشد، قسمت بعد از آن را برمی‌گردانیم
    if (timeString.includes(' - ')) {
      return timeString.split(' - ')[1].trim()
    }
    // اگر شامل ":" باشد، احتمالاً خود ساعت است
    if (timeString.includes(':')) {
      return timeString.trim()
    }
    // در غیر این صورت، همان رشته را برمی‌گردانیم
    return timeString
  }

  const displayTime = extractTime(time)

  return (
    <section className="flex flex-col md:flex-row items-start justify-between w-full gap-4 md:gap-0 py-0 px-4">
      {/* Content ID Section */}
      <div className="flex flex-col items-end md:items-start w-full md:w-auto">
        <p className="text-sm font-normal text-light-white text-right md:text-left leading-6">
          شناسه محتوا: {contentId}
        </p>
      </div>

      {/* Time Section - فقط ساعت */}
      <div className="flex flex-col items-end w-full md:w-auto">
        <p className="text-sm font-normal text-light-white text-right leading-6">
          {displayTime}
        </p>
      </div>
    </section>
  )
}
