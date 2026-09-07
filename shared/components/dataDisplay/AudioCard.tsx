'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PlaceholderImage } from '@/shared/components/general'

/**
 * Audio Item Type
 */
interface AudioItem {
  id: string
  title: string
  category: string
  image: string
  href: string
  duration: string
}

/**
 * AudioCard Props
 */
export interface AudioCardProps {
  item?: AudioItem
  onPlay?: (id: string) => void
  isPlaying?: boolean
  isLoading?: boolean
  skeleton?: boolean
  /** اگر true باشد، دکمه پخش به لینک تبدیل می‌شود */
  linkMode?: boolean
}

/**
 * AudioCard Skeleton Component
 */
function AudioCardSkeleton() {
  return (
    <div className="bg-theme-black border border-theme-border rounded-[10px] px-[11px] py-px w-full">
      <div className="flex flex-col gap-[10px] items-center justify-end px-0 py-[10px] w-full">
        {/* Image Skeleton */}
        <div className="w-full aspect-square rounded-[8px] bg-theme-gray/20 animate-pulse" />

        {/* Controls and Info Skeleton */}
        <div className="flex gap-[5px] items-center w-full">
          {/* Info Skeleton */}
          <div className="flex flex-col gap-1 items-start flex-1 min-w-0">
            <div className="h-5 w-3/4 bg-theme-gray/20 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-theme-gray/20 rounded animate-pulse" />
          </div>

          {/* Play Button Skeleton */}
          <div className="w-10 h-10 rounded-full bg-theme-gray/20 animate-pulse shrink-0" />
        </div>
      </div>
    </div>
  )
}

/**
 * AudioCard Component
 * کارت نمایش صوت - قابل استفاده مجدد
 *
 * @param item - اطلاعات صوت
 * @param onPlay - تابع پخش صوت (اختیاری)
 * @param isPlaying - آیا این کارت در حال پخش است
 * @param isLoading - آیا در حال بارگذاری است
 * @param skeleton - حالت skeleton
 */
export function AudioCard({ item, onPlay, isPlaying = false, isLoading = false, skeleton = false, linkMode = false }: AudioCardProps) {
  if (skeleton || !item) {
    return <AudioCardSkeleton />
  }
  return (
    <div
      className={`bg-theme-black border rounded-[10px] px-[11px] py-px w-full transition-all ${
        isPlaying ? 'border-theme-white shadow-[0_0_12px_rgba(18,145,151,0.3)]' : 'border-theme-border'
      }`}
    >
      <div className="flex flex-col gap-[10px] items-center justify-end px-0 py-[10px] w-full">
        {/* Image */}
        <div className="w-full">
          <Link href={item.href}>
            <div className="relative w-full aspect-square rounded-[8px] overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              ) : (
                <PlaceholderImage
                  className="w-full h-full rounded-[8px]"
                  type="audio"
                  text={item.title}
                />
              )}
            </div>
          </Link>
        </div>

        {/* Controls and Info */}
        <div className="flex gap-[5px] items-center w-full">
          {/* Info */}
          <div className="flex flex-col gap-0 items-start flex-1 min-w-0">
            <div className="h-[22.41px] overflow-hidden w-full">
              <Link href={item.href}>
                <h3 className="text-theme-white font-bold text-[14px] leading-[22.4px] text-right hover:text-theme-gray-light transition-colors truncate">
                  {item.title}
                </h3>
              </Link>
            </div>
            <div className="flex flex-col items-start pb-px pt-[2px] px-0 w-full">
              <Link
                href={`/occasion/${item.category
                  .toLowerCase()
                  .replace(/\s+/g, '-')}`}>
                <p className="text-theme-gray text-[10.8px] leading-[15.4px] text-right hover:text-theme-gray-light transition-colors truncate">
                  {item.category}
                </p>
              </Link>
            </div>
          </div>

          {/* Play Button */}
          {linkMode ? (
            <Link
              href={item.href}
              className="flex items-center justify-center p-[12px] rounded-full transition-colors shrink-0 bg-theme-gray hover:bg-theme-gray/80"
              aria-label={`مشاهده ${item.title}`}>
              <i className="fa-light fa-play text-theme-black text-[15px]" />
            </Link>
          ) : (
            <button
              onClick={() => onPlay?.(item.id)}
              disabled={isLoading}
              className={`flex items-center justify-center p-[12px] rounded-full transition-colors shrink-0 ${
                isPlaying ? 'bg-theme-white hover:bg-theme-white' : 'bg-theme-gray hover:bg-theme-gray/80'
              } ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
              aria-label={isPlaying ? `توقف ${item.title}` : `پخش ${item.title}`}>
              {isLoading ? (
                <i className="fa-light fa-spinner-third fa-spin text-theme-black text-[15px]" />
              ) : (
                <i className={`fa-light ${isPlaying ? 'fa-pause' : 'fa-play'} text-theme-black text-[15px]`} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
