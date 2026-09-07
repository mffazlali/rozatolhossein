'use client';

import { ReactNode } from 'react';

interface PlaceholderImageProps {
  width?: number;
  height?: number;
  className?: string;
  icon?: ReactNode;
  text?: string;
  type?: 'audio' | 'video' | 'session' | 'image';
}

/**
 * Placeholder Image Component
 * کامپوننت تصویر جایگزین برای زمانی که تصویر اصلی در دسترس نیست
 */
export function PlaceholderImage({ 
  width = 200, 
  height = 200, 
  className = '',
  icon,
  text,
  type = 'image'
}: PlaceholderImageProps) {
  const getDefaultIcon = () => {
    switch (type) {
      case 'audio':
        return <i className="fa-light fa-music text-2xl" />;
      case 'video':
        return <i className="fa-light fa-play text-2xl" />;
      case 'session':
        return <i className="fa-light fa-microphone text-2xl" />;
      default:
        return <i className="fa-light fa-image text-2xl" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'audio':
        return 'bg-blue-900/50';
      case 'video':
        return 'bg-red-900/50';
      case 'session':
        return 'bg-green-900/50';
      default:
        return 'bg-gray-700';
    }
  };

  return (
    <div 
      className={`${getBackgroundColor()} flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <div className="flex flex-col items-center gap-2 text-gray-400">
        {icon || getDefaultIcon()}
        {text && <span className="text-xs text-center px-2">{text}</span>}
      </div>
    </div>
  );
}