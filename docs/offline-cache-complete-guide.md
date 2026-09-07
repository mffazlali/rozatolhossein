# راهنمای کامل سیستم کش آفلاین - روضة الحسین

## فهرست مطالب

1. [معرفی](#معرفی)
2. [معماری](#معماری)
3. [Service Worker](#service-worker)
4. [IndexedDB Cache](#indexeddb-cache)
5. [پیاده‌سازی در Features](#پیاده‌سازی-در-features)
6. [تست و دیباگ](#تست-و-دیباگ)
7. [بهترین روش‌ها](#بهترین-روش‌ها)

---

## معرفی

سیستم کش آفلاین پروژه روضة الحسین از دو لایه تشکیل شده است:

1. **Service Worker**: کش فایل‌های استاتیک (تصاویر، فونت‌ها، JS/CSS)
2. **IndexedDB**: کش داده‌های API در Client Components

### چرا دو لایه؟

- **Service Worker**: برای فایل‌های استاتیک که تغییر نمی‌کنند
- **IndexedDB**: برای داده‌های دینامیک API که نیاز به TTL و مدیریت دارند

---

## معماری

### نحوه کار کلی

```
┌─────────────────────────────────────────────────────────────┐
│                         کاربر                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Worker                            │
│  • کش تصاویر، فونت‌ها، JS/CSS                               │
│  • کش صفحات HTML برای آفلاین                                │
│  • استراتژی Cache First                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Server Component                           │
│  • دریافت داده از API                                       │
│  • SSR برای SEO                                             │
│  • ارسال initialData به Client                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Client Component                           │
│  • دریافت initialData                                       │
│  • کش در IndexedDB                                          │
│  • نمایش از کش در آفلاین                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      IndexedDB                               │
│  • ذخیره داده‌های API                                       │
│  • TTL برای هر داده                                         │
│  • پاک‌سازی خودکار منقضی شده‌ها                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Service Worker

### ویژگی‌ها

Service Worker در `public/sw.js` پیاده‌سازی شده و استراتژی‌های زیر را دارد:

#### 1. تصاویر (Cache First)
```javascript
// تمام تصاویر با Cache First
if (request.destination === 'image') {
  // ابتدا از کش، سپس از شبکه
  // حداکثر 100 تصویر
  // Fallback SVG در صورت عدم دسترسی
}
```

#### 2. فایل‌های استاتیک Next.js (Cache First)
```javascript
// فایل‌های /_next/static/ با کش دائمی
if (url.pathname.startsWith('/_next/static/')) {
  // Cache First
}
```

#### 3. فونت‌ها (Cache First)
```javascript
// فونت‌ها با کش دائمی
if (request.destination === 'font') {
  // Cache First
}
```

#### 4. API Calls (بدون کش)
```javascript
// API calls را کش نمی‌کنیم
// IndexedDB مدیریت می‌کند
if (url.pathname.startsWith('/api/')) {
  return fetch(request);
}
```

#### 5. صفحات HTML (Network First با Cache Fallback)
```javascript
// صفحات HTML برای آفلاین
if (request.destination === 'document') {
  // Network First
  // در صورت آفلاین، از کش
}
```

### مدیریت نسخه

```javascript
const CACHE_VERSION = 'v3';
const CACHE_STATIC = `rozatolhossein-static-${CACHE_VERSION}`;
const CACHE_DYNAMIC = `rozatolhossein-dynamic-${CACHE_VERSION}`;
const CACHE_IMAGES = `rozatolhossein-images-${CACHE_VERSION}`;
```

هر بار که نسخه را تغییر دهید، کش‌های قدیمی خودکار پاک می‌شوند.

### محدودیت سایز کش

```javascript
const MAX_CACHE_SIZE = {
  dynamic: 50,   // صفحات HTML
  images: 100,   // تصاویر
};
```

### ثبت Service Worker

Service Worker به صورت خودکار در `layout.tsx` ثبت می‌شود:

```tsx
// app/(main)/[locale]/layout.tsx
import { ServiceWorkerRegistration } from '@/shared';

export default function Layout({ children }) {
  return (
    <>
      <ServiceWorkerRegistration />
      {children}
    </>
  );
}
```

---

## IndexedDB Cache

### معماری

```
shared/lib/
├── indexedDB.ts           # مدیریت IndexedDB
└── apiClient.ts           # API Client (بدون کش)

shared/components/cache/
└── CachedFeatureWrapper.tsx  # Wrapper برای کش خودکار
```

### IndexedDB Manager

```typescript
// shared/lib/indexedDB.ts
class IndexedDBManager {
  private dbName = 'rawzat_hussein_cache';
  private storeName = 'cache';
  
  async set<T>(key: string, value: T, ttl?: number): Promise<void>
  async get<T>(key: string): Promise<T | null>
  async delete(key: string): Promise<void>
  async clear(): Promise<void>
  async keys(): Promise<string[]>
}

export const indexedDBManager = new IndexedDBManager();
```

### ساختار داده

```typescript
interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  expiresAt: number;
}
```

---

## پیاده‌سازی در Features

### استراتژی

1. **Server Component**: دریافت داده از API (برای SEO)
2. **Client Component**: کش در IndexedDB
3. **Offline**: استفاده از کش

### مرحله 1: Server Component

```typescript
// features/my-feature/index.tsx
import { Suspense } from 'react';
import { myService } from '@/shared/services';
import { MyFeatureContent, MyFeatureSkeleton } from './components';

async function MyFeatureDataFetcher({ id, locale }) {
  let data = null;
  
  try {
    data = await myService.getData(id, locale);
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  if (!data) {
    throw new Error('Data not found');
  }

  return (
    <MyFeatureContent 
      data={data} 
      id={id} 
      locale={locale} 
    />
  );
}

export default function MyFeature({ id, locale }) {
  return (
    <Suspense fallback={<MyFeatureSkeleton />}>
      <MyFeatureDataFetcher id={id} locale={locale} />
    </Suspense>
  );
}
```

### مرحله 2: Client Component با CachedFeatureWrapper

```typescript
// features/my-feature/components/index.tsx
'use client';

import { CachedFeatureWrapper } from '@/shared/components/cache';
import { ErrorBoundary, FeatureErrorFallback } from '@/shared';

export function MyFeatureContent({ data, id, locale = 'fa' }) {
  return (
    <CachedFeatureWrapper
      initialData={data}
      cacheKey={`my-feature:${id}:${locale}`}
      ttl={3600000} // 1 ساعت
      loadingComponent={<MyFeatureSkeleton />}
      errorComponent={(error) => (
        <FeatureErrorFallback 
          error={error} 
          retry={() => window.location.reload()} 
          featureName="نام فیچر" 
        />
      )}>
      {(cachedData, isFromCache) => (
        <>
          {isFromCache && (
            <div className="fixed top-0 left-0 right-0 z-50 bg-dark-primary-teal/90 text-dark-white py-1 px-4 text-center text-xs">
              <i className="fa-light fa-database" /> داده‌ها از کش نمایش داده می‌شوند
            </div>
          )}
          
          <ErrorBoundary fallback={FeatureErrorFallback}>
            <div>
              {/* محتوای شما */}
            </div>
          </ErrorBoundary>
        </>
      )}
    </CachedFeatureWrapper>
  );
}
```

### Props CachedFeatureWrapper

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `initialData` | `T \| null` | ✅ | داده اولیه از Server Component |
| `cacheKey` | `string` | ✅ | کلید یکتا (مثل `feature:id:locale`) |
| `ttl` | `number` | ❌ | مدت اعتبار کش (پیش‌فرض: 1 ساعت) |
| `children` | `(data, isFromCache) => ReactNode` | ✅ | کامپوننت نمایش |
| `loadingComponent` | `ReactNode` | ❌ | کامپوننت Loading |
| `errorComponent` | `(error) => ReactNode` | ❌ | کامپوننت Error |

### انتخاب TTL مناسب

```typescript
// محتوای استاتیک (منو، فوتر)
ttl: 3600000  // 1 ساعت

// محتوای نیمه‌دینامیک (صفحه اصلی، جزئیات)
ttl: 1800000  // 30 دقیقه

// محتوای دینامیک (جستجو، لیست‌ها)
ttl: 600000   // 10 دقیقه

// محتوای خیلی دینامیک
ttl: 300000   // 5 دقیقه
```

### نمونه‌های واقعی

#### Home Feature

```typescript
// features/home/components/index.tsx
export const HomeContent = ({ 
  menuData, 
  slides, 
  audioItems, 
  videoItems, 
  sessionItems,
  locale = 'fa' 
}) => {
  const initialData = {
    menuData,
    slides,
    audioItems,
    videoItems,
    sessionItems,
  };

  return (
    <CachedFeatureWrapper
      initialData={initialData}
      cacheKey={`home:${locale}`}
      ttl={1800000}>
      {(data, isFromCache) => (
        <>
          {isFromCache && <CacheIndicator />}
          <HomeContentInner {...data} />
        </>
      )}
    </CachedFeatureWrapper>
  );
};
```

#### Audio Detail Feature

```typescript
// features/media/details/audio/components/index.tsx
export const AudioDetailContent = ({ 
  audioData, 
  audioId, 
  locale = 'fa' 
}) => {
  return (
    <CachedFeatureWrapper
      initialData={audioData}
      cacheKey={`audio:${audioId}:${locale}`}
      ttl={3600000}>
      {(data, isFromCache) => (
        <>
          {isFromCache && <CacheIndicator />}
          <AudioDetailInner audioData={data} />
        </>
      )}
    </CachedFeatureWrapper>
  );
};
```

---

## تست و دیباگ

### تست Service Worker

#### 1. بررسی ثبت

1. باز کردن DevTools (F12)
2. رفتن به تب **Application**
3. بخش **Service Workers**
4. باید `/sw.js` را ببینید با وضعیت "activated"

#### 2. بررسی کش

1. در تب **Application**
2. بخش **Cache Storage**
3. باید کش‌های زیر را ببینید:
   - `rozatolhossein-static-v3`
   - `rozatolhossein-dynamic-v3`
   - `rozatolhossein-images-v3`

#### 3. تست آفلاین

1. در DevTools، تب **Network**
2. فعال کردن **Offline**
3. رفرش صفحه
4. صفحه باید از کش Service Worker لود شود

### تست IndexedDB Cache

#### 1. بررسی کش

1. DevTools → **Application** → **IndexedDB**
2. **rawzat_hussein_cache** → **cache**
3. باید رکوردهای کش شده را ببینید

#### 2. تست آنلاین

```bash
1. صفحه را باز کنید
2. DevTools → Application → IndexedDB → rawzat_hussein_cache
3. باید داده‌ها را ببینید ✅
```

#### 3. تست آفلاین

```bash
1. صفحه را باز کنید (آنلاین)
2. DevTools → Network → Offline
3. صفحه را رفرش کنید
4. باید داده از کش نمایش داده شود ✅
5. باید بنر "داده‌ها از کش" را ببینید ✅
```

### دستورات Console مفید

```javascript
// بررسی وضعیت آنلاین/آفلاین
console.log(navigator.onLine);

// بررسی IndexedDB Manager
console.log(window.indexedDBManager);

// خواندن از کش
await window.indexedDBManager.get('home:fa');

// پاک کردن کش
await window.indexedDBManager.clear();

// دریافت تمام کلیدهای کش
await window.indexedDBManager.keys();

// Unregister Service Worker
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => {
    registration.unregister();
  });
});
```

---

## بهترین روش‌ها

### 1. انتخاب استراتژی کش

- **Service Worker**: فایل‌های استاتیک (تصاویر، فونت‌ها)
- **IndexedDB**: داده‌های API (محتوا، لیست‌ها)

### 2. انتخاب TTL مناسب

- محتوای استاتیک: 1 ساعت
- محتوای نیمه‌دینامیک: 30 دقیقه
- محتوای دینامیک: 10 دقیقه

### 3. مدیریت خطا

همیشه خطاها را مدیریت کنید:

```typescript
try {
  const data = await myService.getData(id, locale);
  return <MyContent data={data} />;
} catch (error) {
  console.error('Error:', error);
  throw error; // error.tsx مدیریت می‌کند
}
```

### 4. نمایش وضعیت کش

```typescript
{isFromCache && (
  <div className="fixed top-0 left-0 right-0 z-50 bg-dark-primary-teal/90 text-dark-white py-1 px-4 text-center text-xs">
    <i className="fa-light fa-database" /> داده‌ها از کش نمایش داده می‌شوند
  </div>
)}
```

### 5. Checklist پیاده‌سازی

- [ ] Server Component داده را از API می‌گیرد
- [ ] Client Component از `CachedFeatureWrapper` استفاده می‌کند
- [ ] `initialData` ارسال شده است
- [ ] `cacheKey` یکتا است (شامل id و locale)
- [ ] TTL مناسب انتخاب شده است
- [ ] `loadingComponent` تعریف شده است
- [ ] `errorComponent` تعریف شده است
- [ ] نشانگر کش نمایش داده می‌شود
- [ ] تست آنلاین انجام شده است
- [ ] تست آفلاین انجام شده است

---

## Troubleshooting

### Service Worker ثبت نمی‌شود

1. بررسی HTTPS (Service Worker فقط روی HTTPS کار می‌کند)
2. بررسی console برای خطاها
3. بررسی مسیر `/sw.js` در مرورگر

### کش به‌روز نمی‌شود

1. تغییر `CACHE_VERSION` در `public/sw.js`
2. Hard refresh (Ctrl + Shift + R)
3. پاک کردن دستی کش از DevTools

### داده‌ها کش نمی‌شوند

1. بررسی Console برای خطاها
2. بررسی `indexedDBManager` در Console
3. بررسی که `initialData` معتبر است (نه خالی)

### در آفلاین داده‌ها نمایش داده نمی‌شوند

1. بررسی که Service Worker صفحه HTML را کش کرده است
2. بررسی که IndexedDB داده‌ها را دارد
3. بررسی لاگ‌های Console

---

## نکات مهم

1. **Server Components**: کش فقط در Client Components کار می‌کند
2. **SSR**: در Server-Side Rendering، کش غیرفعال است
3. **حجم**: IndexedDB محدودیت حجم دارد (معمولاً 50MB+)
4. **امنیت**: داده‌های حساس را کش نکنید
5. **Hydration**: مشکل hydration ندارد چون فقط در client اجرا می‌شود
6. **داده‌های خالی**: داده‌های خالی (آرایه‌های خالی) کش نمی‌شوند

---

## پشتیبانی مرورگرها

### Service Worker
- ✅ Chrome 40+
- ✅ Firefox 44+
- ✅ Safari 11.1+
- ✅ Edge 17+

### IndexedDB
- ✅ Chrome 24+
- ✅ Firefox 16+
- ✅ Safari 10+
- ✅ Edge 12+
- ✅ iOS Safari 10+
- ✅ Android Browser 4.4+

---

## منابع

- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Cache Strategies](https://web.dev/offline-cookbook/)
- [PWA Checklist](https://web.dev/pwa-checklist/)

---

**نسخه**: 1.0.0  
**آخرین به‌روزرسانی**: فوریه 2026  
**نویسنده**: تیم توسعه روضة الحسین
