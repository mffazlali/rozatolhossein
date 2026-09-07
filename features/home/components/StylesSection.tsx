'use client'

import Link from 'next/link'
import { HeaderIcon, SectionHeader } from '@/shared'

interface StyleCategory {
  id: string;
  title: string;
  href: string;
}

const styleCategories: StyleCategory[] = [
  {
    id: '4',
    title: 'شور',
    href: '/style/shoor',
  },
  {
    id: '3',
    title: 'تنظیم دیجیتالی',
    href: '/style/tanzim-digital',
  },
  {
    id: '2',
    title: 'احساسی',
    href: '/style/ehsasi',
  },
  {
    id: '1',
    title: 'زمینه',
    href: '/style/zamineh',
  },
]

/**
 * Styles Section Component
 * بخش سبک‌ها - طبق دیزاین دقیق Figma
 */
export function StylesSection() {
  return (
    <section className="flex flex-col gap-4 items-start w-full max-w-[1140px] pt-24 -mb-5">
      {/* Header */}
      <SectionHeader
        title="سبک ها"
        icon={<HeaderIcon className="w-[24px] h-[24px] text-theme-gray" />}
        showViewAll={false}
      />

      {/* Categories Grid */}
      <div className="flex flex-wrap gap-[15px] items-start justify-center w-full">
        {styleCategories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col items-start w-full sm:w-[calc(50%-7.5px)] md:w-[calc(33.333%-10px)] lg:w-[273.75px]">
            <Link
              href={category.href}
              className="bg-theme-black border border-theme-border flex items-center justify-center p-[21px] rounded-[6px] w-full cursor-pointer hover:bg-theme-black/80 transition-colors">
              <p className="text-base font-medium leading-4 text-theme-gray text-center cursor-pointer hover:text-theme-gray-medium transition-colors">
                {category.title}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
