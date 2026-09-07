# Story Feature - API Migration Guide

راهنمای تغییر از Mock Data به API واقعی

## وضعیت فعلی

فعلاً Story Feature از **Mock Data** استفاده می‌کند چون API های backend آماده نیستند.

```typescript
// shared/services/storyService.ts
await new Promise(resolve => setTimeout(resolve, 300));
return MOCK_STORIES; // ⚠️ Mock Data
```

## مراحل Migration

### مرحله 1: آماده‌سازی Backend

Backend باید این endpoint ها را پیاده‌سازی کند:

#### 1.1 دریافت لیست استوری‌ها
```
GET /api/stories?locale={locale}

Response:
{
  "items": [
    {
      "id": 1,
      "user": {
        "id": 1,
        "username": "user1",
        "avatar": "https://...",
        "verified": true
      },
      "slides": [
        {
          "id": 1,
          "type": "gradient",
          "bg": "linear-gradient(...)",
          "text": "متن استوری",
          "subtext": "زیرنویس",
          "emoji": "🌸"
        }
      ]
    }
  ]
}
```

#### 1.2 Mark as Seen
```
POST /api/stories/{storyId}/seen?locale={locale}

Response:
{
  "success": true
}
```

#### 1.3 دریافت استوری‌های کاربر
```
GET /api/stories/user/{userId}?locale={locale}

Response:
{
  "id": 1,
  "user": {...},
  "slides": [...]
}
```

### مرحله 2: تغییر Service

فایل: `shared/services/storyService.ts`

#### 2.1 حذف Mock Data Import
```typescript
// ❌ حذف کنید:
import { MOCK_STORIES } from '@/features/story/mockData';

// ✅ اضافه کنید:
import type { StoriesResponse } from '@/shared/types';
```

#### 2.2 تغییر getStories()
```typescript
async getStories(locale?: string): Promise<StoryItem[]> {
  try {
    // ❌ حذف کنید:
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_STORIES;
    
    // ✅ Uncomment کنید:
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
  } catch (error) {
    console.error('Error fetching stories:', error);
    return []; // ⚠️ یا می‌توانید به MOCK_STORIES برگردید
  }
}
```

#### 2.3 تغییر markAsSeen()
```typescript
async markAsSeen(storyId: string | number, locale?: string): Promise<boolean> {
  try {
    // ❌ حذف کنید:
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log(`✅ Story ${storyId} marked as seen (mock)`);
    return true;
    
    // ✅ Uncomment کنید:
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
  } catch (error) {
    console.error('Error marking story as seen:', error);
    return false;
  }
}
```

#### 2.4 تغییر getUserStories()
```typescript
async getUserStories(
  userId: string | number,
  locale?: string
): Promise<StoryItem | null> {
  try {
    // ❌ حذف کنید:
    await new Promise(resolve => setTimeout(resolve, 200));
    const story = MOCK_STORIES.find(s => {
      if (typeof s.user === 'string') {
        return s.user === userId.toString();
      }
      return s.user.id === userId || s.user.username === userId;
    });
    return story || null;
    
    // ✅ Uncomment کنید:
    const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stories/user/${userId}`);
    if (locale) {
      url.searchParams.append('locale', locale);
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user stories:', error);
    return null;
  }
}
```

### مرحله 3: تنظیم Environment Variables

فایل: `.env.local`

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

### مرحله 4: تست

#### 4.1 تست Manual
```bash
# 1. Start development server
npm run dev

# 2. باز کردن صفحه استوری‌ها
http://localhost:3000/fa/stories

# 3. بررسی Network tab در DevTools
# باید request به API واقعی ببینید
```

#### 4.2 تست با cURL
```bash
# تست getStories
curl -X GET "https://api.example.com/stories?locale=fa"

# تست markAsSeen
curl -X POST "https://api.example.com/stories/1/seen?locale=fa"

# تست getUserStories
curl -X GET "https://api.example.com/stories/user/1?locale=fa"
```

### مرحله 5: Error Handling

اضافه کردن error handling بهتر:

```typescript
async getStories(locale?: string): Promise<StoryItem[]> {
  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    
    if (!response.ok) {
      // Log error details
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: url.toString(),
      });
      
      // Return empty array or throw
      return [];
    }
    
    const data = await response.json();
    
    // Validate response structure
    if (!data.items || !Array.isArray(data.items)) {
      console.error('Invalid API response structure:', data);
      return [];
    }
    
    return data.items;
  } catch (error) {
    console.error('Error fetching stories:', error);
    
    // در production می‌توانید به monitoring service بفرستید
    // sendToSentry(error);
    
    return [];
  }
}
```

## Checklist

- [ ] Backend API های لازم پیاده‌سازی شده‌اند
- [ ] Environment variables تنظیم شده‌اند
- [ ] Mock data imports حذف شده‌اند
- [ ] API calls uncomment شده‌اند
- [ ] Error handling اضافه شده
- [ ] تست manual انجام شده
- [ ] تست با cURL انجام شده
- [ ] Network requests در DevTools بررسی شده‌اند
- [ ] Error scenarios تست شده‌اند
- [ ] Performance بررسی شده (loading time, caching)
- [ ] Documentation به‌روز شده

## Rollback Plan

اگر مشکلی پیش آمد، می‌توانید به Mock Data برگردید:

```typescript
// در catch block
catch (error) {
  console.error('Error fetching stories:', error);
  
  // Fallback to mock data
  if (process.env.NODE_ENV === 'development') {
    return MOCK_STORIES;
  }
  
  return [];
}
```

## نکات مهم

1. **Caching**: از Next.js caching استفاده کنید:
   ```typescript
   fetch(url, { next: { revalidate: 60 } })
   ```

2. **Loading States**: Suspense boundaries به درستی کار می‌کنند

3. **Error Boundaries**: ErrorBoundary ها خطاهای API را می‌گیرند

4. **Type Safety**: Response types را validate کنید

5. **Authentication**: اگر نیاز به auth دارید، headers را اضافه کنید:
   ```typescript
   headers: {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json',
   }
   ```

## پشتیبانی

اگر سوالی دارید یا مشکلی پیش آمد:
- فایل `features/story/README.md` را بخوانید
- فایل `features/story/TESTING.md` را برای تست‌ها ببینید
- Mock data در `features/story/mockData.ts` موجود است
