'use client'

import { useCallback } from 'react'
import type { AudioDetailResponse } from '@/shared/services'
import {
  MetaTags,
  LyricsSection,
  ContentActionButtons,
} from '@/shared/components/dataDisplay'
import { Breadcrumb } from '@/shared/components/navigation'
import { ErrorBoundary, FeatureErrorFallback } from '@/shared'
import { useZoom } from '@/shared/hooks/utility'
import { getServiceListHref, ServiceId } from '@/shared/types/service'
import { AudioPlayerCard } from './AudioPlayerCard'
import { VideoSection } from './VideoSection'
import { RelatedAudiosSection } from './RelatedAudiosSection'
import { SameOccasionAudiosSection } from './SameOccasionAudiosSection'
import { getContentHref } from '@/shared/types'

/**
 * AudioDetailSkeleton Component
 * اسکلتون صفحه جزئیات صوت
 */
export const AudioDetailSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1140px] mx-auto py-8 px-4">
      <Breadcrumb skeleton skeletonCount={3} />
      <AudioPlayerCard skeleton />
      <MetaTags skeleton skeletonCount={4} />
      <ContentActionButtons skeleton />
      <VideoSection skeleton />
      <LyricsSection skeleton />
      <RelatedAudiosSection skeleton />
      <SameOccasionAudiosSection skeleton />
    </div>
  )
}

/**
 * AudioDetailContent Props
 */
interface AudioDetailContentProps {
  audioData: AudioDetailResponse
}

// Wrapper for FeatureErrorFallback with featureName
const AudioDetailErrorFallback = ({
  error,
  retry,
}: {
  error: Error
  retry: () => void
}) => (
  <FeatureErrorFallback error={error} retry={retry} featureName="جزئیات صوت" />
)

/**
 * Main Audio Detail Content Client Component
 * کامپوننت اصلی محتوای صفحه جزئیات صوت
 *
 * مطابق استانداردهای پروژه روضة الحسین
 * - Client Component با props از Server Component
 * - ErrorBoundary برای مدیریت خطا
 * - Responsive design
 */
export const AudioDetailContent = ({ audioData }: AudioDetailContentProps) => {
  // Zoom functionality
  const { zoomLevel, handleZoomIn, handleZoomOut, canZoomIn, canZoomOut } =
    useZoom()

  // تابع retry برای ErrorBoundary
  const handleRetry = useCallback((resetErrorBoundary: () => void) => {
    resetErrorBoundary()
    // Refresh page to refetch data from server
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }, [])

  const breadcrumbItems = [
    { label: 'روضة الحسین', href: '/' },
    { label: 'صوت ها', href: getServiceListHref('fa', ServiceId.AUDIO) },
    { label: audioData.occasion, href: getContentHref('fa', audioData.id) },
  ]

  // ترکیب داده‌های واقعی برای MetaTags
  const metaItems = [
    // سال
    ...(audioData.year
      ? [{ label: 'سال', value: audioData.year, icon: 'fa-calendar-days' }]
      : []),

    // افراد
    ...(audioData.persons?.map((person) => ({
      label: 'مداح',
      value: person.title,
      href: person.href,
      icon: 'fa-user',
    })) || []),

    // مناسبت‌ها
    ...(audioData.occasions?.map((occasion) => ({
      label: 'مناسبت',
      value: occasion.title,
      href: occasion.href,
      icon: 'fa-calendar',
    })) || []),

    // مکان‌ها
    ...(audioData.places?.map((place) => ({
      label: 'مکان',
      value: place.title,
      href: place.href,
      icon: 'fa-location-dot',
    })) || []),

    // هیئت‌ها
    ...(audioData.heyats?.map((heyat) => ({
      label: 'هیئت',
      value: heyat.title,
      href: heyat.href,
      icon: 'fa-users',
    })) || []),

    // سبک‌ها
    ...(audioData.styles?.map((style) => ({
      label: 'سبک',
      value: style.title,
      href: style.href,
      icon: 'fa-circle-notch',
    })) || []),

    // کلیدواژه‌ها
    ...(audioData.tags?.map((tag) => ({
      label: 'کلیدواژه',
      value: tag.title,
      href: tag.href,
      icon: 'fa-tag',
    })) || []),
  ]

  // Current URL for sharing
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <ErrorBoundary
      fallback={({ error, retry }) => (
        <AudioDetailErrorFallback
          error={error}
          retry={() => handleRetry(retry)}
        />
      )}
      resetOnPropsChange>
      <div className="flex flex-col gap-6 w-full max-w-[1140px] mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Audio Player Card */}
        <AudioPlayerCard
          title={audioData.title}
          artist={audioData.artist}
          image={audioData.image}
          audioUrl={audioData.audioUrl}
          duration={audioData.duration}
          downloadUrl={audioData.downloadUrl}
        />

        {/* Meta Tags */}
        <MetaTags items={metaItems} />

        {/* Video Section */}
        <VideoSection
          videoThumbnail={audioData.videoThumbnail}
          videoUrl={audioData.videoUrl}
          videoHref={audioData.videoHref}
        />

        {audioData.description && (
          <div className="flex flex-col mt-2">
            {/* Action Buttons */}
            <ContentActionButtons
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              canZoomIn={canZoomIn}
              canZoomOut={canZoomOut}
              contentId={audioData.id}
              title={audioData.title}
              shareData={{
                title: `${audioData.title} - ${audioData.artist}`,
                text: 'مشاهده این صوت در روضة الحسین',
                url: currentUrl,
              }}
            />
            {/* Lyrics Section with Zoom */}
            <LyricsSection
              lyrics={audioData.description}
              title={audioData.title}
              zoomLevel={zoomLevel}
            />
          </div>
        )}

        {/* Related Audios */}
        <RelatedAudiosSection audios={audioData.relatedAudios} />

        {/* Same Occasion Audios */}
        <SameOccasionAudiosSection
          audios={audioData.sameOccasionAudios}
          occasionTitle={audioData.occasion}
        />
      </div>
    </ErrorBoundary>
  )
}

// Re-export components
export { AudioPlayerCard } from './AudioPlayerCard'
