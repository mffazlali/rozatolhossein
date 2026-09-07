# ادغام ReactPlayer مشترک برای صوت و ویدیو

## خلاصه تغییرات

تمام کامپوننت‌های پلیر (`InlineReactPlayer`, `UnifiedReactPlayer`, `UnifiedVideoPlayer`) اکنون از **یک** `<ReactPlayer>` مشترک استفاده می‌کنند.

## ساختار جدید

### 1. SharedReactPlayerProvider (فایل جدید)
**مسیر**: `shared/components/player/SharedReactPlayerProvider.tsx`

این کامپوننت شامل:
- **یک** المنت `<ReactPlayer>` که برای هر دو صوت و ویدیو استفاده می‌شود
- بر اساس `activePlayer` از `ActivePlayerContext` تصمیم می‌گیرد که کدام media را پخش کند
- برای صوت: container با `display: none` مخفی می‌شود
- برای ویدیو: container visible است و با `appendChild` بین DOM containers جابجا می‌شود
- **بدون رندر شرطی** - یک ReactPlayer همیشه render می‌شود با props دینامیک

### 2. فایل‌های قدیمی (تبدیل به re-export)
- `shared/components/player/audio/SharedReactPlayer.tsx` → فقط re-export
- `shared/components/player/video/SharedReactVideoPlayer.tsx` → فقط re-export

این فایل‌ها اکنون فقط `useSharedReactPlayer` و `useSharedReactVideoPlayer` را از `SharedReactPlayerProvider` re-export می‌کنند.

### 3. Providers (به‌روزرسانی شده)
**مسیر**: `shared/providers/index.tsx`

```tsx
<ThemeProvider>
  <UIProvider>
    <ActivePlayerProvider>
      <AudioPlayerProvider>
        <VideoPlayerProvider>
          <SharedReactPlayerProvider>  {/* یک ReactPlayer مشترک + UI Components */}
            {children}
            <UnifiedReactPlayer />
            <UnifiedVideoPlayer />
          </SharedReactPlayerProvider>
        </VideoPlayerProvider>
      </AudioPlayerProvider>
    </ActivePlayerProvider>
  </UIProvider>
</ThemeProvider>
```

**نکته مهم**: 
- `SharedReactPlayerProvider` باید داخل `AudioPlayerProvider` و `VideoPlayerProvider` باشد چون به contexts آنها نیاز دارد
- `UnifiedReactPlayer` و `UnifiedVideoPlayer` در `SharedReactPlayerProvider` render می‌شوند
- `AudioPlayerProvider` و `VideoPlayerProvider` فقط context را فراهم می‌کنند

### 4. AudioPlayerProvider و VideoPlayerProvider (ساده‌سازی شده)
این دو provider فقط context را فراهم می‌کنند و دیگر UI components را render نمی‌کنند:

```tsx
// AudioPlayerProvider
<AudioPlayerContext>
  {children}
</AudioPlayerContext>

// VideoPlayerProvider
<VideoPlayerContext>
  {children}
</VideoPlayerContext>
```

UI components (`UnifiedReactPlayer` و `UnifiedVideoPlayer`) در `SharedReactPlayerProvider` render می‌شوند.

## مزایا

1. **یک ReactPlayer واحد**: فقط یک instance از ReactPlayer در کل برنامه
2. **بدون تداخل**: صوت و ویدیو نمی‌توانند همزمان پخش شوند
3. **کد تمیزتر**: منطق مشترک در یک جا
4. **عملکرد بهتر**: کمتر re-render و کمتر DOM manipulation
5. **سازگاری کامل**: تمام UI components بدون تغییر کار می‌کنند

## نحوه کار

1. `ActivePlayerContext` مشخص می‌کند که کدام player فعال است ('audio' یا 'video')
2. `SharedReactPlayerProvider` بر اساس `activePlayer`:
   - برای audio: `audioContext` را استفاده می‌کند و container را مخفی می‌کند
   - برای video: `videoContext` را استفاده می‌کند و container را visible می‌کند
3. UI components (`InlineReactPlayer`, `UnifiedReactPlayer`, `UnifiedVideoPlayer`) از hooks استفاده می‌کنند:
   - `useSharedReactPlayer()` برای audio
   - `useSharedReactVideoPlayer()` برای video (alias از همان hook)

## تست

برای تست کردن:
1. پخش یک صوت در InlineReactPlayer
2. پخش یک ویدیو در UnifiedVideoPlayer
3. سوییچ بین صوت و ویدیو
4. بررسی کنید که فقط یکی در هر زمان پخش می‌شود
5. تست کنید که جابجایی بین inline/mini/expanded برای هر دو کار می‌کند

## فایل‌های تغییر یافته

- ✅ `shared/components/player/SharedReactPlayerProvider.tsx` (جدید - شامل ReactPlayer + UI components)
- ✅ `shared/components/player/audio/SharedReactPlayer.tsx` (تبدیل به re-export)
- ✅ `shared/components/player/video/SharedReactVideoPlayer.tsx` (تبدیل به re-export)
- ✅ `shared/providers/index.tsx` (اضافه شدن SharedReactPlayerProvider)
- ✅ `shared/providers/AudioPlayerProvider.tsx` (ساده‌سازی - فقط context)
- ✅ `shared/providers/VideoPlayerProvider.tsx` (ساده‌سازی - فقط context)
- ✅ `shared/components/player/index.ts` (به‌روزرسانی exports)
- ✅ `shared/components/player/audio/index.ts` (به‌روزرسانی exports)
- ✅ `shared/components/player/video/index.ts` (به‌روزرسانی exports)

## نکات مهم

- ❌ هرگز دو `<ReactPlayer>` render نمی‌شود
- ✅ همیشه یک ReactPlayer با props دینامیک
- ✅ سوییچ بین audio/video با تغییر `activePlayer`
- ✅ تمام UI components بدون تغییر کار می‌کنند
- ✅ `SharedReactPlayerProvider` باید داخل Audio و Video context providers باشد
- ✅ UI components (`UnifiedReactPlayer`, `UnifiedVideoPlayer`) در `SharedReactPlayerProvider` render می‌شوند
- ✅ فقط یک `<ReactPlayer>` element در کل برنامه وجود دارد
