'use client'

import { useSyncExternalStore } from 'react'
import { useTheme } from '@/shared/contexts'
import clsx from 'clsx'

export interface ThemeToggleProps {
  className?: string
  iconClassName?: string
  variant?: 'default' | 'hero'
}

// برای جلوگیری از hydration mismatch
const emptySubscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

/**
 * ThemeToggle Component
 * دکمه تغییر تم لایت/دارک - قابل استفاده مجدد
 */
export function ThemeToggle({
  className,
  iconClassName,
  variant = 'default',
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)

  const baseClassName =
    variant === 'hero'
      ? 'flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors'
      : 'p-2 rounded-lg bg-theme-gray-dark hover:bg-theme-gray-dark/80 transition-colors'

  const baseIconClassName =
    variant === 'hero' ? 'text-white text-lg' : 'text-theme-gray text-lg'

  // نمایش اسکلتون تا زمان mount شدن
  if (!mounted) {
    return (
      <div className={clsx(className, baseClassName)}>
        <div className="w-5 h-5 rounded-full bg-theme-gray/30 animate-pulse" />
      </div>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className={clsx(className, baseClassName)}
      aria-label={
        theme === 'dark' ? 'تغییر به حالت روشن' : 'تغییر به حالت تاریک'
      }>
      {theme === 'light' ? (
        <i
          className={clsx(iconClassName, baseIconClassName, 'fa-light fa-moon')}
        />
      ) : (
        <i
          className={clsx(iconClassName, baseIconClassName, 'fa-light fa-sun')}
        />
      )}
    </button>
  )
}
