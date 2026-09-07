'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { PlaceholderImage } from '@/shared/components/general'
import { useVideoPlayer, type VideoTrack } from '@/shared/contexts'
import { useSharedReactPlayer } from '@/shared'
import { InlineVideoPlayer } from '@/shared/components/player/video'

/**
 * VideoPlayerCard Props
 */
interface VideoPlayerCardProps {
  title?: string
  speaker?: string
  image?: string
  videoUrl?: string
  downloadUrl?: string
  videoId?: string
  skeleton?: boolean
}

/**
 * VideoPlayerCard Skeleton Component
 */
function VideoPlayerCardSkeleton() {
  return (
    <div className="relative w-full px-4 sm:px-0">
      <div className="bg-theme-black border border-theme-border rounded-[10px] backdrop-blur-[25px] p-3 sm:p-5">
        {/* Mobile Layout */}
        <div className="flex flex-col sm:hidden gap-4">
          <div className="w-full aspect-video rounded-[10px] bg-theme-gray/20 animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="w-20 h-9 rounded-md bg-theme-gray/20 animate-pulse shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-4 w-3/4 bg-theme-gray/20 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-theme-gray/20 rounded animate-pulse" />
            </div>
          </div>
        </div>
        {/* Desktop Layout */}
        <div className="hidden sm:flex flex-col gap-4">
          <div className="relative w-full aspect-video rounded-[10px] bg-theme-gray/20 animate-pulse" />
          <div className="flex items-center gap-[10px]">
            <div className="w-[60px] h-[60px] rounded-full bg-theme-gray/20 animate-pulse shrink-0" />
            <div className="flex flex-col items-start gap-[10px] flex-1">
              <div className="h-5 w-48 bg-theme-gray/20 rounded animate-pulse" />
              <div className="h-4 w-32 bg-theme-gray/20 rounded animate-pulse" />
            </div>
            <div className="w-24 h-10 rounded-md bg-theme-gray/20 animate-pulse shrink-0" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * VideoPlayerCard Component
 * کارت اصلی پخش ویدیو - با کلیک روی تصویر، ویدیو در همان مکان پخش می‌شود
 * با اسکرول صفحه، پخش‌کننده به حالت mini/fixed تبدیل می‌شود (مثل یوتیوب)
 * با تغییر صفحه، پخش‌کننده به حالت mini میره
 */
export function VideoPlayerCard({
  title = '',
  speaker = '',
  image,
  videoUrl,
  downloadUrl,
  videoId,
  skeleton = false,
}: VideoPlayerCardProps) {
  const pathname = usePathname()
  const prevPathnameRef = useRef(pathname)
  const { currentTrack, inlinePlayerId, playInline, stopInline, closePlayer, setPlaylist, isVideoPlaying, isPlayerVisible } = useVideoPlayer()
  const { setPlayingByUser } = useSharedReactPlayer()

  // آیا این ویدیو در حالت inline پخش می‌شود
  const isInlineActive = inlinePlayerId === videoId && currentTrack?.id === videoId
  
  // آیا این ویدیو همان ویدیوی در حال پخش است؟
  const isCurrentTrack = currentTrack?.id === videoId && isPlayerVisible

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

  // وقتی به صفحه برمی‌گردیم و این ویدیو در حال پخش است، به inline سوییچ کن
  useEffect(() => {
    // اگر این ویدیو در حال پخش است اما در inline نیست، به inline سوییچ کن
    if (isPlayerVisible && currentTrack?.id === videoId && !inlinePlayerId && videoUrl && videoId) {
      const track: VideoTrack = {
        id: videoId,
        title,
        artist: speaker,
        image: image || '',
        duration: '',
        videoSrc: videoUrl,
        href: pathname,
      }
      
      // سوییچ به inline بدون تغییر activePlayer (چون قبلاً active است)
      playInline(track, false)
    }
  }, [isPlayerVisible, currentTrack?.id, videoId, inlinePlayerId, videoUrl, title, speaker, image, pathname, playInline])

  // Handle toggle play/pause
  const handleTogglePlay = () => {
    if (!videoUrl || !videoId) return

    if (!isPlayerVisible || !isCurrentTrack) {
      // اگر پلیر بسته است یا این ویدیو در حال پخش نیست، پلیر inline رو باز کن
      const track: VideoTrack = {
        id: videoId,
        title,
        artist: speaker,
        image: image || '',
        duration: '',
        videoSrc: videoUrl,
        href: pathname,
      }

      setPlaylist([track])
      playInline(track, true)
    } else {
      // اگر پلیر باز است و این ویدیو در حال پخش است، toggle کن
      setPlayingByUser(!isVideoPlaying)
    }
  }

  // Handle close - close player completely
  const handleClose = () => {
    closePlayer()
  }
  
  // تشخیص وضعیت دکمه: اگر این ویدیو در حال پخش است، pause نمایش بده
  const showPause = isCurrentTrack && isVideoPlaying

  if (skeleton) {
    return <VideoPlayerCardSkeleton />
  }

  return (
    <div className="relative w-full px-4 sm:px-0">
      <div className="bg-theme-black border border-theme-border rounded-[10px] backdrop-blur-[25px] p-3 sm:p-5">
        {/* Video Player or Thumbnail */}
        <div className="relative w-full aspect-video rounded-[10px] overflow-hidden">
          {/* اگر ویدیو در حالت inline است، InlineVideoPlayer نمایش بده */}
          {videoUrl && isInlineActive && currentTrack ? (
            <InlineVideoPlayer track={currentTrack} onClose={handleClose} />
          ) : (
            <>
              {/* Thumbnail */}
              {image ? (
                <Image src={image} alt={title} fill className="object-cover" priority />
              ) : (
                <PlaceholderImage className="w-full h-full" type="video" text={title} />
              )}
              
              {/* Play/Pause Button Overlay */}
              {videoUrl && (
                <button
                  onClick={handleTogglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-theme-black/10 hover:bg-theme-black/20 transition-colors cursor-pointer"
                  aria-label={showPause ? `توقف ${title}` : `پخش ${title}`}>
                  <div className="relative flex items-center justify-center">
                    {/* Mobile size */}
                    <div className="sm:hidden">
                      <div className="absolute w-16 h-16 rounded-full bg-theme-gray/15 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
                      <div className="absolute w-14 h-14 rounded-full bg-theme-gray/60 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
                      <div className="relative flex items-center justify-center w-12 h-12 bg-theme-gray rounded-full">
                        <i className={clsx(
                          'fa-solid text-theme-black text-lg',
                          showPause ? 'fa-pause' : 'fa-play'
                        )} />
                      </div>
                    </div>
                    {/* Desktop size */}
                    <div className="hidden sm:block">
                      <div className="absolute w-[80px] h-[80px] rounded-full bg-theme-gray/15 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
                      <div className="absolute w-[70px] h-[70px] rounded-full bg-theme-gray/60 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
                      <div className="relative flex items-center justify-center w-[60px] h-[60px] bg-theme-gray rounded-full">
                        <i className={clsx(
                          'fa-solid text-theme-black text-xl',
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

        {/* Mobile Info Row */}
        <div className="flex sm:hidden items-center gap-[5px] mt-4">
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <h1 className="text-theme-white text-sm font-medium leading-tight text-right truncate">{title}</h1>
            <p className="text-theme-gray text-xs leading-tight text-right truncate">{speaker}</p>
          </div>
          {downloadUrl && (
            <Link
              href={downloadUrl}
              className="flex items-center justify-center gap-[5px] bg-theme-gray px-4 py-2 rounded-md hover:bg-theme-gray/80 transition-colors shrink-0"
              aria-label="دانلود"
              download>
              <span className="text-theme-black text-sm font-medium leading-[14px]">دانلود</span>
              <i className="fa-light fa-file-arrow-down text-theme-black text-sm" />
            </Link>
          )}
        </div>

        {/* Desktop Info Row */}
        <div className="hidden sm:flex items-center gap-[5px] mt-4">
          <div className="flex flex-col items-end gap-[5px] flex-1">
            <h1 className="text-theme-white text-[19.4px] font-medium leading-5 text-right w-full">{title}</h1>
            <p className="text-theme-gray text-[15.6px] leading-4 text-right w-full">{speaker}</p>
          </div>
          {downloadUrl && (
            <Link
              href={downloadUrl}
              className="flex items-center justify-center gap-[5px] bg-theme-gray px-5 py-3 rounded-md hover:bg-theme-gray/80 transition-colors shrink-0"
              aria-label="دانلود"
              download>
              <span className="text-theme-black text-sm font-medium leading-[14px]">دانلود</span>
              <i className="fa-light fa-file-arrow-down text-theme-black text-sm" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
