'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { useActivePlayer } from './ActivePlayerContext'

/**
 * Audio Track Type
 */
export interface AudioTrack {
  id: string
  title: string
  artist: string
  image: string
  duration: string
  audioSrc: string
  /** لینک به صفحه صوت */
  href?: string
  /** آیا این track از session است؟ */
  isFromSession?: boolean
  /** ID صفحه session (اگر از session باشد) */
  sessionId?: string
  /** لینک دانلود صوت */
  downloadUrl?: string
}

/**
 * Player Type - نوع پلیر
 */
export type PlayerType = 'linear' | 'waveform'

/**
 * Audio Player Context Type
 */
interface AudioPlayerContextType {
  currentTrack: AudioTrack | null
  isPlayerVisible: boolean
  /** تنظیم وضعیت نمایش پلیر */
  setIsPlayerVisible: (visible: boolean) => void
  /** آیدی صوتی که در حالت inline پخش می‌شود */
  inlinePlayerId: string | null
  /** Track کامل برای inline player */
  inlineTrack: AudioTrack | null
  /** آیا پخش‌کننده inline در viewport هست */
  isInlineInView: boolean
  /** آیا پخش‌کننده در حالت expanded هست */
  isExpanded: boolean
  /** آیا باید بعد از انتقال پخش ادامه پیدا کنه */
  shouldResumePlayback: boolean
  /** آیا audio قبل از move در حال پخش بود */
  wasPlayingBeforeMove: boolean
  /** آیا audio در حال پخش است */
  isAudioPlaying: boolean
  /** نوع پلیر فعلی (linear یا waveform) */
  playerType: PlayerType
  /** تنظیم نوع پلیر */
  setPlayerType: (type: PlayerType) => void
  playTrack: (track: AudioTrack) => void
  /** پخش صوت در حالت inline (در جای تصویر) */
  playInline: (track: AudioTrack, showPlayer?: boolean, setActive?: boolean, playerType?: PlayerType) => void
  /** تنظیم وضعیت viewport برای inline player */
  setInlineInView: (inView: boolean) => void
  /** تنظیم وضعیت expanded */
  setIsExpanded: (expanded: boolean) => void
  /** بستن حالت inline (برگشت به تصویر) */
  stopInline: () => void
  /** بستن حالت inline و ادامه پخش در mini */
  stopInlineAndResume: () => void
  /** تنظیم وضعیت resume */
  setShouldResumePlayback: (resume: boolean) => void
  /** تنظیم وضعیت پخش قبل از move */
  setWasPlayingBeforeMove: (wasPlaying: boolean) => void
  /** تنظیم وضعیت پخش فعلی */
  setIsAudioPlaying: (isPlaying: boolean) => void
  setCurrentTrack: (track: AudioTrack) => void
  closePlayer: () => void
  playlist: AudioTrack[]
  setPlaylist: (tracks: AudioTrack[]) => void
  playNext: () => void
  playPrevious: () => void
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined)

/**
 * Audio Player Provider Props
 */
interface AudioPlayerProviderProps {
  children: ReactNode
}

/**
 * AudioPlayerProvider
 * مدیریت وضعیت پخش‌کننده صوت در سراسر برنامه
 */
export function AudioPlayerProvider({ children }: AudioPlayerProviderProps) {
  const { activePlayer, setActivePlayer } = useActivePlayer()
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null)
  const [isPlayerVisible, setIsPlayerVisible] = useState(false)
  const [inlinePlayerId, setInlinePlayerId] = useState<string | null>(null)
  const [inlineTrack, setInlineTrack] = useState<AudioTrack | null>(null) // ذخیره track برای inline player
  const [isInlineInView, setIsInlineInView] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [shouldResumePlayback, setShouldResumePlayback] = useState(false)
  const [wasPlayingBeforeMove, setWasPlayingBeforeMove] = useState(false)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [playlist, setPlaylist] = useState<AudioTrack[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1)
  const [playerType, setPlayerType] = useState<PlayerType>('linear')

  // وقتی پلیر دیگه فعال شد، این پلیر رو ببند
  useEffect(() => {
    if (activePlayer !== 'audio' && isPlayerVisible) {
      setIsPlayerVisible(false)
      setCurrentTrack(null)
      setInlinePlayerId(null)
      setInlineTrack(null)
      setIsInlineInView(true)
      setIsExpanded(false)
      setShouldResumePlayback(false)
      setWasPlayingBeforeMove(false)
      setIsAudioPlaying(false)
    }
  }, [activePlayer, isPlayerVisible])

  const playTrack = useCallback((track: AudioTrack) => {
    setActivePlayer('audio')
    setCurrentTrack(track)
    setIsPlayerVisible(true)
    setInlinePlayerId(null)
  }, [setActivePlayer])

  const playInline = useCallback((track: AudioTrack, showPlayer: boolean = false, setActive: boolean = true, playerType?: PlayerType) => {
    // فقط اگر setActive=true باشد، activePlayer رو تغییر بده
    if (setActive) {
      setActivePlayer('audio')
    }
    // set کردن currentTrack، inlinePlayerId و inlineTrack
    setCurrentTrack(track)
    if (showPlayer) {
      setIsPlayerVisible(true)
    }
    setInlinePlayerId(track.id)
    setInlineTrack(track) // ذخیره track کامل
    setIsInlineInView(true)
    // اگر playerType پاس شده، آن را تنظیم کن
    if (playerType) {
      setPlayerType(playerType)
    }
  }, [setActivePlayer])

  const handleSetInlineInView = useCallback((inView: boolean) => {
    setIsInlineInView(inView)
  }, [])

  const handleSetIsExpanded = useCallback((expanded: boolean) => {
    setIsExpanded(expanded)
  }, [])

  const stopInline = useCallback(() => {
    setInlinePlayerId(null)
    setInlineTrack(null)
    setIsInlineInView(true)
  }, [])

  const stopInlineAndResume = useCallback(() => {
    setShouldResumePlayback(true)
    setInlinePlayerId(null)
    setInlineTrack(null)
    setIsInlineInView(true)
  }, [])

  const handleSetShouldResumePlayback = useCallback((resume: boolean) => {
    setShouldResumePlayback(resume)
  }, [])

  const handleSetWasPlayingBeforeMove = useCallback((wasPlaying: boolean) => {
    setWasPlayingBeforeMove(wasPlaying)
  }, [])

  const handleSetIsAudioPlaying = useCallback((playing: boolean) => {
    setIsAudioPlaying(playing)
  }, [])

  const handleSetCurrentTrack = useCallback((track: AudioTrack) => {
    setCurrentTrack(track)
    // به‌روزرسانی currentTrackIndex
    const index = playlist.findIndex(t => t.id === track.id)
    setCurrentTrackIndex(index)
    
    // اگر inline player فعال بود، inlinePlayerId رو به ترک جدید تغییر بده
    if (inlinePlayerId) {
      setInlinePlayerId(track.id)
      setInlineTrack(track)
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
    setInlineTrack(null)
    setIsInlineInView(true)
    setIsExpanded(false)
    setShouldResumePlayback(false)
    setWasPlayingBeforeMove(false)
    setIsAudioPlaying(false)
    
    // فقط اگر آخرین ترک بود، playlist رو خالی کن
    const isLastTrack = currentTrackIndex !== -1 && currentTrackIndex === playlist.length - 1
    if (isLastTrack) {
      setPlaylist([])
      setCurrentTrackIndex(-1)
    }
    
    if (activePlayer === 'audio') {
      setActivePlayer(null)
    }
  }, [activePlayer, setActivePlayer, currentTrackIndex, playlist.length])

  const playNext = useCallback(() => {
    if (!currentTrack || playlist.length === 0) return
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id)
    
    // اگر inline player فعال نیست (در mini player هستیم)، inline mode رو clear کن
    if (!inlinePlayerId || !isInlineInView) {
      setInlinePlayerId(null)
      setInlineTrack(null)
    }
    
    if (currentIndex === -1 || currentIndex === playlist.length - 1) {
      // Play first track if at end
      setCurrentTrack(playlist[0])
    } else {
      setCurrentTrack(playlist[currentIndex + 1])
    }
  }, [currentTrack, playlist, inlinePlayerId, isInlineInView])

  const playPrevious = useCallback(() => {
    if (!currentTrack || playlist.length === 0) return
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id)
    
    // اگر inline player فعال نیست (در mini player هستیم)، inline mode رو clear کن
    if (!inlinePlayerId || !isInlineInView) {
      setInlinePlayerId(null)
      setInlineTrack(null)
    }
    
    if (currentIndex === -1 || currentIndex === 0) {
      // Play last track if at beginning
      setCurrentTrack(playlist[playlist.length - 1])
    } else {
      setCurrentTrack(playlist[currentIndex - 1])
    }
  }, [currentTrack, playlist, inlinePlayerId, isInlineInView])

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlayerVisible,
        setIsPlayerVisible,
        inlinePlayerId,
        inlineTrack,
        isInlineInView,
        isExpanded,
        shouldResumePlayback,
        wasPlayingBeforeMove,
        isAudioPlaying,
        playerType,
        setPlayerType,
        playTrack,
        playInline,
        setInlineInView: handleSetInlineInView,
        setIsExpanded: handleSetIsExpanded,
        stopInline,
        stopInlineAndResume,
        setShouldResumePlayback: handleSetShouldResumePlayback,
        setWasPlayingBeforeMove: handleSetWasPlayingBeforeMove,
        setIsAudioPlaying: handleSetIsAudioPlaying,
        setCurrentTrack: handleSetCurrentTrack,
        closePlayer,
        playlist,
        setPlaylist,
        playNext,
        playPrevious,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  )
}

/**
 * useAudioPlayer Hook
 * دسترسی به context پخش‌کننده صوت
 */
export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext)
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider')
  }
  return context
}
