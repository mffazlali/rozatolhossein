'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PlaceholderImage } from '@/shared/components/general'
import { useAudioPlayer } from '@/shared/contexts/AudioPlayerContext'
import { AudioTrack, InlineAudioPlayer } from '@/shared'

/**
 * AudioPlayerCard Props
 */
interface AudioPlayerCardProps {
  id?: string
  title?: string
  artist?: string
  image?: string
  duration?: string
  downloadUrl?: string
  audioUrl?: string
  onPlay?: () => void
  skeleton?: boolean
}

/**
 * AudioPlayerCard Skeleton Component
 */
function AudioPlayerCardSkeleton() {
  return (
    <div className="relative w-full px-4 sm:px-0">
      <div className="bg-theme-black border border-theme-border rounded-[10px] backdrop-blur-[25px] p-3 sm:p-4">
        {/* Mobile Layout - Vertical */}
        <div className="flex flex-col sm:hidden gap-3">
          {/* Top Row: Image + Info */}
          <div className="flex items-center gap-3">
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-lg bg-theme-gray/20 animate-pulse shrink-0" />

            {/* Title and Artist */}
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <div className="h-4 w-3/4 bg-theme-gray/20 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-theme-gray/20 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Desktop Layout - Horizontal */}
        <div className="hidden sm:flex items-center justify-between gap-3">
          {/* Title and Artist */}
          <div className="flex flex-col w-full">
            <div className="flex flex-col gap-1 flex-1 min-w-0 h-8">
              <div className="h-5 w-48 bg-theme-gray/20 rounded animate-pulse" />
              <div className="h-4 w-32 bg-theme-gray/20 rounded animate-pulse" />
            </div>
          </div>

          <div className="flex gap-2">
            {/* Download and Duration */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="h-4 w-12 bg-theme-gray/20 rounded animate-pulse" />
              <div className="w-5 h-5 bg-theme-gray/20 rounded animate-pulse" />
            </div>
            {/* Image Skeleton */}
            <div className="w-[70px] h-[70px] rounded-lg bg-theme-gray/20 animate-pulse shrink-0" />
          </div>
        </div>

        {/* InlineAudioPlayer Skeleton - Shared */}
        <div className="w-full mt-3 sm:mt-2">
          <div className="relative flex items-center gap-1.5 md:gap-2 bg-theme-gray-dark rounded-lg md:rounded-[10px] h-8 md:h-10 px-2 md:px-2.5">
            {/* Current Time Skeleton */}
            <div className="w-[24px] md:w-[30px] h-2 md:h-2.5 bg-theme-white/20 animate-pulse rounded" />

            {/* Progress Bar Skeleton */}
            <div className="flex-1 h-2 md:h-2.5 relative">
              <div className="absolute inset-y-0 left-0 right-0 my-auto h-0.5 md:h-1 bg-theme-white/20 animate-pulse rounded-full" />
            </div>

            {/* Duration Skeleton */}
            <div className="w-[24px] md:w-[30px] h-2 md:h-2.5 bg-theme-white/20 animate-pulse rounded" />

            {/* Play Button Skeleton */}
            <div className="size-4 md:size-5 bg-theme-white/20 animate-pulse rounded-full shrink-0" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * AudioPlayerCard Component
 * کارت اصلی پخش صوت - ریسپانسیو مطابق طرح Figma
 * استفاده از useAudioPlayer برای پخش با FixedAudioPlayer
 *
 * @param skeleton - نمایش حالت اسکلتون
 */
export function AudioPlayerCard({
  id = '',
  title = '',
  artist = '',
  image,
  duration = '',
  downloadUrl,
  audioUrl,
  onPlay,
  skeleton = false,
}: AudioPlayerCardProps) {
  const pathname = usePathname()
  const prevPathnameRef = useRef(pathname)
  const { playInline, setPlaylist } = useAudioPlayer()

  // Track object برای این صوت - با useMemo برای جلوگیری از re-render
  const track: AudioTrack = useMemo(
    () => ({
      id: id || title,
      title,
      artist,
      image: image || '',
      duration,
      audioSrc: audioUrl || '',
      href: pathname,
      downloadUrl,
    }),
    [id, title, artist, image, duration, audioUrl, pathname, downloadUrl]
  )

  // وقتی صفحه عوض میشه، از حالت inline خارج شو
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname
    }
  }, [pathname])

  // Handle play - فعال‌سازی player و شروع پخش
  const handlePlay = useCallback(() => {
    if (!audioUrl) return
    // تنظیم playlist با یک عضو (همین صوت)
    setPlaylist([track])
    // فعال کردن inline player - playInline خودش currentTrack رو set می‌کنه
    // showPlayer = true, setActive = true
    // توجه: setPlaying در InlineAudioPlayer انجام می‌شود
    playInline(track, true, true)
    onPlay?.()
  }, [audioUrl, track, playInline, setPlaylist, onPlay])

  if (skeleton) {
    return <AudioPlayerCardSkeleton />
  }

  return (
    <div className="relative w-full px-4 sm:px-0">
      {/* Card with backdrop blur */}
      <div className="bg-theme-black border border-white/10 rounded-[10px] p-3 sm:p-4">
        {/* Mobile Layout - Vertical */}
        <div className="flex flex-col sm:hidden gap-3">
          {/* Top Row: Image + Info */}
          <div className="flex items-center gap-3">
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
              {image ? (
                <Image
                  src={image}
                  alt={title}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <PlaceholderImage
                  className="w-full h-full"
                  type="audio"
                  text={title}
                />
              )}
            </div>

            {/* Title and Artist */}
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <h1 className="text-theme-white text-sm font-normal leading-tight text-right truncate">
                {title}
              </h1>
              <p className="text-theme-gray text-xs leading-tight text-right truncate">
                {artist}
              </p>
            </div>

            {/* Duration and Download */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <span className="text-theme-gray text-xs font-light">
                {duration}
              </span>
              {downloadUrl && (
                <Link
                  href={downloadUrl}
                  className="flex items-center justify-center text-theme-gray hover:text-theme-white transition-colors"
                  aria-label="دانلود"
                  download>
                  <i className="fa-light fa-download text-base" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout - Horizontal (RTL: Play | Download+Duration | Title+Artist | Image) */}
        <div className="hidden sm:flex items-center justify-between gap-3">
          {/* Title and Artist */}
          <div className="flex flex-col w-full">
            <div className="flex flex-col gap-1 flex-1 min-w-0 h-8">
              <h1 className="text-theme-white text-lg font-normal leading-6 text-right truncate">
                {title}
              </h1>
              <p className="text-theme-gray text-sm font-light leading-4 text-right truncate">
                {artist}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {/* Download and Duration */}
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-theme-gray text-sm font-light leading-4 text-right min-w-[45px]">
                {duration}
              </span>
            </div>
            {/* Thumbnail Image */}
            <div className="w-[70px] h-[70px] rounded-lg overflow-hidden shrink-0">
              {image ? (
                <Image
                  src={image}
                  alt={title}
                  width={70}
                  height={70}
                  className="object-cover w-full h-full"
                />
              ) : (
                <PlaceholderImage
                  className="w-full h-full"
                  type="audio"
                  text={title}
                />
              )}
            </div>
          </div>
        </div>

        {/* InlineAudioPlayer - Shared for both Mobile and Desktop */}
        <div className="w-full mt-3 sm:mt-2">
          <InlineAudioPlayer track={track} onPlay={handlePlay} />
        </div>
      </div>
    </div>
  )
}
