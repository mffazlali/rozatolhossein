# 📊 نمودارهای معماری Player

## نمودار 1: معماری کلی (Big Picture)

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE                             │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  AudioCard   │  │  VideoCard   │  │  SessionCard │             │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘             │
│         │                 │                 │                       │
└─────────┼─────────────────┼─────────────────┼───────────────────────┘
          │                 │                 │
          │ playTrack()     │ playTrack()     │ setPlaylist()
          │ playInline()    │ playInline()    │
          │                 │                 │
          ↓                 ↓                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        CONTEXT LAYER                                 │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              ActivePlayerContext                            │    │
│  │  State: activePlayer: 'audio' | 'video' | null             │    │
│  │  Rule: Only ONE player active at a time                    │    │
│  └────────────────┬───────────────────────┬───────────────────┘    │
│                   │                       │                         │
│         ┌─────────┴─────────┐   ┌─────────┴─────────┐             │
│         │                   │   │                   │             │
│  ┌──────▼──────────┐  ┌─────▼────────────┐  ┌──────▼──────────┐  │
│  │ AudioPlayerCtx  │  │ VideoPlayerCtx   │  │ usePlayerVolume │  │
│  │                 │  │                  │  │                 │  │
│  │ • currentTrack  │  │ • currentTrack   │  │ • volume        │  │
│  │ • playlist      │  │ • playlist       │  │ • isMuted       │  │
│  │ • isPlaying     │  │ • isFullscreen   │  │ • setVolume     │  │
│  │ • isExpanded    │  │ • isInlineInView │  │ • toggleMute    │  │
│  │ • inlinePlayerId│  │ • inlinePlayerId │  │                 │  │
│  └─────────────────┘  └──────────────────┘  └─────────────────┘  │
│         │                       │                       │          │
└─────────┼───────────────────────┼───────────────────────┼──────────┘
          │                       │                       │
          └───────────┬───────────┴───────────┬───────────┘
                      │                       │
                      ↓                       ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      PLAYBACK LAYER                                  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │         SharedReactPlayerProvider                           │    │
│  │                                                             │    │
│  │  ┌──────────────────────────────────────────────────┐     │    │
│  │  │      Single ReactPlayer Instance                 │     │    │
│  │  │                                                   │     │    │
│  │  │  • Switches: audio ↔ video                       │     │    │
│  │  │  • State: playing, played, loaded, duration      │     │    │
│  │  │  • Portal: moves between containers              │     │    │
│  │  │  • Volume: synced across all players             │     │    │
│  │  └──────────────────────────────────────────────────┘     │    │
│  │                                                             │    │
│  │  Provides: useSharedReactPlayer()                          │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        UI COMPONENTS                                 │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │ UnifiedAudioPl.  │  │ InlineAudioPl.   │  │ UnifiedVideoPl.  │ │
│  │                  │  │                  │  │                  │ │
│  │ • Mini Player    │  │ • In AudioCard   │  │ • Mini Player    │ │
│  │ • Expanded       │  │ • Viewport detect│  │ • Fullscreen     │ │
│  │ • Controls       │  │ • Portal target  │  │ • PiP support    │ │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘ │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐                        │
│  │ InlineVideoPl.   │  │ CustomVideoCtrl  │                        │
│  │                  │  │                  │                        │
│  │ • In VideoCard   │  │ • Custom UI      │                        │
│  │ • Viewport detect│  │ • Playback rate  │                        │
│  │ • Portal target  │  │ • Auto-hide      │                        │
│  └──────────────────┘  └──────────────────┘                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## نمودار 2: جریان پخش صوت (Audio Playback Flow)

```
┌──────────────┐
│   User       │
│   clicks     │
│  AudioCard   │
└──────┬───────┘
       │
       ↓
┌──────────────────────────────────────────┐
│  audioContext.playTrack(track)           │
└──────┬───────────────────────────────────┘
       │
       ├─→ setActivePlayer('audio') ────────────┐
       │                                         │
       ├─→ setCurrentTrack(track)               │
       │                                         │
       ├─→ setIsPlayerVisible(true)             │
       │                                         │
       └─→ setInlinePlayerId(null)              │
                                                 │
                                                 ↓
                                    ┌────────────────────────┐
                                    │ ActivePlayerContext    │
                                    │ activePlayer = 'audio' │
                                    └────────┬───────────────┘
                                             │
                                             ↓
                                    ┌────────────────────────────────┐
                                    │ SharedReactPlayerProvider      │
                                    │                                │
                                    │ if (activePlayer === 'audio')  │
                                    │   src = track.audioSrc         │
                                    │   container.style.display=none │
                                    └────────┬───────────────────────┘
                                             │
                                             ↓
                                    ┌────────────────────────────────┐
                                    │ UnifiedAudioPlayer             │
                                    │                                │
                                    │ shouldShowMini = true          │
                                    │ Renders Mini Player UI         │
                                    └────────────────────────────────┘
```

---

## نمودار 3: جریان Inline Player (Inline Flow)

```
┌──────────────┐
│   User       │
│   clicks     │
│  Play button │
│  in Card     │
└──────┬───────┘
       │
       ↓
┌──────────────────────────────────────────┐
│  audioContext.playInline(track)          │
└──────┬───────────────────────────────────┘
       │
       ├─→ setInlinePlayerId(track.id)
       ├─→ setInlineTrack(track)
       └─→ setIsInlineInView(true)
       
       ↓
┌──────────────────────────────────────────┐
│  InlineAudioPlayer renders               │
│                                          │
│  <div id="inline-...-{track.id}">       │
│    {/* Portal target */}                │
│  </div>                                 │
└──────┬───────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────┐
│  SharedReactPlayerProvider               │
│                                          │
│  1. Find container by ID                │
│  2. Move ReactPlayer via Portal         │
│  3. ReactPlayer renders inside card     │
└──────┬───────────────────────────────────┘
       │
       │ (User scrolls)
       ↓
┌──────────────────────────────────────────┐
│  InlineAudioPlayer                       │
│                                          │
│  Intersection Observer:                 │
│    isInView = false                     │
│    setInlineInView(false)               │
└──────┬───────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────┐
│  UnifiedAudioPlayer                      │
│                                          │
│  Detects: !isInlineInView               │
│  shouldShowMini = true                  │
│  Renders Mini Player                    │
└──────┬───────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────┐
│  SharedReactPlayerProvider               │
│                                          │
│  Moves ReactPlayer to mini container    │
│  (or hides for audio)                   │
└──────────────────────────────────────────┘
```

---

## نمودار 4: سوییچ Audio ↔ Video

```
┌─────────────────────────────────────────┐
│  Initial State: Audio Playing           │
│  activePlayer = 'audio'                 │
└─────────────┬───────────────────────────┘
              │
              │ User clicks VideoCard
              ↓
┌─────────────────────────────────────────┐
│  videoContext.playTrack(track)          │
│  setActivePlayer('video')               │
└─────────────┬───────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────┐
│  ActivePlayerContext                    │
│  activePlayer: 'audio' → 'video'        │
└─────────────┬───────────────────────────┘
              │
              ├──────────────────┬─────────────────┐
              │                  │                 │
              ↓                  ↓                 ↓
┌──────────────────────┐  ┌──────────────┐  ┌──────────────────┐
│ AudioPlayerContext   │  │ SharedReact  │  │ VideoPlayerCtx   │
│                      │  │ PlayerProv.  │  │                  │
│ useEffect detects:   │  │              │  │ Receives new     │
│ activePlayer≠'audio' │  │ Switches to  │  │ track and        │
│                      │  │ video mode:  │  │ becomes active   │
│ Actions:             │  │              │  │                  │
│ • setIsPlayerVisible │  │ • src=video  │  │ State:           │
│   (false)            │  │ • show       │  │ • currentTrack   │
│ • setCurrentTrack    │  │   container  │  │ • isPlayerVisible│
│   (null)             │  │              │  │   = true         │
│ • reset all state    │  │              │  │                  │
└──────────────────────┘  └──────────────┘  └──────────────────┘
              │                  │                 │
              └──────────────────┴─────────────────┘
                                 │
                                 ↓
                    ┌────────────────────────────┐
                    │  UnifiedVideoPlayer        │
                    │  Renders with new track    │
                    └────────────────────────────┘
```

---

## نمودار 5: Volume Sync

```
┌─────────────────────────────────────────────────────────┐
│                    localStorage                          │
│  Key: 'player-volume'  Value: "0.7"                     │
│  Key: 'player-muted'   Value: "false"                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Read on mount
                     │ Write on change
                     ↓
┌─────────────────────────────────────────────────────────┐
│              usePlayerVolume Hook                        │
│                                                          │
│  const [volume, setVolume] = useState(0.7)              │
│  const [isMuted, setIsMuted] = useState(false)          │
│                                                          │
│  Returns: { volume, isMuted, setVolume, toggleMute }    │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Used by all players
                     │
        ┌────────────┼────────────┬────────────┐
        │            │            │            │
        ↓            ↓            ↓            ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ UnifiedAudio │ │ UnifiedVideo │ │ CustomVideo  │ │ SharedReact  │
│   Player     │ │   Player     │ │  Controls    │ │ PlayerProv.  │
│              │ │              │ │              │ │              │
│ volume: 0.7  │ │ volume: 0.7  │ │ volume: 0.7  │ │ volume: 0.7  │
│ muted: false │ │ muted: false │ │ muted: false │ │ muted: false │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘

All players share the SAME volume state!
Change in one → Updates in all
```

---

## نمودار 6: Provider Hierarchy (Tree)

```
<App>
  │
  └─<ThemeProvider>
      │
      └─<UIProvider>
          │
          └─<ActivePlayerProvider>
              │
              ├─<AudioPlayerProvider>
              │   │
              │   └─<VideoPlayerProvider>
              │       │
              │       └─<SharedReactPlayerProvider>
              │           │
              │           ├─ {children}
              │           │   │
              │           │   └─ <Pages>
              │           │       ├─ <HomePage>
              │           │       ├─ <AudioDetailPage>
              │           │       └─ <VideoDetailPage>
              │           │
              │           ├─ <UnifiedAudioPlayer />
              │           │
              │           └─ <UnifiedVideoPlayer />
              │
              └─<QueryClientProvider>
                  └─ ...
```

**چرا این ترتیب؟**
1. `ActivePlayerProvider` → بالاترین سطح، مدیریت player فعال
2. `AudioPlayerProvider` → نیاز به ActivePlayerContext
3. `VideoPlayerProvider` → نیاز به ActivePlayerContext
4. `SharedReactPlayerProvider` → نیاز به Audio و Video contexts
5. UI Components → داخل SharedReactPlayerProvider

---

## نمودار 7: State Dependencies

```
┌────────────────────────────────────────────────────────┐
│              ActivePlayerContext                        │
│  activePlayer: 'audio' | 'video' | null                │
└────────────┬───────────────────────────────────────────┘
             │
             │ depends on
             │
    ┌────────┴────────┐
    │                 │
    ↓                 ↓
┌─────────────────┐ ┌─────────────────┐
│ AudioPlayerCtx  │ │ VideoPlayerCtx  │
│                 │ │                 │
│ Watches:        │ │ Watches:        │
│ activePlayer    │ │ activePlayer    │
│                 │ │                 │
│ If ≠ 'audio':   │ │ If ≠ 'video':   │
│ → Close player  │ │ → Close player  │
└────────┬────────┘ └────────┬────────┘
         │                   │
         │ provides          │ provides
         │                   │
         ↓                   ↓
┌─────────────────┐ ┌─────────────────┐
│ UnifiedAudioPl. │ │ UnifiedVideoPl. │
│                 │ │                 │
│ Reads:          │ │ Reads:          │
│ • currentTrack  │ │ • currentTrack  │
│ • isVisible     │ │ • isVisible     │
│ • playlist      │ │ • playlist      │
└─────────────────┘ └─────────────────┘
         │                   │
         │ uses              │ uses
         │                   │
         └────────┬──────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│  SharedReactPlayerProvider          │
│                                     │
│  Reads:                             │
│  • activePlayer (from Active)       │
│  • currentTrack (from Audio/Video)  │
│                                     │
│  Provides:                          │
│  • playing, played, duration, seek  │
└─────────────────────────────────────┘
```

---

## 🎯 خلاصه نمودارها

1. **Big Picture**: معماری کلی از UI تا Playback
2. **Audio Flow**: جریان پخش صوت
3. **Inline Flow**: جریان inline player و viewport detection
4. **Audio ↔ Video**: سوییچ بین players
5. **Volume Sync**: همگام‌سازی volume
6. **Provider Tree**: سلسله مراتب providers
7. **State Dependencies**: وابستگی‌های state

