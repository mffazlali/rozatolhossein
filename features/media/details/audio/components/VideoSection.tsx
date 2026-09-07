'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PlaceholderImage } from '@/shared/components/general'
import { SectionHeader } from '@/shared/components/navigation'

/**
 * VideoSection Props
 */
interface VideoSectionProps {
  videoThumbnail?: string
  videoTitle?: string
  videoUrl?: string
  videoHref?: string
  skeleton?: boolean
}

/**
 * VideoSection Skeleton Component
 */
function VideoSectionSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header Skeleton */}
      <div className="flex items-center gap-2 w-full">
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 bg-theme-gray/20 rounded animate-pulse" />
          <div className="h-5 w-24 bg-theme-gray/20 rounded animate-pulse" />
        </div>
        <div className="flex-1 h-px bg-theme-gray/30" />
      </div>

      {/* Video Card */}
      <div className="bg-theme-black border border-theme-border rounded-[10px] p-5">
        <div className="flex flex-col gap-4">
          {/* Video Thumbnail Skeleton */}
          <div className="relative w-full aspect-video rounded-[10px] bg-theme-gray/20 animate-pulse" />
          {/* Button Skeleton */}
          <div className="h-12 w-full bg-theme-gray/20 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  )
}


/**
 * VideoSection Component
 * بخش ویدیو این صوت - مطابق طرح Figma
 */
export function VideoSection({
  videoThumbnail,
  videoTitle = 'ویدیو این صوت',
  videoUrl,
  videoHref,
  skeleton = false,
}: VideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(false)

  // Handle play/pause toggle
  const handlePlayPause = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
      setShowControls(true)
    }
  }

  // Handle video ended
  const handleVideoEnded = () => {
    setIsPlaying(false)
    setShowControls(false)
  }

  if (skeleton) {
    return <VideoSectionSkeleton />
  }

  // اگر ویدیویی وجود نداشت، چیزی نمایش نده
  if (!videoHref && !videoUrl) return null

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header with divider */}
      <SectionHeader
        title="ویدئو این صوت"
        icon={<i className="fa-light fa-clapperboard-play text-theme-white text-lg" />}
        className="px-0"
      />

      {/* Video Card */}
      <div className="bg-theme-black border border-theme-border rounded-[10px] p-5">
        <div className="flex flex-col gap-4">
          {/* Video Thumbnail with Play Button */}
          <div className="relative w-full aspect-video rounded-[10px] overflow-hidden">
            {videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  poster={videoThumbnail}
                  className="w-full h-full object-cover"
                  controls={showControls}
                  onEnded={handleVideoEnded}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  playsInline
                />
                {/* Play Button Overlay - Show when not playing */}
                {!isPlaying && (
                  <button
                    onClick={handlePlayPause}
                    className="absolute inset-0 flex items-center justify-center bg-theme-black/30 hover:bg-theme-black/40 transition-colors"
                    aria-label={`پخش ${videoTitle}`}>
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-[70px] h-[70px] rounded-full bg-theme-gray/15" />
                      <div className="absolute w-[60px] h-[60px] rounded-full bg-theme-gray/60" />
                      <div className="relative flex items-center justify-center w-[55px] h-[55px] bg-theme-gray rounded-full">
                        <i className="fa-solid fa-play text-theme-black text-xl" />
                      </div>
                    </div>
                  </button>
                )}
              </>
            ) : videoThumbnail ? (
              <Link href={videoHref || '#'} className="block w-full h-full">
                <Image
                  src={videoThumbnail}
                  alt={videoTitle}
                  fill
                  className="object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-[70px] h-[70px] rounded-full bg-theme-gray/15" />
                    <div className="absolute w-[60px] h-[60px] rounded-full bg-theme-gray/60" />
                    <div className="relative flex items-center justify-center w-[55px] h-[55px] bg-theme-gray rounded-full">
                      <i className="fa-solid fa-play text-theme-black text-xl" />
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <PlaceholderImage className="w-full h-full" type="video" text={videoTitle} />
            )}
          </div>

          {/* View and Download Button */}
          {videoHref && (
            <Link
              href={videoHref}
              className="flex items-center justify-center w-full py-4 bg-theme-gray rounded-md text-theme-black text-sm font-medium hover:bg-theme-gray/80 transition-colors">
              مشاهده و دانلود
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
