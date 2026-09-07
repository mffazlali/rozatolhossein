'use client'

import { useCallback } from 'react'

interface UseVideoControlsProps {
  currentTime: number
  duration: number
  seek: (time: number) => void
}

/**
 * هوک کاستوم برای کنترل‌های ویدیو
 * شامل منطق‌های مشترک بین UnifiedVideoPlayer و CustomVideoControls
 */
export function useVideoControls({ currentTime, duration, seek }: UseVideoControlsProps) {
  /**
   * جهش 10 ثانیه به جلو
   */
  const handleSkipForward = useCallback(() => {
    if (duration === 0) return
    const newTime = Math.min(currentTime + 10, duration)
    seek(newTime)
  }, [currentTime, duration, seek])

  /**
   * جهش 10 ثانیه به عقب
   */
  const handleSkipBackward = useCallback(() => {
    if (duration === 0) return
    const newTime = Math.max(currentTime - 10, 0)
    seek(newTime)
  }, [currentTime, duration, seek])

  return {
    handleSkipForward,
    handleSkipBackward,
  }
}
