'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@heroui/react'
import {
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
} from '@heroui/react'

/**
 * Desktop Navigation Item Type
 */
export interface DesktopNavItem {
  id: string
  title: string
  href: string
  children?: DesktopNavItem[]
}

/**
 * DesktopNav Props
 */
export interface DesktopNavProps {
  items: DesktopNavItem[]
  gap?: string
  itemClassName?: string
  dropdownClassName?: string
  dropdownMenuClassName?: string
  dropdownItemClassName?: string
  onItemClick?: (item: DesktopNavItem) => void
  // New props for Header NavBar styling
  variant?: 'default' | 'header'
  showBorders?: boolean
  containerClassName?: string
}

/**
 * DesktopNav Component
 *
 * کامپوننت منوی دسکتاپ قابل استفاده مجدد با پشتیبانی از dropdown
 *
 * @example
 * ```tsx
 * <DesktopNav
 *   items={[
 *     { id: 'home', title: 'خانه', href: '/' },
 *     {
 *       id: 'about',
 *       title: 'درباره ما',
 *       href: '/about',
 *       children: [
 *         { id: 'team', title: 'تیم ما', href: '/about/team' }
 *       ]
 *     }
 *   ]}
 * />
 * ```
 */
export const DesktopNav: React.FC<DesktopNavProps> = ({
  items,
  gap = 'gap-2 md:gap-7',
  itemClassName = 'text-theme-white font-vazirmatn text-sm md:text-base px-2 py-0 inline tracking-tight hover:bg-transparent hover:text-theme-gray-light',
  dropdownClassName = 'text-theme-white font-vazirmatn text-sm md:text-base px-2 py-0 hover:bg-theme-primary-teal/20 sm:hover:bg-transparent',
  dropdownMenuClassName = 'bg-theme-black text-theme-white rounded-lg shadow-lg min-w-[200px] border border-theme-border',
  dropdownItemClassName = 'hover:bg-theme-primary-teal/20!',
  onItemClick,
  variant = 'default',
  showBorders = false,
  containerClassName,
}) => {
  const handleItemClick = (item: DesktopNavItem) => {
    onItemClick?.(item)
  }

  // Header variant specific styles
  const headerItemClassName =
    'flex h-[24px] items-center justify-center px-[6px] sm:px-[8px] lg:px-[10px] text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-normal text-theme-gray hover:text-theme-white transition-colors'

  const getItemClassName = (index: number) => {
    if (variant === 'header') {
      return `${headerItemClassName} ${
        showBorders && index < items.length - 1
          ? 'border-l border-theme-gray-light'
          : ''
      }`
    }
    return itemClassName
  }

  const containerClasses =
    variant === 'header'
      ? `flex h-full items-center justify-start gap-0 ${
          containerClassName || ''
        }`
      : `hidden sm:flex items-center justify-center ${gap} whitespace-nowrap scrollbar-none select-none w-full`

  return (
    <div className={containerClasses}>
      {items.map((item, index) =>
        item.children && item.children.length > 0 ? (
          // Item with dropdown
          <div key={item.id}>
            {variant === 'header' ? (
              // Header variant with dropdown
              <Dropdown
                placement="bottom-end"
                classNames={{ content: 'p-0' }}
                shouldBlockScroll={false}>
                <DropdownTrigger>
                  <div
                    className={getItemClassName(index)}
                    style={{ cursor: 'pointer' }}>
                    <span className="text-right leading-[24px]">
                      {item.title}
                    </span>
                    <span className="ml-2 inline-block h-[4px] w-[8px] border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-theme-gray" />
                  </div>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label={`${item.title} زیرمنو`}
                  className="bg-theme-black text-theme-white rounded-lg shadow-lg min-w-[200px] border border-theme-border">
                  {item.children.map((child) => (
                    <DropdownItem
                      key={child.id}
                      className="text-theme-white">
                      <Link
                        href={child.href}
                        className="text-theme-white block w-full"
                        onClick={() => handleItemClick(child)}>
                        {child.title}
                      </Link>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            ) : (
              // Default variant with full dropdown
              <Dropdown
                placement="bottom-end"
                classNames={{ content: 'p-0' }}
                shouldBlockScroll={false}>
                <DropdownTrigger>
                  <Button variant="light" className={dropdownClassName}>
                    <span className="inline-flex items-center gap-1">
                      <span>{item.title}</span>
                      <i className="fa-light fa-angle-down text-xs" />
                    </span>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label={`${item.title} زیرمنو`}
                  className={dropdownMenuClassName}>
                  {item.children.map((child) => (
                    <DropdownItem
                      key={child.id}
                      className={dropdownItemClassName}>
                      <Link
                        href={child.href}
                        className="text-theme-white block w-full"
                        onClick={() => handleItemClick(child)}>
                        {child.title}
                      </Link>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
        ) : (
          // Simple link item
          <div key={item.id} dir={variant === 'header' ? 'rtl' : 'rtl'}>
            <Link
              href={item.href}
              className={getItemClassName(index)}
              onClick={() => handleItemClick(item)}>
              <span
                className={
                  variant === 'header' ? 'text-right leading-[24px]' : ''
                }>
                {item.title}
              </span>
            </Link>
          </div>
        )
      )}
    </div>
  )
}
