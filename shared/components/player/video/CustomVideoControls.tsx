'use client'

import { forwardRef, useEffect, useRef, useState, useCallback } from 'react'
import ReactPlayer from 'react-player'
import clsx from 'clsx'
import { useVideoPlayer } from '@/shared/contexts/VideoPlayerContext'
import { VolumeControl } from '../VolumeControl'
import { PlaybackRateControl } from '../PlaybackRateControl'
import { usePlaybackRate } from '../usePlaybackRate'
import { formatTime } from '../utils'
import { useVideoControls } from './useVideoControls'

interface CustomVideoControlsProps {
  videoSrc: string
  playing: boolean
  controls: boolean
  onPlay: () => void
  onPause: () => void
  onProgress: (state: { played: number; loaded: number; playedSeconds: number; loadedSeconds: number }) => void
  onDurationChange: (duration: number) => void
  onEnded: () => void
  volume: number
  muted: boolean
  onVolumeChange?: (volume: number) => void
  onToggleMute?: () => void
}

export const CustomVideoControls = forwardRef<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  CustomVideoControlsProps
>(function CustomVideoControls(
  {
    videoSrc,
    playing,
    controls,
    onPlay,
    onPause,
    onProgress,
    onDurationChange,
    onEnded,
    volume,
    muted,
    onVolumeChange,
    onToggleMute,
  },
  ref
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const internalRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastProgressRef = useRef({ played: 0, loaded: 0, playedSeconds: 0, loadedSeconds: 0 })
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [played, setPlayed] = useState(0)
  const [loaded, setLoaded] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isPiPActive, setIsPiPActive] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const { playbackRate, setPlaybackRate } = usePlaybackRate()
  
  // دسترسی به video context برای playlist و next/previous
  const { playlist, currentTrack, playNext, playPrevious } = useVideoPlayer()
  
  // محاسبه امکان next/previous
  const currentIndex = playlist.findIndex(t => t.id === currentTrack?.id)
  const canPlayPrevious = playlist.length > 1 && currentIndex > 0
  const canPlayNext = playlist.length > 1 && currentIndex < playlist.length - 1
  const hasPlaylist = playlist.length > 1
  
  // Polling برای به‌روزرسانی progress از internal player
  useEffect(() => {
    const interval = setInterval(() => {
      const player = (ref && typeof ref !== 'function' ? ref.current : null) || internalRef.current
      if (!player) return
      
      const internalPlayer = player.getInternalPlayer?.() || player
      if (!internalPlayer) return
      
      // دریافت duration
      const dur = internalPlayer.duration
      if (dur && !isNaN(dur) && isFinite(dur)) {
        setDuration(dur)
        onDurationChange(dur)
        
        // دریافت progress
        const time = internalPlayer.currentTime || 0
        setCurrentTime(time)
        const playedRatio = time / dur
        setPlayed(playedRatio)
        
        // دریافت buffered
        let loadedRatio = 0
        if (internalPlayer.buffered && internalPlayer.buffered.length > 0) {
          try {
            const bufferedEnd = internalPlayer.buffered.end(internalPlayer.buffered.length - 1)
            loadedRatio = bufferedEnd / dur
            setLoaded(loadedRatio)
          } catch {
            // ignore buffered errors
          }
        }
        
        const progressState = {
          played: playedRatio,
          loaded: loadedRatio,
          playedSeconds: time,
          loadedSeconds: loadedRatio * dur,
        }
        
        // فقط اگر تغییر کرده باشد، callback را صدا بزن
        if (
          Math.abs(progressState.played - lastProgressRef.current.played) > 0.001 ||
          Math.abs(progressState.loaded - lastProgressRef.current.loaded) > 0.01
        ) {
          lastProgressRef.current = progressState
          onProgress(progressState)
        }
      }
    }, 100)
    
    return () => clearInterval(interval)
  }, [ref, onProgress, onDurationChange])

  const handlePlayPause = useCallback(() => {
    if (playing) {
      onPause()
    } else {
      onPlay()
    }
  }, [playing, onPlay, onPause])

  // مدیریت نمایش/مخفی کردن کنترل‌ها
  const resetHideControlsTimer = useCallback(() => {
    // نمایش کنترل‌ها
    setShowControls(true)
    
    // پاک کردن timeout قبلی
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current)
    }
    
    // تنظیم timeout جدید برای مخفی کردن (3 ثانیه)
    hideControlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 3000)
  }, [])

  // نمایش کنترل‌ها با حرکت موس
  const handleMouseMove = useCallback(() => {
    resetHideControlsTimer()
  }, [resetHideControlsTimer])

  // مخفی کردن کنترل‌ها با خروج موس (با تاخیر)
  const handleMouseLeave = useCallback(() => {
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current)
    }
    // تنظیم timeout کوتاه‌تر برای مخفی کردن (1 ثانیه)
    hideControlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 1000)
  }, [])

  // پاک کردن timeout در unmount
  useEffect(() => {
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current)
      }
    }
  }, [])

  // تشخیص حالت Picture-in-Picture
  useEffect(() => {
    const handlePiPEnter = () => setIsPiPActive(true)
    const handlePiPLeave = () => setIsPiPActive(false)

    document.addEventListener('enterpictureinpicture', handlePiPEnter)
    document.addEventListener('leavepictureinpicture', handlePiPLeave)

    return () => {
      document.removeEventListener('enterpictureinpicture', handlePiPEnter)
      document.removeEventListener('leavepictureinpicture', handlePiPLeave)
    }
  }, [])

  // تشخیص حالت Fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    // برای timeline چپ به راست
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    const newTime = percentage * duration
    
    const player = (ref && typeof ref !== 'function' ? ref.current : null) || internalRef.current
    if (player) {
      const internalPlayer = player.getInternalPlayer?.() || player
      if (internalPlayer && 'currentTime' in internalPlayer) {
        internalPlayer.currentTime = newTime
        setCurrentTime(newTime)
        setPlayed(percentage)
      }
    }
  }, [duration])

  const handleVolumeChange = useCallback((newVolume: number) => {
    // اگر callback داریم، از اون استفاده کن
    if (onVolumeChange) {
      onVolumeChange(newVolume)
    }
    
    // همچنین internal player رو هم به‌روز کن
    const player = (ref && typeof ref !== 'function' ? ref.current : null) || internalRef.current
    if (player) {
      const internalPlayer = player.getInternalPlayer?.() || player
      if (internalPlayer && 'volume' in internalPlayer && 'muted' in internalPlayer) {
        internalPlayer.volume = newVolume
        internalPlayer.muted = newVolume === 0
      }
    }
  }, [onVolumeChange])

  const handleToggleMute = useCallback(() => {
    // اگر callback داریم، از اون استفاده کن
    if (onToggleMute) {
      onToggleMute()
    }
    
    // همچنین internal player رو هم به‌روز کن
    const player = (ref && typeof ref !== 'function' ? ref.current : null) || internalRef.current
    if (player) {
      const internalPlayer = player.getInternalPlayer?.() || player
      if (internalPlayer && 'muted' in internalPlayer) {
        internalPlayer.muted = !internalPlayer.muted
      }
    }
  }, [onToggleMute])

  const handlePlaybackRateChange = useCallback((rate: number) => {
    setPlaybackRate(rate)
    const player = (ref && typeof ref !== 'function' ? ref.current : null) || internalRef.current
    if (player) {
      const internalPlayer = player.getInternalPlayer?.() || player
      if (internalPlayer && 'playbackRate' in internalPlayer) {
        internalPlayer.playbackRate = rate
      }
    }
  }, [])

  const handleFullscreen = useCallback(() => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        containerRef.current.requestFullscreen()
      }
    }
  }, [])

  const handlePictureInPicture = useCallback(async () => {
    const player = (ref && typeof ref !== 'function' ? ref.current : null) || internalRef.current
    if (player) {
      const internalPlayer = player.getInternalPlayer?.() || player
      if (internalPlayer && 'requestPictureInPicture' in internalPlayer) {
        try {
          if (document.pictureInPictureElement) {
            await document.exitPictureInPicture()
          } else {
            await internalPlayer.requestPictureInPicture()
          }
        } catch {
          // PiP not supported or failed
        }
      }
    }
  }, [])

  // تابع seek برای استفاده در هوک کاستوم
  const seekToTime = useCallback((newTime: number) => {
    const player = (ref && typeof ref !== 'function' ? ref.current : null) || internalRef.current
    if (player) {
      const internalPlayer = player.getInternalPlayer?.() || player
      if (internalPlayer && 'currentTime' in internalPlayer) {
        internalPlayer.currentTime = newTime
        setCurrentTime(newTime)
        setPlayed(newTime / duration)
      }
    }
  }, [duration])

  // استفاده از هوک کاستوم برای کنترل‌های ویدیو
  const { handleSkipForward, handleSkipBackward } = useVideoControls({
    currentTime,
    duration,
    seek: seekToTime,
  })

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full bg-theme-black" 
      data-video-container="true"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={resetHideControlsTimer}
      onTouchMove={resetHideControlsTimer}
      style={{
        // مخفی کردن متن پیش‌فرض مرورگر در PiP
        ...(isPiPActive && {
          '::cue': { display: 'none' }
        } as React.CSSProperties)
      }}>
      <ReactPlayer
        ref={(r) => {
          if (typeof ref === 'function') {
            ref(r)
          } else if (ref) {
            ref.current = r
          }
          internalRef.current = r
        }}
        src={videoSrc}
        playing={playing}
        controls={false}
        volume={volume}
        muted={muted}
        playbackRate={playbackRate}
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
      />
      
      {/* نمایش متن فارسی در حالت Picture-in-Picture */}
      {isPiPActive && (
        <div className="absolute top-4 left-4 bg-theme-black/80 text-theme-white px-3 py-1.5 rounded-lg text-sm pointer-events-none">
          در حال پخش در حالت تصویر در تصویر
        </div>
      )}
      
      {/* دکمه Play/Pause در وسط - همیشه نمایش داده می‌شود */}
      {controls && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ 
            opacity: showControls ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}>
          <button
            onClick={handlePlayPause}
            className="bg-theme-black/60 hover:bg-theme-black/80 rounded-full flex items-center justify-center transition-all pointer-events-auto w-16 h-16 md:w-20 md:h-20"
            aria-label={playing ? 'توقف' : 'پخش'}>
            <i className={clsx('fa-solid text-theme-white text-2xl md:text-3xl', playing ? 'fa-pause' : 'fa-play mr-1')} />
          </button>
        </div>
      )}
      
      {controls && showControls && (
        <div className="absolute inset-0 flex flex-col justify-end pointer-events-none transition-opacity duration-300">
          <div 
            className="bg-linear-to-t from-theme-black/80 via-theme-black/40 to-transparent p-4 pointer-events-auto"
            dir="rtl">
            {/* Progress Bar */}
            <div 
              className="w-full h-1.5 bg-theme-player-progress rounded-full cursor-pointer relative group mb-3"
              onClick={handleSeek}>
              <div
                className="absolute top-0 left-0 h-full bg-theme-white/20 rounded-full"
                style={{ width: `${loaded * 100}%` }}
              />
              <div
                className="absolute top-0 left-0 h-full bg-theme-player-muted rounded-full"
                style={{ width: `${played * 100}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-theme-player-muted rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${played * 100}% - 6px)` }}
              />
            </div>

            {/* Controls Row */}
            <div className={clsx(
              'flex items-center gap-2',
              isFullscreen ? 'justify-center' : 'justify-between'
            )}>
              {/* Left Controls - فقط در حالت عادی */}
              {!isFullscreen && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleFullscreen}
                    className="text-theme-white hover:text-theme-gray transition-colors"
                    title="تمام صفحه">
                    <i className="fa-solid fa-expand text-lg" />
                  </button>

                  <PlaybackRateControl
                    playbackRate={playbackRate}
                    onPlaybackRateChange={handlePlaybackRateChange}
                    textColor="text-theme-white"
                    textHoverColor="hover:text-theme-gray"
                    textSize="text-sm"
                  />
                </div>
              )}

              {/* Center Controls - در fullscreen */}
              {isFullscreen && (
                <div className="flex items-center justify-between w-full gap-1 sm:gap-2">
                  {/* Right side - fullscreen + playback rate */}
                  <div className="flex items-center gap-1 sm:gap-3">
                    <PlaybackRateControl
                      playbackRate={playbackRate}
                      onPlaybackRateChange={handlePlaybackRateChange}
                      textColor="text-theme-white"
                      textHoverColor="hover:text-theme-gray"
                      textSize="text-xs sm:text-sm"
                    />

                    <button
                      onClick={handleFullscreen}
                      className="text-theme-white hover:text-theme-gray transition-colors"
                      title="خروج از تمام صفحه">
                      <i className="fa-solid fa-compress text-base sm:text-lg" />
                    </button>
                  </div>

                  {/* Center playback controls */}
                  <div className="flex items-center gap-2 sm:gap-4">
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
                        title="ترک بعدی">
                        <i className="fa-solid fa-forward text-lg sm:text-xl" />
                      </button>
                    )}

                    <button
                      onClick={handleSkipForward}
                      className="text-theme-white hover:text-theme-gray transition-colors"
                      title="10 ثانیه جلو"
                      aria-label="10 ثانیه جلو">
                      <i className="fa-light fa-rotate-right text-lg sm:text-xl" />
                    </button>

                    <button
                      onClick={handlePlayPause}
                      className="text-theme-white hover:text-theme-gray transition-colors"
                      title={playing ? 'توقف' : 'پخش'}>
                      <i className={clsx('fa-solid text-xl sm:text-2xl', playing ? 'fa-pause' : 'fa-play')} />
                    </button>

                    <button
                      onClick={handleSkipBackward}
                      className="text-theme-white hover:text-theme-gray transition-colors"
                      title="10 ثانیه عقب"
                      aria-label="10 ثانیه عقب">
                      <i className="fa-light fa-rotate-left text-lg sm:text-xl" />
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
                        title="ترک قبلی">
                        <i className="fa-solid fa-backward text-lg sm:text-xl" />
                      </button>
                    )}
                  </div>

                  {/* Left side - volume + time */}
                  <div className="flex items-center gap-1 sm:gap-3">
                    <span className="text-theme-white text-xs sm:text-sm whitespace-nowrap">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    <VolumeControl
                      volume={volume}
                      isMuted={muted}
                      onVolumeChange={handleVolumeChange}
                      onToggleMute={handleToggleMute}
                      iconColor="text-theme-white"
                      iconHoverColor="hover:text-theme-gray"
                      iconSize="text-base sm:text-lg"
                    />
                  </div>
                </div>
              )}

              {/* Right Controls - فقط در حالت عادی */}
              {!isFullscreen && (
                <div className="flex items-center gap-3">
                  <span className="text-theme-white text-sm">
                    {formatTime(duration)} / {formatTime(currentTime)}
                  </span>

                  <VolumeControl
                    volume={volume}
                    isMuted={muted}
                    onVolumeChange={handleVolumeChange}
                    onToggleMute={handleToggleMute}
                    iconColor="text-theme-white"
                    iconHoverColor="hover:text-theme-gray"
                    iconSize="text-lg"
                  />
                  
                  <button
                    onClick={handleSkipForward}
                    className="text-theme-white hover:text-theme-gray transition-colors"
                    title="10 ثانیه جلو"
                    aria-label="10 ثانیه جلو">
                    <i className="fa-light fa-rotate-right text-lg" />
                  </button>

                  <button
                    onClick={handlePlayPause}
                    className="text-theme-white hover:text-theme-gray transition-colors"
                    title={playing ? 'توقف' : 'پخش'}>
                    <i className={clsx('fa-solid text-xl', playing ? 'fa-pause' : 'fa-play')} />
                  </button>

                  <button
                    onClick={handleSkipBackward}
                    className="text-theme-white hover:text-theme-gray transition-colors"
                    title="10 ثانیه عقب"
                    aria-label="10 ثانیه عقب">
                    <i className="fa-light fa-rotate-left text-lg" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
