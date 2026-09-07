'use client'

import Link from 'next/link'

import { SectionHeader } from '@/shared/components/navigation'
import { HeaderIcon } from '@/shared'

interface GroupItem {
  id: string;
  title: string;
  href: string;
}

const groupItems: GroupItem[] = [
  {
    id: '4',
    title: 'محفل زوار البقیع طهران',
    href: 'heyat/mahfel-zovar-albaghi-tehran',
  },
  {
    id: '3',
    title: 'ام المصائب (س) بابل',
    href: 'heyat/heyat-om-almasayeb-babel',
  },
  {
    id: '2',
    title: 'خادمین حضرت رقیه (س)',
    href: 'heyat/heyat-khademin-hazrat-roghayeh',
  },
  {
    id: '1',
    title: 'محسنیه کربلا المقدسة',
    href: 'heyat/heyat-mohseniyeh-karbala-almoghaddase',
  },
]

/**
 * Groups Section Component
 * بخش هیئت‌ها
 */
export function GroupsSection() {
  return (
    <section className="flex flex-col gap-4 items-start w-full max-w-[1140px] pt-22 -mb-5">
      {/* Header */}
      <SectionHeader
        title="هیئت ها"
        icon={<HeaderIcon className="w-[24px] h-[24px] text-theme-gray" />}
        showViewAll={false}
      />

      {/* Groups Grid */}
      <div className="flex flex-wrap gap-[15px] items-start justify-center w-full">
        {groupItems.map((group) => (
          <div
            key={group.id}
            className="flex flex-col items-start w-full sm:w-[calc(50%-7.5px)] md:w-[calc(33.333%-10px)] lg:w-[273.75px]">
            <Link
              href={group.href}
              className="bg-theme-black border border-white/10 flex items-center justify-center p-[21px] rounded-[6px] w-full hover:bg-theme-black/80 transition-colors">
              <span className="font-medium text-[15.9px] leading-[16px] text-theme-gray text-center transition-colors">
                {group.title}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
