'use client'

import { useCallback } from 'react'
import type { VideoDetailResponse } from '@/shared/services'
import {
  MetaTags,
  LyricsSection,
  ContentActionButtons,
} from '@/shared/components/dataDisplay'
import { Breadcrumb } from '@/shared/components/navigation'
import { ErrorBoundary, FeatureErrorFallback } from '@/shared'
import { useZoom } from '@/shared/hooks/utility'
import { getServiceListHref, ServiceId } from '@/shared/types/service'
import { VideoPlayerCard } from './VideoPlayerCard'
import { RelatedVideosSection } from './RelatedVideosSection'
import { SameOccasionVideosSection } from './SameOccasionVideosSection'
import { AudioPlayerCard } from './AudioPlayerCard'
import { getContentHref } from '@/shared/types'

/**
 * VideoDetailSkeleton Component
 * اسکلتون صفحه جزئیات ویدیو
 */
export const VideoDetailSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1140px] mx-auto py-8 px-4">
      <Breadcrumb skeleton skeletonCount={3} />
      <VideoPlayerCard skeleton />
      <MetaTags skeleton skeletonCount={4} />
      <ContentActionButtons skeleton />
      {/* Audio Player Skeleton */}
      <AudioPlayerCard />
      {/* Description Skeleton */}
      <LyricsSection skeleton />
      <RelatedVideosSection skeleton />
      <SameOccasionVideosSection skeleton />
    </div>
  )
}

/**
 * VideoDetailContent Props
 */
interface VideoDetailContentProps {
  videoData: VideoDetailResponse
}

// Wrapper for FeatureErrorFallback with featureName
const VideoDetailErrorFallback = ({
  error,
  retry,
}: {
  error: Error
  retry: () => void
}) => (
  <FeatureErrorFallback
    error={error}
    retry={retry}
    featureName="جزئیات ویدیو"
  />
)

/**
 * Main Video Detail Content Client Component
 * کامپوننت اصلی محتوای صفحه جزئیات ویدیو
 *
 * مطابق استانداردهای پروژه روضة الحسین
 * - Client Component با props از Server Component
 * - ErrorBoundary برای مدیریت خطا
 * - Responsive design
 */
export const VideoDetailContent = ({ videoData }: VideoDetailContentProps) => {
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

  // Handler for audio download
  const handleAudioDownload = useCallback((audioUrl: string) => {
    if (!audioUrl) return

    // Create a temporary link and trigger download
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = ''
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  const breadcrumbItems = [
    { label: 'روضة الحسین', href: '/' },
    { label: 'ویدیوها', href: getServiceListHref('fa', ServiceId.VIDEO) },
    { label: videoData.occasion, href: getContentHref('fa', videoData.id) },
  ]

  // ترکیب داده‌های واقعی برای MetaTags
  const metaItems = [
    // سال
    ...(videoData.year
      ? [{ label: 'سال', value: videoData.year, icon: 'fa-calendar-days' }]
      : []),

    // افراد
    ...(videoData.persons?.map((person) => ({
      label: 'سخنران',
      value: person.title,
      href: person.href,
      icon: 'fa-user',
    })) || []),

    // مناسبت‌ها
    ...(videoData.occasions?.map((occasion) => ({
      label: 'مناسبت',
      value: occasion.title,
      href: occasion.href,
      icon: 'fa-calendar',
    })) || []),

    // مکان‌ها
    ...(videoData.places?.map((place) => ({
      label: 'مکان',
      value: place.title,
      href: place.href,
      icon: 'fa-location-dot',
    })) || []),

    // هیئت‌ها
    ...(videoData.heyats?.map((heyat) => ({
      label: 'هیئت',
      value: heyat.title,
      href: heyat.href,
      icon: 'fa-users',
    })) || []),

    // سبک‌ها
    ...(videoData.styles?.map((style) => ({
      label: 'سبک',
      value: style.title,
      href: style.href,
      icon: 'fa-circle-notch',
    })) || []),

    // کلیدواژه‌ها
    ...(videoData.tags?.map((tag) => ({
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
        <VideoDetailErrorFallback
          error={error}
          retry={() => handleRetry(retry)}
        />
      )}
      resetOnPropsChange>
      <div className="flex flex-col gap-6 w-full max-w-[1140px] mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Video Player Card */}
        <VideoPlayerCard
          title={videoData.title}
          speaker={videoData.speaker}
          image={videoData.image}
          videoUrl={videoData.videoUrl}
          downloadUrl={videoData.downloadUrl}
          videoId={videoData.id}
        />

        {/* Meta Tags */}
        <MetaTags items={metaItems} />

        {/* Audio Player Card - صوت این ویدئو */}
        {videoData.audioData && (
          <AudioPlayerCard
            item={{
              id: videoData.audioData.id,
              title: videoData.audioData.title,
              artist: videoData.audioData.artist || videoData.speaker,
              duration: videoData.audioData.duration,
              image: videoData.audioData.image || videoData.image,
              audioUrl: videoData.audioData.audioUrl,
              href:
                videoData.audioData.href || `/audio/${videoData.audioData.id}`,
            }}
            onDownload={handleAudioDownload}
          />
        )}

        {videoData.description && (
          <div className="flex flex-col mt-2">
            {/* Action Buttons */}
            {/* Action Buttons */}
            <ContentActionButtons
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              canZoomIn={canZoomIn}
              canZoomOut={canZoomOut}
              contentId={videoData.id}
              title={videoData.title}
              shareData={{
                title: `${videoData.title} - ${videoData.speaker}`,
                text: 'مشاهده این ویدیو در روضة الحسین',
                url: currentUrl,
              }}
            />

            {/* Description with Zoom */}
            <LyricsSection
              lyrics={videoData.description}
              title={videoData.title}
              zoomLevel={zoomLevel}
            />
          </div>
        )}

        {/* Related Videos */}
        <RelatedVideosSection videos={videoData.relatedVideos} />

        {/* Same Occasion Videos */}
        <SameOccasionVideosSection
          videos={videoData.sameOccasionVideos}
          occasionTitle={videoData.occasion}
        />
      </div>
    </ErrorBoundary>
  )
}
