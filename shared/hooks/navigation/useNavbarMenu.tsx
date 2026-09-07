'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Drawer, DrawerContent, DrawerBody, Accordion, AccordionItem } from '@heroui/react'

/**
 * Navigation Menu Item Type
 */
export interface NavMenuItem {
  id: string
  title: string
  href: string
  children?: NavMenuItem[]
}

/**
 * useNavbarMenu Hook Options
 */
export interface UseNavbarMenuOptions {
  items: NavMenuItem[]
  placement?: 'left' | 'right' | 'top' | 'bottom'
  width?: string
  backgroundColor?: string
  backdrop?: 'transparent' | 'opaque' | 'blur'
  ariaLabel?: string
  title?: string
  showCloseButton?: boolean
  itemClassName?: string
  childItemClassName?: string
  onItemClick?: (item: NavMenuItem) => void
}

/**
 * useNavbarMenu Hook Return Type
 */
export interface UseNavbarMenuReturn {
  isOpen: boolean
  openMenu: () => void
  closeMenu: () => void
  toggleMenu: () => void
  NavbarMenuComponent: () => React.JSX.Element
}

/**
 * useNavbarMenu Hook
 *
 * Hook قابل استفاده مجدد برای مدیریت منوی ناوبری با Accordion برای زیرمنو
 */
export const useNavbarMenu = (
  options: UseNavbarMenuOptions
): UseNavbarMenuReturn => {
  const {
    items,
    placement = 'right',
    width = '220px',
    backgroundColor = 'bg-theme-white',
    backdrop = 'transparent',
    ariaLabel = 'منوی ناوبری',
    title,
    showCloseButton = false,
    itemClassName = '',
    childItemClassName = '',
    onItemClick,
  } = options

  const [isOpen, setIsOpen] = useState(false)

  const openMenu = useCallback(() => setIsOpen(true), [])
  const closeMenu = useCallback(() => setIsOpen(false), [])
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), [])

  const handleItemClick = useCallback(
    (item: NavMenuItem) => {
      closeMenu()
      onItemClick?.(item)
    },
    [closeMenu, onItemClick]
  )

  const NavbarMenuComponent = () => (
    <Drawer
      isOpen={isOpen}
      onClose={closeMenu}
      hideCloseButton={true}
      backdrop={backdrop}
      placement={placement}
      classNames={{
        base: `${backgroundColor} rounded-none`,
        wrapper: `sm:w-[${width}] w-[${width}] rounded-none`,
      }}
      style={{
        boxShadow:
          placement === 'right'
            ? 'rgba(0, 0, 0, 0.1) -2px 0px 8px'
            : 'rgba(0, 0, 0, 0.1) 2px 0px 8px',
      }}>
      <DrawerContent>
        <DrawerBody className="p-0">
          {/* Header with title and close button */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-end px-5 py-4">
              {showCloseButton && (
                <button
                  onClick={closeMenu}
                  className="text-theme-gray hover:text-theme-primary-teal transition-colors"
                  aria-label="بستن منو">
                  <i className="fa-light fa-times text-xl" />
                </button>
              )}
              {title && (
                <h2 className="text-lg font-semibold text-theme-black">{title}</h2>
              )}
            </div>
          )}

          <nav aria-label={ariaLabel}>
            <ul className="flex flex-col p-0 m-0 list-none">
              {items.map((item) => {
                const hasChildren = item.children && item.children.length > 0

                return (
                  <li key={item.id}>
                    {hasChildren ? (
                      <Accordion
                        isCompact
                        className="px-0"
                        itemClasses={{
                          base: 'py-0',
                          title: 'text-theme-gray text-base font-normal',
                          trigger: 'py-4 px-5 data-[hover=true]:bg-transparent',
                          indicator: 'text-theme-gray',
                          content: 'pt-0 pb-2 px-0 bg-theme-black',
                        }}>
                        <AccordionItem
                          key={item.id}
                          aria-label={item.title}
                          title={item.title}>
                          <ul className="flex flex-col">
                            {item.children!.map((child) => (
                              <li key={child.id}>
                                <Link
                                  href={child.href}
                                  onClick={() => handleItemClick(child)}
                                  className={`block w-full py-3 px-8 text-theme-gray text-sm hover:bg-theme-black/10! hover:text-theme-white transition-colors ${childItemClassName}`}>
                                  {child.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => handleItemClick(item)}
                        className={`block w-full py-4 px-5 text-theme-gray text-base hover:bg-theme-black/10! hover:text-theme-white transition-colors ${itemClassName}`}>
                        {item.title}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )

  return {
    isOpen,
    openMenu,
    closeMenu,
    toggleMenu,
    NavbarMenuComponent,
  }
}
