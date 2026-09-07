'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import clsx from 'clsx'
import SeamlessMarquee from '../SeamlessMarquee'
import { useAudioPlayer } from '@/shared/contexts/AudioPlayerContext'
import { usePlayerVolume } from '../usePlayerVolume'
import { usePlaybackRate } from '../usePlaybackRate'
import { useSharedReactPlayer } from '../SharedReactPlayerProvider'
import { PeaksTimeline, TimelineType } from './PeaksTimeline'
import { VolumeControl } from '../VolumeControl'
import { PlaybackRateControl } from '../PlaybackRateControl'
import { formatTime } from '../utils'
import { useAudioControls } from './useAudioControls'

/**
 * UnifiedAudioPlayer
 * پخش‌کننده یکپارچه با react-player که بین حالت inline، mini و expanded سوییچ می‌کند
 * این کامپوننت فقط UI را نمایش می‌دهد و از ReactPlayer مشترک استفاده می‌کند
 */
export function UnifiedAudioPlayer() {
  const pathname = usePathname()
  const router = useRouter()
  const [inlineContainerExists, setInlineContainerExists] = useState(false)

  const {
    currentTrack,
    isPlayerVisible,
    inlinePlayerId,
    isInlineInView,
    isExpanded,
    setIsExpanded,
    closePlayer,
    stopInlineAndResume,
    playlist,
    playNext,
    playPrevious,
  } = useAudioPlayer()

  const [timelineType, setTimelineType] = useState<TimelineType>('linear')
  const [isTimelineLoading, setIsTimelineLoading] = useState(false)
  const { volume, isMuted, setVolume, toggleMute } = usePlayerVolume()
  const { playbackRate, setPlaybackRate } = usePlaybackRate()

  const { playing, setPlaying, played, loaded, duration, seek } =
    useSharedReactPlayer()

  const currentTime = duration * played
  const progress = played * 100
  const bufferedProgress = loaded * 100

  // محاسبه امکان next/previous
  const currentIndex = playlist.findIndex((t) => t.id === currentTrack?.id)
  const canPlayPrevious = playlist.length > 1 && currentIndex > 0
  const canPlayNext = playlist.length > 1 && currentIndex < playlist.length - 1
  const hasPlaylist = playlist.length > 1

  // Smart navigation handler
  const handleTitleClick = useCallback(() => {
    if (!currentTrack?.href) return

    if (currentTrack.isFromSession && currentTrack.sessionId) {
      // استخراج index از id (format: sessionId-audio-index)
      const audioIndex = currentTrack.id.split('-').pop()
      const audioId = `audio-${audioIndex}`

      // ذخیره audioId در sessionStorage برای اسکرول
      sessionStorage.setItem('scrollToAudioId', audioId)

      // Navigation به session با tab=audio
      router.push(`/fa/content/${currentTrack.sessionId}?tab=audio`)
    } else {
      // Navigation عادی به audio detail
      router.push(currentTrack.href)
    }
  }, [currentTrack, router])

  // بررسی وجود inline container در DOM
  useEffect(() => {
    if (!inlinePlayerId) {
      return
    }

    const checkContainer = () => {
      const exists =
        document.getElementById(
          `inline-react-player-container-${inlinePlayerId}`
        ) !== null
      setInlineContainerExists(exists)
    }

    // بررسی اولیه
    checkContainer()

    // بررسی مجدد بعد از تاخیرهای مختلف
    const timeouts = [50, 100, 200].map((delay) =>
      setTimeout(checkContainer, delay)
    )

    return () => timeouts.forEach(clearTimeout)
  }, [inlinePlayerId, pathname])

  const shouldShowMini =
    isPlayerVisible &&
    !isExpanded &&
    (!inlinePlayerId || !isInlineInView || !inlineContainerExists)

  const toggle = useCallback(() => {
    setPlaying(!playing)
  }, [playing, setPlaying])

  const handleVolumeChange = useCallback(
    (newVolume: number) => {
      setVolume(newVolume)
    },
    [setVolume]
  )

  const handleToggleMute = useCallback(() => {
    toggleMute()
  }, [toggleMute])

  const prevPathnameRef = useRef(pathname)

  useEffect(() => {
    if (prevPathnameRef.current === pathname) {
      prevPathnameRef.current = pathname
      return
    }

    prevPathnameRef.current = pathname

    if (!inlinePlayerId || !isPlayerVisible) return

    const timeoutId = setTimeout(() => {
      const container = document.getElementById(
        `inline-react-player-container-${inlinePlayerId}`
      )

      if (!container) {
        stopInlineAndResume()
      }
    }, 50)

    return () => clearTimeout(timeoutId)
  }, [pathname, inlinePlayerId, isPlayerVisible, stopInlineAndResume])

  const handleSeek = useCallback(
    (percentage: number) => {
      if (duration === 0) return
      seek(percentage * duration)
    },
    [seek, duration]
  )

  // استفاده از هوک کاستوم برای کنترل‌های صوتی
  const { handleSkipForward, handleSkipBackward } = useAudioControls({
    currentTime,
    duration,
    seek,
  })

  const toggleTimelineType = useCallback(() => {
    setTimelineType((prev) => (prev === 'linear' ? 'waveform' : 'linear'))
  }, [])

  const handleTimelineLoadingChange = useCallback((loading: boolean) => {
    setIsTimelineLoading(loading)
  }, [])

  if (!isPlayerVisible || !currentTrack) return null

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-9998 bg-theme-black flex flex-col items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4 md:p-8">
          <div className="relative bg-theme-black overflow-hidden w-full max-w-5xl rounded-lg sm:rounded-xl p-8">
            <div className="flex flex-col items-center gap-6">
              <div className="self-end flex items-center gap-4">
                <PlaybackRateControl
                  playbackRate={playbackRate}
                  onPlaybackRateChange={setPlaybackRate}
                  textColor="text-theme-white"
                  textHoverColor="hover:text-theme-gray"
                  side="bottom"
                />
                <VolumeControl
                  volume={volume}
                  isMuted={isMuted}
                  onVolumeChange={handleVolumeChange}
                  onToggleMute={handleToggleMute}
                  iconColor="text-theme-white"
                  iconHoverColor="hover:text-theme-gray"
                  side="bottom"
                />
                <button
                  onClick={toggleTimelineType}
                  className={clsx(
                    'transition-colors',
                    isTimelineLoading
                      ? 'text-theme-gray/50 cursor-not-allowed'
                      : 'text-theme-white hover:text-theme-gray'
                  )}
                  title={
                    timelineType === 'linear'
                      ? 'نمایش موج صوتی'
                      : 'نمایش تایم‌لاین خطی'
                  }
                  aria-label={
                    timelineType === 'linear'
                      ? 'نمایش موج صوتی'
                      : 'نمایش تایم‌لاین خطی'
                  }>
                  <i
                    className={clsx(
                      'fa-light text-2xl',
                      timelineType === 'linear'
                        ? 'fa-waveform-lines'
                        : 'fa-bars'
                    )}
                  />
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-theme-white hover:text-theme-gray transition-colors"
                  title="کوچک کردن"
                  aria-label="کوچک کردن">
                  <i className="fa-light fa-compress text-2xl" />
                </button>
                <button
                  onClick={closePlayer}
                  className="text-theme-white hover:text-theme-gray transition-colors"
                  title="بستن پلیر"
                  aria-label="بستن پلیر">
                  <i className="fa-light fa-xmark text-2xl" />
                </button>
              </div>

              {currentTrack.image && (
                <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-xl overflow-hidden bg-theme-black relative">
                  <Image
                    src={currentTrack.image}
                    alt={currentTrack.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={handleTitleClick}
                  className="text-theme-white text-2xl font-medium mb-2 hover:text-theme-gray transition-colors">
                  {currentTrack.title}
                </button>
              </div>

              <div className="w-full">
                <div className="w-[95%]" dir="ltr">
                  <PeaksTimeline
                    type={timelineType}
                    isActive={true}
                    progress={progress}
                    bufferedProgress={bufferedProgress}
                    audioSrc={currentTrack.audioSrc}
                    onSeek={handleSeek}
                    onLoadingChange={handleTimelineLoadingChange}
                    lazyLoad={false}
                    className="w-full h-16"
                  />
                </div>
                <div className="flex justify-between mt-2 text-theme-white text-sm">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {hasPlaylist && (
                  <button
                    onClick={playNext}
                    disabled={!canPlayNext}
                    className={clsx(
                      'transition-colors',
                      canPlayNext
                        ? 'text-theme-white hover:text-theme-gray'
                        : 'text-theme-white/30 cursor-not-allowed'
                    )}
                    title="ترک بعدی"
                    aria-label="ترک بعدی">
                    <i className="fa-solid fa-forward text-2xl" />
                  </button>
                )}

                <button
                  onClick={handleSkipForward}
                  className="text-theme-white hover:text-theme-gray transition-colors"
                  title="10 ثانیه جلو"
                  aria-label="10 ثانیه جلو">
                  <i className="fa-light fa-rotate-right text-xl" />
                </button>

                <button
                  onClick={toggle}
                  className="bg-theme-gray rounded-full w-16 h-16 flex items-center justify-center hover:bg-theme-gray/80 transition-colors"
                  title={playing ? 'توقف' : 'پخش'}
                  aria-label={playing ? 'توقف' : 'پخش'}>
                  <i
                    className={clsx(
                      'fa-solid text-theme-black text-xl',
                      playing ? 'fa-pause' : 'fa-play'
                    )}
                  />
                </button>

                <button
                  onClick={handleSkipBackward}
                  className="text-theme-white hover:text-theme-gray transition-colors"
                  title="10 ثانیه عقب"
                  aria-label="10 ثانیه عقب">
                  <i className="fa-light fa-rotate-left text-xl" />
                </button>

                {hasPlaylist && (
                  <button
                    onClick={playPrevious}
                    disabled={!canPlayPrevious}
                    className={clsx(
                      'transition-colors',
                      canPlayPrevious
                        ? 'text-theme-white hover:text-theme-gray'
                        : 'text-theme-white/30 cursor-not-allowed'
                    )}
                    title="ترک قبلی"
                    aria-label="ترک قبلی">
                    <i className="fa-solid fa-backward text-2xl" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!shouldShowMini) return null

  return (
    <div className="fixed bottom-0 sm:bottom-0 left-0 right-0 z-50 px-2 sm:px-4 md:px-0">
      <div className="relative">
        <div
          className={clsx(
            'bg-theme-player-bg border border-theme-player-border md:rounded-none rounded-xl transition-all duration-300 p-3 md:p-4'
          )}>
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-2.5">
            <div className="flex items-center gap-3 md:w-auto">
              {currentTrack.image && (
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-16 md:h-16 shrink-0 rounded-lg md:rounded-xl overflow-hidden bg-theme-black relative">
                  <Image
                    src={currentTrack.image}
                    alt={currentTrack.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 flex items-center gap-2 min-w-0 md:hidden">
                <SeamlessMarquee
                  className="w-full!"
                  speed={60}
                  gap={60}
                  direction="right"
                  pauseOnHover={true}>
                  {currentTrack.href ? (
                    <button
                      onClick={handleTitleClick}
                      className="text-theme-white text-sm font-normal text-right leading-relaxed hover:text-theme-gray transition-colors">
                      {currentTrack.title}
                    </button>
                  ) : (
                    <h4 className="text-theme-white text-sm font-normal text-right leading-relaxed">
                      {currentTrack.title}
                    </h4>
                  )}
                </SeamlessMarquee>
              </div>
              <div className="flex md:hidden items-center gap-2">
                <button
                  onClick={toggle}
                  className="bg-theme-player-muted rounded-full flex items-center justify-center hover:bg-theme-gray transition-colors w-9 h-9"
                  title={playing ? 'توقف' : 'پخش'}
                  aria-label={playing ? 'توقف' : 'پخش'}>
                  <i
                    className={clsx(
                      'fa-solid text-theme-player-bg text-xs',
                      playing ? 'fa-pause' : 'fa-play mr-0.5'
                    )}
                  />
                </button>
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-theme-player-muted hover:text-theme-white transition-colors"
                  title="بزرگ کردن"
                  aria-label="بزرگ کردن">
                  <i className="fa-light fa-expand text-lg" />
                </button>
                <button
                  onClick={closePlayer}
                  className="text-theme-player-muted hover:text-theme-white transition-colors"
                  title="بستن"
                  aria-label="بستن">
                  <i className="fa-light fa-xmark text-lg" />
                </button>
              </div>
            </div>

            <div className="hidden md:flex flex-1 flex-col gap-2 w-[90%]">
              <div className="flex items-center justify-between w-full relative">
                <div className="flex justify-between gap-2 lg:w-[41%] md:w-[30%] sm:w-[27%]">
                  <SeamlessMarquee
                    className="w-full! lg:block hidden"
                    speed={60}
                    gap={500}
                    direction="right"
                    pauseOnHover={true}>
                    {currentTrack.href ? (
                      <button
                        onClick={handleTitleClick}
                        className="text-theme-white text-base font-normal text-right leading-relaxed hover:text-theme-gray transition-colors">
                        {currentTrack.title}
                      </button>
                    ) : (
                      <h4 className="text-theme-white text-base font-normal text-right leading-relaxed">
                        {currentTrack.title}
                      </h4>
                    )}
                  </SeamlessMarquee>
                  <SeamlessMarquee
                    className="w-full! lg:hidden sm:block hidden"
                    speed={60}
                    gap={100}
                    direction="right"
                    pauseOnHover={true}>
                    {currentTrack.href ? (
                      <button
                        onClick={handleTitleClick}
                        className="text-theme-white text-base font-normal text-right leading-relaxed hover:text-theme-gray transition-colors">
                        {currentTrack.title}
                      </button>
                    ) : (
                      <h4 className="text-theme-white text-base font-normal text-right leading-relaxed">
                        {currentTrack.title}
                      </h4>
                    )}
                  </SeamlessMarquee>
                </div>

                <div className="flex items-center justify-between lg:w-[59%] md:w-[70%] sm:w-[73%]">
                  <div className="flex flex-1  gap-5">
                    {hasPlaylist && (
                      <button
                        onClick={playNext}
                        disabled={!canPlayNext}
                        className={clsx(
                          'transition-colors',
                          canPlayNext
                            ? 'text-theme-player-muted hover:text-theme-white'
                            : 'text-theme-player-muted/30 cursor-not-allowed'
                        )}
                        title="ترک بعدی"
                        aria-label="ترک بعدی">
                        <i className="fa-solid fa-forward text-lg" />
                      </button>
                    )}

                    <button
                      onClick={handleSkipForward}
                      className="text-theme-player-muted hover:text-theme-white transition-colors"
                      title="10 ثانیه جلو"
                      aria-label="10 ثانیه جلو">
                      <i className="fa-light fa-rotate-right text-base" />
                    </button>

                    <button
                      onClick={toggle}
                      className="bg-theme-player-muted rounded-full flex items-center justify-center hover:bg-theme-gray transition-colors w-11 h-11"
                      title={playing ? 'توقف' : 'پخش'}
                      aria-label={playing ? 'توقف' : 'پخش'}>
                      <i
                        className={clsx(
                          'fa-solid text-theme-player-bg text-sm',
                          playing ? 'fa-pause' : 'fa-play mr-0.5'
                        )}
                      />
                    </button>

                    <button
                      onClick={handleSkipBackward}
                      className="text-theme-player-muted hover:text-theme-white transition-colors"
                      title="10 ثانیه عقب"
                      aria-label="10 ثانیه عقب">
                      <i className="fa-light fa-rotate-left text-base" />
                    </button>

                    {hasPlaylist && (
                      <button
                        onClick={playPrevious}
                        disabled={!canPlayPrevious}
                        className={clsx(
                          'transition-colors',
                          canPlayPrevious
                            ? 'text-theme-player-muted hover:text-theme-white'
                            : 'text-theme-player-muted/30 cursor-not-allowed'
                        )}
                        title="ترک قبلی"
                        aria-label="ترک قبلی">
                        <i className="fa-solid fa-backward text-lg" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-5">
                    <button
                      onClick={toggleTimelineType}
                      className={clsx(
                        'transition-colors',
                        isTimelineLoading
                          ? 'text-theme-player-muted/50 cursor-not-allowed'
                          : 'text-theme-player-muted hover:text-theme-white'
                      )}
                      title={
                        timelineType === 'linear'
                          ? 'نمایش موج صوتی'
                          : 'نمایش تایم‌لاین خطی'
                      }
                      aria-label={
                        timelineType === 'linear'
                          ? 'نمایش موج صوتی'
                          : 'نمایش تایم‌لاین خطی'
                      }>
                      <i
                        className={clsx(
                          'fa-light text-lg',
                          timelineType === 'linear'
                            ? 'fa-waveform-lines'
                            : 'fa-bars'
                        )}
                      />
                    </button>
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="text-theme-player-muted hover:text-theme-white transition-colors"
                      title="بزرگ کردن"
                      aria-label="بزرگ کردن">
                      <i className="fa-light fa-expand text-lg" />
                    </button>
                    <PlaybackRateControl
                      playbackRate={playbackRate}
                      onPlaybackRateChange={setPlaybackRate}
                      textColor="text-theme-player-muted"
                      textHoverColor="hover:text-theme-white"
                      side="top"
                    />
                    <VolumeControl
                      volume={volume}
                      isMuted={isMuted}
                      onVolumeChange={handleVolumeChange}
                      onToggleMute={handleToggleMute}
                      iconSize="text-lg"
                    />
                    <button
                      onClick={closePlayer}
                      className="text-theme-player-muted hover:text-theme-white transition-colors"
                      title="بستن"
                      aria-label="بستن">
                      <i className="fa-light fa-xmark text-lg" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full" dir="ltr">
                <div className="flex items-center gap-4 w-full">
                  <span className="text-theme-player-muted text-xs w-10 text-left shrink-0">
                    {formatTime(currentTime)}
                  </span>
                  <div className="flex-1">
                    <PeaksTimeline
                      type={timelineType}
                      isActive={true}
                      progress={progress}
                      bufferedProgress={bufferedProgress}
                      audioSrc={currentTrack.audioSrc}
                      onSeek={handleSeek}
                      onLoadingChange={handleTimelineLoadingChange}
                      lazyLoad={false}
                      className="h-10"
                    />
                  </div>
                  <span className="text-theme-player-muted text-xs w-10 text-right shrink-0">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex md:hidden w-full" dir="ltr">
              <div className="flex items-center gap-2 w-full">
                {hasPlaylist && (
                  <button
                    onClick={playNext}
                    disabled={!canPlayNext}
                    className={clsx(
                      'transition-colors shrink-0',
                      canPlayNext
                        ? 'text-theme-player-muted hover:text-theme-white'
                        : 'text-theme-player-muted/30 cursor-not-allowed'
                    )}
                    title="ترک بعدی"
                    aria-label="ترک بعدی">
                    <i className="fa-solid fa-forward text-sm" />
                  </button>
                )}
                <button
                  onClick={handleSkipForward}
                  className="text-theme-player-muted hover:text-theme-white transition-colors shrink-0"
                  title="10 ثانیه جلو"
                  aria-label="10 ثانیه جلو">
                  <i className="fa-light fa-rotate-right text-xs" />
                </button>
                <span className="text-theme-player-muted text-xs w-9 text-left shrink-0">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1">
                  <PeaksTimeline
                    type={timelineType}
                    isActive={true}
                    progress={progress}
                    bufferedProgress={bufferedProgress}
                    audioSrc={currentTrack.audioSrc}
                    onSeek={handleSeek}
                    onLoadingChange={handleTimelineLoadingChange}
                    lazyLoad={false}
                    className="h-6"
                  />
                </div>
                <span className="text-theme-player-muted text-xs w-9 text-right shrink-0">
                  {formatTime(duration)}
                </span>
                <button
                  onClick={handleSkipBackward}
                  className="text-theme-player-muted hover:text-theme-white transition-colors shrink-0"
                  title="10 ثانیه عقب"
                  aria-label="10 ثانیه عقب">
                  <i className="fa-light fa-rotate-left text-xs" />
                </button>
                {hasPlaylist && (
                  <button
                    onClick={playPrevious}
                    disabled={!canPlayPrevious}
                    className={clsx(
                      'transition-colors shrink-0',
                      canPlayPrevious
                        ? 'text-theme-player-muted hover:text-theme-white'
                        : 'text-theme-player-muted/30 cursor-not-allowed'
                    )}
                    title="ترک قبلی"
                    aria-label="ترک قبلی">
                    <i className="fa-solid fa-backward text-sm" />
                  </button>
                )}
                <button
                  onClick={toggleTimelineType}
                  className={clsx(
                    'transition-colors shrink-0',
                    isTimelineLoading
                      ? 'text-theme-player-muted/50 cursor-not-allowed'
                      : 'text-theme-player-muted hover:text-theme-white'
                  )}
                  title={
                    timelineType === 'linear'
                      ? 'نمایش موج صوتی'
                      : 'نمایش تایم‌لاین خطی'
                  }
                  aria-label={
                    timelineType === 'linear'
                      ? 'نمایش موج صوتی'
                      : 'نمایش تایم‌لاین خطی'
                  }>
                  <i
                    className={clsx(
                      'fa-light text-sm',
                      timelineType === 'linear'
                        ? 'fa-waveform-lines'
                        : 'fa-bars'
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
