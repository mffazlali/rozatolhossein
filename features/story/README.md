# Story Feature

فیچر استوری به سبک اینستاگرام با قابلیت‌های کامل.

## ساختار

```
features/story/
├── index.tsx              # Server Component با Suspense
├── components/
│   ├── index.tsx          # StoryFeedContent (Client Component)
│   └── StoryViewer.tsx    # Full-screen Story Viewer
├── mockData.ts            # داده‌های نمونه
└── README.md
```

## استفاده

### در صفحه

```tsx
import Story from '@/features/story';

export default async function StoriesPage({ params }: PageProps) {
  const { locale } = await params;
  
  return <Story locale={locale} />;
}
```

### با داده‌های سفارشی

```tsx
import { StoryFeedContent } from '@/features/story/components';

<StoryFeedContent stories={customStories} />
```

## ویژگی‌ها

### Navigation
- **Keyboard**: Arrow keys (چپ/راست), Space (pause/play), Escape (close)
- **Touch**: Swipe left/right برای تغییر استوری، Long press برای pause
- **Click**: کلیک روی 1/3 چپ = قبلی، 2/3 راست = بعدی
- **Desktop**: دکمه‌های navigation در کنار viewer

### Progress Bars
- RAF-based smooth animation
- Auto-pause در حالت pause
- نمایش وضعیت completed/active

### Seen State
- Track کردن استوری‌های دیده شده
- تغییر رنگ ring برای seen stories
- Persistence در session

### Responsive
- Mobile-first design
- Full-screen در موبایل
- Rounded corners در دسکتاپ
- Side navigation arrows فقط در دسکتاپ

## Types

```typescript
interface StoryItem {
  id: string;
  username: string;
  avatar: string;
  verified?: boolean;
  user?: StoryUser;
  slides: StorySlide[];
}

interface StorySlide {
  id: string;
  bg: string;
  emoji?: string;
  text?: string;
  subtext?: string;
}
```

## Service

```typescript
import { storyService } from '@/shared/services';

// دریافت همه استوری‌ها
const stories = await storyService.getStories(locale);

// Mark as seen
await storyService.markAsSeen(storyId);

// دریافت استوری‌های یک کاربر
const userStories = await storyService.getUserStories(userId);
```

### ⚠️ استفاده از Mock Data

فعلاً سرویس از Mock Data استفاده می‌کند چون API های backend آماده نیستند.

**برای تغییر به API واقعی:**

1. فایل `shared/services/storyService.ts` را باز کنید
2. کامنت‌های `🔴` را پیدا کنید
3. کد mock را حذف کنید
4. کد API واقعی را uncomment کنید

```typescript
// ❌ حذف کنید:
await new Promise(resolve => setTimeout(resolve, 300));
return MOCK_STORIES;

// ✅ Uncomment کنید:
const response = await fetch(url.toString());
const data: StoriesResponse = await response.json();
return data.items || [];
```

## Customization

### تغییر مدت زمان هر slide

```tsx
// در StoryViewer.tsx
const STORY_DURATION = 5000; // 5 seconds
```

### تغییر رنگ‌های gradient ring

```tsx
// در StoryThumbnail.tsx
const gradientClass = seen 
  ? 'from-dark-gray/40 to-dark-gray/40'
  : 'from-dark-primary-teal via-dark-primary-gold to-dark-primary-red';
```

## TODO

- [ ] اتصال به API واقعی
- [ ] پیاده‌سازی reply functionality
- [ ] Support برای image و video slides
- [ ] Preloading برای slides بعدی
- [ ] Analytics tracking
- [ ] Share functionality
- [ ] Report/Block options
