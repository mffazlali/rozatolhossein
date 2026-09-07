/**
 * Tabs Component - روضة الحسین
 * کامپوننت تب قابل استفاده مجدد با پشتیبانی از Lazy Load
 */

'use client'

import { useState, useCallback, ReactNode, useEffect } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

/**
 * Tab Configuration Interface
 */
export interface TabConfig<T extends string = string> {
  id: T
  label: string
  hasContent: boolean
  content: ReactNode
}

/**
 * Tabs Props
 */
interface TabsProps<T extends string = string> {
  tabs?: TabConfig<T>[]
  defaultTab?: T
  className?: string
  skeleton?: boolean
  onTabChange?: (tabId: T) => void
  /** نام پارامتر در URL (پیش‌فرض: 'tab') */
  searchParamName?: string
  /** آیا از URL search params استفاده شود؟ (پیش‌فرض: true) */
  useSearchParams?: boolean
}

/**
 * TabPanel Component
 * پنل تب با پشتیبانی از Lazy Load
 */
interface TabPanelProps {
  isActive: boolean
  hasVisited: boolean
  children: ReactNode
}

const TabPanel = ({ isActive, hasVisited, children }: TabPanelProps) => {
  // اگر تب هنوز بازدید نشده، رندر نکن (lazy load)
  // اما اگر قبلاً بازدید شده، در DOM نگه دار (برای حفظ state)
  if (!isActive && !hasVisited) {
    return null
  }

  return (
    <div className={isActive ? 'block' : 'hidden'} aria-hidden={!isActive}>
      {children}
    </div>
  )
}

/**
 * Tabs Skeleton Component
 */
function TabsSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      {/* Tab Buttons Skeleton */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 w-full px-2 sm:px-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex-1 sm:flex-none sm:w-32 h-10 sm:h-12 bg-theme-gray/20 rounded-md animate-pulse"
          />
        ))}
      </div>
      {/* Content Skeleton */}
      <div className="w-full h-64 bg-theme-gray/20 rounded-md animate-pulse" />
    </div>
  )
}

/**
 * Tabs Component
 * کامپوننت تب با مدیریت خودکار state و lazy loading
 * با پشتیبانی از URL search params برای حفظ تب فعال
 *
 * @example
 * ```tsx
 * // استفاده پیش‌فرض - با URL search params
 * const tabs = [
 *   { id: 'image', label: 'تصاویر', hasContent: true, content: <Images /> },
 *   { id: 'audio', label: 'صوت‌ها', hasContent: true, content: <Audios /> },
 * ]
 * <Tabs tabs={tabs} defaultTab="image" />
 * // URL: /page?tab=image
 * 
 * // بدون URL search params
 * <Tabs tabs={tabs} useSearchParams={false} />
 * 
 * // با نام پارامتر سفارشی
 * <Tabs tabs={tabs} searchParamName="media" />
 * // URL: /page?media=image
 * ```
 */
export function Tabs<T extends string = string>({
  tabs = [],
  defaultTab,
  className = '',
  skeleton = false,
  onTabChange,
  searchParamName = 'tab',
  useSearchParams: useUrlParams = true,
}: TabsProps<T>) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  // فیلتر کردن تب‌هایی که محتوا دارند - با useMemo
  const availableTabs = useState(() => 
    skeleton ? [] : tabs.filter((tab) => tab.hasContent)
  )[0]

  // تعیین تب پیش‌فرض
  const initialTab = useState<T>(() => {
    // اگر از URL params استفاده می‌کنیم، اول از URL بخون
    if (useUrlParams && searchParams) {
      const tabFromUrl = searchParams.get(searchParamName) as T
      // چک کن که تب از URL معتبر باشه
      if (tabFromUrl && availableTabs.some((tab) => tab.id === tabFromUrl)) {
        return tabFromUrl
      }
    }
    // در غیر این صورت از defaultTab یا اولین تب استفاده کن
    return defaultTab || (availableTabs.length > 0 ? availableTabs[0].id : ('' as T))
  })[0]

  const [activeTab, setActiveTab] = useState<T>(initialTab)
  const [visitedTabs, setVisitedTabs] = useState<Set<T>>(new Set([initialTab]))

  // Sync با URL params وقتی searchParams تغییر می‌کنه
  useEffect(() => {
    if (!useUrlParams || !searchParams) return

    const tabFromUrl = searchParams.get(searchParamName) as T
    if (tabFromUrl && availableTabs.some((tab) => tab.id === tabFromUrl) && tabFromUrl !== activeTab) {
      // استفاده از queueMicrotask برای جلوگیری از cascading renders
      queueMicrotask(() => {
        setActiveTab(tabFromUrl)
        setVisitedTabs((prev) => new Set([...prev, tabFromUrl]))
      })
    }
  }, [searchParams, searchParamName, availableTabs, activeTab, useUrlParams])

  // هندلر تغییر تب
  const handleTabChange = useCallback(
    (tabId: T) => {
      setActiveTab(tabId)
      setVisitedTabs((prev) => new Set([...prev, tabId]))
      
      // به‌روزرسانی URL
      if (useUrlParams && pathname) {
        const params = new URLSearchParams(searchParams?.toString())
        params.set(searchParamName, tabId)
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      }
      
      onTabChange?.(tabId)
    },
    [onTabChange, useUrlParams, pathname, searchParams, searchParamName, router]
  )

  if (skeleton) {
    return <TabsSkeleton />
  }

  // اگر هیچ تبی وجود نداره، چیزی نمایش نده
  if (availableTabs.length === 0) {
    return null
  }

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {/* Tab Buttons */}
      <div
        className="flex items-center justify-center gap-1.5 sm:gap-2.5 w-full px-2 sm:px-0"
        role="tablist">
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`
              flex-1 sm:flex-none flex items-center justify-center px-3 sm:px-8 py-3 sm:py-4 rounded-md border border-theme-border
              bg-theme-black text-xs sm:text-sm font-medium transition-colors cursor-pointer
              ${
                activeTab === tab.id
                  ? 'text-theme-white'
                  : 'text-theme-gray hover:text-theme-white'
              }
            `}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {availableTabs.map((tab) => (
        <TabPanel
          key={tab.id}
          isActive={activeTab === tab.id}
          hasVisited={visitedTabs.has(tab.id)}>
          {tab.content}
        </TabPanel>
      ))}
    </div>
  )
}
