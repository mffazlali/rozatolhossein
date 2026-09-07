'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import type { PeaksInstance, PeaksOptions } from 'peaks.js'
import { useSharedReactPlayer } from '../SharedReactPlayerProvider'

export type TimelineType = 'linear' | 'waveform'

interface PeaksTimelineProps {
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
  /** Callback برای تغییر وضعیت loading */
  onLoadingChange?: (loading: boolean) => void
}

// Cache برای نگه داشتن waveform data
const waveformCache = new Map<string, AudioBuffer>()

/**
 * PeaksTimeline
 * کامپوننت تایم‌لاین صوتی با peaks.js که بسیار سریع‌تر از WaveSurfer است
 * 
 * مزایای peaks.js:
 * - Progressive loading: نیازی به دانلود کل فایل نیست
 * - Pre-computed waveforms: می‌تواند از waveform از قبل محاسبه شده استفاده کند
 * - بهینه‌سازی شده برای فایل‌های بزرگ
 * - مصرف memory کمتر
 * - سرعت بالاتر
 * - Caching: waveform data یک بار لود می‌شود و cache می‌شود
 */
export function PeaksTimeline({
  type,
  isActive,
  progress,
  bufferedProgress,
  audioSrc,
  onSeek,
  className = '',
  lazyLoad = true,
  onLoadingChange,
}: PeaksTimelineProps) {
  const { audioElementRef } = useSharedReactPlayer()
  const progressRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const bufferedRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const overviewContainerRef = useRef<HTMLDivElement | null>(null)
  const peaksInstanceRef = useRef<PeaksInstance | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const dummyAudioRef = useRef<HTMLAudioElement | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const [waveformReady, setWaveformReady] = useState(false)
  const [isInViewport, setIsInViewport] = useState(!lazyLoad)
  const [shouldLoad, setShouldLoad] = useState(!lazyLoad && type === 'waveform')
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const initializingRef = useRef(false)

  // Notify parent about loading state changes
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading)
    }
  }, [isLoading, onLoadingChange])

  // ایجاد container خارج از React lifecycle
  useEffect(() => {
    const wrapper = wrapperRef.current
    
    if (type !== 'waveform' || !wrapper) {
      // اگر type waveform نیست، container را پاک کن
      if (overviewContainerRef.current) {
        try {
          if (wrapper) {
            wrapper.removeChild(overviewContainerRef.current)
          }
        } catch {
          // نادیده بگیر
        }
        overviewContainerRef.current = null
      }
      return
    }

    // ایجاد یک div که React آن را مدیریت نمی‌کند
    const container = document.createElement('div')
    container.className = `w-full cursor-pointer relative ${className || 'h-8 md:h-10'}`
    container.style.backgroundColor = 'transparent'
    container.style.overflow = 'hidden'
    container.style.position = 'relative'
    container.style.display = 'block'
    
    wrapper.appendChild(container)
    overviewContainerRef.current = container

    return () => {
      // پاک کردن container در unmount
      if (overviewContainerRef.current && wrapper) {
        try {
          wrapper.removeChild(overviewContainerRef.current)
        } catch {
          // نادیده بگیر
        }
        overviewContainerRef.current = null
      }
    }
  }, [type, className])

  // Intersection Observer برای lazy loading
  useEffect(() => {
    if (!lazyLoad || type !== 'waveform') {
      return
    }

    const container = wrapperRef.current
    if (!container) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          setIsInViewport(true)
          if (observerRef.current) {
            observerRef.current.disconnect()
          }
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
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
      const timer = setTimeout(() => {
        setShouldLoad(true)
      }, 100)
      return () => clearTimeout(timer)
    } else if (type === 'linear') {
      // Reset state وقتی به linear تغییر می‌کند
      setShouldLoad(false)
      setWaveformReady(false)
      setIsLoading(false)
    }
  }, [type, isInViewport, audioSrc])

  // Initialize Peaks.js
  useEffect(() => {
    if (!shouldLoad || !overviewContainerRef.current || !audioSrc || initializingRef.current) {
      return
    }

    const container = overviewContainerRef.current
    initializingRef.current = true

    // ایجاد AudioContext و load کردن audio
    const initPeaks = async () => {
      try {
        // Dynamic import برای جلوگیری از خطای SSR
        const Peaks = (await import('peaks.js')).default

        // ایجاد یک dummy audio element که پخش نمی‌شود
        // فقط برای Peaks.js که به mediaElement نیاز دارد
        if (!dummyAudioRef.current) {
          dummyAudioRef.current = document.createElement('audio')
          dummyAudioRef.current.src = audioSrc
          dummyAudioRef.current.preload = 'metadata'
          // مطمئن شویم که پخش نمی‌شود
          dummyAudioRef.current.volume = 0
          dummyAudioRef.current.muted = true
        }

        const dummyAudio = dummyAudioRef.current

        // ایجاد AudioContext
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext()
        }

        // بررسی cache
        let audioBuffer = waveformCache.get(audioSrc)
        
        if (!audioBuffer) {
          // دانلود و decode فایل صوتی
          const response = await fetch(audioSrc)
          const audioData = await response.arrayBuffer()
          audioBuffer = await audioContextRef.current.decodeAudioData(audioData)
          
          // ذخیره در cache
          waveformCache.set(audioSrc, audioBuffer)
        }

        // Destroy instance قبلی قبل از init جدید
        if (peaksInstanceRef.current) {
          try {
            peaksInstanceRef.current.destroy()
          } catch (e) {
            console.warn('[PeaksTimeline] Destroy error (ignored):', e)
          }
          peaksInstanceRef.current = null
        }

        // پاک کردن container قبل از init
        container.innerHTML = ''

        // دریافت رنگ‌های theme از CSS variables
        const computedStyle = getComputedStyle(document.documentElement)
        const themeWhite = computedStyle.getPropertyValue('--color-theme-white').trim()
        const themeGray = computedStyle.getPropertyValue('--color-theme-gray').trim()
        
        const options: PeaksOptions = {
          overview: {
            container: container,
            // استایل موج‌ها با رنگ‌های theme
            waveformColor: themeGray, // theme-gray
            playedWaveformColor: themeWhite, // theme-white
            // تنظیمات اضافی برای جلوگیری از overflow
            axisGridlineColor: 'transparent',
            axisLabelColor: 'transparent',
            showAxisLabels: false,
          },
          mediaElement: dummyAudio,
          webAudio: {
            audioContext: audioContextRef.current,
            audioBuffer: audioBuffer,
            scale: 512,
            multiChannel: false,
          },
          zoomLevels: [512, 1024, 2048, 4096],
          keyboard: false,
        }

        Peaks.init(options, (err, peaks) => {
          initializingRef.current = false
          
          if (err) {
            console.error('[PeaksTimeline] Initialization error:', err)
            queueMicrotask(() => {
              setIsLoading(false)
              setWaveformReady(false)
            })
            return
          }

          if (peaks) {
            peaksInstanceRef.current = peaks
            
            // تابع برای تنظیم سایز canvas با استفاده از Peaks API
            const resizeWaveform = () => {
              try {
                if (peaksInstanceRef.current) {
                  // استفاده از API داخلی Peaks برای resize
                  const view = peaksInstanceRef.current.views.getView('overview')
                  if (view) {
                    view.fitToContainer()
                  }
                }
              } catch {
                // fallback به تنظیم manual
                const canvases = container.querySelectorAll('canvas')
                const containerHeight = container.offsetHeight || 32
                
                canvases.forEach((canvas) => {
                  canvas.style.position = 'absolute'
                  canvas.style.top = '0'
                  canvas.style.left = '0'
                  canvas.style.width = '100%'
                  canvas.style.height = `${containerHeight}px`
                  canvas.style.maxWidth = '100%'
                  canvas.style.maxHeight = '100%'
                  canvas.style.objectFit = 'contain'
                })
              }
            }
            
            // تنظیم اولیه
            setTimeout(() => resizeWaveform(), 100)
            
            // Resize observer برای تغییرات سایز
            if (resizeObserverRef.current) {
              resizeObserverRef.current.disconnect()
            }
            
            resizeObserverRef.current = new ResizeObserver(() => {
              resizeWaveform()
            })
            resizeObserverRef.current.observe(container)
            
            queueMicrotask(() => {
              setIsLoading(false)
              setWaveformReady(true)
            })
          }
        })
      } catch (error) {
        console.error('[PeaksTimeline] Error loading audio:', error)
        initializingRef.current = false
        queueMicrotask(() => {
          setIsLoading(false)
          setWaveformReady(false)
        })
      }
    }

    queueMicrotask(() => setIsLoading(true))
    initPeaks()

    // Cleanup فقط در unmount
    return () => {
      // پاک کردن ResizeObserver
      if (resizeObserverRef.current) {
        try {
          resizeObserverRef.current.disconnect()
        } catch {
          // نادیده بگیر
        }
        resizeObserverRef.current = null
      }
      
      if (peaksInstanceRef.current) {
        try {
          peaksInstanceRef.current.destroy()
        } catch (e) {
          console.warn('[PeaksTimeline] Cleanup destroy error (ignored):', e)
        }
        peaksInstanceRef.current = null
      }
      
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close()
        } catch {
          // نادیده بگیر
        }
        audioContextRef.current = null
      }
      
      if (dummyAudioRef.current) {
        dummyAudioRef.current.pause()
        dummyAudioRef.current.src = ''
        dummyAudioRef.current = null
      }
      
      initializingRef.current = false
      setIsLoading(false)
      setWaveformReady(false)
    }
  }, [shouldLoad, audioSrc])

  // Update waveform progress - sync با audio element اصلی
  useEffect(() => {
    if (type === 'waveform' && peaksInstanceRef.current && waveformReady && audioElementRef.current) {
      const audioElement = audioElementRef.current
      const duration = audioElement.duration
      
      if (duration > 0) {
        const currentTime = (progress / 100) * duration
        // فقط seek در waveform، نه در audio
        try {
          peaksInstanceRef.current.player.seek(currentTime)
        } catch {
          // نادیده بگیر
        }
      }
    }
  }, [type, progress, waveformReady, audioElementRef])

  // Update linear progress bars
  useEffect(() => {
    if (type !== 'linear') return

    if (!isActive) {
      if (progressFillRef.current) progressFillRef.current.style.width = '0%'
      if (bufferedRef.current) bufferedRef.current.style.width = '0%'
      if (thumbRef.current) {
        thumbRef.current.style.left = 'calc(0% - 4px)'
        thumbRef.current.style.opacity = '0'
      }
      return
    }

    if (progressFillRef.current) progressFillRef.current.style.width = `${progress}%`
    if (bufferedRef.current) bufferedRef.current.style.width = `${bufferedProgress}%`
    if (thumbRef.current) {
      thumbRef.current.style.left = `calc(${progress}% - 4px)`
      // نمایش thumb همیشه وقتی player فعال است
      thumbRef.current.style.opacity = '1'
    }
  }, [type, progress, bufferedProgress, isActive])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isActive) return

      const target = type === 'linear' ? progressRef.current : wrapperRef.current
      if (!target) return

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

      const target = type === 'linear' ? progressRef.current : wrapperRef.current
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
      <div className={`flex-1 relative ${className}`}>
        {/* Wrapper برای container که React آن را مدیریت نمی‌کند */}
        <div
          ref={wrapperRef}
          onClick={handleClick}
          onTouchStart={handleTouch}
          onTouchMove={handleTouch}
          className={`w-full cursor-pointer relative overflow-hidden ${className || 'h-8 md:h-10'}`}
        >
          {/* Loading indicator */}
          {(isLoading || (!waveformReady && shouldLoad)) && (
            <div className="absolute inset-0 flex items-center justify-center bg-figma-gray-dark/50 rounded z-10 pointer-events-none">
              <div className="flex items-center gap-2 text-figma-gray text-xs">
                <i className="fa-light fa-spinner-third fa-spin" />
                <span className="hidden sm:inline">در حال بارگذاری موج صوتی ...</span>
                <span className="sm:hidden">بارگذاری ...</span>
              </div>
            </div>
          )}
          {/* Placeholder قبل از load */}
          {!shouldLoad && (
            <div className="absolute inset-0 bg-figma-gray-dark rounded flex items-center justify-center pointer-events-none">
              <i className="fa-light fa-waveform-lines text-figma-gray text-lg" />
            </div>
          )}
        </div>
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
        className="absolute top-1/2 -translate-y-1/2 size-2 md:size-2.5 bg-theme-white rounded-full transition-opacity"
        style={{ opacity: 0 }}
      />
    </div>
  )
}
