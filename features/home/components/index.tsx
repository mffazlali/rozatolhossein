'use client'

import { ErrorBoundary, ErrorFallback } from '@/shared'
import { CachedFeatureWrapper } from '@/shared/components/cache'
import { HomeHero, HomeHeroSkeleton } from './HomeHero'
import { AudioSection, AudioSectionSkeleton } from './AudioSection'
import { VideoSection, VideoSectionSkeleton } from './VideoSection'
import { SessionsSection, SessionsSectionSkeleton } from './SessionsSection'
import type { NavItem } from '@/shared/types/menu'
import type { AudioItem, VideoItem, SessionItem } from '@/shared/types/media'
import type { HeroSlide } from '../index'

interface HomeContentProps {
  menuData: NavItem[] | null
  slides: HeroSlide[]
  audioItems: AudioItem[]
  videoItems: VideoItem[]
  sessionItems: SessionItem[]
  locale?: string
}

interface HomeData {
  menuData: NavItem[] | null
  slides: HeroSlide[]
  audioItems: AudioItem[]
  videoItems: VideoItem[]
  sessionItems: SessionItem[]
}

/**
 * HomeSkeleton Component
 * اسکلتون کامل صفحه اصلی
 */
export const HomeSkeleton = () => {
  return (
    <div className="flex flex-col w-full">
      <HomeHeroSkeleton />
      <div className="flex flex-col gap-0 items-center pb-5 w-full mb-16 mt-8 md:mb-0">
        <AudioSectionSkeleton />
        <VideoSectionSkeleton />
        <SessionsSectionSkeleton />
      </div>
    </div>
  )
}

/**
 * Home Content Inner Component
 * کامپوننت داخلی برای نمایش محتوا
 */
function HomeContentInner({
  menuData,
  slides,
  audioItems,
  videoItems,
  sessionItems,
}: HomeContentProps) {
  return (
    <ErrorBoundary
      fallback={({ retry, error }) => (
        <ErrorFallback error={error} retry={retry} />
      )}
      resetOnPropsChange>
      <div className="flex flex-col w-full">
        <HomeHero menuData={menuData} slides={slides} />
        <div className="flex flex-col gap-0 items-center pb-5 w-full mb-16 mt-8 md:mb-0">
          <AudioSection audioItems={audioItems} />
          {/* <StylesSection /> */}
          <VideoSection videoItems={videoItems} />
          <SessionsSection sessionItems={sessionItems} />
        </div>
      </div>
    </ErrorBoundary>
  )
}

/**
 * Main Home Content Client Component با CachedFeatureWrapper
 * کامپوننت اصلی محتوای صفحه خانه با پشتیبانی کش
 */
export const HomeContent = ({
  menuData,
  slides,
  audioItems,
  videoItems,
  sessionItems,
  locale = 'fa',
}: HomeContentProps) => {
  const initialData: HomeData = {
    menuData,
    slides,
    audioItems,
    videoItems,
    sessionItems,
  }

  return (
    <CachedFeatureWrapper<HomeData>
      initialData={initialData}
      cacheKey={`home:${locale}`}
      ttl={1800000} // 30 دقیقه
      loadingComponent={<HomeSkeleton />}
      errorComponent={(error) => (
        <ErrorFallback error={error} retry={() => window.location.reload()} />
      )}>
      {(data, isFromCache) => (
        <>
          {isFromCache && (
            <div className="fixed top-0 left-0 right-0 z-50 bg-dark-primary-teal/90 text-dark-white py-1 px-4 text-center text-xs">
              <i className="fa-light fa-database" /> داده‌ها از کش نمایش داده می‌شوند
            </div>
          )}
          <HomeContentInner {...data} locale={locale} />
        </>
      )}
    </CachedFeatureWrapper>
  )
}

// Export skeletons
export { HomeHeroSkeleton, AudioSectionSkeleton, VideoSectionSkeleton, SessionsSectionSkeleton }
