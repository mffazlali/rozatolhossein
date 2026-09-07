# Feedback Components

کامپوننت‌های بازخورد به کاربر (Loading, Error, Empty states)

## MediaEmpty

کامپوننت نمایش empty state برای بخش‌های مدیا

### استفاده

```tsx
import { MediaEmpty } from '@/shared';

// استفاده پیش‌فرض
<MediaEmpty type="audio" />

// با پیام سفارشی
<MediaEmpty 
  type="video" 
  message="هیچ ویدیویی در این دسته‌بندی یافت نشد"
/>
```

### Props

- `type`: نوع مدیا (`'audio' | 'video' | 'session'`)
- `message` (اختیاری): پیام سفارشی

### ویژگی‌ها

- آیکون مناسب بر اساس نوع مدیا:
  - `audio`: آیکون موسیقی
  - `video`: آیکون ویدیو
  - `session`: آیکون تقویم
- پیام پیش‌فرض فارسی
- امکان تعیین پیام سفارشی
- Responsive design
- استفاده از FontAwesome Light icons

### پیام‌های پیش‌فرض

- `audio`: "هیچ صوتی یافت نشد"
- `video`: "هیچ ویدیویی یافت نشد"
- `session`: "هیچ جلسه‌ای یافت نشد"

---

## MediaNotFound

کامپوننت نمایش 404 برای صفحات جزئیات مدیا

### استفاده

```tsx
import { MediaNotFound } from '@/shared';

<MediaNotFound type="audio" />
```

---

## ServerDataLoader

کامپوننت نمایش loading و error برای Server Components

### استفاده

```tsx
import { ServerDataLoader } from '@/shared';

<ServerDataLoader 
  isLoading={isLoading}
  error={error}
  loadingText="در حال بارگذاری..."
  errorText="خطا در دریافت اطلاعات"
>
  {children}
</ServerDataLoader>
```

---

## Progress

کامپوننت نمایش پیشرفت (Progress bar)

### استفاده

```tsx
import { Progress } from '@/shared';

<Progress value={75} max={100} />
```

---

## FeatureErrorFallback

برای نمایش خطا در بخش‌های مختلف از `FeatureErrorFallback` در `shared/components/general/ErrorBoundary` استفاده کنید.

### استفاده

```tsx
import { FeatureErrorFallback } from '@/shared';

<FeatureErrorFallback 
  error={error} 
  retry={refetch} 
  featureName="صوت‌ها" 
/>
```
