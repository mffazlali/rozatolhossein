# روضة الحسین — پلتفرم محتوای مذهبی

<div dir="rtl">

پلتفرم رسمی هیئت **روضة الحسین علیه السلام** برای انتشار صوت‌ها، ویدیوها و گزارش جلسات مذهبی. این پروژه یک وب‌اپلیکیشن مدرن بر پایه Next.js 16 است که با پشتیبانی از زبان‌های فارسی/انگلیسی، تم تاریک/روشن و پخش‌کننده‌های پیشرفته صوت و ویدیو ساخته شده است.

🌐 **وبسایت**: [rozatolhosein.com](https://rozatolhosein.com/fa)

---

## فهرست مطالب

- [پیش‌نیازها](#پیش‌نیازها)
- [نصب و راه‌اندازی](#نصب-و-راه‌اندازی)
- [متغیرهای محیطی](#متغیرهای-محیطی)
- [دستورات](#دستورات)
- [معماری پروژه](#معماری-پروژه)
- [ساختار دایرکتوری‌ها](#ساختار-دایرکتوری‌ها)
- [Routing و Locale](#routing-و-locale)
- [سیستم تم](#سیستم-تم)
- [Providers و Contexts](#providers-و-contexts)
- [Services و API](#services-و-api)
- [پلیرها](#پلیرها)
- [استایل‌دهی](#استایل‌دهی)
- [استقرار با Docker](#استقرار-با-docker)
- [استانداردهای کدنویسی](#استانداردهای-کدنویسی)

---

## پیش‌نیازها

| ابزار | نسخه پیشنهادی |
|-------|----------------|
| Node.js | 22+ |
| pnpm | 10.22.0 |

---

## نصب و راه‌اندازی

```bash
# نصب وابستگی‌ها
pnpm install

# کپی فایل محیطی
cp .env.example .env.local

# اجرای محیط توسعه (port 3002)
pnpm dev
```

---

## متغیرهای محیطی

فایل `.env.local` را بر اساس `.env.example` بسازید. متغیرهای مورد نیاز:

| متغیر | توضیح |
|-------|-------|
| `NEXT_PUBLIC_API_BASE_URL` | آدرس پایه API |
| `NEXT_PUBLIC_API_VERSION` | نسخه API (مثلاً `ape-api/v1`) |
| `NEXT_PUBLIC_API_DEFAULT_LANG` | زبان پیش‌فرض درخواست‌های API |
| `REVALIDATION_SECRET` | کلید مخفی برای ISR Revalidation |
| `NEXT_PUBLIC_ENABLE_RSC_PROTECTION` | محافظت در برابر درخواست‌های مشکوک RSC |
| `NEXT_PUBLIC_ENABLE_RSC_HEADER_VALIDATION` | اعتبارسنجی headerهای RSC |
| `NEXT_PUBLIC_ENABLE_SERVER_ACTION_PROTECTION` | محافظت در برابر حملات Server Action |
| `NEXT_PUBLIC_ENABLE_HEADER_MANIPULATION_PROTECTION` | محافظت در برابر دستکاری Header |
| `NEXT_PUBLIC_ENABLE_RCE_PROTECTION` | محافظت در برابر Remote Code Execution |

آدرس کامل API بدین شکل ساخته می‌شود:  
`{API_BASE_URL}/{API_VERSION}/{endpoint}?lang={locale}`

---

## دستورات

```bash
pnpm dev      # اجرای development server روی port 3002
pnpm build    # بیلد پروداکشن
pnpm start    # اجرای production server روی port 3000
pnpm lint     # بررسی با ESLint
```

---

## معماری پروژه

### تکنولوژی‌های اصلی

| دسته | تکنولوژی |
|------|-----------|
| Framework | Next.js 16 — App Router |
| Language | TypeScript 5 (Strict Mode) |
| Runtime | React 19 |
| Styling | Tailwind CSS 4 |
| Font | Vazirmatn (RTL) |
| Icons | FontAwesome Pro (fa-light) |
| UI Components | HeroUI (`@heroui/react`) |
| Forms | React Hook Form + Zod |
| Animation | Framer Motion + React Spring |
| Package Manager | pnpm 10 |

### وابستگی‌های مهم

```
react-player        پایه پلیر صوت/ویدیو
@vidstack/react     پلیر ویدیوی پیشرفته
wavesurfer.js       نمایش شکل موج صوت
peaks.js            timeline صوتی برای فایل‌های بزرگ
swiper              اسلایدر و carousel
@fancyapps/ui       lightbox گالری تصاویر
```

### الگوهای معماری

- **Server Components با Suspense** — داده‌ها در سمت سرور fetch می‌شوند؛ هیچ React Query یا SWR استفاده نمی‌شود
- **Feature-based structure** — هر feature مستقل است و Server Component + Client Components خود را دارد
- **ISR Support** — API Client از `cache`, `revalidate`, و `tags` های Next.js پشتیبانی می‌کند
- **Error Boundaries** — سه لایه مدیریت خطا: `error.tsx`، `ErrorBoundary`، `FeatureErrorFallback`
- **PWA Capabilities** — Service Worker و نمایش وضعیت آفلاین

---

## ساختار دایرکتوری‌ها

```
front-rozatolhossein/
│
├── app/                              # Next.js App Router
│   ├── (main)/[locale]/              # Route group اصلی
│   │   ├── (pages)/
│   │   │   ├── content/[contentId]/  # جزئیات محتوا (صوت/ویدیو/جلسه)
│   │   │   ├── search/               # صفحه جستجو
│   │   │   ├── service/[id]/         # لیست سرویس
│   │   │   ├── link/                 # صفحه لینک‌ها
│   │   │   └── [archive]/[id]/       # آرشیو (person, occasion, place, ...)
│   │   ├── layout.tsx                # Layout اصلی با Providers
│   │   └── page.tsx                  # صفحه اصلی
│   ├── (custom)/[locale]/            # Route group سفارشی
│   │   └── content/[contentId]/print-version/   # نسخه چاپی
│   ├── globals.css                   # تعریف @theme و رنگ‌های سیستم
│   ├── manifest.tsx                  # Web App Manifest
│   └── not-found.tsx
│
├── features/                         # ماژول‌های Feature-based
│   ├── home/                         # صفحه اصلی
│   ├── link/                         # صفحه لینک‌ها
│   ├── media/
│   │   ├── General/                  # لیست صوت، ویدیو، جلسه
│   │   │   ├── audio/
│   │   │   ├── video/
│   │   │   └── session/
│   │   └── details/                  # صفحات جزئیات
│   │       ├── audio/
│   │       ├── video/
│   │       └── session/
│   ├── search/                       # ماژول جستجو
│   ├── story/                        # استوری‌ها
│   └── printVersion/                 # نسخه چاپی محتوا
│
├── shared/                           # منابع مشترک
│   ├── components/
│   │   ├── dataDisplay/              # AudioCard, VideoCard, SessionCard, MetaTags
│   │   ├── dataEntry/                # FormButton, FormInput, FormSelect
│   │   ├── feedback/                 # MediaEmpty, MediaNotFound, Progress
│   │   ├── forms/                    # FilterSelect, SearchInput
│   │   ├── general/                  # ErrorBoundary, FeatureErrorFallback, PlaceholderImage
│   │   ├── navigation/               # Breadcrumb, Pagination, SectionHeader
│   │   └── player/                   # پلیرهای صوت و ویدیو
│   │       ├── audio/
│   │       ├── video/
│   │       └── shared/
│   ├── contexts/                     # React Contexts
│   ├── hooks/                        # Custom Hooks
│   ├── icons/                        # SVG icons سفارشی
│   ├── layout/                       # Header, Footer, MobileNavBar
│   ├── lib/                          # Utilities (apiClient, i18n, themeScript)
│   ├── providers/                    # Provider wrappers
│   ├── services/                     # API Services
│   └── types/                        # TypeScript Types
│
├── public/
│   ├── fonts/fontawesome/            # FontAwesome Pro (CSS + fonts)
│   └── images/
│
├── docs/                             # مستندات معماری پلیر و بهینه‌سازی
├── .env.example
├── Dockerfile
└── package.json
```

---

## Routing و Locale

پروژه از **locale-based routing** استفاده می‌کند:

| URL Pattern | صفحه |
|-------------|------|
| `/{locale}/` | صفحه اصلی |
| `/{locale}/content/{contentId}` | جزئیات محتوا |
| `/{locale}/search` | جستجو |
| `/{locale}/service/{id}` | لیست سرویس |
| `/{locale}/link` | صفحه لینک‌ها |
| `/{locale}/{archive}/{id}` | آرشیو |
| `/{locale}/content/{contentId}/print-version` | نسخه چاپی |

**Locales پشتیبانی شده:**

| کد | زبان | جهت |
|----|------|-----|
| `fa` | فارسی (پیش‌فرض) | RTL |
| `en` | انگلیسی | LTR |

```typescript
// دریافت locale در Server Component
interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const direction = locale === 'fa' ? 'rtl' : 'ltr';
}
```

---

## سیستم تم

پروژه از سیستم تم دوگانه **Dark / Light** با CSS Custom Properties پشتیبانی می‌کند.

### نحوه کار

تم از طریق class روی `<html>` اعمال می‌شود:

```html
<html class="dark">   <!-- تم تاریک -->
<html class="light">  <!-- تم روشن -->
```

یک inline script قبل از hydration تزریق می‌شود تا از **flash of wrong theme** جلوگیری شود. تم پیش‌فرض از API دریافت و در `localStorage` ذخیره می‌شود.

### رنگ‌های اصلی

```css
/* Dark Theme */
--color-dark-primary-teal:  #129197
--color-dark-primary-gold:  #bf9c5c
--color-dark-primary-red:   #991010
--color-dark-black:         #181818
--color-dark-gray-dark:     #121212

/* Light Theme */
--color-light-primary-teal: #0fa8b0
--color-light-primary-gold: #d4a84a
--color-light-primary-red:  #c41414
--color-light-black:        #ffffff
--color-light-gray-dark:    #f5f5f5
```

### استفاده در کامپوننت‌ها

```tsx
// رنگ‌های ثابت dark
<div className="bg-dark-black text-dark-white">

// رنگ‌های theme-aware (تغییر خودکار با تم)
<div className="bg-theme-black text-theme-gray">

// دسترسی به context
import { useTheme } from '@/shared/contexts';
const { theme, toggleTheme } = useTheme();
```

---

## Providers و Contexts

### ترتیب Nesting Providers

```tsx
ThemeProvider
  └── UIProvider (HeroUI)
       └── ActivePlayerProvider
            └── AudioPlayerProvider
                 └── VideoPlayerProvider
                      └── SharedReactPlayerProvider
                           └── {children}
```

### Contexts

| Context | Export | کاربرد |
|---------|--------|--------|
| `ThemeContext` | `useTheme()` | تم dark/light |
| `ActivePlayerContext` | `useActivePlayer()` | کدام پلیر فعال است |
| `AudioPlayerContext` | `useAudioPlayer()` | وضعیت پلیر صوت |
| `VideoPlayerContext` | `useVideoPlayer()` | وضعیت پلیر ویدیو |

```typescript
// ThemeContext
const { theme, setTheme, toggleTheme } = useTheme();

// ActivePlayerContext
const { activePlayer, setActivePlayer } = useActivePlayer();
// activePlayer: 'audio' | 'video' | null

// AudioPlayerContext
const { currentTrack, isPlaying, playTrack, playNext, playPrevious, setPlaylist } = useAudioPlayer();

// VideoPlayerContext
const { currentVideo, isPlaying, playVideo, playNext, playPrevious } = useVideoPlayer();
```

> وقتی یک پلیر فعال می‌شود، `ActivePlayerContext` پلیر دیگر را خودکار می‌بندد.

---

## Services و API

### API Client

فایل `shared/lib/apiClient.ts` از native `fetch` استفاده می‌کند و از قابلیت‌های ISR در Next.js بهره می‌برد:

```typescript
import { apiClient } from '@/shared/lib/apiClient';

// GET ساده
const data = await apiClient.get<ResponseType>('page/home', { lang: 'fa' });

// با تنظیمات cache
const data = await apiClient.get<ResponseType>(
  'page/home',
  { lang: 'fa' },
  { next: { revalidate: 3600, tags: ['home'] } }
);
```

### Services موجود

```typescript
import { 
  homeService,
  contentService,
  menuService,
  searchService,
  seoService,
  termService,
  vocabService
} from '@/shared/services';
```

| سرویس | متدهای اصلی |
|-------|-------------|
| `homeService` | `getHomeData(lang)` |
| `menuService` | `getHeaderMenu(lang)`, `getFooterMenu(lang)`, `getDefaultTheme(lang)` |
| `contentService` | `getAudioDetail(id, lang)`, `getVideoDetail(id, lang)`, `getSessionDetail(id, lang)` |
| `searchService` | `search(params)`, `searchByService(id)`, `searchByPeople(id)`, `searchByTag(id)`, ... |
| `seoService` | `getAudioMetadata(id, lang)`, `getVideoMetadata(id, lang)`, `getSessionMetadata(id, lang)` |

### الگوی Data Fetching

```typescript
// Server Component — بدون React Query
async function DataFetcher({ id, locale }: Props) {
  let data = null;
  
  try {
    data = await contentService.getAudioDetail(id, locale);
  } catch (error) {
    console.error('Error:', error);
    throw error; // re-throw برای error.tsx
  }
  
  if (!data) throw new Error('Not found');
  
  return <ClientContent data={data} />;
}

// استفاده با Suspense
const Feature = ({ id, locale }: Props) => (
  <Suspense fallback={<FeatureSkeleton />}>
    <DataFetcher id={id} locale={locale} />
  </Suspense>
);
```

---

## پلیرها

### Audio Players

| کامپوننت | کاربرد |
|----------|--------|
| `UnifiedAudioPlayer` | پلیر اصلی — حالت `linear` (نوار ساده) یا `waveform` (شکل موج) |
| `InlineAudioPlayer` | پلیر جاسازی شده در جای تصویر محتوا |
| `AudioTimeline` | نمایش شکل موج با wavesurfer.js |
| `PeaksTimeline` | timeline پیشرفته با peaks.js برای فایل‌های بزرگ |
| `FixedAudioPlayer` | پلیر ثابت پایین صفحه |
| `MiniAudioPlayer` | پلیر کوچک |

### Video Players

| کامپوننت | کاربرد |
|----------|--------|
| `UnifiedVideoPlayer` | پلیر اصلی ویدیو با `@vidstack/react` |
| `InlineVideoPlayer` | پلیر جاسازی شده در جای تصویر |
| `CustomVideoControls` | کنترل‌های سفارشی ویدیو |
| `FixedVideoPlayer` | پلیر ثابت پایین صفحه |
| `MiniVideoPlayer` | پلیر کوچک |

### کنترل‌های مشترک

```typescript
import { PlaybackRateControl, VolumeControl } from '@/shared';

<PlaybackRateControl currentRate={rate} onRateChange={setRate} />
<VolumeControl volume={vol} isMuted={muted} onVolumeChange={setVol} onMuteToggle={toggleMute} />
```

---

## استایل‌دهی

### قوانین اصلی

- فقط **Tailwind CSS** — هیچ `style={{...}}` و CSS Module استفاده نمی‌شود
- Layout فقط با **Flexbox** — نه Grid
- رنگ‌ها فقط از سیستم تم: `dark-*`, `light-*`, `theme-*` — نه arbitrary color مثل `bg-[#hex]`
- آیکون‌ها فقط از **fa-light** FontAwesome Pro

```tsx
// ✅ درست
<div className="flex flex-col gap-4 bg-theme-black text-theme-white rounded-lg p-4">
  <i className="fa-light fa-play text-dark-primary-teal" />
</div>

// ❌ اشتباه
<div style={{ display: 'flex' }} className="bg-[#181818] grid grid-cols-2">
  <i className="fa-solid fa-play" />
</div>
```

### Path Aliases

```typescript
"@/*"          → "./*"
"@/shared/*"   → "./shared/*"
"@/features/*" → "./features/*"
"@/app/*"      → "./app/*"
"@/public/*"   → "./public/*"
```

### Barrel Exports

همه کامپوننت‌های shared از مسیر `@/shared` قابل دسترس هستند:

```typescript
import { AudioCard, VideoCard, SessionCard } from '@/shared';
import { ErrorBoundary, FeatureErrorFallback } from '@/shared';
import { Breadcrumb, Pagination, SectionHeader } from '@/shared';
import { UnifiedAudioPlayer, UnifiedVideoPlayer } from '@/shared';
```

---

## Error Handling

سه لایه برای مدیریت خطا:

```
1. error.tsx          ← خطاهای Server Component (صفحات detail)
2. ErrorBoundary      ← خطاهای Client Component
3. FeatureErrorFallback ← کامپوننت نمایش خطا
```

```tsx
// Client Component
<ErrorBoundary
  fallback={({ error, retry }) => (
    <FeatureErrorFallback error={error} retry={retry} featureName="صوت‌ها" />
  )}
  resetOnPropsChange>
  <Content />
</ErrorBoundary>
```

---

## استقرار با Docker

پروژه دارای Dockerfile بهینه‌شده با multi-stage build است:

```bash
# Build image
docker build -t rozatolhossein-front .

# Run container
docker run -p 3000:3000 rozatolhossein-front
```

Image نهایی با Node.js 22 Alpine ساخته می‌شود و standalone output برای حداقل حجم استفاده می‌کند.

---

## استانداردهای کدنویسی

### نام‌گذاری

| نوع | الگو | مثال |
|-----|------|------|
| کامپوننت | PascalCase | `AudioCard.tsx` |
| سرویس | camelCase | `contentService.ts` |
| Hook | camelCase با `use` | `useAudioPlayer.ts` |
| Types | camelCase | `media.ts` |
| ثابت‌ها | UPPER_SNAKE_CASE | `API_BASE_URL` |

### TypeScript

```typescript
// همیشه interface برای props
interface ComponentProps {
  title: string;
  data?: DataType;
  className?: string;
}

export const Component = ({ title, data, className = '' }: ComponentProps) => {
  // ...
};
```

### Responsive Design

```tsx
// Mobile first
<div className="flex flex-col md:flex-row gap-4">
<div className="w-full md:w-1/2 lg:w-1/3">
<div className="hidden md:flex">  {/* فقط desktop */}
<div className="flex md:hidden">  {/* فقط mobile */}
```

---

## مستندات بیشتر

پوشه `docs/` شامل مستندات فنی دقیق‌تر است:

| فایل | محتوا |
|------|------|
| `player-architecture.md` | معماری کامل سیستم پلیر |
| `audio-timeline-integration.md` | یکپارچه‌سازی timeline صوتی |
| `peaks-vs-wavesurfer-final.md` | مقایسه peaks.js و wavesurfer.js |
| `waveform-performance-optimization.md` | بهینه‌سازی نمایش شکل موج |
| `offline-cache-complete-guide.md` | راهنمای کامل offline caching |

---

<div align="center">
  <strong>هیئت روضة الحسین علیه السلام</strong>
</div>

</div>
