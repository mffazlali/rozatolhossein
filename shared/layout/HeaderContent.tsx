'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useMemo } from 'react'
import { useNavbarMenu } from '@/shared/hooks/navigation/useNavbarMenu'
import type { NavMenuItem } from '@/shared/hooks/navigation/useNavbarMenu'
import {
  DesktopNav,
  type DesktopNavItem,
} from '@/shared/components/navigation/DesktopNav'
import type { NavItem } from '@/shared/types/menu'

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

// منوی پیش‌فرض (fallback)
const defaultNavItems: DesktopNavItem[] = [
  { id: 'home', title: 'صفحه اصلی', href: '/' },
  { id: 'audio', title: 'صوت ها', href: '/audio' },
  { id: 'video', title: 'ویدئو ها', href: '/video' },
  { id: 'session', title: 'جلسات', href: '/session' },
]

/**
 * HeaderContent Component - Client Component
 * کامپوننت محتوای هدر با استفاده از داده‌های fetch شده از سرور
 */
interface HeaderContentProps {
  menuData: NavItem[] | null
}

export function HeaderContent({ menuData }: HeaderContentProps) {
  // استفاده مستقیم از داده‌های دریافتی از سرور
  const apiMenuItems = menuData

  // تبدیل آیتم‌های API به فرمت DesktopNav
  const navItems = useMemo<DesktopNavItem[]>(() => {
    if (!apiMenuItems || apiMenuItems.length === 0) {
      return defaultNavItems
    }
    return apiMenuItems.map(mapToDesktopNavItem)
  }, [apiMenuItems])

  // تبدیل برای منوی موبایل
  const mobileMenuItems = useMemo<NavMenuItem[]>(() => {
    const items =
      apiMenuItems?.map(mapToNavMenuItem) ||
      defaultNavItems.map((item) => ({
        id: item.id,
        title: item.title,
        href: item.href,
      }))

    return items
  }, [apiMenuItems])

  // Use navbar menu hook for mobile
  const { openMenu, NavbarMenuComponent } = useNavbarMenu({
    showCloseButton: true,
    items: mobileMenuItems,
    placement: 'right',
    backgroundColor: 'bg-theme-black ',
    ariaLabel: 'منوی موبایل',
  })

  return (
    <header className="w-full bg-theme-black border-b border-theme-border transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          {/* Right Side - Logo & Navigation */}
          <div className="flex items-center gap-6">
            {/* Logo */}
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

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-0">
              <DesktopNav
                variant="header"
                items={navItems}
                gap="gap-0"
                itemClassName="px-3 py-2 text-base font-normal transition-colors text-theme-gray hover:text-theme-white"
              />
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={openMenu}
              className="text-theme-gray hover:text-theme-white p-2 transition-colors"
              aria-label="منوی موبایل">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6.03464 1.66406H4.4513C2.6263 1.66406 1.66797 2.6224 1.66797 4.43906V6.0224C1.66797 7.83906 2.6263 8.7974 4.44297 8.7974H6.0263C7.84297 8.7974 8.8013 7.83906 8.8013 6.0224V4.43906C8.80964 2.6224 7.8513 1.66406 6.03464 1.66406Z"
                  fill="currentColor"
                />
                <path
                  d="M15.5576 1.66406H13.9742C12.1576 1.66406 11.1992 2.6224 11.1992 4.43906V6.0224C11.1992 7.83906 12.1576 8.7974 13.9742 8.7974H15.5576C17.3742 8.7974 18.3326 7.83906 18.3326 6.0224V4.43906C18.3326 2.6224 17.3742 1.66406 15.5576 1.66406Z"
                  fill="currentColor"
                />
                <path
                  d="M15.5576 11.1953H13.9742C12.1576 11.1953 11.1992 12.1536 11.1992 13.9703V15.5536C11.1992 17.3703 12.1576 18.3286 13.9742 18.3286H15.5576C17.3742 18.3286 18.3326 17.3703 18.3326 15.5536V13.9703C18.3326 12.1536 17.3742 11.1953 15.5576 11.1953Z"
                  fill="currentColor"
                />
                <path
                  d="M6.03464 11.1953H4.4513C2.6263 11.1953 1.66797 12.1536 1.66797 13.9703V15.5536C1.66797 17.3786 2.6263 18.337 4.44297 18.337H6.0263C7.84297 18.337 8.8013 17.3786 8.8013 15.562V13.9786C8.80964 12.1536 7.8513 11.1953 6.03464 11.1953Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <NavbarMenuComponent />
    </header>
  )
}
