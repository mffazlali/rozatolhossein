import { Suspense } from 'react'
import { menuService, homeService } from '@/shared/services'
import { HomeContent, HomeSkeleton } from './components'
import { defaultLocale } from '@/shared/lib/i18n'
import { getContentHref } from '@/shared/types'
import type { AudioItem, VideoItem, SessionItem } from '@/shared/types/media'
import type { HomeContentItem, MainSliderItem, HomePageResponse } from '@/shared/types/home'

interface HomeProps {
  locale?: string
}

/**
 * Hero Slide Type
 */
export interface HeroSlide {
  id: string
  title: string
  subtitle?: string
  image: string
  href: string
  buttonText?: string
}

/**
 * تبدیل MainSliderItem به HeroSlide
 */
function mapToHeroSlide(item: MainSliderItem, index: number): HeroSlide {
  return {
    id: `slider-${index}`,
    title: 'روضة الحسین علیه السلام',
    subtitle: 'جدیدترین مداحی‌ها و روضه‌خوانی‌ها',
    image: item.thumb,
    href: '/',
    buttonText: 'مشاهده بیشتر',
  }
}

/**
 * تبدیل HomeContentItem به AudioItem
 */
function mapToAudioItem(item: HomeContentItem, locale: string): AudioItem {
  return {
    id: item.id,
    title: item.title,
    category: item.service,
    image: item.thumb_path || item.image_path,
    href: getContentHref(locale, item.id),
    audioUrl: '',
    duration: '',
  }
}

/**
 * تبدیل HomeContentItem به VideoItem
 */
function mapToVideoItem(item: HomeContentItem, locale: string): VideoItem {
  return {
    id: item.id,
    title: item.title,
    category: item.service,
    image: item.thumb_path || item.image_path,
    href: getContentHref(locale, item.id),
    duration: '',
    publishedAt: item.created_at,
  }
}

/**
 * تبدیل HomeContentItem به SessionItem
 */
function mapToSessionItem(item: HomeContentItem, locale: string): SessionItem {
  return {
    id: item.id,
    title: item.title,
    date: item.fields?.data?.text || '',
    image: item.thumb_path || item.image_path,
    href: getContentHref(locale, item.id),
  }
}

/**
 * Home Data Fetcher - کامپوننت داخلی برای fetch داده
 */
async function HomeDataFetcher({ locale = defaultLocale }: HomeProps) {
  // Fetch menu data برای HeroNavbar
  let menuData = null
  try {
    menuData = await menuService.getHeaderMenu(locale)
  } catch (error) {
    console.error('Error fetching header menu:', error)
  }

  // Fetch home data
  let homeData: HomePageResponse | null = null
  try {
    homeData = await homeService.getHomeData(locale)
  } catch (error) {
    console.error('Error fetching home data:', error)
  }

  // تبدیل داده‌ها به فرمت مورد نیاز کامپوننت‌ها
  const slides: HeroSlide[] = homeData?.data?.main_slider?.contents
    ? homeData.data.main_slider.contents.map((item, index) => mapToHeroSlide(item, index))
    : []

  const audioItems: AudioItem[] = homeData?.data?.multimedia_sounds?.contents?.data
    ? homeData.data.multimedia_sounds.contents.data.map((item) => mapToAudioItem(item, locale))
    : []

  const videoItems: VideoItem[] = homeData?.data?.multimedia_video?.contents?.data
    ? homeData.data.multimedia_video.contents.data.map((item) => mapToVideoItem(item, locale))
    : []

  const sessionItems: SessionItem[] = homeData?.data?.last_jalasat?.contents?.data
    ? homeData.data.last_jalasat.contents.data.map((item) => mapToSessionItem(item, locale))
    : []

  return (
    <HomeContent
      menuData={menuData}
      slides={slides}
      audioItems={audioItems}
      videoItems={videoItems}
      sessionItems={sessionItems}
      locale={locale}
    />
  )
}

/**
 * Home Page Server Component با Suspense
 * پیاده‌سازی صفحه اصلی با fetch مستقیم از API
 *
 * @endpoint GET /page/home?lang={lang}
 */
const Home = ({ locale = defaultLocale }: HomeProps) => {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeDataFetcher locale={locale} />
    </Suspense>
  )
}

export default Home
