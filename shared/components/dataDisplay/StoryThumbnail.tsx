/**
 * StoryThumbnail Component
 * کامپوننت نمایش thumbnail استوری با gradient ring
 */

'use client';

import Image from 'next/image';
import type { StoryThumbnailProps } from '@/shared/types';

export function StoryThumbnail({ 
  story, 
  seen = false, 
  onClick,
  size = 'medium'
}: StoryThumbnailProps) {
  // تعیین سایز بر اساس prop
  const sizeClasses = {
    small: 'w-14 h-14',
    medium: 'w-[68px] h-[68px]',
    large: 'w-20 h-20'
  };

  const avatarSize = {
    small: 56,
    medium: 68,
    large: 80
  };

  // استخراج اطلاعات کاربر
  const username = typeof story.user === 'string' 
    ? story.user 
    : story.user.username || story.username || 'user';
  
  const avatar = typeof story.user === 'string'
    ? story.avatar || ''
    : story.user.avatar || story.avatar || '';

  return (
    <div 
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0"
    >
      {/* Avatar با Gradient Ring */}
      <div 
        className={`${sizeClasses[size]} rounded-full p-[3px]`}
        style={{
          background: seen
            ? 'linear-gradient(135deg, #ccc, #aaa)'
            : 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)'
        }}
      >
        <div className="w-full h-full rounded-full border-[3px] border-theme-white overflow-hidden bg-theme-gray-light">
          {avatar ? (
            <Image 
              src={avatar} 
              alt={username}
              width={avatarSize[size]}
              height={avatarSize[size]}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              👤
            </div>
          )}
        </div>
      </div>

      {/* Username */}
      <span 
        className={`text-[11px] max-w-[68px] text-center overflow-hidden text-ellipsis whitespace-nowrap ${
          seen ? 'text-theme-gray' : 'text-theme-gray-light'
        }`}
      >
        {username}
      </span>
    </div>
  );
}
