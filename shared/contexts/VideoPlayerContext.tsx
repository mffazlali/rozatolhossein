'use client'

import { createContext, useContext, useState, useCallback, useRef, ReactNode, useEffect } from 'react'
import { useActivePlayer } from './ActivePlayerContext'

/**
 * Video Track Type
 * تایپ ترک ویدیویی
 */
export interface VideoTrack {
  id: string
  title: string
  artist: string
  image: string
  duration: string
  videoSrc: string
  /** لینک به صفحه ویدیو */
  href?: string
  /** آیا این track از session است؟ */
  isFromSession?: boolean
  /** ID صفحه session (اگر از session باشد) */
  sessionId?: string
}

/**
 * Video Player Context Type
 */
interface VideoPlayerContextType {
  currentTrack: VideoTrack | null
  isPlayerVisible: boolean
  /** آیدی ویدیویی که در حالت inline پخش می‌شود */
  inlinePlayerId: string | null
  /** آیا پخش‌کننده inline در viewport هست */
  isInlineInView: boolean
  /** آیا پخش‌کننده در حالت expanded/fullscreen هست */
  isExpanded: boolean
  /** آیا در حالت fullscreen هستیم */
  isFullscreen: boolean
  /** آیا در حال باز شدن inline player هستیم */
  isOpeningInline: boolean
  /** زمان ذخیره شده برای resume */
  savedPlaybackTime: number
  setSavedPlaybackTime: (time: number) => void
  /** آیا باید بعد از انتقال پخش ادامه پیدا کنه */
  shouldResumePlayback: boolean
  /** آیا video قبل از move در حال پخش بود */
  wasPlayingBeforeMove: boolean
  /** آیا video در حال پخش است */
  isVideoPlaying: boolean
  playTrack: (track: VideoTrack) => void
  /** پخش ویدیو در حالت inline (در جای تصویر) */
  playInline: (track: VideoTrack, setActive?: boolean) => void
  /** تنظیم وضعیت viewport برای inline player */
  setInlineInView: (inView: boolean) => void
  /** تنظیم وضعیت expanded */
  setIsExpanded: (expanded: boolean) => void
  /** تنظیم وضعیت fullscreen */
  setIsFullscreen: (fullscreen: boolean) => void
  /** بستن حالت inline (برگشت به تصویر) */
  stopInline: () => void
  /** بستن حالت inline و ادامه پخش در mini */
  stopInlineAndResume: () => void
  /** تنظیم وضعیت resume */
  setShouldResumePlayback: (resume: boolean) => void
  /** تنظیم وضعیت پخش قبل از move */
  setWasPlayingBeforeMove: (wasPlaying: boolean) => void
  /** تنظیم وضعیت پخش فعلی */
  setIsVideoPlaying: (isPlaying: boolean) => void
  setCurrentTrack: (track: VideoTrack) => void
  closePlayer: () => void
  playlist: VideoTrack[]
  setPlaylist: (tracks: VideoTrack[]) => void
  playNext: () => void
  playPrevious: () => void
}

const VideoPlayerContext = createContext<VideoPlayerContextType | undefined>(undefined)

/**
 * Video Player Provider Props
 */
interface VideoPlayerProviderProps {
  children: ReactNode
}

/**
 * VideoPlayerProvider
 * مدیریت وضعیت پخش‌کننده ویدیو در سراسر برنامه
 */
export function VideoPlayerProvider({ children }: VideoPlayerProviderProps) {
  const { activePlayer, setActivePlayer } = useActivePlayer()
  const [currentTrack, setCurrentTrack] = useState<VideoTrack | null>(null)
  const [isPlayerVisible, setIsPlayerVisible] = useState(false)
  const [inlinePlayerId, setInlinePlayerId] = useState<string | null>(null)
  const [isInlineInView, setIsInlineInView] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [shouldResumePlayback, setShouldResumePlayback] = useState(false)
  const [wasPlayingBeforeMove, setWasPlayingBeforeMove] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [playlist, setPlaylist] = useState<VideoTrack[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1)
  const [isOpeningInline, setIsOpeningInline] = useState(false)
  const [savedPlaybackTime, setSavedPlaybackTime] = useState<number>(0)
  const prevActivePlayerRef = useRef(activePlayer)

  // وقتی پلیر دیگه فعال شد، این پلیر رو ببند
  useEffect(() => {
    if (prevActivePlayerRef.current === 'video' && activePlayer !== 'video' && isPlayerVisible) {
      queueMicrotask(() => {
        setIsPlayerVisible(false)
        setCurrentTrack(null)
        setInlinePlayerId(null)
        setIsInlineInView(true)
        setIsExpanded(false)
        setShouldResumePlayback(false)
      })
    }
    prevActivePlayerRef.current = activePlayer
  }, [activePlayer, isPlayerVisible])

  const playTrack = useCallback((track: VideoTrack) => {
    setActivePlayer('video')
    setCurrentTrack(track)
    setIsPlayerVisible(true)
    setInlinePlayerId(null)
  }, [setActivePlayer])

  const playInline = useCallback((track: VideoTrack, setActive: boolean = true) => {
    // فقط اگر setActive=true باشد، activePlayer رو تغییر بده
    if (setActive) {
      setActivePlayer('video')
    }
    setCurrentTrack(track)
    setIsPlayerVisible(true)
    setInlinePlayerId(track.id)
    setIsInlineInView(true)
    // فلگ برای جلوگیری از نمایش mini player
    setIsOpeningInline(true)
    // بعد از 500ms فلگ را false کن
    setTimeout(() => setIsOpeningInline(false), 500)
  }, [setActivePlayer])

  const handleSetInlineInView = useCallback((inView: boolean) => {
    setIsInlineInView(inView)
  }, [])

  const handleSetIsExpanded = useCallback((expanded: boolean) => {
    setIsExpanded(expanded)
  }, [])

  const stopInline = useCallback(() => {
    setInlinePlayerId(null)
    setIsInlineInView(true)
  }, [])

  const stopInlineAndResume = useCallback(() => {
    setShouldResumePlayback(true)
    setInlinePlayerId(null)
    setIsInlineInView(true)
  }, [])

  const handleSetShouldResumePlayback = useCallback((resume: boolean) => {
    setShouldResumePlayback(resume)
  }, [])

  const handleSetWasPlayingBeforeMove = useCallback((wasPlaying: boolean) => {
    setWasPlayingBeforeMove(wasPlaying)
  }, [])

  const handleSetIsVideoPlaying = useCallback((playing: boolean) => {
    setIsVideoPlaying(playing)
  }, [])

  const handleSetCurrentTrack = useCallback((track: VideoTrack) => {
    setCurrentTrack(track)
    // به‌روزرسانی currentTrackIndex
    const index = playlist.findIndex(t => t.id === track.id)
    setCurrentTrackIndex(index)
    
    // اگر inline player فعال بود، inlinePlayerId رو به ترک جدید تغییر بده
    if (inlinePlayerId) {
      setInlinePlayerId(track.id)
      // فلگ برای جلوگیری از نمایش mini player
      setIsOpeningInline(true)
      // بعد از 500ms فلگ را false کن
      setTimeout(() => setIsOpeningInline(false), 500)
    }
  }, [playlist, inlinePlayerId])

  // وقتی playlist تغییر می‌کنه، currentTrackIndex رو به‌روز کن
  useEffect(() => {
    if (currentTrack && playlist.length > 0) {
      const index = playlist.findIndex(t => t.id === currentTrack.id)
      setCurrentTrackIndex(index)
    }
  }, [playlist, currentTrack])

  const closePlayer = useCallback(() => {
    setIsPlayerVisible(false)
    setCurrentTrack(null)
    setInlinePlayerId(null)
    setIsInlineInView(true)
    setIsExpanded(false)
    setIsFullscreen(false)
    setShouldResumePlayback(false)
    setWasPlayingBeforeMove(false)
    setIsVideoPlaying(false)
    
    // فقط اگر آخرین ترک بود، playlist رو خالی کن
    const isLastTrack = currentTrackIndex !== -1 && currentTrackIndex === playlist.length - 1
    if (isLastTrack) {
      setPlaylist([])
      setCurrentTrackIndex(-1)
    }
    
    if (activePlayer === 'video') {
      setActivePlayer(null)
    }
  }, [activePlayer, setActivePlayer, currentTrackIndex, playlist.length])

  const playNext = useCallback(() => {
    if (!currentTrack || playlist.length === 0) return
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id)
    
    // اگر در fullscreen هستیم یا inline player فعال نیست، inline mode رو clear کن
    if (isFullscreen || !inlinePlayerId || !isInlineInView) {
      setInlinePlayerId(null)
    }
    
    // اگر آخرین ترک است، null برگردان (نه اولین ترک)
    if (currentIndex === -1 || currentIndex === playlist.length - 1) {
      return
    }
    setCurrentTrack(playlist[currentIndex + 1])
  }, [currentTrack, playlist, inlinePlayerId, isInlineInView, isFullscreen])

  const playPrevious = useCallback(() => {
    if (!currentTrack || playlist.length === 0) return
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id)
    
    // اگر در fullscreen هستیم یا inline player فعال نیست، inline mode رو clear کن
    if (isFullscreen || !inlinePlayerId || !isInlineInView) {
      setInlinePlayerId(null)
    }
    
    if (currentIndex === -1 || currentIndex === 0) {
      return
    }
    setCurrentTrack(playlist[currentIndex - 1])
  }, [currentTrack, playlist, inlinePlayerId, isInlineInView, isFullscreen])

  return (
    <VideoPlayerContext.Provider
      value={{
        currentTrack,
        isPlayerVisible,
        inlinePlayerId,
        isInlineInView,
        isExpanded,
        isFullscreen,
        isOpeningInline,
        savedPlaybackTime,
        setSavedPlaybackTime,
        shouldResumePlayback,
        wasPlayingBeforeMove,
        isVideoPlaying,
        playTrack,
        playInline,
        setInlineInView: handleSetInlineInView,
        setIsExpanded: handleSetIsExpanded,
        setIsFullscreen,
        stopInline,
        stopInlineAndResume,
        setShouldResumePlayback: handleSetShouldResumePlayback,
        setWasPlayingBeforeMove: handleSetWasPlayingBeforeMove,
        setIsVideoPlaying: handleSetIsVideoPlaying,
        setCurrentTrack: handleSetCurrentTrack,
        closePlayer,
        playlist,
        setPlaylist,
        playNext,
        playPrevious,
      }}
    >
      {children}
    </VideoPlayerContext.Provider>
  )
}

/**
 * useVideoPlayer Hook
 * دسترسی به context پخش‌کننده ویدیو
 */
export function useVideoPlayer() {
  const context = useContext(VideoPlayerContext)
  if (context === undefined) {
    throw new Error('useVideoPlayer must be used within a VideoPlayerProvider')
  }
  return context
}
