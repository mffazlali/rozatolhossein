'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'

export type TimelineType = 'linear' | 'waveform'

interface AudioTimelineProps {
  /** نوع تایم‌لاین: خطی یا موجی */
  type: TimelineType
  /** آیا این player فعال است */
  isActive: boolean
  /** درصد پخش شده (0-100) */
  progress: number
  /** درصد بافر شده (0-100) */
  bufferedProgress: number
  /** URL فایل صوتی (فقط برای waveform) */
  audioSrc?: string
  /** تابع seek */
  onSeek: (percentage: number) => void
  /** کلاس اضافی */
  className?: string
  /** آیا waveform را lazy load کنیم (پیش‌فرض: true) */
  lazyLoad?: boolean
}

/**
 * AudioTimeline
 * کامپوننت تایم‌لاین صوتی که می‌تواند خطی یا موجی باشد
 * از همان ReactPlayer مشترک استفاده می‌کند
 * 
 * Performance Optimization:
 * - Lazy loading: فقط وقتی type=waveform باشد، WaveSurfer initialize می‌شود
 * - Intersection Observer: فقط وقتی در viewport باشد، load می‌شود
 * - Debounced loading: از لود همزمان چندین waveform جلوگیری می‌کند
 */
export function AudioTimeline({
  type,
  isActive,
  progress,
  bufferedProgress,
  audioSrc,
  onSeek,
  className = '',
  lazyLoad = true,
}: AudioTimelineProps) {
  const progressRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const bufferedRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const waveformRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const [waveformReady, setWaveformReady] = useState(false)
  const [isInViewport, setIsInViewport] = useState(!lazyLoad) // اگر lazy load نباشد، بلافاصله true
  const [shouldLoad, setShouldLoad] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Intersection Observer برای lazy loading
  useEffect(() => {
    if (!lazyLoad || type !== 'waveform') {
      setIsInViewport(true)
      return
    }

    const container = waveformRef.current
    if (!container) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          setIsInViewport(true)
          // بعد از اینکه در viewport آمد، observer را disconnect کن
          if (observerRef.current) {
            observerRef.current.disconnect()
          }
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // 50px قبل از اینکه وارد viewport شود، شروع به load کن
      }
    )

    observerRef.current.observe(container)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [lazyLoad, type])

  // تصمیم‌گیری برای load کردن waveform
  useEffect(() => {
    if (type === 'waveform' && isInViewport && audioSrc) {
      // با تاخیر کوتاه load کن تا از قفل شدن browser جلوگیری شود
      const timer = setTimeout(() => {
        setShouldLoad(true)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setShouldLoad(false)
    }
  }, [type, isInViewport, audioSrc])

  // Initialize WaveSurfer برای حالت waveform
  useEffect(() => {
    if (!shouldLoad || !waveformRef.current || !audioSrc) {
      // اگر نباید load شود، instance قبلی را destroy کن
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy()
        wavesurferRef.current = null
        setWaveformReady(false)
      }
      return
    }

    // اگر قبلاً instance وجود داشت، destroy کن
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy()
    }

    // ایجاد instance جدید
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#7d7d7d',
      progressColor: '#ffffff',
      cursorColor: 'transparent',
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 32,
      normalize: true,
      backend: 'WebAudio',
      interact: false, // غیرفعال کردن interaction مستقیم با waveform
      barMinHeight: 1,
    })

    wavesurferRef.current = wavesurfer

    // Load audio
    wavesurfer.load(audioSrc)

    // Event listeners
    wavesurfer.on('ready', () => {
      queueMicrotask(() => setWaveformReady(true))
    })

    wavesurfer.on('error', (error) => {
      console.error('WaveSurfer error:', error)
      queueMicrotask(() => setWaveformReady(false))
    })

    return () => {
      if (wavesurfer) {
        wavesurfer.destroy()
      }
    }
  }, [shouldLoad, audioSrc])

  // Update waveform progress
  useEffect(() => {
    if (type === 'waveform' && wavesurferRef.current && waveformReady) {
      const seekProgress = progress / 100
      wavesurferRef.current.seekTo(seekProgress)
    }
  }, [type, progress, waveformReady])

  // Update linear progress bars
  useEffect(() => {
    if (type !== 'linear') return

    if (!isActive) {
      // اگر فعال نیست، progress را صفر کن
      if (progressFillRef.current) progressFillRef.current.style.width = '0%'
      if (bufferedRef.current) bufferedRef.current.style.width = '0%'
      if (thumbRef.current) thumbRef.current.style.left = 'calc(0% - 4px)'
      return
    }

    // اگر فعال است، progress را به‌روز کن
    if (progressFillRef.current) progressFillRef.current.style.width = `${progress}%`
    if (bufferedRef.current) bufferedRef.current.style.width = `${bufferedProgress}%`
    if (thumbRef.current) thumbRef.current.style.left = `calc(${progress}% - 4px)`
  }, [type, progress, bufferedProgress, isActive])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = type === 'linear' ? progressRef.current : waveformRef.current
      if (!target || !isActive) return

      const rect = target.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const percentage = (clickX / rect.width) * 100
      onSeek(percentage / 100)
    },
    [type, isActive, onSeek]
  )

  const handleTouch = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!isActive) return
      
      // جلوگیری از scroll در حین touch
      e.preventDefault()

      const target = type === 'linear' ? progressRef.current : waveformRef.current
      if (!target) return

      const touch = e.touches[0] || e.changedTouches[0]
      if (!touch) return

      const rect = target.getBoundingClientRect()
      const touchX = touch.clientX - rect.left
      const percentage = Math.max(0, Math.min(100, (touchX / rect.width) * 100))
      onSeek(percentage / 100)
    },
    [type, isActive, onSeek]
  )

  if (type === 'waveform') {
    return (
      <div
        ref={waveformRef}
        onClick={handleClick}
        onTouchStart={handleTouch}
        onTouchMove={handleTouch}
        className={`flex-1 h-8 md:h-10 cursor-pointer relative ${className}`}
      >
        {/* Loading indicator */}
        {!waveformReady && shouldLoad && (
          <div className="absolute inset-0 flex items-center justify-center bg-figma-gray-dark/50 rounded">
            <div className="flex items-center gap-2 text-figma-gray text-xs">
              <i className="fa-light fa-spinner-third fa-spin" />
              <span className="hidden sm:inline">در حال بارگذاری موج صوتی...</span>
              <span className="sm:hidden">بارگذاری...</span>
            </div>
          </div>
        )}
        {/* Placeholder قبل از load */}
        {!shouldLoad && (
          <div className="absolute inset-0 bg-figma-gray-dark rounded flex items-center justify-center">
            <i className="fa-light fa-waveform-lines text-figma-gray text-lg" />
          </div>
        )}
      </div>
    )
  }

  // Linear timeline
  return (
    <div
      ref={progressRef}
      onClick={handleClick}
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
      className={`flex-1 h-2 md:h-2.5 relative cursor-pointer group ${className}`}
    >
      <div className="absolute inset-y-0 left-0 right-0 my-auto h-0.5 md:h-1 bg-theme-white/30 rounded-full" />
      <div
        ref={bufferedRef}
        className="absolute inset-y-0 left-0 my-auto h-0.5 md:h-1 bg-theme-white/20 rounded-full"
      />
      <div
        ref={progressFillRef}
        className="absolute inset-y-0 left-0 my-auto h-0.5 md:h-1 bg-theme-white rounded-full transition-all"
      />
      <div
        ref={thumbRef}
        className="absolute top-1/2 -translate-y-1/2 size-2 md:size-2.5 bg-theme-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  )
}
