'use client';

import type { SocialLink } from '@/shared/types/link';

interface LinkItemProps {
  link: SocialLink;
}

export function LinkItem({ link }: LinkItemProps) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 w-full p-4 bg-theme-black border border-theme-border rounded-md hover:bg-theme-gray-dark transition-colors"
    >
      <span className="text-theme-gray text-sm font-medium">{link.title}</span>
      <i className={`${link.icon} text-theme-gray text-sm`} />
    </a>
  );
}
