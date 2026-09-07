'use client'

import { useCallback, useEffect, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import clsx from 'clsx'

interface PlaybackRateOption {
  rate: number
  label: string
  labelEn: string
}

interface PlaybackRateControlProps {
  /** سرعت فعلی پخش */
  playbackRate: number
  /** تابع تغییر سرعت پخش */
  onPlaybackRateChange: (rate: number) => void
  /** کلاس اضافی */
  className?: string
  /** کلاس اضافی برای button */
  buttonClassName?: string
  /** رنگ متن (پیش‌فرض: theme-white) */
  textColor?: string
  /** رنگ متن در hover (پیش‌فرض: theme-gray) */
  textHoverColor?: string
  /** اندازه متن (پیش‌فرض: text-sm) */
  textSize?: string
  /** موقعیت منو نسبت به دکمه (پیش‌فرض: top) */
  side?: 'top' | 'bottom' | 'left' | 'right'
  /** سرعت‌های قابل انتخاب */
  rates?: PlaybackRateOption[]
}

/**
 * PlaybackRateControl
 * کامپوننت مشترک برای کنترل سرعت پخش در پلیرهای صوتی و ویدیویی
 * با استفاده از Radix UI Popover برای positioning بهتر
 */
export function PlaybackRateControl({
  playbackRate,
  onPlaybackRateChange,
  className = '',
  buttonClassName = '',
  textColor = 'text-theme-white',
  textHoverColor = 'hover:text-theme-gray',
  textSize = 'text-sm',
  side = 'top',
  rates = [
    { rate: 0.5, label: 'آهسته', labelEn: 'Slow' },
    { rate: 1, label: 'عادی', labelEn: 'Normal' },
    { rate: 1.2, label: 'متوسط', labelEn: 'Medium' },
    { rate: 1.5, label: 'سریع', labelEn: 'Fast' },
    { rate: 1.7, label: 'خیلی سریع', labelEn: 'Very fast' },
    { rate: 2, label: 'فوق سریع', labelEn: 'Super fast' },
  ],
}: PlaybackRateControlProps) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(() => {
    // Initial state: check if we're in fullscreen
    if (typeof document !== 'undefined') {
      return document.fullscreenElement ? (document.fullscreenElement as HTMLElement) : document.body
    }
    return null
  })

  // گوش دادن به تغییرات fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenEl = document.fullscreenElement
      setPortalContainer(fullscreenEl ? (fullscreenEl as HTMLElement) : document.body)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const handleRateChange = useCallback(
    (rate: number) => {
      onPlaybackRateChange(rate)
    },
    [onPlaybackRateChange]
  )

  // فرمت نمایش سرعت (حذف .0 برای اعداد صحیح)
  const formatRate = (rate: number) => {
    return rate === Math.floor(rate) ? rate.toString() : rate.toString()
  }

  return (
    <Popover.Root>
      <div className={`relative ${className}`}>
        <Popover.Trigger asChild>
          <button
            className={clsx(
              'flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-theme-white/30 transition-colors',
              textColor,
              textHoverColor,
              'text-xs sm:text-sm font-medium',
              buttonClassName
            )}
            title="سرعت پخش"
            aria-label="سرعت پخش">
            {formatRate(playbackRate)}x
          </button>
        </Popover.Trigger>
      </div>

      <Popover.Portal container={portalContainer}>
        <Popover.Content
          side={side}
          align="center"
          sideOffset={8}
          className={clsx(
            'bg-theme-black/95 backdrop-blur-sm rounded-xl p-2 min-w-[200px] shadow-xl border border-theme-white/10',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
          )}
          style={{ zIndex: 9999 }}>
          <div className="flex flex-col gap-1">
            {rates.map(({ rate, label, labelEn }) => (
              <Popover.Close key={rate} asChild>
                <button
                  onClick={() => handleRateChange(rate)}
                  className={clsx(
                    'flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors',
                    playbackRate === rate
                      ? 'bg-theme-white/20 text-theme-white'
                      : 'text-theme-white/70 hover:bg-theme-white/10 hover:text-theme-white'
                  )}>
                  <span className="text-sm font-medium">{formatRate(rate)}x</span>
                  <span className="text-sm">{label}</span>
                  {playbackRate === rate && (
                    <i className="fa-light fa-check text-theme-white mr-2" />
                  )}
                </button>
              </Popover.Close>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
