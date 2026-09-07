/**
 * AudioTrackList Component - روضة الحسین
 * لیست ترک‌های صوتی جلسه با پلیر و دکمه دانلود
 *
 * ⚠️ تمام المان‌ها دقیقاً از Figma استخراج شده‌اند
 */

'use client'

import { useCallback, useMemo, useEffect, useRef } from 'react'
import { InlineAudioPlayer } from '@/shared'
import { useAudioPlayer } from '@/shared/contexts/AudioPlayerContext'
import { useScrollToTrack } from '@/shared/hooks'
import type { AudioItem } from '@/shared/types'
import type { AudioTrack } from '@/shared/contexts/AudioPlayerContext'

interface AudioTrackListProps {
  tracks?: AudioItem[]
  skeleton?: boolean
  className?: string
  sessionId?: string
}

/**
 * AudioTrackItemSkeleton
 * اسکلتون یک آیتم ترک - ریسپانسیو
 */
function AudioTrackItemSkeleton() {
  return (
    <div className="flex flex-col gap-1.5 px-1.5 py-3 md:px-2.5 md:py-4">
      {/* Title Skeleton */}
      <div className="flex justify-end">
        <div className="h-3 w-32 md:h-3.5 md:w-48 bg-theme-gray/20 animate-pulse rounded" />
      </div>
      {/* Player Skeleton */}
      <div className="relative flex items-center gap-1.5 md:gap-2 bg-theme-gray-dark rounded-lg md:rounded-[10px] h-8 md:h-10 px-2 md:px-2.5">
        {/* Current Time Skeleton */}
        <div className="w-[24px] md:w-[30px] h-2 md:h-2.5 bg-theme-white/20 animate-pulse rounded" />

        {/* Progress Bar Skeleton */}
        <div className="flex-1 h-2 md:h-2.5 relative">
          <div className="absolute inset-y-0 left-0 right-0 my-auto h-0.5 md:h-1 bg-theme-white/20 animate-pulse rounded-full" />
        </div>

        {/* Duration Skeleton */}
        <div className="w-[24px] md:w-[30px] h-2 md:h-2.5 bg-theme-white/20 animate-pulse rounded" />

        {/* Play Button Skeleton */}
        <div className="size-4 md:size-5 bg-theme-white/20 animate-pulse rounded-full shrink-0" />
      </div>
    </div>
  )
}

/**
 * AudioTrackItem
 * یک آیتم ترک صوتی با قابلیت پخش
 */
function AudioTrackItem({
  track,
  registerCard,
  sessionId,
  trackIndex,
}: {
  track: AudioItem
  registerCard: (id: string, element: HTMLElement | null) => void
  sessionId?: string
  trackIndex: number
}) {
  const { playInline, setIsPlayerVisible, setCurrentTrack } = useAudioPlayer()
  const itemRef = useRef<HTMLDivElement>(null)

  // اضافه کردن audioId برای اسکرول (مثل video)
  const audioId = `audio-${trackIndex}`

  // Convert AudioItem to AudioTrack
  const audioTrack: AudioTrack = useMemo(
    () => ({
      id: sessionId ? `${sessionId}-audio-${trackIndex}` : track.id,
      title: track.title,
      artist: track.category || 'نامشخص',
      image: track.image || '',
      duration: track.duration || '00:00',
      audioSrc: track.audioUrl,
      href: track.href,
      isFromSession: !!sessionId,
      sessionId: sessionId,
      downloadUrl: track.audioUrl, // استفاده از audioUrl به عنوان downloadUrl
    }),
    [track, sessionId, trackIndex]
  )

  // Register this item for scroll tracking
  useEffect(() => {
    registerCard(audioId, itemRef.current)
    return () => registerCard(audioId, null)
  }, [audioId, registerCard])

  // Handle play - set player visible and current track
  const handlePlay = useCallback(() => {
    if (!track.audioUrl) return
    // اول inline player رو فعال کن و activePlayer رو تغییر بده
    playInline(audioTrack, false, true) // showPlayer = false, setActive = true
    // بعد player رو visible کن و currentTrack رو set کن
    setTimeout(() => {
      setIsPlayerVisible(true)
      setCurrentTrack(audioTrack)
    }, 50)
  }, [
    track.audioUrl,
    audioTrack,
    playInline,
    setIsPlayerVisible,
    setCurrentTrack,
  ])

  return (
    <div
      ref={itemRef}
      data-audio-id={audioId}
      className="flex flex-col gap-1 md:gap-1.5 px-1.5 py-3 md:px-2.5 md:py-4">
      {/* Track Title with Download - RTL aligned */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs md:text-sm text-theme-white text-right leading-tight md:leading-[14px] flex-1">
          {track.title}
        </p>
      </div>

      {/* Audio Player */}
      <InlineAudioPlayer
        track={audioTrack}
        onPlay={handlePlay}
        usePeaks={true}
      />
    </div>
  )
}

/**
 * AudioTrackList
 * لیست کامل ترک‌های صوتی
 */
export function AudioTrackList({
  tracks,
  skeleton = false,
  className = '',
  sessionId,
}: AudioTrackListProps) {
  const { setPlaylist } = useAudioPlayer()
  const { registerCard } = useScrollToTrack()

  // Convert tracks to AudioTrack format for playlist
  const audioTracks: AudioTrack[] = useMemo(() => {
    if (!tracks) return []
    return tracks.map((track, index) => ({
      id: sessionId ? `${sessionId}-audio-${index}` : track.id,
      title: track.title,
      artist: track.category || 'نامشخص',
      image: track.image || '',
      duration: track.duration || '00:00',
      audioSrc: track.audioUrl,
      href: track.href,
      isFromSession: !!sessionId,
      sessionId: sessionId,
      downloadUrl: track.audioUrl, // استفاده از audioUrl به عنوان downloadUrl
    }))
  }, [tracks, sessionId])

  // Set playlist when component mounts or tracks change
  useEffect(() => {
    if (audioTracks.length > 0) {
      setPlaylist(audioTracks)
    }
    // Note: عمداً cleanup نداریم تا playlist حفظ شود و auto-play کار کند
  }, [audioTracks, setPlaylist])

  // Skeleton State
  if (skeleton) {
    return (
      <div
        className={`flex flex-col bg-theme-black border border-theme-border rounded-lg md:rounded-[10px] py-2 md:py-4 px-2 md:px-3 lg:px-5 ${className}`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <AudioTrackItemSkeleton key={index} />
        ))}
      </div>
    )
  }

  // Empty State
  if (!tracks || tracks.length === 0) {
    return (
      <div
        className={`flex items-center justify-center min-h-[150px] md:min-h-[200px] bg-theme-black border border-theme-border rounded-lg md:rounded-[10px] ${className}`}>
        <p className="text-theme-gray text-xs md:text-sm">صوتی موجود نیست</p>
      </div>
    )
  }

  // Normal State
  return (
    <div
      className={`flex flex-col bg-theme-black border border-theme-border rounded-lg md:rounded-[10px] py-2 md:py-4 px-2 md:px-3 lg:px-5 ${className}`}>
      {tracks.map((track, index) => (
        <AudioTrackItem
          key={track.id}
          track={track}
          registerCard={registerCard}
          sessionId={sessionId}
          trackIndex={index}
        />
      ))}
    </div>
  )
}
