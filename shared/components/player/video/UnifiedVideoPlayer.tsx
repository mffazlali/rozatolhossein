'use client'

import { useState, useCallback, useEffect, memo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'
import { useVideoPlayer } from '@/shared/contexts/VideoPlayerContext'
import { usePlayerVolume } from '../usePlayerVolume'
import { usePlaybackRate } from '../usePlaybackRate'
import { useSharedReactPlayer } from '../SharedReactPlayerProvider'
import { VolumeControl } from '../VolumeControl'
import { PlaybackRateControl } from '../PlaybackRateControl'
import { formatTime } from '../utils'
import { useVideoControls } from './useVideoControls'
import SeamlessMarquee from '../SeamlessMarquee'

/**
 * UnifiedVideoPlayer
 * پخش‌کننده یکپارچه که بین حالت inline، mini و expanded سوییچ می‌کند
 * از react-player برای پخش استفاده می‌کند
 *
 * از React.memo استفاده می‌کند تا فقط زمانی render شود که context state تغییر کند
 */
function UnifiedVideoPlayerComponent() {
  const pathname = usePathname()
  const router = useRouter()

  const {
    currentTrack,
    isPlayerVisible,
    inlinePlayerId,
    isInlineInView,
    isOpeningInline,
    isFullscreen,
    setIsFullscreen,
    closePlayer,
    stopInlineAndResume,
    playlist,
    playNext,
    playPrevious,
  } = useVideoPlayer()

  // محاسبه امکان next/previous
  const currentIndex = playlist.findIndex((t) => t.id === currentTrack?.id)
  const canPlayPrevious = playlist.length > 1 && currentIndex > 0
  const canPlayNext = playlist.length > 1 && currentIndex < playlist.length - 1
  const hasPlaylist = playlist.length > 1

  const [inlineContainerExists, setInlineContainerExists] = useState(false)

  const { volume, isMuted, setVolume, toggleMute } = usePlayerVolume()
  const { playbackRate, setPlaybackRate } = usePlaybackRate()
  const { playing, setPlayingByUser, played, loaded, duration, seek } =
    useSharedReactPlayer()

  // محاسبه مقادیر progress
  const currentTime = duration * played
  const progress = played * 100
  const bufferedProgress = loaded * 100

  // آیا باید mini player نمایش داده بشه
  // اگر در حال باز شدن inline player هستیم، mini را نشان نده
  const shouldShowMini =
    isPlayerVisible &&
    !isOpeningInline &&
    (!inlinePlayerId || !isInlineInView || !inlineContainerExists)

  // بررسی وجود inline container در DOM
  useEffect(() => {
    if (!inlinePlayerId) {
      setInlineContainerExists(false)
      return
    }

    const checkContainer = () => {
      const exists =
        document.getElementById(`inline-video-container-${inlinePlayerId}`) !==
        null
      setInlineContainerExists(exists)
    }

    checkContainer()

    const timeouts = [50, 100, 200].map((delay) =>
      setTimeout(checkContainer, delay)
    )

    return () => timeouts.forEach(clearTimeout)
  }, [inlinePlayerId, pathname])

  // وقتی صفحه عوض میشه، چک کن که inline container وجود داره یا نه
  useEffect(() => {
    if (!inlinePlayerId || !isPlayerVisible) return

    const timeoutId = setTimeout(() => {
      const container = document.getElementById(
        `inline-video-container-${inlinePlayerId}`
      )
      if (!container) {
        stopInlineAndResume()
      }
    }, 50)

    return () => clearTimeout(timeoutId)
  }, [pathname, inlinePlayerId, isPlayerVisible, stopInlineAndResume])

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [setIsFullscreen])

  const handlePlayPause = useCallback(() => {
    if (currentTime >= duration && duration > 0) {
      seek(0)
      setTimeout(() => {
        setPlayingByUser(true)
      }, 50)
      return
    }

    setPlayingByUser(!playing)
  }, [playing, currentTime, duration, seek, setPlayingByUser])

  const handleSeek = useCallback(
    (percentage: number) => {
      if (duration === 0) return
      const newTime = percentage * duration
      seek(newTime)
    },
    [duration, seek]
  )

  const handleVolumeChange = useCallback(
    (newVolume: number) => {
      setVolume(newVolume)
    },
    [setVolume]
  )

  const handleToggleMute = useCallback(() => {
    toggleMute()
  }, [toggleMute])

  const handlePlaybackRateChange = useCallback(
    (rate: number) => {
      setPlaybackRate(rate)
    },
    [setPlaybackRate]
  )

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const percentage = clickX / rect.width
      handleSeek(percentage)
    },
    [handleSeek]
  )

  const handleFullscreen = useCallback(() => {
    // پیدا کردن container ویدیو و fullscreen کردن آن
    const videoContainer = document.querySelector(
      '[data-video-container="true"]'
    )
    if (videoContainer && videoContainer.requestFullscreen) {
      videoContainer.requestFullscreen()
    } else if (document.fullscreenElement) {
      document.exitFullscreen()
    }
  }, [])

  // استفاده از هوک کاستوم برای کنترل‌های ویدیو
  const { handleSkipForward, handleSkipBackward } = useVideoControls({
    currentTime,
    duration,
    seek,
  })

  // Smart navigation: کلیک روی عنوان
  const handleTitleClick = useCallback(() => {
    if (!currentTrack) return

    // اگر از session است، به صفحه session با tab=video برو
    if (currentTrack.isFromSession && currentTrack.sessionId) {
      // استخراج index از id (format: pathname-video-index)
      const videoIndex = currentTrack.id.split('-').pop()
      const videoId = `video-${videoIndex}`

      // ذخیره videoId در sessionStorage برای اسکرول
      sessionStorage.setItem('scrollToVideoId', videoId)

      // هدایت به صفحه session با tab=video
      router.push(`/fa/content/${currentTrack.sessionId}?tab=video`)
    } else if (currentTrack.href) {
      // اگر از session نیست، به صفحه detail ویدیو برو
      router.push(currentTrack.href)
    }
  }, [currentTrack, router])

  if (!isPlayerVisible || !currentTrack) {
    return null
  }

  // Mini Player UI
  if (!shouldShowMini) return null

  return (
    <div className="fixed bottom-0 sm:bottom-0 left-0 right-0 z-50 px-2 sm:px-4 md:px-0">
      <div className="relative">
        <div className="bg-theme-player-bg border border-theme-player-border md:rounded-none rounded-xl transition-all duration-300 p-3 md:p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-2.5">
            {/* Mobile & Desktop: Video + Title + Mobile Controls */}
            <div className="flex items-center gap-3 md:w-auto">
              <div
                id="mini-video-container"
                className="w-16 h-9 sm:w-20 sm:h-11 md:w-[120px] md:h-[70px] shrink-0 rounded-lg md:rounded-xl bg-theme-black cursor-pointer relative group"
                onClick={handleFullscreen}>
                {/* ReactPlayer مشترک در div ثابت - کنترل‌ها فقط اینجا هستند */}
                <div className="absolute inset-0 bg-theme-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <i className="fa-light fa-expand text-theme-white text-base md:text-xl" />
                </div>
              </div>
              <div className="flex-1 flex items-center gap-2 min-w-0 md:hidden">
                <SeamlessMarquee
                  className="w-full!"
                  speed={60}
                  gap={60}
                  direction="right"
                  pauseOnHover={true}>
                  <button
                    onClick={handleTitleClick}
                    className="text-theme-white text-sm font-normal text-right leading-relaxed hover:text-theme-gray transition-colors">
                    {currentTrack.title}
                  </button>
                </SeamlessMarquee>
              </div>
              <div className="flex md:hidden items-center gap-2">
                <button
                  onClick={handlePlayPause}
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
                  onClick={handleFullscreen}
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

            {/* Desktop: Title + Controls + Timeline + Utility Controls */}
            <div className="hidden md:flex flex-1 flex-col gap-2 w-[90%]">
              <div className="flex items-center justify-between w-full relative">
                <div className="flex justify-between gap-2 lg:w-[41%] md:w-[30%] sm:w-[27%]">
                  <SeamlessMarquee
                    className="w-full! lg:block hidden"
                    speed={60}
                    gap={500}
                    direction="right"
                    pauseOnHover={true}>
                    <button
                      onClick={handleTitleClick}
                      className="text-theme-white text-base font-normal text-right leading-relaxed hover:text-theme-gray transition-colors">
                      {currentTrack.title}
                    </button>
                  </SeamlessMarquee>
                  <SeamlessMarquee
                    className="w-full! lg:hidden sm:block hidden"
                    speed={60}
                    gap={100}
                    direction="right"
                    pauseOnHover={true}>
                    <button
                      onClick={handleTitleClick}
                      className="text-theme-white text-base font-normal text-right leading-relaxed hover:text-theme-gray transition-colors">
                      {currentTrack.title}
                    </button>
                  </SeamlessMarquee>
                </div>

                <div className="flex items-center justify-between lg:w-[59%] md:w-[70%] sm:w-[73%]">
                  <div className="flex flex-1 gap-5">
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
                      onClick={handlePlayPause}
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
                      onClick={handleFullscreen}
                      className="text-theme-player-muted hover:text-theme-white transition-colors"
                      title="بزرگ کردن"
                      aria-label="بزرگ کردن">
                      <i className="fa-light fa-expand text-lg" />
                    </button>
                    <PlaybackRateControl
                      playbackRate={playbackRate}
                      onPlaybackRateChange={handlePlaybackRateChange}
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
                  <div
                    onClick={handleProgressClick}
                    className="flex-1 h-2 bg-theme-player-progress rounded-xl cursor-pointer relative">
                    <div
                      className="absolute top-0 left-0 h-full bg-theme-white/20 rounded-xl"
                      style={{ width: `${bufferedProgress}%` }}
                    />
                    <div
                      className="absolute top-0 left-0 h-full bg-theme-player-muted rounded-xl"
                      style={{ width: `${progress}%` }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-theme-player-muted rounded-full"
                      style={{ left: `calc(${progress}% - 6px)` }}
                    />
                  </div>
                  <span className="text-theme-player-muted text-xs w-10 text-right shrink-0">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile: Controls + Timeline */}
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
                <div
                  onClick={handleProgressClick}
                  className="flex-1 h-1.5 bg-theme-player-progress rounded-xl cursor-pointer relative">
                  <div
                    className="absolute top-0 left-0 h-full bg-theme-white/20 rounded-xl"
                    style={{ width: `${bufferedProgress}%` }}
                  />
                  <div
                    className="absolute top-0 left-0 h-full bg-theme-player-muted rounded-xl"
                    style={{ width: `${progress}%` }}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * UnifiedVideoPlayer با React.memo
 * فقط زمانی render می‌شود که context state تغییر کند
 */
export const UnifiedVideoPlayer = memo(UnifiedVideoPlayerComponent)
