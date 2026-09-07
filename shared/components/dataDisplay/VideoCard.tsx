'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PlaceholderImage } from '@/shared/components/general'
import type { VideoItem } from '@/shared/types'

/**
 * VideoCard Props
 */
export interface VideoCardProps {
  item?: VideoItem
  skeleton?: boolean
  onPlay?: (id: string) => void
  isLoading?: boolean
  /** اگر true باشد، دکمه پخش به لینک تبدیل می‌شود */
  linkMode?: boolean
}

/**
 * VideoCard Skeleton Component
 */
function VideoCardSkeleton() {
  return (
    <div className="bg-theme-black border border-theme-border rounded-[10px] px-[11px] py-2 w-full">
      <div className="flex flex-col gap-[10px] items-center">
        {/* Video Thumbnail Skeleton */}
        <div className="w-full aspect-video rounded-[8px] bg-theme-gray/20 animate-pulse" />

        {/* Video Info Skeleton */}
        <div className="flex flex-col gap-[2px] items-start w-full">
          <div className="h-5 w-3/4 bg-theme-gray/20 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-theme-gray/20 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

/**
 * VideoCard Component
 * کارت نمایش ویدیو - قابل استفاده مجدد
 *
 * @param item - اطلاعات ویدیو
 * @param skeleton - حالت skeleton
 * @param onPlay - callback برای پخش ویدیو
 * @param isLoading - حالت loading
 */
export function VideoCard({ item, skeleton = false, onPlay, isLoading = false, linkMode = false }: VideoCardProps) {
  if (skeleton || !item) {
    return <VideoCardSkeleton />
  }

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onPlay?.(item.id)
  }

  return (
    <div className="bg-theme-black border border-theme-border rounded-[10px] px-[11px] py-2 hover:border-theme-white/20 transition-colors w-full">
      <div className="flex flex-col gap-[10px] items-center">
        {/* Video Thumbnail */}
        <div className="w-full relative block">
          <div className="relative w-full aspect-video rounded-[8px] overflow-hidden">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <PlaceholderImage
                className="w-full h-full rounded-[8px]"
                type="video"
                text={item.title}
              />
            )}

            {/* Play Overlay */}
            {linkMode ? (
              <Link
                href={item.href}
                className="absolute inset-0 flex items-center justify-center"
                aria-label={`مشاهده ${item.title}`}
              >
                <div className="flex items-center justify-center w-[50px] h-[50px] hover:opacity-90 transition-opacity">
                  <svg
                    width="50"
                    height="64"
                    viewBox="0 0 50 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <rect y="0.5" width="50" height="50" rx="25" fill="#121212" />
                    <rect width="50" height="50" rx="25" fill="#181818" />
                    <path
                      d="M29.5757 22.9997L19.6673 28.9747C19.084 29.3247 18.334 28.908 18.334 28.2247V21.558C18.334 18.6497 21.4757 16.833 24.0007 18.283L27.8257 20.483L29.5673 21.483C30.1423 21.8247 30.1507 22.658 29.5757 22.9997Z"
                      fill="white"
                    />
                    <path
                      d="M30.074 27.8858L26.699 29.8358L23.3324 31.7775C22.124 32.4691 20.7574 32.3275 19.7657 31.6275C19.2824 31.2941 19.3407 30.5525 19.849 30.2525L30.4407 23.9025C30.9407 23.6025 31.599 23.8858 31.6907 24.4608C31.899 25.7525 31.3657 27.1441 30.074 27.8858Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </Link>
            ) : (
              <button
                onClick={handlePlayClick}
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                aria-label={`پخش ${item.title}`}
              >
                <div className="flex items-center justify-center w-[50px] h-[50px] hover:opacity-90 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="64" fill="none" viewBox="0 0 50 64"><rect width="50" height="50" y=".5" fill="#121212" rx="25"/><rect width="50" height="50" fill="#181818" rx="25"/><path fill="#fff" d="m29.576 23-9.909 5.975a.88.88 0 0 1-1.333-.75v-6.667c0-2.908 3.142-4.725 5.667-3.275l3.825 2.2 1.741 1c.575.342.584 1.175.009 1.517m.498 4.886-3.375 1.95-3.367 1.942a3.3 3.3 0 0 1-3.566-.15c-.484-.334-.425-1.076.083-1.375l10.592-6.35c.5-.3 1.158-.017 1.25.558.208 1.292-.325 2.683-1.617 3.425"/></svg>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Video Info */}
        <div className="flex flex-col gap-[2px] items-end w-full">
          <div className="w-full overflow-hidden">
            <Link href={item.href}>
              <h3 className="text-theme-white font-extrabold text-sm leading-tight text-right truncate hover:text-theme-gray-light transition-colors">
                {item.title}
              </h3>
            </Link>
          </div>
          <div className="flex items-end w-full">
            <Link
              href={`/occasion/${item.category
                .toLowerCase()
                .replace(/\s+/g, '-')}`}>
              <p className="text-theme-gray text-xs leading-tight text-right hover:text-theme-gray-light transition-colors">
                {item.category}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
