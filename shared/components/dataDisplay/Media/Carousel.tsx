"use client"

import React, { ReactNode, useCallback, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation, Autoplay } from "swiper/modules"
import type { SwiperOptions, Swiper as SwiperType } from "swiper/types"

import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

export interface CarouselItem {
  id: string
  content: ReactNode
}

export interface CarouselProps {
  items: CarouselItem[]
  slidesPerView?: number
  spaceBetween?: number
  pagination?: boolean
  navigation?: boolean
  autoplay?: boolean | { delay: number; disableOnInteraction?: boolean }
  loop?: boolean
  dir?: "rtl" | "ltr"
  breakpoints?: SwiperOptions["breakpoints"]
  className?: string
  slideClassName?: string
  paginationClassName?: string
  paginationBulletClassName?: string
  paginationBulletActiveClassName?: string
  onSlideChange?: (index: number) => void
  customPagination?: boolean
  customNavigation?: boolean
  renderNavigation?: (props: { onPrev: () => void; onNext: () => void }) => ReactNode
}

export const Carousel: React.FC<CarouselProps> = ({
  items,
  slidesPerView = 1,
  spaceBetween = 0,
  pagination = true,
  navigation = false,
  autoplay = false,
  loop = false,
  dir = "rtl",
  breakpoints,
  className = "",
  slideClassName = "",
  paginationClassName = "",
  paginationBulletClassName = "",
  paginationBulletActiveClassName = "",
  onSlideChange,
  customPagination = false,
  customNavigation = false,
  renderNavigation,
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null)

  // اگر فقط یک آیتم داریم، loop و autoplay غیرفعال باشه
  const isSingleItem = items.length <= 1
  const effectiveLoop = isSingleItem ? false : loop
  const effectiveAutoplay = isSingleItem ? false : autoplay

  const modules = []
  if (pagination && !customPagination) modules.push(Pagination)
  if (navigation && !customNavigation) modules.push(Navigation)
  if (effectiveAutoplay) modules.push(Autoplay)

  const autoplayConfig = typeof effectiveAutoplay === "boolean" 
    ? (effectiveAutoplay ? { delay: 3000, disableOnInteraction: false } : false) 
    : effectiveAutoplay

  const handleSlideChange = (swiper: SwiperType) => {
    const realIndex = swiper.realIndex
    setActiveIndex(realIndex)
    onSlideChange?.(realIndex)
  }

  const goToSlide = useCallback((index: number) => {
    swiperInstance?.slideToLoop(index)
  }, [swiperInstance])

  const goToPrev = useCallback(() => {
    swiperInstance?.slidePrev()
  }, [swiperInstance])

  const goToNext = useCallback(() => {
    swiperInstance?.slideNext()
  }, [swiperInstance])

  return (
    <div className={`carousel-container relative ${className}`}>
      <Swiper
        modules={modules}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        pagination={
          pagination && !customPagination
            ? {
                clickable: true,
                el: `.${paginationClassName || "swiper-pagination"}`,
              }
            : false
        }
        navigation={navigation && !customNavigation && !isSingleItem}
        autoplay={autoplayConfig}
        loop={effectiveLoop}
        dir={dir}
        breakpoints={breakpoints}
        onSlideChange={handleSlideChange}
        onSwiper={setSwiperInstance}
        className='w-full h-full'
      >
        {items.map(item => (
          <SwiperSlide key={item.id} className={slideClassName}>
            {item.content}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Default Pagination */}
      {pagination && !customPagination && (
        <div className={paginationClassName || "swiper-pagination"} />
      )}

      {/* Custom Pagination */}
      {pagination && customPagination && (
        <div className={paginationClassName || "flex justify-center items-center gap-2.5 mt-4"}>
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`${paginationBulletClassName || "w-[5px] h-1.5 rounded-[5.5px] bg-black opacity-20 transition-all cursor-pointer"} ${
                index === activeIndex 
                  ? paginationBulletActiveClassName || "bg-theme-primary-teal opacity-100" 
                  : ""
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Custom Navigation - فقط وقتی بیش از یک آیتم داریم */}
      {customNavigation && renderNavigation && !isSingleItem && renderNavigation({ onPrev: goToPrev, onNext: goToNext })}
    </div>
  )
}
