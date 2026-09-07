'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PlaceholderImage } from '@/shared/components/general'

/**
 * Session Item Type
 */
interface SessionItem {
  id: string
  title: string
  date: string
  image: string
  href: string
}

/**
 * SessionCard Props
 */
interface SessionCardProps {
  item?: SessionItem
  skeleton?: boolean
}

/**
 * SessionCard Skeleton Component
 * اسکلتون کارت جلسه
 */
function SessionCardSkeleton() {
  return (
    <div className="w-full">
      <div className="border border-theme-white/10 rounded-[10px] overflow-hidden relative p-px">
        {/* Image Skeleton */}
        <div className="relative w-full h-[245.23px] bg-theme-gray/20 animate-pulse" />

        {/* Content Skeleton */}
        <div className="relative bg-theme-black w-full">
          <div className="flex flex-col items-start px-[10px] py-0">
            <div className="flex flex-col gap-0 items-start pb-[11px] pt-0 px-0 w-full">
              <div className="flex flex-col items-start -mb-px">
                <div className="flex items-start justify-end px-0 py-[4.5px]">
                  <div className="h-[14px] w-32 bg-theme-gray/30 rounded animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col items-start -mb-px pb-[4px] pt-[5px]">
                <div className="h-[12px] w-20 bg-theme-gray/30 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * SessionCard Component
 * کارت نمایش جلسه - قابل استفاده مجدد
 *
 * @param item - اطلاعات جلسه
 * @param skeleton - حالت skeleton
 */
export function SessionCard({ item, skeleton = false }: SessionCardProps) {
  if (skeleton || !item) {
    return <SessionCardSkeleton />
  }
  return (
    <div className="w-full">
      <div className="border border-theme-white/10 rounded-[10px] overflow-hidden relative p-px">
        {/* Background Image */}
        <div className="relative w-full">
          <Link href={item.href}>
            <div className="relative w-full h-[245.23px]">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
              ) : (
                <PlaceholderImage
                  className="w-full h-full"
                  type="session"
                  text={item.title}
                />
              )}
              
              {/* Gradient Overlay - 1/3 پایین تصویر */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-theme-black/80 to-transparent pointer-events-none" />
            </div>
          </Link>
        </div>

        {/* Content */}
        <div className="relative w-full bg-theme-black">
          <div className="flex flex-col items-start px-[10px] py-0">
            <div className="flex flex-col gap-0 items-start pb-[11px] pt-0 px-0 w-full">
              <div className="flex flex-col items-start -mb-px">
                <div className="flex items-start justify-end px-0 py-[4.5px]">
                  <Link href={item.href}>
                    <h3 className="text-theme-white font-bold text-[13.3px] leading-[14px] text-right hover:text-theme-gray-light transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col items-start -mb-px pb-[4px] pt-[5px]">
                <span className="text-theme-gray text-[9px] leading-[12px] text-right">
                  {item.date}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
