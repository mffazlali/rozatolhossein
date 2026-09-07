/**
 * Mock Data for Story Feature
 * داده‌های نمونه برای تست فیچر استوری
 */

import type { StoryItem } from '@/shared/types';

export const MOCK_STORIES: StoryItem[] = [
  {
    id: 1,
    user: {
      id: 1,
      username: 'aria.design',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aria&backgroundColor=b6e3f4',
      verified: true,
    },
    slides: [
      {
        id: 1,
        type: 'gradient',
        bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        text: '✨ روز خوبی داری؟',
        subtext: 'امیدوارم همیشه بهترین باشی',
        emoji: '🌸',
      },
      {
        id: 2,
        type: 'gradient',
        bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        text: 'طراحی = عشق',
        subtext: 'هر پیکسل یه داستانه',
        emoji: '💎',
      },
    ],
  },
  {
    id: 2,
    user: {
      id: 2,
      username: 'matin.photo',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=matin&backgroundColor=ffdfbf',
      verified: false,
    },
    slides: [
      {
        id: 1,
        type: 'gradient',
        bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        text: '📸 لحظه‌ها رو ثبت کن',
        subtext: 'هر عکس یه خاطره‌ست',
        emoji: '🌊',
      },
      {
        id: 2,
        type: 'gradient',
        bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        text: 'طبیعت بهترین استودیوئه',
        subtext: 'برو بیرون، کاوش کن',
        emoji: '🌿',
      },
      {
        id: 3,
        type: 'gradient',
        bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        text: 'زندگی رنگارنگه 🎨',
        subtext: 'از هر رنگش لذت ببر',
        emoji: '🦋',
      },
    ],
  },
  {
    id: 3,
    user: {
      id: 3,
      username: 'sara.art',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara&backgroundColor=c0aede',
      verified: true,
    },
    slides: [
      {
        id: 1,
        type: 'gradient',
        bg: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        text: 'هنر بی‌مرزه 🖌️',
        subtext: 'خلق کن، بساز، بتراش',
        emoji: '🎭',
      },
      {
        id: 2,
        type: 'gradient',
        bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        text: 'الهام همه جاست',
        subtext: 'فقط چشماتو باز کن',
        emoji: '👁️',
      },
    ],
  },
  {
    id: 4,
    user: {
      id: 4,
      username: 'kaveh.dev',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kaveh&backgroundColor=d1d4f9',
      verified: false,
    },
    slides: [
      {
        id: 1,
        type: 'gradient',
        bg: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        text: '< کد بنویس />',
        subtext: 'دنیا رو تغییر بده',
        emoji: '💻',
      },
    ],
  },
  {
    id: 5,
    user: {
      id: 5,
      username: 'negar.food',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=negar&backgroundColor=ffd5dc',
      verified: false,
    },
    slides: [
      {
        id: 1,
        type: 'gradient',
        bg: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        text: 'غذا = محبته 🍽️',
        subtext: 'با عشق بپز',
        emoji: '❤️',
      },
      {
        id: 2,
        type: 'gradient',
        bg: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
        text: 'طعم خوشبختی',
        subtext: 'هر وعده رو جشن بگیر',
        emoji: '🎉',
      },
    ],
  },
];

/**
 * Helper function برای استفاده از mock data در development
 */
export function getMockStories(): StoryItem[] {
  return MOCK_STORIES;
}
