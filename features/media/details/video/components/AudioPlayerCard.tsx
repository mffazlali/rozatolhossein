'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PlaceholderImage } from '@/shared/components/general'
import { SectionHeader } from '@/shared/components/navigation'
import { useAudioPlayer } from '@/shared/contexts/AudioPlayerContext'
import { AudioTrack } from '@/shared'

/**
 * Audio Player Item Type
 * نوع آیتم پخش‌کننده صوت
 */
export interface AudioPlayerItem {
  id: string
  title: string
  artist: string
  duration: string
  image: string
  audioUrl: string
  href: string
}

/**
 * AudioPlayerCard Props
 */
export interface AudioPlayerCardProps {
  item?: AudioPlayerItem
  onPlay?: (id: string) => void
  onDownload?: (audioUrl: string) => void
  isPlaying?: boolean
  className?: string
}

/**
 * AudioPlayerCard Skeleton Component
 * کامپوننت اسکلتون برای حالت بارگذاری
 */
function AudioPlayerCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header Skeleton */}
      <SectionHeader
        title="صوت این ویدئو"
        icon={
          <i className="fa-light fa-waveform-lines text-theme-gray text-xl" />
        }
      />

      {/* Card Skeleton */}
      <div className="bg-theme-black border border-white/10 rounded-[10px] px-4 py-4 w-full">
        <div className="flex items-center gap-3 w-full">
          {/* Play Button Skeleton */}
          <div className="w-10 h-10 rounded-full bg-theme-gray/20 animate-pulse shrink-0" />

          {/* Info Skeleton */}
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-5 w-3/4 bg-theme-gray/20 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-theme-gray/20 rounded animate-pulse" />
          </div>

          {/* Thumbnail Skeleton */}
          <div className="w-[70px] h-[70px] rounded-lg bg-theme-gray/20 animate-pulse shrink-0" />
        </div>
      </div>
    </div>
  )
}

/**
 * AudioPlayerCard Component
 * کامپوننت کارت پخش‌کننده صوت - صوت این ویدئو
 * استفاده از useAudioPlayer برای پخش با FixedAudioPlayer
 *
 * مطابق استانداردهای پروژه روضة الحسین
 * - Client Component با event handlers
 * - Responsive design (Mobile First)
 * - RTL support
 * - Pixel-perfect از Figma
 *
 * @param item - اطلاعات صوت
 * @param onPlay - تابع پخش صوت
 * @param onDownload - تابع دانلود صوت
 * @param isPlaying - وضعیت پخش
 * @param className - کلاس‌های اضافی
 */
export function AudioPlayerCard({
  item,
  onPlay,
  onDownload,
  isPlaying = false,
  className = '',
}: AudioPlayerCardProps) {
  const { playTrack, setPlaylist } = useAudioPlayer()

  // Convert AudioPlayerItem to AudioTrack format
  const convertToTrack = useCallback((audioItem: AudioPlayerItem): AudioTrack => ({
    id: audioItem.id,
    title: audioItem.title,
    artist: audioItem.artist,
    image: audioItem.image,
    duration: audioItem.duration,
    audioSrc: audioItem.audioUrl || `/media/audio.mp3`,
  }), [])

  // Handle play - uses AudioPlayer context
  const handlePlay = useCallback(() => {
    if (!item) return
    
    const track = convertToTrack(item)
    // Set single track as playlist
    setPlaylist([track])
    // Play the track
    playTrack(track)
    
    // Call original onPlay if provided
    onPlay?.(item.id)
  }, [item, convertToTrack, playTrack, setPlaylist, onPlay])

  const handleDownload = useCallback(() => {
    if (!item) return
    onDownload?.(item.audioUrl)
  }, [item, onDownload])

  // Early return for skeleton
  if (!item) {
    return <AudioPlayerCardSkeleton />
  }

  return (
    <div className={`flex flex-col gap-4 w-full px-2 sm:px-0 ${className}`}>
      {/* Header Section - استفاده از SectionHeader */}
      <SectionHeader
        title="صوت این ویدئو"
        icon={
          <i className="fa-light fa-waveform-lines text-theme-gray text-xl" />
        }
      />

      {/* Audio Player Card */}
      <div className="bg-theme-black border border-white/10 rounded-[10px] px-3 sm:px-4 py-3 sm:py-4 w-full">
        {/* Mobile Layout */}
        <div className="flex flex-col sm:hidden gap-3">
          {/* Top Row: Image + Info */}
          <div className="flex items-center gap-3">
            {/* Thumbnail Image */}
            <Link href={item.href} className="shrink-0">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                {item.image && item.image !== '' ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <PlaceholderImage
                    className="w-full h-full"
                    type="audio"
                    text={item.title}
                  />
                )}
              </div>
            </Link>

            {/* Title & Artist */}
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <Link href={item.href} className="block">
                <h3 className="text-theme-white text-sm font-normal leading-tight text-right truncate">
                  {item.title}
                </h3>
              </Link>
              <p className="text-theme-gray text-xs leading-tight text-right truncate">
                {item.artist}
              </p>
            </div>
          </div>

          {/* Bottom Row: Play + Duration/Download */}
          <div className="flex items-center justify-between">
            {/* Play Button */}
            <button
              onClick={handlePlay}
              className="bg-theme-gray flex items-center justify-center w-10 h-10 rounded-full hover:bg-theme-gray/80 transition-colors shrink-0"
              aria-label={
                isPlaying ? `توقف ${item.title}` : `پخش ${item.title}`
              }>
              <i
                className={`fa-solid ${
                  isPlaying ? 'fa-pause' : 'fa-play'
                } text-theme-black text-sm`}
              />
            </button>

            {/* Duration & Download */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                className="text-theme-gray hover:text-theme-white transition-colors"
                aria-label={`دانلود ${item.title}`}>
                <i className="fa-light fa-download text-lg" />
              </button>
              <span className="text-theme-gray text-sm font-light">
                {item.duration}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Layout - RTL: Play | Download+Duration | Title+Artist | Image */}
        <div className="hidden sm:flex items-center gap-3 w-full">
          {/* Thumbnail Image */}
          <Link href={item.href} className="shrink-0">
            <div className="relative w-[70px] h-[70px] rounded-lg overflow-hidden">
              {item.image && item.image !== '' ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="70px"
                />
              ) : (
                <PlaceholderImage
                  className="w-full h-full"
                  type="audio"
                  text={item.title}
                />
              )}
            </div>
          </Link>

          {/* Title & Artist */}
          <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden">
            <Link href={item.href} className="block">
              <h3 className="text-theme-white text-lg font-normal leading-6 text-right truncate">
                {item.title}
              </h3>
            </Link>
            <p className="text-theme-gray text-sm font-light leading-4 text-right truncate">
              {item.artist}
            </p>
          </div>

          {/* Duration & Download */}
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-theme-gray text-sm font-light leading-4 text-right min-w-[45px]">
              {item.duration}
            </span>
            <button
              onClick={handleDownload}
              className="text-theme-gray hover:text-theme-white transition-colors"
              aria-label={`دانلود ${item.title}`}>
              <i className="fa-light fa-download text-lg" />
            </button>
          </div>

          {/* Play Button */}
          <button
            onClick={handlePlay}
            className="bg-theme-gray flex items-center justify-center p-3 rounded-full hover:bg-theme-gray/80 transition-colors shrink-0"
            aria-label={isPlaying ? `توقف ${item.title}` : `پخش ${item.title}`}>
            <i
              className={`fa-solid ${
                isPlaying ? 'fa-pause' : 'fa-play'
              } text-theme-black text-sm`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
