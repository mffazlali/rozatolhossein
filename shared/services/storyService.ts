/**
 * Story Service
 * سرویس مدیریت استوری‌ها
 * 
 * ⚠️ فعلاً از Mock Data استفاده می‌کند
 * بعد از آماده شدن API، باید به API واقعی متصل شود
 */

import { MOCK_STORIES } from '@/features/story/mockData';
import type { StoryItem } from '@/shared/types';

export const storyService = {
  /**
   * دریافت لیست استوری‌ها
   * 
   * ⚠️ TEMPORARY: استفاده از Mock Data
   * TODO: اتصال به API واقعی بعد از آماده شدن backend
   */
  async getStories(locale?: string): Promise<StoryItem[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return mock data
      return MOCK_STORIES;
      
      /* 
      // 🔴 کد زیر بعد از آماده شدن API فعال شود:
      
      const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stories`);
      if (locale) {
        url.searchParams.append('locale', locale);
      }

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: StoriesResponse = await response.json();
      return data.items || [];
      */
    } catch (error) {
      console.error('Error fetching stories:', error);
      return MOCK_STORIES; // Fallback to mock data
    }
  },

  /**
   * علامت‌گذاری استوری به عنوان دیده شده
   * 
   * ⚠️ TEMPORARY: فقط console.log می‌کند
   * TODO: اتصال به API واقعی بعد از آماده شدن backend
   */
  async markAsSeen(storyId: string | number, locale?: string): Promise<boolean> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log(`✅ Story ${storyId} marked as seen (mock)`);
      return true;
      
      /* 
      // 🔴 کد زیر بعد از آماده شدن API فعال شود:
      
      const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stories/${storyId}/seen`);
      if (locale) {
        url.searchParams.append('locale', locale);
      }

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return response.ok;
      */
    } catch (error) {
      console.error('Error marking story as seen:', error);
      return false;
    }
  },

  /**
   * دریافت استوری‌های یک کاربر خاص
   * 
   * ⚠️ TEMPORARY: جستجو در Mock Data
   * TODO: اتصال به API واقعی بعد از آماده شدن backend
   */
  async getUserStories(
    userId: string | number,
    locale?: string
  ): Promise<StoryItem | null> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Search in mock data
      const story = MOCK_STORIES.find(s => {
        if (typeof s.user === 'string') {
          return s.user === userId.toString();
        }
        return s.user.id === userId || s.user.username === userId;
      });
      
      return story || null;
      
      /* 
      // 🔴 کد زیر بعد از آماده شدن API فعال شود:
      
      const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stories/user/${userId}`);
      if (locale) {
        url.searchParams.append('locale', locale);
      }

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
      */
    } catch (error) {
      console.error('Error fetching user stories:', error);
      return null;
    }
  },
};
