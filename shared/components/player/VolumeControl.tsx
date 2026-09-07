'use client'

import { useCallback, useEffect, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import clsx from 'clsx'

interface VolumeControlProps {
  /** مقدار volume (0-1) */
  volume: number
  /** آیا صدا mute است */
  isMuted: boolean
  /** تابع تغییر volume */
  onVolumeChange: (volume: number) => void
  /** تابع toggle mute */
  onToggleMute: () => void
  /** کلاس اضافی */
  className?: string
  /** کلاس اضافی برای button */
  buttonClassName?: string
  /** رنگ آیکون (پیش‌فرض: theme-player-muted) */
  iconColor?: string
  /** رنگ آیکون در hover (پیش‌فرض: theme-white) */
  iconHoverColor?: string
  /** اندازه آیکون (پیش‌فرض: text-2xl) */
  iconSize?: string
  /** موقعیت slider نسبت به دکمه (پیش‌فرض: top) */
  side?: 'top' | 'bottom' | 'left' | 'right'
  /** نمایش slider به صورت عمودی (پیش‌فرض: true) */
  vertical?: boolean
}

/**
 * VolumeControl
 * کامپوننت مشترک برای کنترل صدا در پلیرهای صوتی و ویدیویی
 * با استفاده از Radix UI Popover برای positioning بهتر
 */
export function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  className = '',
  buttonClassName = '',
  iconColor = 'text-theme-player-muted',
  iconHoverColor = 'hover:text-theme-white',
  iconSize = 'text-2xl',
  side = 'top',
  vertical = true,
}: VolumeControlProps) {
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

  const handleVolumeChange = useCallback(
    (newVolume: number) => {
      onVolumeChange(newVolume)
    },
    [onVolumeChange]
  )

  const handleToggleMute = useCallback(() => {
    onToggleMute()
  }, [onToggleMute])

  return (
    <Popover.Root>
      <div className={`relative ${className}`}>
        <Popover.Trigger asChild>
          <button
            onClick={handleToggleMute}
            className={clsx('transition-colors', iconColor, iconHoverColor, buttonClassName)}
            title={isMuted || volume === 0 ? 'صدادار کردن' : 'بی‌صدا کردن'}
            aria-label={isMuted || volume === 0 ? 'صدادار کردن' : 'بی‌صدا کردن'}>
            <i
              className={clsx('fa-solid', iconSize, isMuted || volume === 0 ? 'fa-volume-xmark' : 'fa-volume')}
            />
          </button>
        </Popover.Trigger>
      </div>

      <Popover.Portal container={portalContainer}>
        <Popover.Content
          side={side}
          align="center"
          sideOffset={8}
          className={clsx(
            'bg-theme-player-bg border border-theme-player-border rounded-lg shadow-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            vertical ? 'p-2 h-32' : 'p-3'
          )}
          style={{ zIndex: 9999 }}>
          {vertical ? (
            <div className="h-full flex flex-col items-center justify-center">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="h-full w-1 bg-theme-player-progress rounded-full appearance-none cursor-pointer"
                style={{
                  writingMode: 'vertical-lr',
                  direction: 'rtl',
                }}
              />
            </div>
          ) : (
            <input
              dir="ltr"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-20 h-1 bg-theme-player-progress rounded-full appearance-none cursor-pointer"
            />
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
