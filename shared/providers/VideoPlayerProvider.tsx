'use client'

import { VideoPlayerProvider as VideoPlayerContext } from '@/shared/contexts/VideoPlayerContext'

interface VideoPlayerProviderProps {
  children: React.ReactNode
}

/**
 * VideoPlayerProvider
 * ارائه‌دهنده context برای پخش‌کننده ویدیو
 * UnifiedVideoPlayer در SharedReactPlayerProvider render می‌شود
 */
export function VideoPlayerProvider({ children }: VideoPlayerProviderProps) {
  return (
    <VideoPlayerContext>
      {children}
    </VideoPlayerContext>
  )
}
