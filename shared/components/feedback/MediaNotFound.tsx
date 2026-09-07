import Link from 'next/link'

type MediaType = 'audio' | 'video' | 'session' | 'service' | 'content' | 'person' | 'occasion' | 'place' | 'heyat' | 'tag' | 'style'

interface MediaNotFoundConfig {
  icon: string
  title: string
  description: string
  listHref: string
  listIcon: string
  listLabel: string
}

const mediaConfig: Record<MediaType, MediaNotFoundConfig> = {
  audio: {
    icon: 'fa-music-slash',
    title: 'صوت مورد نظر یافت نشد',
    description: 'متأسفانه صوتی که به دنبال آن هستید وجود ندارد یا حذف شده است.',
    listHref: '/audio',
    listIcon: 'fa-headphones',
    listLabel: 'لیست صوت‌ها',
  },
  video: {
    icon: 'fa-video-slash',
    title: 'ویدیو مورد نظر یافت نشد',
    description: 'متأسفانه ویدیویی که به دنبال آن هستید وجود ندارد یا حذف شده است.',
    listHref: '/video',
    listIcon: 'fa-video',
    listLabel: 'لیست ویدیوها',
  },
  session: {
    icon: 'fa-calendar-xmark',
    title: 'جلسه مورد نظر یافت نشد',
    description: 'متأسفانه جلسه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.',
    listHref: '/session',
    listIcon: 'fa-calendar',
    listLabel: 'لیست جلسات',
  },
  service: {
    icon: 'fa-folder-xmark',
    title: 'سرویس مورد نظر یافت نشد',
    description: 'متأسفانه سرویسی که به دنبال آن هستید وجود ندارد یا حذف شده است.',
    listHref: '/',
    listIcon: 'fa-home',
    listLabel: 'صفحه اصلی',
  },
  content: {
    icon: 'fa-file-xmark',
    title: 'محتوا مورد نظر یافت نشد',
    description: 'متأسفانه محتوایی که به دنبال آن هستید وجود ندارد یا حذف شده است.',
    listHref: '/',
    listIcon: 'fa-home',
    listLabel: 'صفحه اصلی',
  },
  person: {
    icon: 'fa-user-slash',
    title: 'شخص مورد نظر یافت نشد',
    description: 'متأسفانه شخصی که به دنبال آن هستید وجود ندارد یا حذف شده است.',
    listHref: '/',
    listIcon: 'fa-home',
    listLabel: 'صفحه اصلی',
  },
  occasion: {
    icon: 'fa-calendar-xmark',
    title: 'مناسبت مورد نظر یافت نشد',
    description: 'متأسفانه مناسبتی که به دنبال آن هستید وجود ندارد یا حذف شده است.',
    listHref: '/',
    listIcon: 'fa-home',
    listLabel: 'صفحه اصلی',
  },
  place: {
    icon: 'fa-location-xmark',
    title: 'مکان مورد نظر یافت نشد',
    description: 'متأسفانه مکانی که به دنبال آن هستید وجود ندارد یا حذف شده است.',
    listHref: '/',
    listIcon: 'fa-home',
    listLabel: 'صفحه اصلی',
  },
  heyat: {
    icon: 'fa-users-slash',
    title: 'هیئت مورد نظر یافت نشد',
    description: 'متأسفانه هیئتی که به دنبال آن هستید وجود ندارد یا حذف شده است.',
    listHref: '/',
    listIcon: 'fa-home',
    listLabel: 'صفحه اصلی',
  },
  tag: {
    icon: 'fa-tag-slash',
    title: 'کلیدواژه مورد نظر یافت نشد',
    description: 'متأسفانه کلیدواژه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.',
    listHref: '/',
    listIcon: 'fa-home',
    listLabel: 'صفحه اصلی',
  },
  style: {
    icon: 'fa-circle-notch',
    title: 'سبک مورد نظر یافت نشد',
    description: 'متأسفانه سبکی که به دنبال آن هستید وجود ندارد یا حذف شده است.',
    listHref: '/',
    listIcon: 'fa-home',
    listLabel: 'صفحه اصلی',
  },
}

export interface MediaNotFoundProps {
  type: MediaType
}

/**
 * MediaNotFound Component
 * کامپوننت مشترک برای صفحات 404 رسانه‌ها
 */
export function MediaNotFound({ type }: MediaNotFoundProps) {
  const config = mediaConfig[type]

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-20 px-4">
      {/* Icon */}
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-theme-gray-dark border border-theme-border">
        <i className={`fa-light ${config.icon} text-5xl text-theme-gray`} />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-6xl font-bold text-theme-primary-teal">404</h1>
        <h2 className="text-2xl font-bold text-theme-white">{config.title}</h2>
        <p className="text-theme-gray text-lg max-w-md">{config.description}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 bg-theme-gray-dark text-theme-white px-6 py-3 rounded-xl hover:bg-theme-gray-dark/80 transition-colors border border-theme-border"
        >
          <i className="fa-light fa-home text-lg" />
          <span>صفحه اصلی</span>
        </Link>
      </div>
    </div>
  )
}
