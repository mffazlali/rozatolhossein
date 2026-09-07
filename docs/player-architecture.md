# 🎵 مستندات کامل معماری Player - پروژه روضة الحسین

## 📋 فهرست مطالب

1. [نمای کلی معماری](#نمای-کلی-معماری)
2. [ساختار فایل‌ها و دایرکتوری‌ها](#ساختار-فایلها-و-دایرکتوریها)
3. [Contexts و مدیریت State](#contexts-و-مدیریت-state)
4. [کامپوننت‌های Player](#کامپوننتهای-player)
5. [جریان داده و ارتباطات](#جریان-داده-و-ارتباطات)
6. [سناریوهای استفاده](#سناریوهای-استفاده)
7. [نمودارهای معماری](#نمودارهای-معماری)

---

## 🏗️ نمای کلی معماری

### اصول طراحی

پروژه از معماری **Unified Shared Player** استفاده می‌کند که بر اساس این اصول بنا شده:

1. **Single ReactPlayer Instance**: فقط یک `<ReactPlayer>` در کل برنامه
2. **Context-Based State**: مدیریت state با React Context API
3. **Separation of Concerns**: جداسازی UI از Logic
4. **Shared Volume**: volume مشترک بین همه players
5. **Active Player Management**: فقط یک player در هر زمان فعال

### معماری سه‌لایه

```
┌─────────────────────────────────────────────────────────┐
│                    UI Layer (Components)                 │
│  UnifiedAudioPlayer, UnifiedVideoPlayer, InlinePlayer   │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                  State Layer (Contexts)                  │
│  ActivePlayerContext, AudioPlayerContext, VideoContext  │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│              Playback Layer (ReactPlayer)                │
│         SharedReactPlayerProvider + ReactPlayer          │
└─────────────────────────────────────────────────────────┘
```

---


## 📁 ساختار فایل‌ها و دایرکتوری‌ها

### 1. دایرکتوری `shared/contexts/`

```
shared/contexts/
├── ActivePlayerContext.tsx      # مدیریت player فعال (audio/video)
├── AudioPlayerContext.tsx       # مدیریت state صوت
├── VideoPlayerContext.tsx       # مدیریت state ویدیو
└── index.ts                     # Barrel export
```

#### نقش هر Context:

**ActivePlayerContext.tsx**
- **مسئولیت**: تعیین اینکه کدام player فعال است
- **State**: `activePlayer: 'audio' | 'video' | null`
- **قانون**: فقط یک player می‌تواند همزمان فعال باشد
- **استفاده**: توسط AudioPlayerContext و VideoPlayerContext

**AudioPlayerContext.tsx**
- **مسئولیت**: مدیریت کامل state پخش‌کننده صوت
- **State**: currentTrack, playlist, isPlaying, inlinePlayerId, isExpanded, etc.
- **Actions**: playTrack, playInline, playNext, playPrevious, closePlayer
- **استفاده**: توسط UnifiedAudioPlayer, InlineAudioPlayer, AudioCard

**VideoPlayerContext.tsx**
- **مسئولیت**: مدیریت کامل state پخش‌کننده ویدیو
- **State**: currentTrack, playlist, isFullscreen, isInlineInView, etc.
- **Actions**: playTrack, playInline, playNext, playPrevious, setIsFullscreen
- **استفاده**: توسط UnifiedVideoPlayer, InlineVideoPlayer, VideoCard

---

### 2. دایرکتوری `shared/components/player/`

```
shared/components/player/
├── SharedReactPlayerProvider.tsx    # Provider اصلی با ReactPlayer
├── usePlayerVolume.ts               # Hook مدیریت volume
├── index.ts                         # Barrel export
├── audio/
│   ├── InlineAudioPlayer.tsx        # پخش inline صوت
│   ├── UnifiedAudioPlayer.tsx       # UI اصلی صوت (mini/expanded)
│   ├── SampleReactAudioPlayer.tsx   # نمونه/دمو
│   └── index.ts
└── video/
    ├── InlineVideoPlayer.tsx        # پخش inline ویدیو
    ├── UnifiedVideoPlayer.tsx       # UI اصلی ویدیو (mini/fullscreen)
    ├── CustomVideoControls.tsx      # کنترل‌های سفارشی ویدیو
    └── index.ts
```

---


## 🎯 Contexts و مدیریت State

### 1. ActivePlayerContext

**مسیر**: `shared/contexts/ActivePlayerContext.tsx`

#### Interface:
```typescript
interface ActivePlayerContextType {
  activePlayer: 'audio' | 'video' | null
  setActivePlayer: (player: 'audio' | 'video' | null) => void
}
```

#### نقش:
- مدیریت player فعال در سطح global
- اطمینان از اینکه فقط یک player همزمان فعال است
- هماهنگی بین AudioPlayerContext و VideoPlayerContext

#### استفاده:
```typescript
const { activePlayer, setActivePlayer } = useActivePlayer()

// فعال کردن audio player
setActivePlayer('audio')

// فعال کردن video player
setActivePlayer('video')

// غیرفعال کردن همه
setActivePlayer(null)
```

#### رفتار:
- وقتی `activePlayer` تغییر می‌کند، player غیرفعال خودکار بسته می‌شود
- AudioPlayerContext و VideoPlayerContext با `useEffect` این تغییر را رصد می‌کنند

---

### 2. AudioPlayerContext

**مسیر**: `shared/contexts/AudioPlayerContext.tsx`

#### Interface:
```typescript
interface AudioTrack {
  id: string
  title: string
  artist: string
  image: string
  duration: string
  audioSrc: string
  href?: string
  isFromSession?: boolean
  sessionId?: string
}

interface AudioPlayerContextType {
  // State
  currentTrack: AudioTrack | null
  isPlayerVisible: boolean
  inlinePlayerId: string | null
  inlineTrack: AudioTrack | null
  isInlineInView: boolean
  isExpanded: boolean
  shouldResumePlayback: boolean
  wasPlayingBeforeMove: boolean
  isAudioPlaying: boolean
  playlist: AudioTrack[]
  
  // Actions
  playTrack: (track: AudioTrack) => void
  playInline: (track: AudioTrack, showPlayer?: boolean, setActive?: boolean) => void
  setInlineInView: (inView: boolean) => void
  setIsExpanded: (expanded: boolean) => void
  stopInline: () => void
  stopInlineAndResume: () => void
  setShouldResumePlayback: (resume: boolean) => void
  setWasPlayingBeforeMove: (wasPlaying: boolean) => void
  setIsAudioPlaying: (isPlaying: boolean) => void
  setCurrentTrack: (track: AudioTrack) => void
  closePlayer: () => void
  setPlaylist: (tracks: AudioTrack[]) => void
  playNext: () => void
  playPrevious: () => void
  setIsPlayerVisible: (visible: boolean) => void
}
```

#### State Management:

**currentTrack**
- ترک در حال پخش
- `null` وقتی هیچ چیز پخش نمی‌شود

**isPlayerVisible**
- آیا UI player نمایش داده شود
- `true` وقتی player باز است

**inlinePlayerId**
- ID ترکی که در حالت inline پخش می‌شود
- `null` وقتی inline player فعال نیست

**inlineTrack**
- ترک کامل برای inline player
- برای نمایش اطلاعات در InlineAudioPlayer

**isInlineInView**
- آیا inline player در viewport است
- استفاده از `useIntersectionObserver`
- وقتی `false` می‌شود، mini player نمایش داده می‌شود

**isExpanded**
- آیا player در حالت تمام صفحه است
- فقط برای audio (ویدیو از fullscreen استفاده می‌کند)

**playlist**
- آرایه‌ای از تمام ترک‌ها
- برای next/previous navigation

#### Actions:

**playTrack(track)**
```typescript
// پخش ترک در mini player
playTrack(track)
// نتیجه:
// - setActivePlayer('audio')
// - setCurrentTrack(track)
// - setIsPlayerVisible(true)
// - inlinePlayerId = null (خروج از حالت inline)
```

**playInline(track, showPlayer?, setActive?)**
```typescript
// پخش ترک در حالت inline (در جای تصویر)
playInline(track, false, true)
// نتیجه:
// - setActivePlayer('audio') اگر setActive=true
// - setCurrentTrack(track)
// - setInlinePlayerId(track.id)
// - setInlineTrack(track)
// - setIsInlineInView(true)
```

**playNext() / playPrevious()**
```typescript
// پخش ترک بعدی/قبلی در playlist
playNext()
// نتیجه:
// - پیدا کردن index فعلی
// - setCurrentTrack(playlist[index + 1])
// - اگر inline فعال نیست، inline mode را clear می‌کند
```

**closePlayer()**
```typescript
// بستن کامل player
closePlayer()
// نتیجه:
// - reset تمام state
// - setActivePlayer(null) اگر audio فعال بود
```

#### رفتار با ActivePlayerContext:

```typescript
useEffect(() => {
  if (activePlayer !== 'audio' && isPlayerVisible) {
    // وقتی player دیگری فعال شد، audio player را ببند
    setIsPlayerVisible(false)
    setCurrentTrack(null)
    setInlinePlayerId(null)
    // ... reset all state
  }
}, [activePlayer, isPlayerVisible])
```

---


### 3. VideoPlayerContext

**مسیر**: `shared/contexts/VideoPlayerContext.tsx`

#### Interface:
```typescript
interface VideoTrack {
  id: string
  title: string
  artist: string
  image: string
  duration: string
  videoSrc: string
  href?: string
  isFromSession?: boolean
  sessionId?: string
}

interface VideoPlayerContextType {
  // State
  currentTrack: VideoTrack | null
  isPlayerVisible: boolean
  inlinePlayerId: string | null
  isInlineInView: boolean
  isExpanded: boolean
  isFullscreen: boolean
  isOpeningInline: boolean
  savedPlaybackTime: number
  shouldResumePlayback: boolean
  wasPlayingBeforeMove: boolean
  isVideoPlaying: boolean
  playlist: VideoTrack[]
  
  // Actions
  playTrack: (track: VideoTrack) => void
  playInline: (track: VideoTrack, setActive?: boolean) => void
  setInlineInView: (inView: boolean) => void
  setIsExpanded: (expanded: boolean) => void
  setIsFullscreen: (fullscreen: boolean) => void
  stopInline: () => void
  stopInlineAndResume: () => void
  setShouldResumePlayback: (resume: boolean) => void
  setWasPlayingBeforeMove: (wasPlaying: boolean) => void
  setIsVideoPlaying: (isPlaying: boolean) => void
  setCurrentTrack: (track: VideoTrack) => void
  closePlayer: () => void
  setPlaylist: (tracks: VideoTrack[]) => void
  playNext: () => void
  playPrevious: () => void
  setSavedPlaybackTime: (time: number) => void
}
```

#### تفاوت‌های کلیدی با AudioPlayerContext:

**isFullscreen**
- مدیریت حالت fullscreen
- استفاده از Fullscreen API
- فقط برای ویدیو

**isOpeningInline**
- فلگ موقت برای جلوگیری از نمایش mini player هنگام باز شدن inline
- بعد از 500ms خودکار `false` می‌شود

**savedPlaybackTime**
- ذخیره زمان پخش برای resume
- استفاده در سناریوهای خاص

#### رفتار با ActivePlayerContext:

```typescript
useEffect(() => {
  if (prevActivePlayerRef.current === 'video' && 
      activePlayer !== 'video' && 
      isPlayerVisible) {
    queueMicrotask(() => {
      // بستن video player با تاخیر کوچک
      setIsPlayerVisible(false)
      setCurrentTrack(null)
      // ... reset state
    })
  }
  prevActivePlayerRef.current = activePlayer
}, [activePlayer, isPlayerVisible])
```

---


## 🎬 کامپوننت‌های Player

### 1. SharedReactPlayerProvider

**مسیر**: `shared/components/player/SharedReactPlayerProvider.tsx`

#### نقش:
- قلب سیستم پخش
- رندر یک `<ReactPlayer>` واحد برای همه
- سوییچ بین audio و video
- مدیریت Portal برای inline players

#### Interface:
```typescript
interface SharedReactPlayerContextType {
  playing: boolean
  setPlaying: (playing: boolean) => void
  setPlayingByUser: (playing: boolean) => void
  played: number
  loaded: number
  duration: number
  seek: (time: number | ((prev: number) => number)) => void
}
```

#### ساختار:
```typescript
export function SharedReactPlayerProvider({ children }) {
  const { activePlayer } = useActivePlayer()
  const audioContext = useAudioPlayer()
  const videoContext = useVideoPlayer()
  
  // تعیین context فعال
  const activeContext = activePlayer === 'audio' ? audioContext : videoContext
  const currentTrack = activeContext?.currentTrack
  
  // State مشترک
  const [playing, setPlaying] = useState(false)
  const [played, setPlayed] = useState(0)
  const [loaded, setLoaded] = useState(0)
  const [duration, setDuration] = useState(0)
  
  // تعیین src بر اساس نوع player
  const src = activePlayer === 'audio' 
    ? currentTrack?.audioSrc 
    : currentTrack?.videoSrc
  
  return (
    <SharedReactPlayerContext.Provider value={...}>
      {children}
      
      {/* ReactPlayer واحد */}
      <div 
        id="shared-react-player-container"
        style={{ display: activePlayer === 'audio' ? 'none' : 'block' }}>
        <ReactPlayer
          ref={playerRef}
          url={src}
          playing={playing}
          volume={volume}
          muted={isMuted}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onProgress={handleProgress}
          onDuration={setDuration}
          width="100%"
          height="100%"
        />
      </div>
    </SharedReactPlayerContext.Provider>
  )
}
```

#### نکات مهم:

1. **یک ReactPlayer برای همه**
   - همیشه render می‌شود (بدون conditional)
   - props بر اساس activePlayer تغییر می‌کند

2. **مخفی کردن برای Audio**
   - برای audio: `display: none`
   - برای video: `display: block`

3. **Portal برای Inline**
   - با `appendChild` و `removeChild`
   - ReactPlayer بین containers جابجا می‌شود

4. **Sync با Contexts**
   - `playing` state با `isAudioPlaying` / `isVideoPlaying` sync می‌شود
   - تغییرات در یک جا به همه اعمال می‌شود

---

### 2. usePlayerVolume Hook

**مسیر**: `shared/components/player/usePlayerVolume.ts`

#### نقش:
- مدیریت volume مشترک
- ذخیره در localStorage
- sync بین همه players

#### Interface:
```typescript
interface UsePlayerVolumeReturn {
  volume: number
  isMuted: boolean
  setVolume: (volume: number) => void
  toggleMute: () => void
}
```

#### پیاده‌سازی:
```typescript
export function usePlayerVolume(): UsePlayerVolumeReturn {
  const [volume, setVolumeState] = useState(() => {
    // خواندن از localStorage
    const saved = localStorage.getItem('player-volume')
    return saved ? parseFloat(saved) : 0.7
  })
  
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('player-muted')
    return saved === 'true'
  })
  
  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume)
    localStorage.setItem('player-volume', newVolume.toString())
    if (newVolume > 0) {
      setIsMuted(false)
      localStorage.setItem('player-muted', 'false')
    }
  }, [])
  
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev
      localStorage.setItem('player-muted', newMuted.toString())
      return newMuted
    })
  }, [])
  
  return { volume, isMuted, setVolume, toggleMute }
}
```

#### استفاده:
```typescript
// در هر کامپوننت player
const { volume, isMuted, setVolume, toggleMute } = usePlayerVolume()

// تغییر volume
<input 
  type="range" 
  value={volume} 
  onChange={(e) => setVolume(parseFloat(e.target.value))} 
/>

// toggle mute
<button onClick={toggleMute}>
  <i className={isMuted ? 'fa-volume-xmark' : 'fa-volume'} />
</button>
```

---


### 3. UnifiedAudioPlayer

**مسیر**: `shared/components/player/audio/UnifiedAudioPlayer.tsx`

#### نقش:
- UI اصلی پخش‌کننده صوت
- سوییچ بین حالت‌های mini و expanded
- نمایش controls و اطلاعات ترک

#### حالت‌ها:

**Mini Player** (پایین صفحه)
```
┌─────────────────────────────────────────────────────┐
│  [Image] [Title/Artist]  [Play] [Expand] [Close]   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  [Prev] [Play] [Next]  00:00 ━━━━━━━━━━━ 03:45     │
└─────────────────────────────────────────────────────┘
```

**Expanded Player** (تمام صفحه)
```
┌─────────────────────────────────────────────────────┐
│                                    [Compress] [Close]│
│                                                      │
│                   ┌──────────┐                      │
│                   │          │                      │
│                   │  Image   │                      │
│                   │          │                      │
│                   └──────────┘                      │
│                                                      │
│                    Track Title                      │
│                     Artist                          │
│                                                      │
│              ━━━━━━━━━━━━━━━━━━━━━                │
│              00:00          03:45                   │
│                                                      │
│              [Prev] [Play] [Next]                   │
└─────────────────────────────────────────────────────┘
```

#### Props و State:
```typescript
// استفاده از contexts
const {
  currentTrack,
  isPlayerVisible,
  inlinePlayerId,
  isInlineInView,
  isExpanded,
  setIsExpanded,
  closePlayer,
  playlist,
  playNext,
  playPrevious,
} = useAudioPlayer()

const { volume, isMuted, setVolume, toggleMute } = usePlayerVolume()
const { playing, setPlaying, played, loaded, duration, seek } = useSharedReactPlayer()

// Local state
const [isCollapsed, setIsCollapsed] = useState(false)
const [showVolumeSlider, setShowVolumeSlider] = useState(false)
const [inlineContainerExists, setInlineContainerExists] = useState(false)
```

#### شرط نمایش Mini Player:
```typescript
const shouldShowMini = 
  isPlayerVisible && 
  !isExpanded && 
  (!inlinePlayerId || !isInlineInView || !inlineContainerExists)
```

**منطق:**
- `isPlayerVisible`: player باید visible باشد
- `!isExpanded`: نباید در حالت expanded باشد
- شرط inline: اگر inline فعال نیست یا از viewport خارج شده

#### ویژگی‌های کلیدی:

**1. Collapsible**
```typescript
<button onClick={() => setIsCollapsed(!isCollapsed)}>
  <i className={isCollapsed ? 'fa-chevron-up' : 'fa-chevron-down'} />
</button>
```

**2. Smart Navigation**
```typescript
const handleTitleClick = () => {
  if (currentTrack.isFromSession) {
    // Navigation به session page با tab=audio
    router.push(`/fa/content/${currentTrack.sessionId}?tab=audio`)
  } else {
    // Navigation به audio detail page
    router.push(currentTrack.href)
  }
}
```

**3. Playlist Controls**
```typescript
<button 
  onClick={playNext} 
  disabled={!canPlayNext}
  className={canPlayNext ? 'enabled' : 'disabled'}>
  <i className="fa-forward" />
</button>
```

**4. Volume Control**
```typescript
<div ref={volumeControlRef}>
  <button 
    onClick={toggleMute}
    onMouseEnter={() => setShowVolumeSlider(true)}>
    <i className={isMuted ? 'fa-volume-xmark' : 'fa-volume'} />
  </button>
  
  {showVolumeSlider && (
    <div onMouseLeave={() => setShowVolumeSlider(false)}>
      <input 
        type="range" 
        value={volume} 
        onChange={(e) => setVolume(parseFloat(e.target.value))} 
      />
    </div>
  )}
</div>
```

**5. Progress Bar**
```typescript
<div onClick={handleProgressClick}>
  {/* Buffered progress */}
  <div style={{ width: `${bufferedProgress}%` }} />
  
  {/* Played progress */}
  <div style={{ width: `${progress}%` }} />
  
  {/* Seek handle */}
  <div style={{ left: `calc(${progress}% - 6px)` }} />
</div>
```

#### Responsive Design:
- Mobile: controls ساده‌تر، layout عمودی
- Desktop: controls کامل، layout افقی
- Breakpoints: `md:` برای تغییرات

---


### 4. InlineAudioPlayer

**مسیر**: `shared/components/player/audio/InlineAudioPlayer.tsx`

#### نقش:
- پخش صوت در جای تصویر (در AudioCard)
- تشخیص viewport با Intersection Observer
- اطلاع‌رسانی به context برای سوییچ به mini

#### Interface:
```typescript
export interface InlineAudioPlayerProps {
  track: AudioTrack
  onClose?: () => void
}
```

#### پیاده‌سازی:
```typescript
export function InlineAudioPlayer({ track, onClose }: InlineAudioPlayerProps) {
  const inlineContainerRef = useRef<HTMLDivElement>(null)
  const { setInlineInView } = useAudioPlayer()
  
  // تشخیص viewport
  const isInView = useIntersectionObserver(inlineContainerRef, {
    threshold: 0.5,
    rootMargin: '0px',
  })
  
  // اطلاع‌رسانی به context
  useEffect(() => {
    setInlineInView(isInView)
  }, [isInView, setInlineInView])
  
  return (
    <div 
      ref={inlineContainerRef}
      id={`inline-react-player-container-${track.id}`}
      className="absolute inset-0 w-full h-full bg-theme-black rounded-[10px] overflow-hidden">
      
      {/* دکمه بستن */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-2 left-2 z-10">
          <i className="fa-light fa-xmark" />
        </button>
      )}
      
      {/* ReactPlayer با Portal به اینجا منتقل می‌شود */}
    </div>
  )
}
```

#### نکات مهم:

**1. Container با ID خاص**
```typescript
id={`inline-react-player-container-${track.id}`}
```
- SharedReactPlayerProvider این ID را جستجو می‌کند
- ReactPlayer با Portal به این container منتقل می‌شود

**2. Intersection Observer**
```typescript
const isInView = useIntersectionObserver(inlineContainerRef, {
  threshold: 0.5,  // 50% باید در viewport باشد
  rootMargin: '0px',
})
```

**3. جریان کار:**
```
1. AudioCard → playInline(track)
2. InlineAudioPlayer render می‌شود
3. Container با ID خاص ایجاد می‌شود
4. SharedReactPlayerProvider → ReactPlayer را با Portal منتقل می‌کند
5. useIntersectionObserver → isInView را رصد می‌کند
6. وقتی از viewport خارج شود → setInlineInView(false)
7. UnifiedAudioPlayer → mini player را نمایش می‌دهد
```

---

### 5. UnifiedVideoPlayer

**مسیر**: `shared/components/player/video/UnifiedVideoPlayer.tsx`

#### نقش:
- UI اصلی پخش‌کننده ویدیو
- نمایش mini player با video preview
- مدیریت fullscreen

#### تفاوت‌ها با UnifiedAudioPlayer:

**1. Video Preview در Mini**
```typescript
<div 
  id="mini-video-container"
  className="w-16 h-9 md:w-[120px] md:h-[70px]"
  onClick={handleFullscreen}>
  {/* ReactPlayer اینجا نمایش داده می‌شود */}
  <div className="hover-overlay">
    <i className="fa-expand" />
  </div>
</div>
```

**2. Fullscreen Support**
```typescript
const handleFullscreen = () => {
  const videoContainer = document.querySelector('[data-video-container="true"]')
  if (videoContainer && videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen()
  } else if (document.fullscreenElement) {
    document.exitFullscreen()
  }
}

// تشخیص تغییر fullscreen
useEffect(() => {
  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement)
  }
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
}, [setIsFullscreen])
```

**3. isOpeningInline Flag**
```typescript
// جلوگیری از نمایش mini player هنگام باز شدن inline
const shouldShowMini = 
  isPlayerVisible && 
  !isOpeningInline && 
  (!inlinePlayerId || !isInlineInView || !inlineContainerExists)
```

**4. Playlist Behavior**
```typescript
const playNext = () => {
  // در video، اگر آخرین ترک است، null برمی‌گرداند (نه اولین ترک)
  if (currentIndex === playlist.length - 1) {
    return  // پایان playlist
  }
  setCurrentTrack(playlist[currentIndex + 1])
}
```

---


### 6. InlineVideoPlayer

**مسیر**: `shared/components/player/video/InlineVideoPlayer.tsx`

#### نقش:
- پخش ویدیو در جای تصویر (در VideoCard)
- مشابه InlineAudioPlayer ولی برای ویدیو

#### پیاده‌سازی:
```typescript
export function InlineVideoPlayer({ track }: InlineVideoPlayerProps) {
  const inlineContainerRef = useRef<HTMLDivElement>(null)
  const { setInlineInView } = useVideoPlayer()
  
  const isInView = useIntersectionObserver(inlineContainerRef, {
    threshold: 0.5,
    rootMargin: '0px',
  })
  
  useEffect(() => {
    setInlineInView(isInView)
  }, [isInView, setInlineInView])
  
  return (
    <div 
      ref={inlineContainerRef}
      id={`inline-video-container-${track.id}`}
      className="absolute inset-0 w-full h-full bg-theme-black rounded-[10px] overflow-hidden">
      {/* ReactPlayer با Portal به اینجا منتقل می‌شود */}
    </div>
  )
}
```

#### تفاوت با InlineAudioPlayer:
- ویدیو visible است (نه مخفی)
- بدون دکمه close (ویدیو controls خودش دارد)

---

### 7. CustomVideoControls

**مسیر**: `shared/components/player/video/CustomVideoControls.tsx`

#### نقش:
- کنترل‌های سفارشی برای ویدیو
- جایگزین controls پیش‌فرض ReactPlayer
- مدیریت fullscreen, PiP, playback rate

#### Interface:
```typescript
interface CustomVideoControlsProps {
  videoSrc: string
  playing: boolean
  controls: boolean
  onPlay: () => void
  onPause: () => void
  onProgress: (state: ProgressState) => void
  onDurationChange: (duration: number) => void
  onEnded: () => void
  volume: number
  muted: boolean
  onVolumeChange?: (volume: number) => void
  onToggleMute?: () => void
}
```

#### ویژگی‌های کلیدی:

**1. Auto-hide Controls**
```typescript
const [showControls, setShowControls] = useState(true)

const resetHideControlsTimer = () => {
  setShowControls(true)
  if (hideControlsTimeoutRef.current) {
    clearTimeout(hideControlsTimeoutRef.current)
  }
  hideControlsTimeoutRef.current = setTimeout(() => {
    setShowControls(false)
  }, 3000)  // 3 ثانیه
}

<div 
  onMouseMove={resetHideControlsTimer}
  onMouseLeave={() => setTimeout(() => setShowControls(false), 1000)}>
  {/* Video + Controls */}
</div>
```

**2. Playback Rate**
```typescript
const [playbackRate, setPlaybackRate] = useState(1)
const [showPlaybackRateMenu, setShowPlaybackRateMenu] = useState(false)

const handlePlaybackRateChange = (rate: number) => {
  setPlaybackRate(rate)
  const internalPlayer = playerRef.current?.getInternalPlayer()
  if (internalPlayer) {
    internalPlayer.playbackRate = rate
  }
}

// Menu
{[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
  <button onClick={() => handlePlaybackRateChange(rate)}>
    {rate}x
  </button>
))}
```

**3. Picture-in-Picture**
```typescript
const handlePictureInPicture = async () => {
  const internalPlayer = playerRef.current?.getInternalPlayer()
  if (internalPlayer && 'requestPictureInPicture' in internalPlayer) {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture()
    } else {
      await internalPlayer.requestPictureInPicture()
    }
  }
}
```

**4. Fullscreen Layout**
```typescript
{isFullscreen ? (
  // Layout خاص fullscreen
  <div className="flex items-center justify-between w-full">
    {/* Right: playback rate + fullscreen */}
    <div>...</div>
    
    {/* Center: prev + play + next */}
    <div>
      {hasPlaylist && <button onClick={playNext} />}
      <button onClick={handlePlayPause} />
      {hasPlaylist && <button onClick={playPrevious} />}
    </div>
    
    {/* Left: time + volume */}
    <div>...</div>
  </div>
) : (
  // Layout عادی
  <div>...</div>
)}
```

**5. Polling برای Progress**
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    const internalPlayer = playerRef.current?.getInternalPlayer()
    if (!internalPlayer) return
    
    const time = internalPlayer.currentTime || 0
    const dur = internalPlayer.duration
    
    if (dur && !isNaN(dur)) {
      setCurrentTime(time)
      setDuration(dur)
      setPlayed(time / dur)
      
      // Buffered
      if (internalPlayer.buffered?.length > 0) {
        const bufferedEnd = internalPlayer.buffered.end(0)
        setLoaded(bufferedEnd / dur)
      }
      
      onProgress({ played: time / dur, loaded, ... })
    }
  }, 100)  // هر 100ms
  
  return () => clearInterval(interval)
}, [])
```

---


## 🔄 جریان داده و ارتباطات

### نمودار کلی ارتباطات

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interaction                        │
│              (AudioCard, VideoCard, Controls)                │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   Context Layer                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ ActivePlayerCtx  │←→│ AudioPlayerCtx   │                │
│  └──────────────────┘  └──────────────────┘                │
│           ↕                      ↕                           │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ VideoPlayerCtx   │  │ usePlayerVolume  │                │
│  └──────────────────┘  └──────────────────┘                │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              SharedReactPlayerProvider                       │
│  ┌────────────────────────────────────────────────┐         │
│  │           Single ReactPlayer Instance          │         │
│  │  • Switches between audio/video                │         │
│  │  • Manages playback state                      │         │
│  │  • Handles Portal for inline players           │         │
│  └────────────────────────────────────────────────┘         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    UI Components                             │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ UnifiedAudioPl.  │  │ InlineAudioPl.   │                │
│  └──────────────────┘  └──────────────────┘                │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ UnifiedVideoPl.  │  │ InlineVideoPl.   │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

---

### سناریو 1: پخش صوت در Mini Player

```
┌─────────────┐
│  AudioCard  │
└──────┬──────┘
       │ onClick
       ↓
┌──────────────────────────┐
│ audioContext.playTrack() │
└──────┬───────────────────┘
       │
       ├─→ setActivePlayer('audio')  ──→  ActivePlayerContext
       ├─→ setCurrentTrack(track)
       ├─→ setIsPlayerVisible(true)
       └─→ setInlinePlayerId(null)
       
       ↓
┌────────────────────────────────┐
│ SharedReactPlayerProvider      │
│ • Detects activePlayer='audio' │
│ • Updates ReactPlayer props    │
│ • src = track.audioSrc         │
│ • Hides container              │
└────────────────────────────────┘
       
       ↓
┌────────────────────────────────┐
│ UnifiedAudioPlayer             │
│ • Reads audioContext state     │
│ • shouldShowMini = true        │
│ • Renders mini player UI       │
└────────────────────────────────┘
```

---

### سناریو 2: پخش Inline و سوییچ به Mini

```
┌─────────────┐
│  AudioCard  │
└──────┬──────┘
       │ onClick play button
       ↓
┌────────────────────────────┐
│ audioContext.playInline()  │
└──────┬─────────────────────┘
       │
       ├─→ setActivePlayer('audio')
       ├─→ setCurrentTrack(track)
       ├─→ setInlinePlayerId(track.id)
       ├─→ setInlineTrack(track)
       └─→ setIsInlineInView(true)
       
       ↓
┌────────────────────────────────┐
│ InlineAudioPlayer              │
│ • Renders container with ID    │
│ • Starts Intersection Observer │
└────────────────────────────────┘
       
       ↓
┌────────────────────────────────┐
│ SharedReactPlayerProvider      │
│ • Finds inline container       │
│ • Moves ReactPlayer via Portal │
└────────────────────────────────┘
       
       ↓ (user scrolls)
┌────────────────────────────────┐
│ InlineAudioPlayer              │
│ • isInView = false             │
│ • setInlineInView(false)       │
└────────────────────────────────┘
       
       ↓
┌────────────────────────────────┐
│ UnifiedAudioPlayer             │
│ • Detects !isInlineInView      │
│ • shouldShowMini = true        │
│ • Renders mini player          │
└────────────────────────────────┘
       
       ↓
┌────────────────────────────────┐
│ SharedReactPlayerProvider      │
│ • Moves ReactPlayer to mini    │
│ • (or hides for audio)         │
└────────────────────────────────┘
```

---

### سناریو 3: سوییچ از Audio به Video

```
┌─────────────┐
│  VideoCard  │
└──────┬──────┘
       │ onClick
       ↓
┌──────────────────────────┐
│ videoContext.playTrack() │
└──────┬───────────────────┘
       │
       └─→ setActivePlayer('video')  ──→  ActivePlayerContext
       
       ↓
┌────────────────────────────────┐
│ AudioPlayerContext (useEffect) │
│ • Detects activePlayer≠'audio' │
│ • Resets all audio state       │
│ • Closes audio player          │
└────────────────────────────────┘
       
       ↓
┌────────────────────────────────┐
│ SharedReactPlayerProvider      │
│ • Detects activePlayer='video' │
│ • Updates ReactPlayer props    │
│ • src = track.videoSrc         │
│ • Shows container              │
└────────────────────────────────┘
       
       ↓
┌────────────────────────────────┐
│ UnifiedVideoPlayer             │
│ • Reads videoContext state     │
│ • shouldShowMini = true        │
│ • Renders mini player UI       │
└────────────────────────────────┘
```

---

### سناریو 4: Playlist Navigation (Next/Previous)

```
┌──────────────────────┐
│ UnifiedAudioPlayer   │
│ User clicks Next     │
└──────┬───────────────┘
       │
       ↓
┌────────────────────────────────┐
│ audioContext.playNext()        │
│ • Find currentIndex in playlist│
│ • Check if inline is active    │
│ • If !inline: clear inline mode│
│ • setCurrentTrack(next)        │
└────────────────────────────────┘
       
       ↓
┌────────────────────────────────┐
│ SharedReactPlayerProvider      │
│ • Detects currentTrack change  │
│ • Updates src to new track     │
│ • Maintains playing state      │
└────────────────────────────────┘
       
       ↓
┌────────────────────────────────┐
│ UnifiedAudioPlayer             │
│ • Re-renders with new track    │
│ • Updates UI (title, image)    │
└────────────────────────────────┘
```

---


## 📊 نمودارهای معماری

### نمودار 1: Provider Hierarchy

```
App Root
│
└─── ThemeProvider
     │
     └─── UIProvider (HeroUI)
          │
          └─── ActivePlayerProvider
               │
               ├─── AudioPlayerProvider
               │    │
               │    └─── VideoPlayerProvider
               │         │
               │         └─── SharedReactPlayerProvider
               │              │
               │              ├─── {children} (Pages)
               │              │
               │              ├─── UnifiedAudioPlayer
               │              │
               │              └─── UnifiedVideoPlayer
               │
               └─── (Other Providers...)
```

**چرا این ترتیب؟**
1. `ActivePlayerProvider` در بالا → هر دو audio/video به آن نیاز دارند
2. `AudioPlayerProvider` و `VideoPlayerProvider` قبل از `SharedReactPlayerProvider` → چون SharedReactPlayerProvider به contexts آنها نیاز دارد
3. `UnifiedAudioPlayer` و `UnifiedVideoPlayer` داخل `SharedReactPlayerProvider` → چون به ReactPlayer مشترک نیاز دارند

---

### نمودار 2: State Flow

```
┌──────────────────────────────────────────────────────────┐
│                  ActivePlayerContext                      │
│  State: activePlayer: 'audio' | 'video' | null           │
│  Rule: Only one player can be active at a time           │
└────────────────┬─────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ↓                 ↓
┌──────────────────┐  ┌──────────────────┐
│ AudioPlayerCtx   │  │ VideoPlayerCtx   │
│ • currentTrack   │  │ • currentTrack   │
│ • playlist       │  │ • playlist       │
│ • isPlaying      │  │ • isFullscreen   │
│ • isExpanded     │  │ • isInlineInView │
│ • inlinePlayerId │  │ • inlinePlayerId │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         └──────────┬──────────┘
                    │
                    ↓
┌──────────────────────────────────────────────────────────┐
│           SharedReactPlayerProvider                       │
│  • Reads activePlayer from ActivePlayerContext           │
│  • Reads currentTrack from active context                │
│  • Manages single ReactPlayer instance                   │
│  • Provides: playing, played, loaded, duration, seek     │
└────────────────┬─────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ↓                 ↓
┌──────────────────┐  ┌──────────────────┐
│ UnifiedAudioPl.  │  │ UnifiedVideoPl.  │
│ • Reads audio    │  │ • Reads video    │
│   context        │  │   context        │
│ • Renders UI     │  │ • Renders UI     │
└──────────────────┘  └──────────────────┘
```

---

### نمودار 3: Inline Player Flow

```
AudioCard/VideoCard
       │
       │ playInline(track)
       ↓
AudioPlayerContext / VideoPlayerContext
       │
       ├─→ setInlinePlayerId(track.id)
       ├─→ setInlineTrack(track)
       └─→ setIsInlineInView(true)
       
       ↓
InlineAudioPlayer / InlineVideoPlayer
       │
       ├─→ Creates container with ID
       │   `inline-react-player-container-${track.id}`
       │
       └─→ Starts Intersection Observer
       
       ↓
SharedReactPlayerProvider
       │
       ├─→ Finds inline container by ID
       ├─→ Uses Portal to move ReactPlayer
       └─→ ReactPlayer renders inside inline container
       
       ↓ (User scrolls out)
       
InlineAudioPlayer / InlineVideoPlayer
       │
       └─→ isInView = false
           setInlineInView(false)
       
       ↓
UnifiedAudioPlayer / UnifiedVideoPlayer
       │
       ├─→ Detects !isInlineInView
       ├─→ shouldShowMini = true
       └─→ Renders mini player
       
       ↓
SharedReactPlayerProvider
       │
       └─→ Moves ReactPlayer to mini container
           (or hides for audio)
```

---

### نمودار 4: Volume Sync

```
┌──────────────────────────────────────────────────────────┐
│                    localStorage                           │
│  • player-volume: "0.7"                                   │
│  • player-muted: "false"                                  │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────────────┐
│              usePlayerVolume Hook                         │
│  • Reads from localStorage on mount                       │
│  • Provides: volume, isMuted, setVolume, toggleMute      │
│  • Writes to localStorage on change                       │
└────────────────┬─────────────────────────────────────────┘
                 │
        ┌────────┴────────┬────────────────┐
        │                 │                │
        ↓                 ↓                ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ UnifiedAudio │  │ UnifiedVideo │  │ CustomVideo  │
│   Player     │  │   Player     │  │  Controls    │
│              │  │              │  │              │
│ • Uses hook  │  │ • Uses hook  │  │ • Uses hook  │
│ • Synced     │  │ • Synced     │  │ • Synced     │
└──────────────┘  └──────────────┘  └──────────────┘

All players share the same volume state!
```

---


## 🎯 سناریوهای استفاده

### سناریو 1: کاربر روی AudioCard کلیک می‌کند

**مراحل:**
1. کاربر روی AudioCard کلیک می‌کند
2. AudioCard صدا می‌زند: `audioContext.playTrack(track)`
3. AudioPlayerContext:
   - `setActivePlayer('audio')` → ActivePlayerContext را به‌روز می‌کند
   - `setCurrentTrack(track)`
   - `setIsPlayerVisible(true)`
   - `setInlinePlayerId(null)` → خروج از حالت inline
4. SharedReactPlayerProvider:
   - `activePlayer === 'audio'` را تشخیص می‌دهد
   - ReactPlayer را با `audioSrc` render می‌کند
   - Container را مخفی می‌کند (`display: none`)
5. UnifiedAudioPlayer:
   - از audioContext state استفاده می‌کند
   - `shouldShowMini = true`
   - Mini player UI را نمایش می‌دهد

**کد نمونه:**
```typescript
// در AudioCard
const { playTrack } = useAudioPlayer()

const handleClick = () => {
  playTrack({
    id: '123',
    title: 'عنوان صوت',
    artist: 'هنرمند',
    image: '/image.jpg',
    audioSrc: '/audio.mp3',
    duration: '03:45',
  })
}
```

---

### سناریو 2: پخش Inline در AudioCard

**مراحل:**
1. کاربر روی دکمه play در AudioCard کلیک می‌کند
2. AudioCard صدا می‌زند: `audioContext.playInline(track)`
3. AudioPlayerContext:
   - `setActivePlayer('audio')`
   - `setCurrentTrack(track)`
   - `setInlinePlayerId(track.id)`
   - `setInlineTrack(track)`
   - `setIsInlineInView(true)`
4. InlineAudioPlayer render می‌شود:
   - Container با ID خاص ایجاد می‌کند
   - Intersection Observer را شروع می‌کند
5. SharedReactPlayerProvider:
   - Container inline را پیدا می‌کند
   - ReactPlayer را با Portal منتقل می‌کند
6. کاربر scroll می‌کند و inline از viewport خارج می‌شود:
   - InlineAudioPlayer: `isInView = false`
   - `setInlineInView(false)`
7. UnifiedAudioPlayer:
   - `!isInlineInView` را تشخیص می‌دهد
   - `shouldShowMini = true`
   - Mini player را نمایش می‌دهد

**کد نمونه:**
```typescript
// در AudioCard
const { playInline } = useAudioPlayer()

const handlePlayInline = () => {
  playInline(track, false, true)
  setShowInlinePlayer(true)
}

// در AudioCard JSX
{showInlinePlayer && (
  <InlineAudioPlayer 
    track={track} 
    onClose={() => setShowInlinePlayer(false)} 
  />
)}
```

---

### سناریو 3: سوییچ از Audio به Video

**مراحل:**
1. Audio در حال پخش است (`activePlayer = 'audio'`)
2. کاربر روی VideoCard کلیک می‌کند
3. VideoCard صدا می‌زند: `videoContext.playTrack(track)`
4. VideoPlayerContext:
   - `setActivePlayer('video')` → ActivePlayerContext را تغییر می‌دهد
5. AudioPlayerContext (useEffect):
   - `activePlayer !== 'audio'` را تشخیص می‌دهد
   - تمام audio state را reset می‌کند:
     ```typescript
     setIsPlayerVisible(false)
     setCurrentTrack(null)
     setInlinePlayerId(null)
     setIsAudioPlaying(false)
     ```
   - Audio player را می‌بندد
6. SharedReactPlayerProvider:
   - `activePlayer === 'video'` را تشخیص می‌دهد
   - ReactPlayer را با `videoSrc` render می‌کند
   - Container را visible می‌کند
7. UnifiedVideoPlayer:
   - از videoContext state استفاده می‌کند
   - Mini player با video preview را نمایش می‌دهد

**نتیجه:**
- فقط یک player همزمان فعال است
- هیچ تداخلی بین audio و video نیست
- State قبلی پاک می‌شود

---

### سناریو 4: Navigation در Playlist

**مراحل:**
1. کاربر روی دکمه Next در UnifiedAudioPlayer کلیک می‌کند
2. UnifiedAudioPlayer صدا می‌زند: `playNext()`
3. AudioPlayerContext.playNext():
   ```typescript
   const currentIndex = playlist.findIndex(t => t.id === currentTrack.id)
   
   // اگر inline فعال نیست، inline mode را clear کن
   if (!inlinePlayerId || !isInlineInView) {
     setInlinePlayerId(null)
     setInlineTrack(null)
   }
   
   // پخش ترک بعدی
   if (currentIndex < playlist.length - 1) {
     setCurrentTrack(playlist[currentIndex + 1])
   } else {
     // برگشت به اول
     setCurrentTrack(playlist[0])
   }
   ```
4. SharedReactPlayerProvider:
   - تغییر `currentTrack` را تشخیص می‌دهد
   - `src` را به ترک جدید تغییر می‌دهد
   - `playing` state را حفظ می‌کند
5. UnifiedAudioPlayer:
   - با ترک جدید re-render می‌شود
   - UI را به‌روز می‌کند (عنوان، تصویر، etc.)

**کد نمونه:**
```typescript
// تنظیم playlist
const { setPlaylist } = useAudioPlayer()

useEffect(() => {
  setPlaylist([
    { id: '1', title: 'Track 1', ... },
    { id: '2', title: 'Track 2', ... },
    { id: '3', title: 'Track 3', ... },
  ])
}, [])

// در UI
const { playNext, playPrevious, playlist } = useAudioPlayer()
const currentIndex = playlist.findIndex(t => t.id === currentTrack?.id)
const canPlayNext = currentIndex < playlist.length - 1

<button onClick={playNext} disabled={!canPlayNext}>
  <i className="fa-forward" />
</button>
```

---

### سناریو 5: Fullscreen Video

**مراحل:**
1. کاربر روی دکمه fullscreen در UnifiedVideoPlayer کلیک می‌کند
2. UnifiedVideoPlayer صدا می‌زند: `handleFullscreen()`
   ```typescript
   const videoContainer = document.querySelector('[data-video-container="true"]')
   if (videoContainer) {
     videoContainer.requestFullscreen()
   }
   ```
3. Browser fullscreen API فعال می‌شود
4. Event listener تغییر را تشخیص می‌دهد:
   ```typescript
   useEffect(() => {
     const handleFullscreenChange = () => {
       setIsFullscreen(!!document.fullscreenElement)
     }
     document.addEventListener('fullscreenchange', handleFullscreenChange)
     return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
   }, [])
   ```
5. VideoPlayerContext:
   - `setIsFullscreen(true)`
6. CustomVideoControls:
   - Layout را به حالت fullscreen تغییر می‌دهد
   - Controls را در سه بخش نمایش می‌دهد (right, center, left)

**خروج از Fullscreen:**
- کاربر ESC می‌زند یا روی دکمه compress کلیک می‌کند
- `document.exitFullscreen()` صدا زده می‌شود
- `isFullscreen = false`
- Layout به حالت عادی برمی‌گردد

---


## 🔧 نکات فنی و Best Practices

### 1. چرا یک ReactPlayer واحد؟

**مشکل قبلی:**
- چند instance از ReactPlayer در DOM
- تداخل بین audio و video
- مصرف بالای حافظه
- مشکلات sync

**راه‌حل فعلی:**
- فقط یک `<ReactPlayer>` در کل برنامه
- سوییچ بین audio/video با تغییر props
- بدون render/unmount
- عملکرد بهتر و کد تمیزتر

---

### 2. Portal برای Inline Players

**چرا Portal؟**
```typescript
// بدون Portal - مشکل
<InlineAudioPlayer>
  <ReactPlayer />  // Instance جدید - مشکل!
</InlineAudioPlayer>

// با Portal - درست
<InlineAudioPlayer>
  <div id="container" />  // فقط container
</InlineAudioPlayer>

// در SharedReactPlayerProvider
const container = document.getElementById('container')
if (container) {
  container.appendChild(playerElement)  // انتقال با Portal
}
```

**مزایا:**
- یک ReactPlayer برای همه
- جابجایی بدون re-mount
- حفظ playback state

---

### 3. Intersection Observer برای Viewport Detection

**چرا Intersection Observer؟**
```typescript
// بدون IO - مشکل
window.addEventListener('scroll', () => {
  const rect = element.getBoundingClientRect()
  const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight
  // Performance issue! هر scroll صدا زده می‌شود
})

// با IO - درست
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    setIsInView(entry.isIntersecting)
  })
}, { threshold: 0.5 })

observer.observe(element)
```

**مزایا:**
- عملکرد بهتر
- Native browser API
- Automatic cleanup

---

### 4. localStorage برای Volume Persistence

**پیاده‌سازی:**
```typescript
// خواندن اولیه
const [volume, setVolume] = useState(() => {
  const saved = localStorage.getItem('player-volume')
  return saved ? parseFloat(saved) : 0.7
})

// ذخیره در تغییر
const handleVolumeChange = (newVolume: number) => {
  setVolume(newVolume)
  localStorage.setItem('player-volume', newVolume.toString())
}
```

**مزایا:**
- حفظ تنظیمات کاربر
- sync بین تمام players
- بدون نیاز به backend

---

### 5. useEffect برای Sync با ActivePlayer

**الگو:**
```typescript
// در AudioPlayerContext
useEffect(() => {
  if (activePlayer !== 'audio' && isPlayerVisible) {
    // بستن audio player وقتی player دیگری فعال شد
    setIsPlayerVisible(false)
    setCurrentTrack(null)
    // ... reset state
  }
}, [activePlayer, isPlayerVisible])
```

**چرا این الگو؟**
- Automatic cleanup
- جلوگیری از تداخل
- کد declarative

---

### 6. Ref برای Direct DOM Access

**کاربردها:**
```typescript
// 1. Volume slider - کلیک بیرون
const volumeControlRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (volumeControlRef.current && 
        !volumeControlRef.current.contains(e.target as Node)) {
      setShowVolumeSlider(false)
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [])

// 2. ReactPlayer - دسترسی به internal player
const playerRef = useRef<ReactPlayer>(null)

const seek = (time: number) => {
  if (playerRef.current) {
    playerRef.current.seekTo(time, 'seconds')
  }
}

// 3. Intersection Observer
const containerRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (!containerRef.current) return
  const observer = new IntersectionObserver(...)
  observer.observe(containerRef.current)
  return () => observer.disconnect()
}, [])
```

---

### 7. Conditional Rendering برای Performance

**الگوی صحیح:**
```typescript
// ✅ درست - early return
if (!isPlayerVisible || !currentTrack) {
  return null
}

// ✅ درست - conditional در JSX
{shouldShowMini && (
  <div className="mini-player">
    {/* ... */}
  </div>
)}

// ❌ اشتباه - render همیشه
<div className={shouldShowMini ? 'visible' : 'hidden'}>
  {/* همیشه render می‌شود، فقط مخفی است */}
</div>
```

---

### 8. Memo برای Optimization

**کاربرد:**
```typescript
// برای کامپوننت‌های سنگین
export const UnifiedVideoPlayer = memo(UnifiedVideoPlayerComponent)

// با custom comparison
export const AudioCard = memo(AudioCardComponent, (prev, next) => {
  return prev.track.id === next.track.id
})
```

**چه زمانی استفاده کنیم؟**
- کامپوننت‌های سنگین
- props کم تغییر می‌کنند
- re-render های غیرضروری

---

### 9. Callback Hooks برای Stable References

**الگو:**
```typescript
// ✅ درست - با useCallback
const handleClick = useCallback(() => {
  playTrack(track)
}, [track, playTrack])

// ❌ اشتباه - بدون useCallback
const handleClick = () => {
  playTrack(track)
}
// هر render یک function جدید ایجاد می‌شود
```

**چرا مهم است؟**
- جلوگیری از re-render های غیرضروری
- بهتر برای dependency arrays
- عملکرد بهتر

---

### 10. Error Boundaries برای Robustness

**پیشنهاد:**
```typescript
// در SharedReactPlayerProvider
<ErrorBoundary fallback={<PlayerError />}>
  <ReactPlayer
    onError={(error) => {
      console.error('Player error:', error)
      // Handle error
    }}
  />
</ErrorBoundary>
```

---


## 📝 خلاصه و نتیجه‌گیری

### نقاط قوت معماری

1. **Single Source of Truth**
   - فقط یک ReactPlayer در کل برنامه
   - یک منبع برای playback state

2. **No Conflicts**
   - فقط یک player همزمان فعال
   - ActivePlayerContext تضمین می‌کند

3. **Smooth Transitions**
   - جابجایی بین حالت‌ها بدون glitch
   - Portal برای انتقال بدون re-mount

4. **Memory Efficient**
   - کمتر DOM manipulation
   - یک instance از ReactPlayer

5. **Maintainable**
   - منطق مشترک در یک جا
   - Separation of concerns واضح

6. **Extensible**
   - راحت می‌توان player جدید اضافه کرد
   - معماری modular

---

### فایل‌های کلیدی و مسئولیت‌ها

| فایل | مسئولیت | استفاده |
|------|---------|---------|
| `ActivePlayerContext.tsx` | مدیریت player فعال | همه contexts |
| `AudioPlayerContext.tsx` | state صوت | Audio components |
| `VideoPlayerContext.tsx` | state ویدیو | Video components |
| `SharedReactPlayerProvider.tsx` | ReactPlayer واحد | همه players |
| `usePlayerVolume.ts` | volume مشترک | همه players |
| `UnifiedAudioPlayer.tsx` | UI صوت | Audio playback |
| `UnifiedVideoPlayer.tsx` | UI ویدیو | Video playback |
| `InlineAudioPlayer.tsx` | Inline صوت | AudioCard |
| `InlineVideoPlayer.tsx` | Inline ویدیو | VideoCard |
| `CustomVideoControls.tsx` | Controls ویدیو | Video playback |

---

### Hooks و استفاده

| Hook | مسیر | استفاده |
|------|------|---------|
| `useActivePlayer()` | `ActivePlayerContext` | تعیین player فعال |
| `useAudioPlayer()` | `AudioPlayerContext` | مدیریت audio |
| `useVideoPlayer()` | `VideoPlayerContext` | مدیریت video |
| `useSharedReactPlayer()` | `SharedReactPlayerProvider` | playback state |
| `usePlayerVolume()` | `usePlayerVolume.ts` | volume مشترک |

---

### جریان داده (خلاصه)

```
User Action
    ↓
Context (AudioPlayerContext / VideoPlayerContext)
    ↓
ActivePlayerContext (تعیین player فعال)
    ↓
SharedReactPlayerProvider (ReactPlayer واحد)
    ↓
UI Components (UnifiedPlayer / InlinePlayer)
```

---

### چک‌لیست برای توسعه‌دهندگان

**قبل از اضافه کردن feature جدید:**

- [ ] آیا نیاز به تغییر در Context است؟
- [ ] آیا با معماری Single ReactPlayer سازگار است؟
- [ ] آیا با ActivePlayer management تداخل دارد؟
- [ ] آیا volume sync را حفظ می‌کند؟
- [ ] آیا responsive است؟
- [ ] آیا accessibility را رعایت می‌کند?

**برای اضافه کردن player جدید (مثل WaveSurfer):**

1. ✅ Context موجود را حفظ کن
2. ✅ کامپوننت جدید ایجاد کن (مثل `InlineWaveSurferPlayer`)
3. ✅ از الگوی Portal استفاده کن
4. ✅ با ActivePlayer هماهنگ باش
5. ✅ Volume sync را حفظ کن
6. ✅ Intersection Observer برای viewport
7. ✅ Responsive design
8. ✅ مستندات به‌روز کن

---

### منابع و لینک‌ها

**مستندات مرتبط:**
- [React Context API](https://react.dev/reference/react/useContext)
- [React Portal](https://react.dev/reference/react-dom/createPortal)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)
- [ReactPlayer](https://github.com/cookpete/react-player)

**فایل‌های پروژه:**
- `docs/shared-reactplayer-merge.md` - تاریخچه ادغام
- `shared/components/player/` - کامپوننت‌های player
- `shared/contexts/` - Context providers

---

## 🎉 پایان مستندات

این مستند توسط Kiro AI در تاریخ **17 فوریه 2026** تهیه شده است.

برای سوالات یا پیشنهادات، لطفاً با تیم توسعه تماس بگیرید.

**نسخه مستند**: 1.0.0  
**آخرین به‌روزرسانی**: 2026-02-17

