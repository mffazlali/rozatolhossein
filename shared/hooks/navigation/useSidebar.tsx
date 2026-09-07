"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import { Drawer, DrawerContent, DrawerBody, Accordion, AccordionItem } from "@heroui/react"

/**
 * Sidebar Menu Item Type
 */
export interface SidebarMenuItem {
  id: string
  label: string
  href: string
  icon?: string
  children?: SidebarMenuItem[]
}

/**
 * useSidebar Hook Options
 */
export interface UseSidebarOptions {
  items: SidebarMenuItem[]
  placement?: "left" | "right" | "top" | "bottom"
  width?: string
  backgroundColor?: string
  backdrop?: "transparent" | "opaque" | "blur"
  ariaLabel?: string
  navigationId?: string
  itemClassName?: string
  enableEscapeKey?: boolean
  restoreFocus?: boolean
  focusDelay?: number
  onItemClick?: (item: SidebarMenuItem) => void
  onOpen?: () => void
  onClose?: () => void
}

/**
 * useSidebar Hook Return Type
 */
export interface UseSidebarReturn {
  isOpen: boolean
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void
  SidebarComponent: () => React.JSX.Element
}

/**
 * useSidebar Hook
 *
 * Hook قابل استفاده مجدد برای مدیریت سایدبار با Accordion برای زیرمنو
 */
export const useSidebar = (options: UseSidebarOptions): UseSidebarReturn => {
  const {
    items,
    placement = "right",
    backgroundColor = "bg-theme-black",
    backdrop = "transparent",
    ariaLabel = "منوی اصلی",
    navigationId = "main-navigation",
    itemClassName = "",
    enableEscapeKey = true,
    restoreFocus = true,
    focusDelay = 100,
    onItemClick,
    onOpen,
    onClose,
  } = options

  const [isOpen, setIsOpen] = useState(false)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const openSidebar = useCallback(() => {
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement
    }
    setIsOpen(true)
    onOpen?.()
  }, [restoreFocus, onOpen])

  const closeSidebar = useCallback(() => {
    setIsOpen(false)
    onClose?.()

    if (restoreFocus && previousFocusRef.current) {
      setTimeout(() => {
        previousFocusRef.current?.focus()
      }, focusDelay)
    }
  }, [restoreFocus, focusDelay, onClose])

  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const handleItemClick = useCallback(
    (item: SidebarMenuItem) => {
      closeSidebar()
      onItemClick?.(item)
    },
    [closeSidebar, onItemClick],
  )

  useEffect(() => {
    if (!enableEscapeKey || !isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSidebar()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, enableEscapeKey, closeSidebar])

  const SidebarComponent = () => (
    <Drawer
      isOpen={isOpen}
      onClose={closeSidebar}
      hideCloseButton={true}
      backdrop={backdrop}
      placement={placement}
      classNames={{
        base: `${backgroundColor} rounded-none`,
        wrapper: `sm:w-[256px] w-[256px] rounded-none`,
      }}
      style={{
        boxShadow: "rgba(0, 0, 0, 0.54) 20px 0px 40px inset",
      }}
    >
      <DrawerContent>
        <DrawerBody className='p-0'>
          <nav id={navigationId} aria-label={ariaLabel}>
            <ul className="flex flex-col p-0 m-0 list-none">
              {items.map(item => {
                const hasChildren = item.children && item.children.length > 0

                return (
                  <li key={item.id}>
                    {hasChildren ? (
                      <Accordion
                        isCompact
                        className="px-0"
                        itemClasses={{
                          base: 'py-0',
                          title: 'text-theme-white text-base font-normal',
                          trigger: 'py-4 px-5 data-[hover=true]:bg-transparent',
                          indicator: 'text-theme-white',
                          content: 'pt-0 pb-2 px-0 bg-theme-gray-dark/50',
                        }}>
                        <AccordionItem
                          key={item.id}
                          aria-label={item.label}
                          title={
                            <span className="flex items-center">
                              {item.icon && <i className={`${item.icon} me-2`} />}
                              {item.label}
                            </span>
                          }>
                          <ul className="flex flex-col">
                            {item.children!.map(child => (
                              <li key={child.id}>
                                <Link
                                  href={child.href}
                                  onClick={() => handleItemClick(child)}
                                  className="block w-full py-3 px-8 text-theme-gray-light text-sm hover:bg-theme-primary-teal/20 hover:text-theme-white transition-colors"
                                >
                                  {child.icon && <i className={`${child.icon} me-2`} />}
                                  {child.label}
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
                        className={`block w-full py-4 px-5 text-theme-white text-base hover:bg-theme-primary-teal/20 transition-colors ${itemClassName}`}
                      >
                        {item.icon && <i className={`${item.icon} me-2`} />}
                        {item.label}
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
    openSidebar,
    closeSidebar,
    toggleSidebar,
    SidebarComponent,
  }
}
