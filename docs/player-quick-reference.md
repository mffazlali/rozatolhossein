# 🚀 مرجع سریع Player - روضة الحسین

## 📦 Contexts

### ActivePlayerContext
```typescript
const { activePlayer, setActivePlayer } = useActivePlayer()
// activePlayer: 'audio' | 'video' | null
```

### AudioPlayerContext
```typescript
const {
  currentTrack,
  isPlayerVisible,
  inlinePlayerId,
  isExpanded,
  playlist,
  playTrack,
  playInline,
  playNext,
  playPrevious,
  closePlayer,
  setPlaylist,
} = useAudioPlayer()
```

### VideoPlayerContext
```typescript
const {
  currentTrack,
  isPlayerVisible,
  inlinePlayerId,
  isFullscreen,
  playlist,
  playTrack,
  playInline,
  playNext,
  playPrevious,
  closePlayer,
  setIsFullscreen,
} = useVideoPlayer()
```

---

## 🎵 استفاده در AudioCard

```typescript
import { useAudioPlayer } from '@/shared/contexts'

function AudioCard({ track }) {
  const { playTrack, playInline } = useAudioPlayer()
  const [showInlinePlayer, setShowInlinePlayer] = useState(false)
  
  // پخش در mini player
  const handleClick = () => {
    playTrack(track)
  }
  
  // پخش inline
  const handlePlayInline = () => {
    playInline(track, false, true)
    setShowInlinePlayer(true)
  }
  
  return (
    <div onClick={handleClick}>
      <button onClick={(e) => {
        e.stopPropagation()
        handlePlayInline()
      }}>
        <i className="fa-play" />
      </button>
      
      {showInlinePlayer && (
        <InlineAudioPlayer 
          track={track}
          onClose={() => setShowInlinePlayer(false)}
        />
      )}
    </div>
  )
}
```

---

## 🎬 استفاده در VideoCard

```typescript
import { useVideoPlayer } from '@/shared/contexts'

function VideoCard({ track }) {
  const { playTrack, playInline } = useVideoPlayer()
  const [showInlinePlayer, setShowInlinePlayer] = useState(false)
  
  // پخش در mini player
  const handleClick = () => {
    playTrack(track)
  }
  
  // پخش inline
  const handlePlayInline = () => {
    playInline(track, true)
    setShowInlinePlayer(true)
  }
  
  return (
    <div onClick={handleClick}>
      <button onClick={(e) => {
        e.stopPropagation()
        handlePlayInline()
      }}>
        <i className="fa-play" />
      </button>
      
      {showInlinePlayer && (
        <InlineVideoPlayer track={track} />
      )}
    </div>
  )
}
```

---

## 🎼 مدیریت Playlist

```typescript
import { useAudioPlayer } from '@/shared/contexts'

function AudioList({ tracks }) {
  const { setPlaylist, playTrack } = useAudioPlayer()
  
  useEffect(() => {
    // تنظیم playlist
    setPlaylist(tracks)
  }, [tracks, setPlaylist])
  
  const handlePlayTrack = (track) => {
    playTrack(track)
  }
  
  return (
    <div>
      {tracks.map(track => (
        <AudioCard 
          key={track.id} 
          track={track}
          onClick={() => handlePlayTrack(track)}
        />
      ))}
    </div>
  )
}
```

---

## 🔊 Volume Control

```typescript
import { usePlayerVolume } from '@/shared/components/player'

function VolumeControl() {
  const { volume, isMuted, setVolume, toggleMute } = usePlayerVolume()
  
  return (
    <div>
      <button onClick={toggleMute}>
        <i className={isMuted ? 'fa-volume-xmark' : 'fa-volume'} />
      </button>
      
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={isMuted ? 0 : volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
      />
    </div>
  )
}
```

---

## 🎮 Playback Control

```typescript
import { useSharedReactPlayer } from '@/shared/components/player'

function PlaybackControl() {
  const { playing, setPlaying, played, duration, seek } = useSharedReactPlayer()
  
  const handlePlayPause = () => {
    setPlaying(!playing)
  }
  
  const handleSeek = (percentage: number) => {
    seek(percentage * duration)
  }
  
  return (
    <div>
      <button onClick={handlePlayPause}>
        <i className={playing ? 'fa-pause' : 'fa-play'} />
      </button>
      
      <div onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const percentage = (e.clientX - rect.left) / rect.width
        handleSeek(percentage)
      }}>
        <div style={{ width: `${played * 100}%` }} />
      </div>
    </div>
  )
}
```

---

## 📋 Track Interface

```typescript
// Audio Track
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

// Video Track
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
```

---

## 🔄 سناریوهای رایج

### 1. پخش صوت
```typescript
const { playTrack } = useAudioPlayer()
playTrack(track)
```

### 2. پخش inline
```typescript
const { playInline } = useAudioPlayer()
playInline(track, false, true)
```

### 3. بستن player
```typescript
const { closePlayer } = useAudioPlayer()
closePlayer()
```

### 4. Next/Previous
```typescript
const { playNext, playPrevious } = useAudioPlayer()
playNext()
playPrevious()
```

### 5. Fullscreen (video)
```typescript
const { setIsFullscreen } = useVideoPlayer()
setIsFullscreen(true)
```

---

## ⚠️ نکات مهم

1. **فقط یک player فعال**: ActivePlayerContext تضمین می‌کند
2. **Volume مشترک**: تمام players از یک volume استفاده می‌کنند
3. **Inline viewport**: از Intersection Observer استفاده می‌شود
4. **Portal برای inline**: ReactPlayer با Portal جابجا می‌شود
5. **Playlist**: باید قبل از playTrack تنظیم شود

---

## 🐛 رفع مشکلات رایج

### Player نمایش داده نمی‌شود
```typescript
// بررسی کنید:
console.log('isPlayerVisible:', isPlayerVisible)
console.log('currentTrack:', currentTrack)
console.log('activePlayer:', activePlayer)
```

### Inline player کار نمی‌کند
```typescript
// بررسی کنید:
console.log('inlinePlayerId:', inlinePlayerId)
console.log('isInlineInView:', isInlineInView)
// آیا container با ID درست وجود دارد؟
const container = document.getElementById(`inline-react-player-container-${track.id}`)
console.log('container:', container)
```

### Volume sync نمی‌شود
```typescript
// بررسی localStorage:
console.log('volume:', localStorage.getItem('player-volume'))
console.log('muted:', localStorage.getItem('player-muted'))
```

---

## 📚 مستندات کامل

برای اطلاعات بیشتر، به `docs/player-architecture.md` مراجعه کنید.

