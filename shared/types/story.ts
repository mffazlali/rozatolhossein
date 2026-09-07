/**
 * Story Types
 * تایپ‌های مربوط به فیچر Story (Instagram-like)
 */

/**
 * نوع اسلاید استوری
 */
export type StorySlideType = 'gradient' | 'image' | 'video';

/**
 * اسلاید استوری
 */
export interface StorySlide {
  id: string | number;
  type: StorySlideType;
  bg: string; // gradient یا URL تصویر
  text?: string;
  subtext?: string;
  emoji?: string;
  image?: string;
  video?: string;
}

/**
 * کاربر استوری
 */
export interface StoryUser {
  id: string | number;
  username: string;
  avatar: string;
  verified?: boolean;
}

/**
 * آیتم استوری
 */
export interface StoryItem {
  id: string | number;
  user: StoryUser | string; // string برای backward compatibility
  username?: string; // deprecated - از user.username استفاده کن
  avatar?: string; // deprecated - از user.avatar استفاده کن
  verified?: boolean; // deprecated - از user.verified استفاده کن
  slides: StorySlide[];
  createdAt?: string;
  expiresAt?: string;
}

/**
 * Response API برای لیست استوری‌ها
 */
export interface StoriesResponse {
  items: StoryItem[];
  total?: number;
  hasMore?: boolean;
}

/**
 * State دیده شدن استوری‌ها
 */
export interface StorySeenState {
  [storyId: string]: boolean;
}

/**
 * Props برای StoryViewer
 */
export interface StoryViewerProps {
  stories: StoryItem[];
  startIndex: number;
  onClose: () => void;
  onStoryChange?: (storyIndex: number, slideIndex: number) => void;
  onComplete?: () => void;
}

/**
 * Props برای StoryThumbnail
 */
export interface StoryThumbnailProps {
  story: StoryItem;
  seen?: boolean;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Props برای ProgressBar
 */
export interface StoryProgressBarProps {
  active: boolean;
  completed: boolean;
  duration: number;
  paused?: boolean;
}
