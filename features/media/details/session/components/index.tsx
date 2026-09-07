/**
 * SessionDetailContent Component - روضة الحسین
 * محتوای اصلی صفحه جزئیات جلسه
 */

'use client'

import { useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Breadcrumb, ErrorBoundary, FeatureErrorFallback } from '@/shared'
import type { BreadcrumbItem } from '@/shared'
import { ContentActionButtons, MetaTags } from '@/shared/components/dataDisplay'
import { Tabs } from '@/shared/components/navigation'
import type { TabConfig } from '@/shared/components/navigation'
import { useZoom } from '@/shared/hooks/utility'
import { useAudioPlayer } from '@/shared/contexts/AudioPlayerContext'
import { useVideoPlayer } from '@/shared/contexts/VideoPlayerContext'
import { getServiceListHref, ServiceId } from '@/shared/types/service'
import type { SessionDetailResponse } from '@/shared/services'
import { SessionHeader } from './SessionHeader'
import { ImageGallery } from './ImageGallery'
import { AudioTrackList } from './AudioTrackList'
import { VideoTrackList } from './VideoTrackList'
import { RelatedSessions } from './RelatedSessions'
import { SessionBox } from './SessionBox'
import { LyricsSession } from './LyricsSession'

export type SessionViewMode = 'all' | 'photo' | 'audio' | 'video'

/**
 * SessionDetailSkeleton Component
 * اسکلتون صفحه جزئیات جلسه
 */
export const SessionDetailSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[1140px] mx-auto py-8 px-4">
      {/* Breadcrumb Skeleton */}
      <div className="flex flex-col gap-1">
        <Breadcrumb skeleton skeletonCount={3} />
        
        {/* SessionBox Skeleton */}
        <SessionBox>
          <div className="flex flex-col w-full gap-4">
            {/* SessionHeader Skeleton */}
            <SessionHeader skeleton />
            
            {/* ContentActionButtons Skeleton */}
            <ContentActionButtons skeleton />
            
            {/* LyricsSession Skeleton */}
            <LyricsSession skeleton />
          </div>
        </SessionBox>
      </div>

      {/* Meta Tags Skeleton */}
      <MetaTags skeleton skeletonCount={3} />

      {/* Media Tabs Skeleton */}
      <Tabs skeleton />

      {/* Related Sessions Skeleton */}
      <RelatedSessions skeleton />
    </div>
  )
}

interface SessionDetailContentProps {
  sessionData: SessionDetailResponse
  viewMode?: SessionViewMode
}

// Wrapper for FeatureErrorFallback with featureName
const SessionDetailErrorFallback = ({
  error,
  retry,
}: {
  error: Error
  retry: () => void
}) => (
  <FeatureErrorFallback error={error} retry={retry} featureName="جزئیات جلسه" />
)

/**
 * Main Session Detail Content Client Component
 * کامپوننت اصلی محتوای صفحه جزئیات جلسه
 *
 * مطابق استانداردهای پروژه روضة الحسین
 * - Client Component با props از Server Component
 * - ErrorBoundary برای مدیریت خطا
 * - Responsive design
 */
export const SessionDetailContent = ({
  sessionData,
  viewMode = 'all',
}: SessionDetailContentProps) => {
  const searchParams = useSearchParams()
  const { currentTrack: currentAudioTrack, playInline: playAudioInline } =
    useAudioPlayer()
  const { currentTrack: currentVideoTrack, playInline: playVideoInline } =
    useVideoPlayer()

  // Zoom functionality برای LyricsSection
  const { zoomLevel, handleZoomIn, handleZoomOut, canZoomIn, canZoomOut } =
    useZoom()

  // اسکرول به صوت یا ویدیو جاری بعد از mount و سوییچ به inline
  useEffect(() => {
    const scrollToAudioId = sessionStorage.getItem('scrollToAudioId')
    const scrollToVideoId = sessionStorage.getItem('scrollToVideoId')
    const tab = searchParams.get('tab')

    if (scrollToAudioId && tab === 'audio') {
      // پاک کردن از sessionStorage
      sessionStorage.removeItem('scrollToAudioId')

      // صبر کردن تا DOM آماده شود
      setTimeout(() => {
        const audioElement = document.querySelector(
          `[data-audio-id="${scrollToAudioId}"]`
        )
        if (audioElement) {
          audioElement.scrollIntoView({ behavior: 'smooth', block: 'center' })

          // سوییچ به inline player بعد از اسکرول
          setTimeout(() => {
            if (currentAudioTrack && currentAudioTrack.isFromSession) {
              playAudioInline(currentAudioTrack, false)
            }
          }, 600) // بعد از اتمام اسکرول
        }
      }, 500)
    }

    if (scrollToVideoId && tab === 'video') {
      // پاک کردن از sessionStorage
      sessionStorage.removeItem('scrollToVideoId')

      // صبر کردن تا DOM آماده شود
      setTimeout(() => {
        const videoElement = document.querySelector(
          `[data-video-id="${scrollToVideoId}"]`
        )
        if (videoElement) {
          videoElement.scrollIntoView({ behavior: 'smooth', block: 'center' })

          // سوییچ به inline player بعد از اسکرول
          setTimeout(() => {
            if (currentVideoTrack && currentVideoTrack.isFromSession) {
              playVideoInline(currentVideoTrack, false)
            }
          }, 600) // بعد از اتمام اسکرول
        }
      }, 500)
    }
  }, [
    searchParams,
    currentAudioTrack,
    currentVideoTrack,
    playAudioInline,
    playVideoInline,
  ])

  // تابع retry برای ErrorBoundary
  const handleRetry = useCallback((resetErrorBoundary: () => void) => {
    resetErrorBoundary()
    // Refresh page to refetch data from server
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }, [])

  // تعریف تب‌ها و محتوای آن‌ها
  const tabs: TabConfig[] = [
    {
      id: 'image',
      label: 'گزارش تصویری',
      hasContent: sessionData.hasImages,
      content: <ImageGallery images={sessionData.images} />,
    },
    {
      id: 'audio',
      label: 'گزارش صوتی',
      hasContent: sessionData.hasAudios,
      content: (
        <AudioTrackList
          tracks={sessionData.audios}
          sessionId={sessionData.id}
        />
      ),
    },
    {
      id: 'video',
      label: 'گزارش ویدئویی',
      hasContent: sessionData.hasVideos,
      content: (
        <VideoTrackList
          videos={sessionData.videos}
          sessionId={sessionData.id}
        />
      ),
    },
  ]

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'روضة الحسین', href: '/' },
    { label: 'جلسات', href: getServiceListHref('fa', ServiceId.SESSION) },
    { label: sessionData.heyatName, href: sessionData.id },
  ]

  // ترکیب داده‌های واقعی برای MetaTags
  const metaItems = [
    // سال
    ...(sessionData.year
      ? [{ label: 'سال', value: sessionData.year, icon: 'fa-calendar-days' }]
      : []),

    // افراد
    ...(sessionData.persons?.map((person) => ({
      label: 'مداح',
      value: person.title,
      href: person.href,
      icon: 'fa-user',
    })) || []),

    // مناسبت‌ها
    ...(sessionData.occasions?.map((occasion) => ({
      label: 'مناسبت',
      value: occasion.title,
      href: occasion.href,
      icon: 'fa-calendar',
    })) || []),

    // مکان‌ها
    ...(sessionData.places?.map((place) => ({
      label: 'مکان',
      value: place.title,
      href: place.href,
      icon: 'fa-location-dot',
    })) || []),

    // هیئت‌ها
    ...(sessionData.heyats?.map((heyat) => ({
      label: 'هیئت',
      value: heyat.title,
      href: heyat.href,
      icon: 'fa-users',
    })) || []),

    // سبک‌ها
    ...(sessionData.styles?.map((style) => ({
      label: 'سبک',
      value: style.title,
      href: style.href,
      icon: 'fa-circle-notch',
    })) || []),

    // کلیدواژه‌ها
    ...(sessionData.tags?.map((tag) => ({
      label: 'کلیدواژه',
      value: tag.title,
      href: tag.href,
      icon: 'fa-tag',
    })) || []),
  ]

  // تعیین محتوای قابل نمایش بر اساس viewMode
  const showTabs = viewMode === 'all'

  // Current URL for sharing
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  // رندر محتوای تکی (بدون تب)
  const renderSingleContent = () => {
    if (viewMode === 'photo' && sessionData.hasImages) {
      return <ImageGallery images={sessionData.images} />
    }
    if (viewMode === 'audio' && sessionData.hasAudios) {
      return (
        <AudioTrackList
          tracks={sessionData.audios}
          sessionId={sessionData.id}
        />
      )
    }
    if (viewMode === 'video' && sessionData.hasVideos) {
      return (
        <VideoTrackList
          videos={sessionData.videos}
          sessionId={sessionData.id}
        />
      )
    }
    return null
  }

  return (
    <ErrorBoundary
      fallback={({ error, retry }) => (
        <SessionDetailErrorFallback
          error={error}
          retry={() => handleRetry(retry)}
        />
      )}
      resetOnPropsChange>
      <div className="flex flex-col gap-4 w-full max-w-[1140px] mx-auto py-8 px-4">
        {/* Breadcrumb + Session Header */}
        <div className="flex flex-col gap-1">
          <Breadcrumb items={breadcrumbItems} />
          <SessionBox>
            <div className="flex flex-col w-full">
              <SessionHeader
                title={sessionData.title}
                heyatName={sessionData.heyatName}
                heyatHref={sessionData.heyatHref}
                year={sessionData.year}
              />
              {/* Description with Zoom */}
              {sessionData.description && (
                <div className="flex flex-col mt-2">
                  {/* Action Buttons */}
                  <ContentActionButtons
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    canZoomIn={canZoomIn}
                    canZoomOut={canZoomOut}
                    contentId={sessionData.id}
                    title={sessionData.title}
                    shareData={{
                      title: `${sessionData.title} - ${sessionData.heyatName}`,
                      text: 'مشاهده این جلسه در روضة الحسین',
                      url: currentUrl,
                    }}
                  />
                  <LyricsSession
                    lyrics={sessionData.description}
                    title={sessionData.title}
                    zoomLevel={zoomLevel}
                  />
                </div>
              )}
            </div>
          </SessionBox>
        </div>

        {/* Meta Tags */}
        <MetaTags items={metaItems} />

        {/* Media Content */}
        <div className="flex flex-col gap-2.5">
          {showTabs ? (
            <Tabs tabs={tabs} defaultTab="image" />
          ) : (
            // نمایش محتوای تکی بدون تب
            renderSingleContent()
          )}
        </div>

        {/* Related Sessions */}
        <RelatedSessions
          sessions={sessionData.relatedSessions}
          viewAllHref="/session"
        />
      </div>
    </ErrorBoundary>
  )
}
