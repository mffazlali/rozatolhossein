'use client'

import { AudioPlayerProvider as AudioPlayerContext } from '@/shared/contexts'

interface AudioPlayerProviderProps {
  children: React.ReactNode
}

/**
 * AudioPlayerProvider
 * ارائه‌دهنده context برای پخش‌کننده صوت
 * UnifiedReactPlayer در SharedReactPlayerProvider render می‌شود
 */
export function AudioPlayerProvider({ children }: AudioPlayerProviderProps) {
  return (
    <AudioPlayerContext>
      {children}
    </AudioPlayerContext>
  )
}
