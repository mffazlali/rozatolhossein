/**
 * VideoTrackList Component - روضة الحسین
 * لیست ویدیوهای جلسه با پلیر و دکمه دانلود
 *
 * ⚠️ تمام المان‌ها دقیقاً از Figma استخراج شده‌اند
 */

'use client'

import { useCallback, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import clsx from 'clsx'
import { PlaceholderImage } from '@/shared/components/general'
import { useVideoPlayer, type VideoTrack } from '@/shared/contexts'
import type { VideoItem } from '@/shared/types'
import { useSharedReactPlayer } from '@/shared'
import { InlineVideoPlayer } from '@/shared/components/player/video'

interface VideoTrackListProps {
  videos?: VideoItem[]
  skeleton?: boolean
  className?: string
  sessionId?: string
}

interface VideoTrackItemProps {
  video: VideoItem
  index: number
  sessionId?: string
}

/**
 * VideoTrackItemSkeleton
 * اسکلتون یک آیتم ویدیو - ریسپانسیو
 */
function VideoTrackItemSkeleton() {
  return (
    <div className="flex flex-col gap-3 md:gap-4 p-2 md:p-[15px]">
      {/* Video Player Skeleton */}
      <div className="w-full aspect-video bg-theme-gray-dark rounded-lg md:rounded-[10px] animate-pulse" />

      {/* Title + Download Skeleton */}
      <div className="flex items-center justify-between px-1">
        <div className="size-4 md:size-5 bg-theme-gray/20 animate-pulse rounded" />
        <div className="h-3 md:h-3.5 w-24 md:w-40 bg-theme-gray/20 animate-pulse rounded" />
      </div>
    </div>
  )
}

/**
 * VideoTrackItem
 * یک آیتم ویدیو با InlineVideoPlayer
 */
function VideoTrackItem({ video, index, sessionId }: VideoTrackItemProps) {
  const pathname = usePathname()
  const prevPathnameRef = useRef(pathname)
  const itemRef = useRef<HTMLDivElement>(null)
  
  // اضافه کردن data-video-id برای اسکرول
  const videoId = `video-${index}`
  const { currentTrack, inlinePlayerId, playInline, stopInline, closePlayer, setCurrentTrack, isVideoPlaying, isPlayerVisible } = useVideoPlayer()
  const { setPlayingByUser } = useSharedReactPlayer()

  // استفاده از sessionId به عنوان شناسه یکتا
  const uniqueId = sessionId ? `${sessionId}-video-${index}` : `video-${index}`

  // آیا این ویدیو در حالت inline پخش می‌شود
  const isInlineActive = inlinePlayerId === uniqueId && currentTrack?.id === uniqueId
  
  // آیا این ویدیو همان ویدیوی در حال پخش است؟
  const isCurrentTrack = currentTrack?.id === uniqueId && isPlayerVisible

  // اسکرول خودکار به ویدیوی در حال پخش
  useEffect(() => {
    if (currentTrack?.id === uniqueId && itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentTrack?.id, uniqueId])

  // وقتی به صفحه برمی‌گردیم و این ویدیو در حال پخش است، به inline سوییچ کن
  useEffect(() => {
    // اگر این ویدیو در حال پخش است اما در inline نیست، به inline سوییچ کن
    if (isPlayerVisible && currentTrack?.id === uniqueId && !inlinePlayerId && video.videoUrl) {
      const track: VideoTrack = {
        id: uniqueId,
        title: video.title,
        artist: video.category || '',
        image: video.image || '',
        duration: video.duration || '',
        videoSrc: video.videoUrl,
        href: pathname,
        isFromSession: !!sessionId,
        sessionId: sessionId,
      }
      
      // سوییچ به inline بدون تغییر activePlayer (چون قبلاً active است)
      playInline(track, false)
    }
  }, [isPlayerVisible, currentTrack?.id, uniqueId, inlinePlayerId, video.videoUrl, video.title, video.category, video.image, video.duration, pathname, playInline, sessionId])

  // وقتی صفحه عوض میشه، از حالت inline خارج شو
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname
      // اگر این ویدیو در حالت inline بود، از inline خارج شو (به mini بره)
      if (inlinePlayerId) {
        stopInline()
      }
    }
  }, [pathname, inlinePlayerId, stopInline])

  // Handle toggle play/pause
  const handleTogglePlay = useCallback(() => {
    if (!video.videoUrl) return

    if (!isPlayerVisible || !isCurrentTrack) {
      // اگر پلیر بسته است یا این ویدیو در حال پخش نیست، پلیر mini رو باز کن
      const track: VideoTrack = {
        id: uniqueId,
        title: video.title,
        artist: video.category || '',
        image: video.image || '',
        duration: video.duration || '',
        videoSrc: video.videoUrl,
        href: pathname,
        isFromSession: !!sessionId,
        sessionId: sessionId,
      }

      // اول inline player رو فعال کن و activePlayer رو تغییر بده
      playInline(track, true) // setActive = true
      // بعد currentTrack رو set کن برای playlist navigation
      setTimeout(() => {
        setCurrentTrack(track)
      }, 50)
    } else {
      // اگر پلیر باز است و این ویدیو در حال پخش است، toggle کن
      setPlayingByUser(!isVideoPlaying)
    }
  }, [video, pathname, uniqueId, isPlayerVisible, isCurrentTrack, isVideoPlaying, playInline, setCurrentTrack, setPlayingByUser, sessionId])

  // Handle close - close player completely
  const handleClose = useCallback(() => {
    closePlayer()
  }, [closePlayer])
  
  // تشخیص وضعیت دکمه: اگر این ویدیو در حال پخش است، pause نمایش بده
  const showPause = isCurrentTrack && isVideoPlaying

  // دانلود فایل ویدیویی
  const handleDownload = useCallback(async () => {
    if (!video.videoUrl) return

    try {
      const response = await fetch(video.videoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${video.title}.mp4`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch {
      // Fallback: باز کردن لینک مستقیم
      window.open(video.videoUrl, '_blank')
    }
  }, [video.videoUrl, video.title])

  return (
    <div ref={itemRef} data-video-id={videoId} className="flex flex-col gap-2 md:gap-4 p-2 md:p-[15px]">
      {/* Video Container با ارتفاع ثابت */}
      <div className="relative w-full aspect-video">
        <div className="relative w-full h-full rounded-lg md:rounded-[10px] overflow-hidden">
          {/* اگر ویدیو در حالت inline است، InlineVideoPlayer نمایش بده */}
          {video.videoUrl && isInlineActive && currentTrack ? (
            <InlineVideoPlayer track={currentTrack} onClose={handleClose} />
          ) : (
            <>
              {video.image ? (
                <Image src={video.image} alt={video.title} fill className="object-cover" />
              ) : (
                <PlaceholderImage className="w-full h-full" type="video" text={video.title} />
              )}
              
              {/* Play/Pause Button Overlay */}
              {video.videoUrl && (
                <button
                  onClick={handleTogglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-theme-black/10 hover:bg-theme-black/20 transition-colors cursor-pointer"
                  aria-label={showPause ? `توقف ${video.title}` : `پخش ${video.title}`}>
                  <div className="relative flex items-center justify-center">
                    {/* Mobile size */}
                    <div className="md:hidden">
                      <div className="absolute w-12 h-12 rounded-full bg-theme-gray/15 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
                      <div className="absolute w-10 h-10 rounded-full bg-theme-gray/60 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
                      <div className="relative flex items-center justify-center w-8 h-8 bg-theme-gray rounded-full">
                        <i className={clsx(
                          'fa-solid text-theme-black text-sm',
                          showPause ? 'fa-pause' : 'fa-play'
                        )} />
                      </div>
                    </div>
                    {/* Desktop size */}
                    <div className="hidden md:block">
                      <div className="absolute w-[60px] h-[60px] rounded-full bg-theme-gray/15 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
                      <div className="absolute w-[50px] h-[50px] rounded-full bg-theme-gray/60 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
                      <div className="relative flex items-center justify-center w-[40px] h-[40px] bg-theme-gray rounded-full">
                        <i className={clsx(
                          'fa-solid text-theme-black text-base',
                          showPause ? 'fa-pause' : 'fa-play'
                        )} />
                      </div>
                    </div>
                  </div>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Title + Download Row */}
      <div className="flex items-center justify-between px-1 md:px-[5px]">
        {/* Video Title - RTL aligned */}
        <p className="text-xs md:text-[13.5px] text-theme-white text-right leading-tight md:leading-[14px] line-clamp-1">
          {video.title}
        </p>

        {/* Download Button */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={!video.videoUrl}
          className="flex items-center justify-center size-4 md:size-5 text-theme-gray hover:text-theme-white transition-colors disabled:opacity-50"
          title="دانلود">
          <i className="fa-light fa-download text-xs md:text-sm" />
        </button>
      </div>
    </div>
  )
}

/**
 * VideoTrackList
 * لیست کامل ویدیوهای جلسه
 */
export function VideoTrackList({
  videos,
  skeleton = false,
  className = '',
  sessionId,
}: VideoTrackListProps) {
  const pathname = usePathname()
  const { setPlaylist } = useVideoPlayer()

  // تنظیم playlist وقتی videos تغییر می‌کند
  useEffect(() => {
    if (!videos || videos.length === 0) {
      return
    }

    const videoTracks: VideoTrack[] = videos.map((video, index) => ({
      id: sessionId ? `${sessionId}-video-${index}` : `video-${index}`,
      title: video.title,
      artist: video.category || '',
      image: video.image || '',
      duration: video.duration || '',
      videoSrc: video.videoUrl || '',
      href: pathname,
      isFromSession: !!sessionId,
      sessionId: sessionId,
    }))

    setPlaylist(videoTracks)
    // Note: عمداً cleanup نداریم تا playlist حفظ شود و auto-play کار کند
    // Note: pathname رو از dependency حذف کردیم تا با تغییر صفحه، playlist reset نشه
  }, [videos, setPlaylist, sessionId, pathname])

  // Skeleton State
  if (skeleton) {
    return (
      <div
        className={`bg-theme-black border border-theme-border rounded-lg md:rounded-[10px] p-2 md:p-4 ${className}`}>
        <div className="flex flex-wrap">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-full sm:w-full md:w-1/2">
              <VideoTrackItemSkeleton />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Empty State
  if (!videos || videos.length === 0) {
    return (
      <div
        className={`flex items-center justify-center min-h-[200px] md:min-h-[300px] bg-theme-black border border-theme-border rounded-lg md:rounded-[10px] ${className}`}>
        <p className="text-theme-gray text-xs md:text-sm">ویدیویی موجود نیست</p>
      </div>
    )
  }

  // Normal State - 3 ویدیو در هر سطر
  return (
    <div
      className={`bg-theme-black border border-theme-border rounded-lg md:rounded-[10px] p-2 md:p-4 ${className}`}>
      <div className="flex flex-wrap">
        {videos.map((video, index) => (
          <div key={index} className="w-full sm:w-full md:w-1/2">
            <VideoTrackItem video={video} index={index} sessionId={sessionId} />
          </div>
        ))}
      </div>
    </div>
  )
}
