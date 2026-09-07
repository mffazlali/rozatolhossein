# Audio Timeline Integration - تایم‌لاین قابل تغییر

## نمای کلی

سیستم تایم‌لاین صوتی به گونه‌ای طراحی شده که می‌تواند بین دو حالت **خطی (Linear)** و **موجی (Waveform)** سوییچ کند، در حالی که از همان **ReactPlayer مشترک** استفاده می‌کند.

## معماری

### ساختار کلی

```
SharedReactPlayerProvider (ReactPlayer مشترک)
    ↓
InlineAudioPlayer (UI پلیر)
    ↓
AudioTimeline (تایم‌لاین قابل تغییر)
    ├── Linear Timeline (خطی)
    └── Waveform Timeline (موجی با WaveSurfer)
```

### نکات کلیدی

1. **ReactPlayer مشترک**: همان instance برای همه حالت‌ها استفاده می‌شود
2. **فقط UI تغییر می‌کند**: تایم‌لاین بین خطی و موجی سوییچ می‌کند
3. **WaveSurfer فقط برای نمایش**: برای تحلیل و نمایش موج استفاده می‌شود، نه پخش
4. **Sync کامل**: progress از ReactPlayer به WaveSurfer منتقل می‌شود

## کامپوننت‌ها

### 1. AudioTimeline

کامپوننت اصلی که دو نوع تایم‌لاین را مدیریت می‌کند.

#### Props

```typescript
interface AudioTimelineProps {
  /** نوع تایم‌لاین: خطی یا موجی */
  type: 'linear' | 'waveform'
  /** آیا این player فعال است */
  isActive: boolean
  /** درصد پخش شده (0-100) */
  progress: number
  /** درصد بافر شده (0-100) */
  bufferedProgress: number
  /** URL فایل صوتی (فقط برای waveform) */
  audioSrc?: string
  /** تابع seek */
  onSeek: (percentage: number) => void
  /** کلاس اضافی */
  className?: string
  /** آیا waveform را lazy load کنیم (پیش‌فرض: true) */
  lazyLoad?: boolean
}
```

#### ویژگی‌ها

**Linear Timeline:**
- Progress bar ساده با رنگ‌های theme
- نمایش buffered progress
- Thumb برای نمایش موقعیت فعلی
- Hover effect برای بهبود UX

**Waveform Timeline:**
- استفاده از WaveSurfer.js برای تحلیل موج
- نمایش بصری موج صوتی
- Sync با progress از ReactPlayer
- `interact: false` برای جلوگیری از conflict

#### تنظیمات WaveSurfer

```typescript
{
  waveColor: '#7d7d7d',        // رنگ موج (theme-gray)
  progressColor: '#ffffff',     // رنگ پیشرفت (theme-white)
  cursorColor: 'transparent',   // بدون cursor
  barWidth: 2,                  // عرض هر bar
  barGap: 1,                    // فاصله بین barها
  barRadius: 2,                 // گردی گوشه‌ها
  height: 32,                   // ارتفاع waveform
  normalize: true,              // نرمال‌سازی موج
  backend: 'WebAudio',          // استفاده از Web Audio API
  interact: false,              // غیرفعال (seek از طریق onClick)
}
```

#### رفتار WaveSurfer

- **Lazy Loading**: با `lazyLoad={true}`, WaveSurfer فقط وقتی در viewport باشد initialize می‌شود
- **Intersection Observer**: با `rootMargin: '50px'`, 50px قبل از viewport شروع به load می‌کند
- **Debounced Loading**: با تاخیر 100ms load می‌شود تا از قفل شدن browser جلوگیری شود
- **Loading Indicator**: در حین load، spinner و متن نمایش داده می‌شود
- **Placeholder**: قبل از load، آیکون waveform نمایش داده می‌شود
- **Sync**: progress از ReactPlayer به WaveSurfer منتقل می‌شود
- **Cleanup**: WaveSurfer در cleanup destroy می‌شود

#### Performance Optimization

برای جلوگیری از قفل شدن مرورگر در صفحات با چندین player:
- از `lazyLoad={true}` برای لیست‌ها استفاده کن (پیش‌فرض)
- از `lazyLoad={false}` برای single player استفاده کن
- مستندات کامل: `docs/waveform-performance-optimization.md`

### 2. InlineAudioPlayer (به‌روزرسانی شده)

#### Props جدید

```typescript
interface InlineAudioPlayerProps {
  track: AudioTrack
  onPlay?: () => void
  /** نوع تایم‌لاین: linear یا waveform */
  timelineType?: TimelineType  // پیش‌فرض: 'linear'
  /** آیا waveform را lazy load کنیم (پیش‌فرض: true) */
  lazyLoadWaveform?: boolean
}
```

#### استفاده

```typescript
// با lazy loading (برای لیست‌ها)
<InlineAudioPlayer 
  track={track} 
  onPlay={handlePlay}
  timelineType="waveform"
  lazyLoadWaveform={true}  // پیش‌فرض
/>

// بدون lazy loading (برای single player)
<InlineAudioPlayer 
  track={track} 
  onPlay={handlePlay}
  timelineType="waveform"
  lazyLoadWaveform={false}
/>
```

### 3. AudioPlayerCard (به‌روزرسانی شده)

#### State جدید

```typescript
const [timelineType, setTimelineType] = useState<TimelineType>('linear')
```

#### دکمه Toggle

دکمه‌ای برای تغییر بین دو نوع تایم‌لاین:
- آیکون `fa-waveform-lines` در حالت linear (برای نمایش waveform)
- آیکون `fa-bars` در حالت waveform (برای نمایش linear)

#### موقعیت دکمه

- **Desktop**: کنار دکمه دانلود در سمت راست
- **Mobile**: زیر duration در سمت راست

### 4. UnifiedAudioPlayer (به‌روزرسانی شده)

پلیر یکپارچه که بین حالت‌های mini و expanded سوییچ می‌کند، حالا از `AudioTimeline` استفاده می‌کند.

#### State جدید

```typescript
const [timelineType, setTimelineType] = useState<TimelineType>('linear')
```

#### دکمه Toggle

دکمه toggle در هر دو حالت mini و expanded:
- **Expanded Player**: در کنار دکمه‌های compress و close
- **Mini Player Desktop**: در کنار دکمه‌های expand، volume و close
- **Mini Player Mobile**: در انتهای progress bar

#### استفاده از AudioTimeline

```typescript
// در expanded player
<AudioTimeline
  type={timelineType}
  isActive={true}
  progress={progress}
  bufferedProgress={bufferedProgress}
  audioSrc={currentTrack.audioSrc}
  onSeek={handleSeek}
  className="h-2"
/>

// در mini player
<AudioTimeline
  type={timelineType}
  isActive={true}
  progress={progress}
  bufferedProgress={bufferedProgress}
  audioSrc={currentTrack.audioSrc}
  onSeek={handleSeek}
  className="flex-1"
/>
```

## نحوه استفاده

### 1. استفاده پایه

```typescript
import { InlineAudioPlayer, TimelineType } from '@/shared'

const [timelineType, setTimelineType] = useState<TimelineType>('linear')

<InlineAudioPlayer 
  track={track}
  timelineType={timelineType}
/>
```

### 2. با دکمه Toggle

```typescript
const handleToggle = () => {
  setTimelineType(prev => prev === 'linear' ? 'waveform' : 'linear')
}

<button onClick={handleToggle}>
  <i className={`fa-light ${timelineType === 'linear' ? 'fa-waveform-lines' : 'fa-bars'}`} />
</button>

<InlineAudioPlayer 
  track={track}
  timelineType={timelineType}
/>
```

### 3. استفاده مستقیم از AudioTimeline

```typescript
import { AudioTimeline } from '@/shared'

<AudioTimeline
  type="waveform"
  isActive={isThisPlayerActive}
  progress={progress}
  bufferedProgress={bufferedProgress}
  audioSrc={track.audioSrc}
  onSeek={(percentage) => seek(percentage * duration)}
/>
```

## جریان داده (Data Flow)

```
1. ReactPlayer پخش می‌کند
   ↓
2. SharedReactPlayerProvider state را به‌روز می‌کند
   ↓
3. InlineAudioPlayer از useSharedReactPlayer استفاده می‌کند
   ↓
4. AudioTimeline progress را دریافت می‌کند
   ↓
5. در حالت waveform:
   - WaveSurfer.seekTo(progress) صدا زده می‌شود
   - موج بصری به‌روز می‌شود
   ↓
6. در حالت linear:
   - Progress bar با CSS به‌روز می‌شود
```

## Seek Flow

```
1. کاربر روی تایم‌لاین کلیک می‌کند
   ↓
2. AudioTimeline.handleClick محاسبه می‌کند
   ↓
3. onSeek(percentage) صدا زده می‌شود
   ↓
4. InlineAudioPlayer.handleSeek
   ↓
5. seek(percentage * duration)
   ↓
6. ReactPlayer به موقعیت جدید می‌رود
   ↓
7. تایم‌لاین به‌روز می‌شود
```

## تفاوت‌های کلیدی با رویکرد قبلی

| ویژگی | رویکرد قبلی (اشتباه) | رویکرد فعلی (صحیح) |
|-------|---------------------|-------------------|
| ReactPlayer | دو instance جداگانه | یک instance مشترک |
| WaveSurfer | برای پخش | فقط برای نمایش |
| Sync | دشوار و پیچیده | خودکار و ساده |
| Performance | سنگین (دو player) | بهینه (یک player) |
| State Management | پیچیده | ساده |

## نکات مهم

### 1. WaveSurfer فقط برای نمایش

```typescript
// ❌ اشتباه - استفاده از WaveSurfer برای پخش
wavesurfer.play()
wavesurfer.pause()

// ✅ صحیح - فقط برای نمایش
wavesurfer.seekTo(progress / 100)  // sync با ReactPlayer
```

### 2. Interact غیرفعال

```typescript
// WaveSurfer با interact: false
// seek از طریق onClick روی container انجام می‌شود
interact: false
```

### 3. Conditional Rendering

```typescript
// WaveSurfer ایجاد می‌شود وقتی:
// 1. type === 'waveform'
// 2. audioSrc موجود باشد
// توجه: دیگر نیازی به isActive نیست - موج قبل از پخش نمایش داده می‌شود
```

### 4. Performance

- WaveSurfer برای تحلیل موج زمان نیاز دارد
- در لیست‌های بزرگ، استفاده از linear بهتر است
- برای صفحات detail، waveform تجربه بهتری ارائه می‌دهد

### 5. Cleanup

```typescript
// WaveSurfer باید در cleanup destroy شود
useEffect(() => {
  return () => {
    if (wavesurfer) {
      wavesurfer.destroy()
    }
  }
}, [])
```

## مثال کامل

```typescript
'use client'

import { useState } from 'react'
import { InlineAudioPlayer, TimelineType, AudioTrack } from '@/shared'

export function MyAudioPlayer() {
  const [timelineType, setTimelineType] = useState<TimelineType>('linear')
  
  const track: AudioTrack = {
    id: '1',
    title: 'نمونه صوت',
    artist: 'مداح',
    image: '/image.jpg',
    duration: '05:30',
    audioSrc: '/audio.mp3',
    href: '/audio/1',
  }

  const handleToggle = () => {
    setTimelineType(prev => prev === 'linear' ? 'waveform' : 'linear')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3>پلیر صوتی</h3>
        <button
          onClick={handleToggle}
          className="text-theme-gray hover:text-theme-white"
          title={timelineType === 'linear' ? 'نمایش موج' : 'نمایش خطی'}>
          <i className={`fa-light ${
            timelineType === 'linear' ? 'fa-waveform-lines' : 'fa-bars'
          } text-lg`} />
        </button>
      </div>
      
      <InlineAudioPlayer 
        track={track}
        timelineType={timelineType}
      />
    </div>
  )
}
```

## فایل‌های تغییر یافته

1. **shared/components/player/audio/AudioTimeline.tsx** (جدید)
   - کامپوننت تایم‌لاین قابل تغییر
   - مدیریت linear و waveform

2. **shared/components/player/audio/InlineAudioPlayer.tsx**
   - اضافه شدن prop `timelineType`
   - استفاده از `AudioTimeline`
   - حذف کد مربوط به progress bar

3. **shared/components/player/audio/UnifiedAudioPlayer.tsx**
   - اضافه شدن state `timelineType`
   - اضافه شدن دکمه toggle در mini و expanded
   - استفاده از `AudioTimeline` به جای progress bar
   - حذف `handleProgressClick` و جایگزینی با `handleSeek`

4. **features/media/details/audio/components/AudioPlayerCard.tsx**
   - اضافه شدن state `timelineType`
   - اضافه شدن دکمه toggle
   - ارسال prop به `InlineAudioPlayer`

5. **shared/components/player/audio/index.ts**
   - export کردن `AudioTimeline` و `TimelineType`

## آینده و بهبودها

### پیشنهادات

1. ذخیره ترجیح کاربر در localStorage
2. انیمیشن smooth برای تغییر بین دو حالت
3. تنظیمات سفارشی برای waveform (رنگ، ارتفاع)
4. پشتیبانی از zoom در waveform
5. نمایش markers روی waveform

### مثال localStorage

```typescript
const [timelineType, setTimelineType] = useState<TimelineType>(() => {
  const saved = localStorage.getItem('audio-timeline-type')
  return (saved as TimelineType) || 'linear'
})

useEffect(() => {
  localStorage.setItem('audio-timeline-type', timelineType)
}, [timelineType])
```

## وضعیت پیاده‌سازی

✅ **کامل شده:**
- AudioTimeline component
- InlineAudioPlayer integration
- UnifiedAudioPlayer integration (mini + expanded)
- AudioPlayerCard toggle button
- مستندات کامل

🎉 **همه بخش‌های پلیر صوتی حالا از timeline قابل تغییر پشتیبانی می‌کنند!**

---

**نسخه**: 1.0.0  
**تاریخ**: دسامبر 2024  
**نویسنده**: Kiro AI Assistant
