'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Carousel,
  type CarouselItem,
} from '@/shared/components/dataDisplay/Media/Carousel'
import {
  DesktopNav,
  type DesktopNavItem,
} from '@/shared/components/navigation/DesktopNav'
import {
  useNavbarMenu,
  type NavMenuItem,
} from '@/shared/hooks/navigation/useNavbarMenu'
import type { NavItem } from '@/shared/types/menu'
import type { HeroSlide } from '../index'
import clsx from 'clsx'

// منوی پیش‌فرض (fallback)
const defaultNavItems: DesktopNavItem[] = [
  { id: 'home', title: 'صفحه اصلی', href: '/' },
  { id: 'audio', title: 'صوت ها', href: '/audio' },
  { id: 'video', title: 'ویدئو ها', href: '/video' },
  { id: 'session', title: 'جلسات', href: '/session' },
]

/**
 * تبدیل NavItem از API به DesktopNavItem
 */
function mapToDesktopNavItem(item: NavItem): DesktopNavItem {
  return {
    id: item.id,
    title: item.title,
    href: item.href,
    children: item.children?.map(mapToDesktopNavItem),
  }
}

/**
 * تبدیل NavItem از API به NavMenuItem برای موبایل
 */
function mapToNavMenuItem(item: NavItem): NavMenuItem {
  return {
    id: item.id,
    title: item.title,
    href: item.href,
    children: item.children?.map(mapToNavMenuItem),
  }
}

interface HeroProps {
  className?: string
}

/**
 * Hero Slide Content Component
 */
function HeroSlideContent({ slide }: { slide: HeroSlide }) {
  return (
    <div className="relative w-full h-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Gradient Overlay - بالا */}
      <div className="absolute top-0 left-0 right-0 h-1/8 bg-linear-to-b from-theme-black/80 via-theme-black/40 to-transparent" />

      {/* Gradient Overlay - پایین - محو شدن کامل در پس‌زمینه */}
      <div className="absolute bottom-0 left-0 right-0 h-1/6 bg-gradient-to-t from-theme-gray-dark via-theme-black/60 to-transparent" />
      {/* Content - پایین راست (ریسپانسیو) - موقتا مخفی */}
      {/* TODO: فعال کردن متن و دکمه بعدا
      <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 lg:bottom-28 right-4 sm:right-8 md:right-12 lg:right-24 flex flex-col items-end gap-3 sm:gap-4 md:gap-5 max-w-[280px] sm:max-w-[320px] md:max-w-[350px]">
        <div className="flex flex-col items-end gap-1 sm:gap-2">
          <h2 className="text-theme-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-right leading-tight">
            {slide.title}
          </h2>
          {slide.subtitle && (
            <p className="text-theme-gray-light text-xs sm:text-sm md:text-base font-light text-right">
              {slide.subtitle}
            </p>
          )}
        </div>
        {slide.buttonText && (
          <Link
            href={slide.href}
            className="flex items-center gap-2 bg-theme-gray-light hover:bg-theme-white text-theme-black px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg backdrop-blur-sm transition-colors">
            <span className="text-xs sm:text-sm font-normal">
              {slide.buttonText}
            </span>
            <i className="fa-light fa-play text-xs sm:text-sm" />
          </Link>
        )}
      </div>
      */}
    </div>
  )
}

/**
 * Hero Navigation Component
 */
function HeroNavigation({
  onPrev,
  onNext,
  showNavigation,
}: {
  onPrev: () => void
  onNext: () => void
  showNavigation: boolean
}) {
  if (!showNavigation) return null

  return (
    <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 lg:bottom-28 left-4 sm:left-8 md:left-12 lg:left-24 flex items-center gap-2 z-10">
      {/* Previous Button */}
      <button
        onClick={onPrev}
        className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-theme-black/25 backdrop-blur-sm hover:bg-theme-black/40 transition-colors"
        aria-label="اسلاید قبلی">
        <i className="fa-light fa-chevron-right text-white text-base sm:text-lg" />
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-theme-black/25 backdrop-blur-sm hover:bg-theme-black/40 transition-colors"
        aria-label="اسلاید بعدی">
        <i className="fa-light fa-chevron-left text-white text-base sm:text-lg" />
      </button>
    </div>
  )
}

/**
 * Hero Navbar Component - نوار ناوبری روی اسلایدر
 * استفاده از DesktopNav و useNavbarMenu مثل Header.tsx
 * با قابلیت فیکس شدن در بالای صفحه هنگام اسکرول
 */
interface HeroNavbarProps {
  menuData: NavItem[] | null
}

function HeroNavbar({ menuData }: HeroNavbarProps) {
  const [isFixed, setIsFixed] = useState(false)

  // تشخیص اسکرول برای فیکس کردن navbar
  useEffect(() => {
    const handleScroll = () => {
      // وقتی اسکرول از ارتفاع hero بیشتر شد، navbar فیکس بشه
      const heroHeight = 300 // حداقل ارتفاع hero در موبایل
      setIsFixed(window.scrollY > heroHeight)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // تبدیل آیتم‌های API به فرمت DesktopNav
  const navItems = useMemo<DesktopNavItem[]>(() => {
    if (!menuData || menuData.length === 0) {
      return defaultNavItems
    }
    return menuData.map(mapToDesktopNavItem)
  }, [menuData])

  // تبدیل برای منوی موبایل
  const mobileMenuItems = useMemo<NavMenuItem[]>(() => {
    const items =
      menuData?.map(mapToNavMenuItem) ||
      defaultNavItems.map((item) => ({
        id: item.id,
        title: item.title,
        href: item.href,
      }))
    return items
  }, [menuData])

  // استفاده از useNavbarMenu برای منوی موبایل
  const { openMenu, NavbarMenuComponent } = useNavbarMenu({
    showCloseButton: true,
    items: mobileMenuItems,
    placement: 'right',
    backgroundColor: 'bg-theme-black',
    ariaLabel: 'منوی موبایل',
  })

  return (
    <>
      <nav
        className={clsx(
          'left-0 right-0 z-50 transition-all duration-300',
          isFixed
            ? 'fixed top-0 bg-theme-black/95 backdrop-blur-md shadow-lg'
            : 'absolute top-0 bg-transparent'
        )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[100px]">
          <div className="flex items-center md:justify-center justify-between md:gap-3 py-3 sm:py-4 md:py-5">
            {/* Logo / Brand - راست */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo-red.svg"
                alt="روضة الحسین"
                width={120}
                height={40}
                className="h-8 sm:h-10 w-auto"
                priority
              />
            </Link>

            {/* Navigation Links - وسط (Desktop) */}
            <div className="hidden md:flex items-center">
              <DesktopNav
                items={navItems}
                gap="gap-1"
                itemClassName={clsx(
                  'px-4 py-2 text-sm font-normal transition-colors rounded-lg hover:bg-theme-gray/10',
                  isFixed
                    ? 'text-theme-white'
                    : 'text-theme-white'
                )}
                dropdownClassName={clsx(
                  'px-4 py-2 text-sm font-normal transition-colors rounded-lg hover:bg-theme-gray/10',
                  isFixed
                    ? 'text-theme-white'
                    : 'text-theme-white'
                )}
                dropdownMenuClassName="bg-theme-black/90 backdrop-blur-sm text-theme-white rounded-lg shadow-lg min-w-[200px] border border-theme-border"
                dropdownItemClassName="hover:bg-theme-gray/10"
              />
            </div>

            {/* Actions - چپ */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={openMenu}
                className={clsx(
                  'md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors',
                  isFixed && 'bg-theme-white/10! hover:bg-theme-white/20!'
                )}
                aria-label="منو">
                <i
                  className={clsx(
                    'fa-light fa-bars text-white text-lg',
                    isFixed && ' text-theme-white! hover:text-theme-white!'
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <NavbarMenuComponent />
    </>
  )
}

/**
 * HomeHeroSkeleton Component
 * اسکلتون بخش Hero صفحه اصلی
 */
export function HomeHeroSkeleton() {
  return (
    <section className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] w-full overflow-hidden bg-figma-gray-dark animate-pulse">
      {/* Navbar Skeleton */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[100px]">
          <div className="flex items-center md:justify-center justify-between md:gap-3 py-3 sm:py-4 md:py-5">
            {/* Logo Skeleton */}
            <div className="h-8 sm:h-10 w-[120px] bg-figma-gray/30 rounded" />

            {/* Navigation Links Skeleton (Desktop) */}
            <div className="hidden md:flex items-center gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-24 bg-figma-gray/30 rounded-lg" />
              ))}
            </div>

            {/* Mobile Menu Button Skeleton */}
            <div className="md:hidden w-10 h-10 bg-figma-gray/30 rounded-lg" />
          </div>
        </div>
      </nav>

      {/* Slide Content Skeleton */}
      <div className="absolute inset-0 bg-figma-gray-dark" />

      {/* Navigation Buttons Skeleton */}
      <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 lg:bottom-28 left-4 sm:left-8 md:left-12 lg:left-24 flex items-center gap-2 z-10">
        <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-figma-gray/30" />
        <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-figma-gray/30" />
      </div>
    </section>
  )
}

/**
 * Home Hero Section Component
 * بخش هیرو صفحه اصلی با اسلایدر و نوار ناوبری - مطابق طرح فیگما
 * استفاده از داده‌های واقعی API
 */
interface HomeHeroProps extends HeroProps {
  menuData: NavItem[] | null
  slides: HeroSlide[]
}

export function HomeHero({ className, menuData, slides }: HomeHeroProps) {
  // تبدیل slides به CarouselItem
  const carouselItems: CarouselItem[] = useMemo(
    () =>
      slides.map((slide) => ({
        id: slide.id,
        content: <HeroSlideContent slide={slide} />,
      })),
    [slides]
  )

  // فقط وقتی بیش از یک آیتم داریم دکمه‌های ناوبری نمایش داده بشه
  const showNavigation = carouselItems.length > 1

  return (
    <section
      className={`relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] w-full overflow-hidden ${
        className || ''
      }`}>
      {/* Navbar روی اسلایدر */}
      <HeroNavbar menuData={menuData} />

      {/* Carousel */}
      <Carousel
        items={carouselItems}
        slidesPerView={1}
        spaceBetween={0}
        loop={showNavigation}
        autoplay={showNavigation ? { delay: 5000, disableOnInteraction: false } : false}
        pagination={false}
        customNavigation={showNavigation}
        renderNavigation={showNavigation ? ({ onPrev, onNext }) => (
          <HeroNavigation
            onPrev={onPrev}
            onNext={onNext}
            showNavigation={showNavigation}
          />
        ) : undefined}
        className="h-full"
        slideClassName="h-full"
      />
    </section>
  )
}
