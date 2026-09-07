'use client'

import { HeroUIProvider } from '@heroui/react'

interface UIProviderProps {
  children: React.ReactNode
}

/**
 * UIProvider
 * ارائه‌دهنده HeroUI
 */
export function UIProvider({ children }: UIProviderProps) {
  return <HeroUIProvider>{children}</HeroUIProvider>
}
