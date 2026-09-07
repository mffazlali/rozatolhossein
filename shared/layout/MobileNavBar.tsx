'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

/**
 * Mobile Navigation Bar Component
 * نوار ناوبری موبایل در پایین صفحه
 */
export function MobileNavBar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      icon: 'fa-home',
      label: 'خانه',
      isActive: pathname === '/',
    },
    {
      href: '/audio',
      icon: 'fa-music',
      label: 'صوت‌ها',
      isActive: pathname.startsWith('/audio'),
    },
    {
      href: '/video',
      icon: 'fa-video',
      label: 'ویدئو',
      isActive: pathname.startsWith('/video'),
    },
    {
      href: '/session',
      icon: 'fa-calendar',
      label: 'جلسات',
      isActive: pathname.startsWith('/session'),
    },
    {
      href: '/search',
      icon: 'fa-search',
      label: 'جستجو',
      isActive: pathname.startsWith('/search'),
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-theme-black border-t border-theme-border z-50 transition-colors">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors',
              item.isActive
                ? 'text-theme-primary-teal bg-theme-primary-teal/10'
                : 'text-theme-gray hover:text-theme-white'
            )}
          >
            <i className={`fa-light ${item.icon} text-lg`} />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}