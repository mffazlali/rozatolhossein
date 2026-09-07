'use client'

import { useCallback } from 'react'

interface UseAudioControlsProps {
  currentTime: number
  duration: number
  seek: (time: number) => void
  isActive?: boolean
}

/**
 * هوک کاستوم برای کنترل‌های صوتی
 * شامل منطق‌های مشترک بین UnifiedAudioPlayer و InlineAudioPlayer
 */
export function useAudioControls({ 
  currentTime, 
  duration, 
  seek, 
  isActive = true 
}: UseAudioControlsProps) {
  /**
   * جهش 10 ثانیه به جلو
   */
  const handleSkipForward = useCallback(() => {
    if (!isActive || duration === 0) return
    const newTime = Math.min(currentTime + 10, duration)
    seek(newTime)
  }, [isActive, currentTime, duration, seek])

  /**
   * جهش 10 ثانیه به عقب
   */
  const handleSkipBackward = useCallback(() => {
    if (!isActive || duration === 0) return
    const newTime = Math.max(currentTime - 10, 0)
    seek(newTime)
  }, [isActive, currentTime, duration, seek])

  return {
    handleSkipForward,
    handleSkipBackward,
  }
}
