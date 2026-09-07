# راهنمای تست PeaksTimeline

## خلاصه

کامپوننت `PeaksTimeline` با استفاده از کتابخانه Peaks.js ایجاد شده و به عنوان جایگزین `AudioTimeline` (WaveSurfer) برای تست عملکرد در دسترس است.

## نصب

Peaks.js از قبل نصب شده است:

```bash
pnpm add peaks.js
```

## کامپوننت‌های موجود

### 1. PeaksTimeline

کامپوننت اصلی timeline با Peaks.js

```typescript
import { PeaksTimeline } from '@/shared/components/player/audio'

<PeaksTimeline
  type="waveform"
  isActive={isActive}
  progress={progress}
  bufferedProgress={bufferedProgress}
  audioSrc={track.audioSrc}
  onSeek={handleSeek}
  lazyLoad={true}
/>
```

### 2. TimelineComparison

کامپوننت تست برای مقایسه WaveSurfer و Peaks.js

```typescript
import { TimelineComparison } from '@/shared/components/player/audio'

<TimelineComparison
  track={track}
  progress={progress}
  bufferedProgress={bufferedProgress}
  isActive={isActive}
  onSeek={handleSeek}
/>
```

## نحوه تست

### روش 1: استفاده از TimelineComparison

این ساده‌ترین روش است. کامپوننت `TimelineComparison` هر دو timeline را کنار هم نمایش می‌دهد.

**مثال در InlineAudioPlayer:**

```typescript
// shared/components/player/audio/InlineAudioPlayer.tsx

import { TimelineComparison } from './TimelineComparison'

// در بدنه کامپوننت:
return (
  <div className="relative w-full">
    {/* ... */}
    
    {/* جایگزین AudioTimeline با TimelineComparison */}
    <TimelineComparison
      track={track}
      progress={progress}
      bufferedProgress={bufferedProgress}
      isActive={isThisPlayerActive}
      onSeek={handleSeek}
    />
    
    {/* ... */}
  </div>
)
```

### روش 2: جایگزینی مستقیم AudioTimeline با PeaksTimeline

برای تست سریع، می‌توانید مستقیماً `AudioTimeline` را با `PeaksTimeline` جایگزین کنید:

```typescript
// قبل:
import { AudioTimeline } from './AudioTimeline'

<AudioTimeline
  type={timelineType}
  isActive={isThisPlayerActive}
  progress={progress}
  bufferedProgress={bufferedProgress}
  audioSrc={track.audioSrc}
  onSeek={handleSeek}
  lazyLoad={lazyLoadWaveform}
/>

// بعد:
import { PeaksTimeline } from './PeaksTimeline'

<PeaksTimeline
  type={timelineType}
  isActive={isThisPlayerActive}
  progress={progress}
  bufferedProgress={bufferedProgress}
  audioSrc={track.audioSrc}
  onSeek={handleSeek}
  lazyLoad={lazyLoadWaveform}
/>
```

## معیارهای تست

### 1. سرعت Load

**ابزار:** Chrome DevTools → Network Tab

- باز کردن DevTools (F12)
- رفتن به تب Network
- فیلتر کردن روی Media یا All
- مقایسه زمان دانلود و پردازش فایل‌های صوتی

**انتظار:**
- WaveSurfer: دانلود کامل فایل صوتی
- Peaks.js: دانلود کامل فایل صوتی (در حالت WebAudio)

### 2. مصرف CPU و Memory

**ابزار:** Chrome DevTools → Performance Monitor

- باز کردن Command Palette (Ctrl+Shift+P)
- تایپ "Show Performance Monitor"
- مشاهده CPU usage و JS heap size

**سناریوهای تست:**
1. لود یک صفحه با 10 track
2. Scroll سریع در لیست
3. کلیک روی چند track متوالی
4. باز کردن چند tab همزمان

**انتظار:**
- Peaks.js: مصرف CPU کمتر در زمان initialization
- WaveSurfer: مصرف CPU بیشتر برای فایل‌های طولانی

### 3. کیفیت Waveform

**معیارها:**
- وضوح و جزئیات waveform
- نرمی انیمیشن progress
- دقت نمایش در zoom levels مختلف

### 4. تجربه کاربری

**معیارها:**
- سرعت واکنش به کلیک
- نرمی seek
- عدم freeze شدن UI
- عدم قفل شدن browser در scroll سریع

## سناریوهای تست پیشنهادی

### سناریو 1: فایل‌های کوتاه (< 5 دقیقه)

1. باز کردن صفحه جزئیات صوت
2. کلیک روی play
3. مشاهده سرعت load waveform
4. تست seek به نقاط مختلف

### سناریو 2: فایل‌های طولانی (> 30 دقیقه)

1. باز کردن صفحه جزئیات جلسه
2. مشاهده تب صوت‌ها (10+ track)
3. Scroll سریع در لیست
4. کلیک روی چند track متوالی
5. بررسی CPU و Memory usage

### سناریو 3: Lazy Loading

1. باز کردن صفحه با لیست طولانی
2. Scroll به پایین بدون توقف
3. بررسی تعداد waveform های load شده
4. مشاهده عدم freeze شدن UI

### سناریو 4: Multiple Tabs

1. باز کردن 3-4 tab از صفحات مختلف
2. Switch بین tab ها
3. بررسی عدم crash شدن
4. مشاهده Memory leaks

## نتایج مورد انتظار

### WaveSurfer (AudioTimeline)

**مزایا:**
- ✅ کتابخانه محبوب و پایدار
- ✅ مستندات عالی
- ✅ Community بزرگ
- ✅ Setup ساده

**معایب:**
- ❌ باید کل فایل را دانلود کند
- ❌ مصرف CPU بالا برای فایل‌های طولانی
- ❌ ممکن است browser را freeze کند

### Peaks.js (PeaksTimeline)

**مزایا:**
- ✅ Progressive loading (با pre-computed waveforms)
- ✅ مصرف CPU کمتر
- ✅ بهینه برای فایل‌های بزرگ
- ✅ Multiple views (overview + zoomview)

**معایب:**
- ❌ Setup پیچیده‌تر
- ❌ Community کوچک‌تر
- ❌ در حالت WebAudio باید کل فایل را دانلود کند (مثل WaveSurfer)

## نکات مهم

### 1. WebAudio vs Pre-computed Waveforms

در پیاده‌سازی فعلی، هر دو کتابخانه از WebAudio استفاده می‌کنند که به معنی دانلود کامل فایل است.

**برای بهره‌برداری کامل از Peaks.js:**
- باید waveform ها را از قبل محاسبه کنید (با audiowaveform)
- فایل‌های .dat یا .json را در سرور ذخیره کنید
- در frontend از dataUri استفاده کنید

### 2. Lazy Loading

هر دو کامپوننت از Intersection Observer برای lazy loading استفاده می‌کنند:
- Waveform فقط وقتی load می‌شود که در viewport باشد
- با debounce 100ms برای جلوگیری از load همزمان

### 3. Performance در Production

برای بهترین performance در production:
- استفاده از pre-computed waveforms (Peaks.js)
- یا استفاده از WaveSurfer با lazy loading
- یا ترکیب: WaveSurfer برای فایل‌های کوتاه، Peaks.js برای فایل‌های طولانی

## گزارش نتایج

بعد از تست، موارد زیر را گزارش دهید:

1. **سرعت Load:**
   - WaveSurfer: X ثانیه
   - Peaks.js: Y ثانیه

2. **مصرف CPU:**
   - WaveSurfer: X%
   - Peaks.js: Y%

3. **مصرف Memory:**
   - WaveSurfer: X MB
   - Peaks.js: Y MB

4. **تجربه کاربری:**
   - کدام نرم‌تر است؟
   - کدام سریع‌تر واکنش می‌دهد؟
   - آیا freeze یا lag وجود دارد؟

5. **توصیه نهایی:**
   - کدام را برای production انتخاب می‌کنید؟
   - چرا؟

## مراجع

- [WaveSurfer.js Documentation](https://wavesurfer-js.org/)
- [Peaks.js GitHub](https://github.com/bbc/peaks.js)
- [Peaks.js Tutorial](https://www.trevorlasn.com/blog/peaks-js-interact-with-audio-waveforms)
- [audiowaveform Tool](https://github.com/bbc/audiowaveform)

---

**نسخه:** 1.0.0  
**تاریخ:** دسامبر 2024
