'use client'

import { useEffect, useRef } from 'react'
import type { VideoTrack } from '@/shared/contexts/VideoPlayerContext'
import { useVideoPlayer } from '@/shared/contexts/VideoPlayerContext'
import { useIntersectionObserver } from '@/shared/hooks/utility'

export interface InlineVideoPlayerProps {
  track: VideoTrack
  onClose?: () => void
}

/**
 * InlineVideoPlayer
 * پخش‌کننده inline که در جای تصویر نمایش داده می‌شود
 * ReactPlayer با Portal به اینجا منتقل می‌شود
 * وقتی از viewport خارج شود، به mini player منتقل می‌شود
 */
export function InlineVideoPlayer({ track }: InlineVideoPlayerProps) {
  const inlineContainerRef = useRef<HTMLDivElement>(null)
  const { setInlineInView } = useVideoPlayer()

  // تشخیص اینکه inline player در viewport هست یا نه
  const isInView = useIntersectionObserver(inlineContainerRef as React.RefObject<Element | null>, {
    threshold: 0.5,
    rootMargin: '0px',
  })

  // وقتی از viewport خارج شد، به context اطلاع بده
  useEffect(() => {
    setInlineInView(isInView)
  }, [isInView, setInlineInView])

  return (
    <div 
      ref={inlineContainerRef}
      id={`inline-video-container-${track.id}`}
      className="absolute inset-0 w-full h-full bg-theme-black rounded-[10px] overflow-hidden">
      {/* ReactPlayer با Portal به اینجا منتقل می‌شود */}
    </div>
  )
}
