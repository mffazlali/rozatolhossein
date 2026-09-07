'use client'

import { useCallback } from 'react'
import { AudioCard, ResponsiveGrid, ResponsiveGridItem, MediaEmpty, FeatureErrorFallback } from '@/shared'
import { useAudioPlayer } from '@/shared/contexts/AudioPlayerContext'
import { useScrollToTrack } from '@/shared/hooks/utility'
import type { AudioItem } from '@/shared/types'

interface AudioListProps {
  items: AudioItem[]
  isLoading: boolean
  error: Error | null
  onRetry: () => void
}

interface AudioTrack {
  id: string
  title: string
  artist: string
  image: string
  duration: string
  audioSrc: string
  /** لینک به صفحه صوت */
  href?: string
}

/**
 * AudioListSkeleton Component
 * اسکلتون لیست صوت‌ها
 */
export function AudioListSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className="w-full">
      <ResponsiveGrid type="audio">
        {Array.from({ length: count }).map((_, index) => (
          <ResponsiveGridItem key={index} type="audio">
            <AudioCard skeleton />
          </ResponsiveGridItem>
        ))}
      </ResponsiveGrid>
    </div>
  )
}

/**
 * AudioList Component
 * لیست کارت‌های صوتی با grid responsive
 *
 * مطابق استانداردهای پروژه روضة الحسین
 * - استفاده از ResponsiveGrid از shared
 * - استفاده از AudioCard از shared
 * - استفاده از useAudioPlayer برای پخش با UnifiedAudioPlayer
 * - Loading و Error states
 * - اسکرول خودکار به کارت در حال پخش با useScrollToTrack
 */
export function AudioList({
  items,
  error,
  onRetry,
}: AudioListProps) {
  const { playTrack, currentTrack } = useAudioPlayer()
  const { registerCard } = useScrollToTrack()

  // Convert AudioItem to AudioTrack format
  const convertToTrack = useCallback((item: AudioItem): AudioTrack => ({
    id: item.id,
    title: item.title,
    artist: item.category,
    image: item.image,
    duration: item.duration,
    // TODO: Replace with actual audio URL from API when available
    audioSrc: `/media/audio.mp3`,
    href: item.href,
  }), [])

  // حذف setPlaylist - دیگه نباید اینجا playlist رو set کنیم
  // چون باعث می‌شه playlist فعلی (مثلاً از session) پاک بشه

  // Handle play - uses AudioPlayer context
  const handlePlay = useCallback((id: string) => {
    const item = items?.find(a => a.id === id)
    if (item) {
      playTrack(convertToTrack(item))
    }
  }, [items, playTrack, convertToTrack])

  // Error state
  // if (error) {
  //   return <FeatureErrorFallback error={error} retry={onRetry} featureName="صوت‌ها" />
  // }

  // // Empty state
  // if (!items || items.length === 0) {
  //   return <MediaEmpty type="audio" />
  // }

  // Data state
  return (
    <ResponsiveGrid type="audio">
      {items.map((item) => (
        <ResponsiveGridItem key={item.id} type="audio">
          <div ref={(el) => registerCard(item.id, el)}>
            <AudioCard item={item} linkMode />
          </div>
        </ResponsiveGridItem>
      ))}
    </ResponsiveGrid>
  )
}
