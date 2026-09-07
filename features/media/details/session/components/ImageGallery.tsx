/**
 * ImageGallery Component - روضة الحسین
 * گالری تصاویر جلسه با Fancybox
 */

'use client'

import Image from 'next/image'
import { ResponsiveGrid, ResponsiveGridItem, useFancybox } from '@/shared'

export interface GalleryImage {
  id: string
  src: string
  href: string
  alt?: string
}

interface ImageGalleryProps {
  images?: GalleryImage[]
  className?: string
  skeleton?: boolean
}

/**
 * GalleryItem Skeleton Component
 */
function GalleryItemSkeleton() {
  return (
    <div className="relative w-full h-[120px] sm:h-[150px] md:h-[178px]">
      <div className="w-full h-full rounded-lg sm:rounded-[10px] bg-theme-gray/20 animate-pulse" />
    </div>
  )
}

/**
 * ImageGallery Skeleton Component
 */
function ImageGallerySkeleton() {
  return (
    <div className="min-h-[400px] sm:min-h-[500px] md:min-h-[600px] bg-theme-black rounded-lg sm:rounded-[10px] border border-theme-border p-3 sm:p-4 md:p-5">
      <ResponsiveGrid type="image">
        {[...Array(12)].map((_, i) => (
          <ResponsiveGridItem key={i} type="image">
            <GalleryItemSkeleton />
          </ResponsiveGridItem>
        ))}
      </ResponsiveGrid>
    </div>
  )
}

const GalleryItem = ({ image }: { image: GalleryImage }) => {
  return (
    <div className="relative w-full h-[120px] sm:h-[150px] md:h-[178px]">
      <a
        href={image.href}
        data-fancybox="gallery"
        data-caption={image.alt || 'تصویر جلسه'}
        className="block w-full h-full rounded-lg sm:rounded-[10px] overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
      >
        <div className="relative w-full h-full">
          <Image
            src={image.src}
            alt={image.alt || 'تصویر جلسه'}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 25vw"
          />
        </div>
      </a>
    </div>
  )
}

export const ImageGallery = ({ images, className = '', skeleton = false }: ImageGalleryProps) => {
  const containerRef = useFancybox<HTMLDivElement>({
    selector: '[data-fancybox="gallery"]',
    dependencies: [images],
  })

  if (skeleton) {
    return <ImageGallerySkeleton />
  }

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center bg-theme-black rounded-lg sm:rounded-[10px] border border-theme-border p-3 sm:p-4 md:p-5">
        <p className="text-theme-gray text-sm sm:text-base">تصویری یافت نشد</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`bg-theme-black rounded-lg sm:rounded-[10px] border border-theme-border p-3 sm:p-4 md:p-5 ${className}`}
    >
      <ResponsiveGrid type="image">
        {images.map((image) => (
          <ResponsiveGridItem key={image.id} type="image">
            <GalleryItem image={image} />
          </ResponsiveGridItem>
        ))}
      </ResponsiveGrid>
    </div>
  )
}
