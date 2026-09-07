'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import type { AudioTrack } from '@/shared/contexts/AudioPlayerContext'
import { useAudioPlayer } from '@/shared/contexts/AudioPlayerContext'
import { useSharedReactPlayer } from '../SharedReactPlayerProvider'
import { usePlayerVolume } from '../usePlayerVolume'
import { usePlaybackRate } from '../usePlaybackRate'
import { VolumeControl } from '../VolumeControl'
import { PlaybackRateControl } from '../PlaybackRateControl'
import { AudioTimeline, TimelineType } from './AudioTimeline'
import { PeaksTimeline } from './PeaksTimeline'
import { formatTime } from '../utils'
import { useAudioControls } from './useAudioControls'

export interface InlineAudioPlayerProps {
  track: AudioTrack
  onPlay?: () => void
  /** آیا waveform را lazy load کنیم (پیش‌فرض: true) */
  lazyLoadWaveform?: boolean
  /** استفاده از Peaks.js به جای WaveSurfer (برای تست) */
  usePeaks?: boolean
}

/**
 * InlineAudioPlayer
 * پلیر صوتی inline با react-player و timeline قابل تغییر (linear یا waveform)
 * این کامپوننت فقط UI را نمایش می‌دهد و از ReactPlayer مشترک استفاده می‌کند
 *
 * Performance: با lazyLoadWaveform=true، waveform فقط وقتی در viewport باشد load می‌شود
 */
export function InlineAudioPlayer({
  track,
  onPlay,
  lazyLoadWaveform = true,
  usePeaks = false,
}: InlineAudioPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [timelineType, setTimelineType] = useState<TimelineType>('linear')

  const { inlinePlayerId, setInlineInView } = useAudioPlayer()

  const { playing, setPlaying, played, loaded, duration, seek } =
    useSharedReactPlayer()
  const { volume, isMuted, setVolume, toggleMute } = usePlayerVolume()
  const { playbackRate, setPlaybackRate } = usePlaybackRate()

  const isThisPlayerActive = inlinePlayerId === track.id

  // فقط اگر این player فعال است، از shared state استفاده کن
  // در غیر این صورت مقادیر پیش‌فرض را نمایش بده
  const currentTime = isThisPlayerActive ? duration * played : 0
  const progress = isThisPlayerActive ? played * 100 : 0
  const bufferedProgress = isThisPlayerActive ? loaded * 100 : 0

  const displayDuration =
    isThisPlayerActive && duration > 0
      ? formatTime(duration)
      : track.duration || '00:00'

  // Intersection Observer - فقط وقتی player فعال است کار کند
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // اگر player فعال نیست، observer را disconnect کن و isInlineInView را false کن
    if (!isThisPlayerActive) {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
      setInlineInView(false)
      return
    }

    // اگر player فعال است، observer را راه‌اندازی کن
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        // فقط اگر player هنوز فعال است، isInlineInView را به‌روز کن
        if (isThisPlayerActive) {
          queueMicrotask(() => {
            setInlineInView(entry.isIntersecting)
          })
        }
      },
      { threshold: 0.3 }
    )

    observerRef.current.observe(container)
    // وقتی player فعال می‌شود، بلافاصله isInlineInView را true کن
    setInlineInView(true)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [setInlineInView, isThisPlayerActive])

  const handlePlayPause = useCallback(() => {
    if (!isThisPlayerActive) {
      if (onPlay) {
        onPlay()
        // بعد از onPlay، کمی صبر کن تا state به‌روز شود و سپس پخش را شروع کن
        setTimeout(() => {
          setPlaying(true)
        }, 150)
      }
      return
    }

    if (currentTime >= duration && duration > 0) {
      seek(0)
      setTimeout(() => {
        setPlaying(true)
      }, 50)
      return
    }

    setPlaying(!playing)
  }, [
    isThisPlayerActive,
    onPlay,
    playing,
    currentTime,
    duration,
    seek,
    setPlaying,
  ])

  const handleSeek = useCallback(
    (percentage: number) => {
      if (!isThisPlayerActive || duration === 0) return
      seek(percentage * duration)
    },
    [isThisPlayerActive, duration, seek]
  )

  // استفاده از هوک کاستوم برای کنترل‌های صوتی
  const { handleSkipForward, handleSkipBackward } = useAudioControls({
    currentTime,
    duration,
    seek,
    isActive: isThisPlayerActive,
  })

  const toggleTimelineType = useCallback(() => {
    setTimelineType((prev) => (prev === 'linear' ? 'waveform' : 'linear'))
  }, [])

  const handleVolumeChange = useCallback(
    (newVolume: number) => {
      setVolume(newVolume)
    },
    [setVolume]
  )

  const handleToggleMute = useCallback(() => {
    toggleMute()
  }, [toggleMute])

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        id={`inline-react-player-container-${track.id}`}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      <div
        className="relative flex items-center gap-1.5 md:gap-2 bg-theme-gray-dark rounded-lg md:rounded-[10px] h-8 md:h-10 px-2 md:px-2.5"
        style={{ zIndex: 10 }}>
        {track.downloadUrl && (
          <a
            href={track.downloadUrl}
            className="flex items-center justify-center size-4 md:size-5 text-theme-white hover:text-theme-gray transition-colors shrink-0"
            title="دانلود"
            aria-label="دانلود"
            download>
            <i className="fa-light fa-download text-xs md:text-sm" />
          </a>
        )}

        <span className="text-[7px] md:text-[8.6px] text-theme-white min-w-[24px] md:min-w-[30px] text-center">
          {isThisPlayerActive ? formatTime(currentTime) : '00:00'}
        </span>

        {usePeaks ? (
          <PeaksTimeline
            key={`peaks-${track.id}`}
            type={timelineType}
            isActive={isThisPlayerActive}
            progress={progress}
            bufferedProgress={bufferedProgress}
            audioSrc={track.audioSrc}
            onSeek={handleSeek}
            lazyLoad={lazyLoadWaveform}
            className="h-4 md:h-6"
          />
        ) : (
          <AudioTimeline
            key={`audio-${track.id}`}
            type={timelineType}
            isActive={isThisPlayerActive}
            progress={progress}
            bufferedProgress={bufferedProgress}
            audioSrc={track.audioSrc}
            onSeek={handleSeek}
            lazyLoad={lazyLoadWaveform}
          />
        )}

        <span className="text-[7px] md:text-[8.6px] text-theme-white min-w-[24px] md:min-w-[30px] text-center">
          {displayDuration}
        </span>

        <button
          type="button"
          onClick={handleSkipForward}
          disabled={!isThisPlayerActive}
          className="flex items-center justify-center size-4 md:size-5 text-theme-white disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          title="10 ثانیه جلو"
          aria-label="10 ثانیه جلو">
          <i className="fa-light fa-rotate-right text-xs md:text-sm" />
        </button>
        
        <button
          type="button"
          onClick={handleSkipBackward}
          disabled={!isThisPlayerActive}
          className="flex items-center justify-center size-4 md:size-5 text-theme-white disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          title="10 ثانیه عقب"
          aria-label="10 ثانیه عقب">
          <i className="fa-light fa-rotate-left text-xs md:text-sm" />
        </button>

        <button
          type="button"
          onClick={toggleTimelineType}
          className="flex items-center justify-center size-4 md:size-5 text-theme-white shrink-0"
          title={
            timelineType === 'linear' ? 'نمایش موج صوتی' : 'نمایش تایم‌لاین خطی'
          }
          aria-label={
            timelineType === 'linear' ? 'نمایش موج صوتی' : 'نمایش تایم‌لاین خطی'
          }>
          <i
            className={`fa-light ${timelineType === 'linear' ? 'fa-waveform-lines' : 'fa-bars'} text-xs md:text-sm`}
          />
        </button>

        <PlaybackRateControl
          playbackRate={playbackRate}
          onPlaybackRateChange={setPlaybackRate}
          buttonClassName="flex items-center justify-center size-4 md:size-5"
          textColor="text-theme-white"
          textHoverColor="hover:text-theme-white"
          textSize="text-[7px] md:text-[8.6px]"
          side="bottom"
        />

        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={handleVolumeChange}
          onToggleMute={handleToggleMute}
          buttonClassName="flex items-center justify-center size-4 md:size-5"
          iconColor="text-theme-white"
          iconHoverColor="hover:text-theme-white"
          iconSize="text-xs md:text-sm"
          side="bottom"
        />

        <button
          type="button"
          onClick={handlePlayPause}
          className="flex items-center justify-center size-4 md:size-5 text-theme-white shrink-0"
          title={playing && isThisPlayerActive ? 'توقف' : 'پخش'}
          aria-label={playing && isThisPlayerActive ? 'توقف' : 'پخش'}>
          <i
            className={`fa-solid ${playing && isThisPlayerActive ? 'fa-pause' : 'fa-play'} text-sm md:text-base`}
          />
        </button>
      </div>
    </div>
  )
}
