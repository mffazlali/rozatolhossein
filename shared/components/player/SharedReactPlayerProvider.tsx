'use client'

import { useRef, useEffect, useCallback, createContext, useContext, ReactNode, useState } from 'react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useAudioPlayer } from '@/shared/contexts/AudioPlayerContext'
import { useVideoPlayer } from '@/shared/contexts/VideoPlayerContext'
import { useActivePlayer } from '@/shared/contexts/ActivePlayerContext'
import { usePlayerVolume } from './usePlayerVolume'
import { usePlaybackRate } from './usePlaybackRate'
import { UnifiedAudioPlayer } from './audio/UnifiedAudioPlayer'
import { UnifiedVideoPlayer } from './video/UnifiedVideoPlayer'
import { CustomVideoControls } from './video/CustomVideoControls'

interface PlayerState {
  seeking: boolean
}

interface SharedReactPlayerContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  playerRef: React.RefObject<any>
  playing: boolean
  setPlaying: (playing: boolean) => void
  setPlayingByUser: (playing: boolean) => void
  played: number
  loaded: number
  duration: number
  seek: (time: number) => void
  setPlaybackRate: (rate: number) => void
  // اضافه کردن ref به audio element برای استفاده در Peaks.js
  audioElementRef: React.RefObject<HTMLAudioElement>
}

const SharedReactPlayerContext = createContext<SharedReactPlayerContextType | undefined>(undefined)

export function useSharedReactPlayer() {
  const context = useContext(SharedReactPlayerContext)
  if (!context) {
    throw new Error('useSharedReactPlayer must be used within SharedReactPlayerProvider')
  }
  return context
}

interface SharedReactPlayerProviderProps {
  children: ReactNode
}

/**
 * SharedReactPlayerProvider
 * دو ReactPlayer جداگانه برای audio و video که همیشه در DOM هستند
 * فقط یکی از آنها فعال است و دیگری مخفی
 */
export function SharedReactPlayerProvider({ children }: SharedReactPlayerProviderProps) {
  // دو ref جداگانه برای audio و video
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const audioPlayerRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const videoPlayerRef = useRef<any>(null)
  
  const lastAudioTrackIdRef = useRef<string | null>(null)
  const lastVideoTrackIdRef = useRef<string | null>(null)
  const lastVideoContainerRef = useRef<string | null>(null)
  const pathname = usePathname()
  
  const { activePlayer } = useActivePlayer()
  const audioContext = useAudioPlayer()
  const videoContext = useVideoPlayer()
  const { volume, isMuted, setVolume, toggleMute } = usePlayerVolume()
  const { playbackRate, setPlaybackRate: setGlobalPlaybackRate } = usePlaybackRate()

  // State جداگانه برای audio
  const [audioPlaying, setAudioPlayingState] = useState(false)
  const [audioPlayed, setAudioPlayed] = useState(0)
  const [audioLoaded, setAudioLoaded] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [audioSeeking] = useState(false)

  // State جداگانه برای video
  const [videoPlaying, setVideoPlayingState] = useState(false)
  const [videoPlayed, setVideoPlayed] = useState(0)
  const [videoLoaded, setVideoLoaded] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const [videoSeeking] = useState(false)

  // State برای موقعیت video player
  const [videoPlayerPosition, setVideoPlayerPosition] = useState<{
    top: number
    left: number
    width: number
    height: number
    zIndex: number
    isInline: boolean
    isCollapsed?: boolean
  } | null>(null)
  
  const audioState: PlayerState = { seeking: audioSeeking }
  const videoState: PlayerState = { seeking: videoSeeking }

  // انتخاب context بر اساس activePlayer
  const isAudio = activePlayer === 'audio'
  const isVideo = activePlayer === 'video'
  
  // برای context API، بر اساس activePlayer مقادیر را برمی‌گردانیم
  const playerRef = isAudio ? audioPlayerRef : videoPlayerRef
  const playing = isAudio ? audioPlaying : videoPlaying
  const played = isAudio ? audioPlayed : videoPlayed
  const loaded = isAudio ? audioLoaded : videoLoaded
  const duration = isAudio ? audioDuration : videoDuration
  
  const currentTrack = isAudio ? audioContext.currentTrack : isVideo ? videoContext.currentTrack : null
  const isPlayerVisible = isAudio ? audioContext.isPlayerVisible : isVideo ? videoContext.isPlayerVisible : false

  const setPlaying = useCallback((value: boolean) => {
    if (isAudio) {
      setAudioPlayingState(value)
      audioContext.setWasPlayingBeforeMove(value)
      audioContext.setIsAudioPlaying(value)
      
      // کنترل پخش audio element
      if (audioPlayerRef.current) {
        if (value) {
          audioPlayerRef.current.play().catch((e: Error) => console.error('Audio play error:', e))
        } else {
          audioPlayerRef.current.pause()
        }
      }
    } else if (isVideo) {
      setVideoPlayingState(value)
      videoContext.setWasPlayingBeforeMove(value)
      videoContext.setIsVideoPlaying(value)
    }
  }, [isAudio, isVideo, audioContext, videoContext])

  const setPlayingByUser = useCallback((value: boolean) => {
    if (isAudio) {
      setAudioPlayingState(value)
      audioContext.setWasPlayingBeforeMove(value)
      audioContext.setIsAudioPlaying(value)
      
      // کنترل پخش audio element
      if (audioPlayerRef.current) {
        if (value) {
          audioPlayerRef.current.play().catch((e: Error) => console.error('Audio play error:', e))
        } else {
          audioPlayerRef.current.pause()
        }
      }
    } else if (isVideo) {
      setVideoPlayingState(value)
      videoContext.setWasPlayingBeforeMove(value)
      videoContext.setIsVideoPlaying(value)
    }
  }, [isAudio, isVideo, audioContext, videoContext])

  const seek = useCallback((time: number) => {
    const currentPlayerRef = isAudio ? audioPlayerRef : videoPlayerRef
    const currentDuration = isAudio ? audioDuration : videoDuration
    
    if (!currentPlayerRef.current || currentDuration === 0) return
    const clampedTime = Math.max(0, Math.min(time, currentDuration))
    currentPlayerRef.current.currentTime = clampedTime
  }, [isAudio, audioDuration, videoDuration])

  const setPlaybackRate = useCallback((rate: number) => {
    const currentPlayerRef = isAudio ? audioPlayerRef : videoPlayerRef
    
    if (!currentPlayerRef.current) return
    currentPlayerRef.current.playbackRate = rate
    setGlobalPlaybackRate(rate)
  }, [isAudio, setGlobalPlaybackRate])

  // Reset audio player وقتی بسته می‌شود
  useEffect(() => {
    if (!audioContext.isPlayerVisible) {
      queueMicrotask(() => {
        setAudioPlayingState(false)
        setAudioPlayed(0)
        setAudioLoaded(0)
        setAudioDuration(0)
        lastAudioTrackIdRef.current = null
        
        if (audioPlayerRef.current) {
          try {
            if (audioPlayerRef.current.pause) {
              audioPlayerRef.current.pause()
            }
            audioPlayerRef.current.currentTime = 0
          } catch (error) {
            console.debug('Audio player cleanup error:', error)
          }
        }
      })
    }
  }, [audioContext.isPlayerVisible])

  // Reset video player وقتی بسته می‌شود
  useEffect(() => {
    if (!videoContext.isPlayerVisible) {
      queueMicrotask(() => {
        // ذخیره currentTime قبل از reset
        if (videoPlayerRef.current && videoPlayerRef.current.currentTime) {
          videoContext.setSavedPlaybackTime(videoPlayerRef.current.currentTime)
        }
        
        setVideoPlayingState(false)
        setVideoPlayed(0)
        setVideoLoaded(0)
        setVideoDuration(0)
        lastVideoTrackIdRef.current = null
        setVideoPlayerPosition(null)
        
        if (videoPlayerRef.current) {
          try {
            if (videoPlayerRef.current.pause) {
              videoPlayerRef.current.pause()
            }
            videoPlayerRef.current.currentTime = 0
          } catch (error) {
            console.debug('Video player cleanup error:', error)
          }
        }
      })
    }
  }, [videoContext.isPlayerVisible, videoContext])

  // Audio Track changes
  useEffect(() => {
    const audioTrack = audioContext.currentTrack
    if (!audioTrack) return

    if (audioTrack.audioSrc && lastAudioTrackIdRef.current !== audioTrack.id) {
      lastAudioTrackIdRef.current = audioTrack.id
      
      queueMicrotask(() => {
        setAudioPlayed(0)
        setAudioLoaded(0)
        setAudioDuration(0)
        
        // تنظیم volume، muted و playbackRate
        if (audioPlayerRef.current) {
          audioPlayerRef.current.volume = isMuted ? 0 : volume
          audioPlayerRef.current.muted = isMuted
          audioPlayerRef.current.playbackRate = playbackRate
        }
        
        setTimeout(() => {
          if (activePlayer === 'audio') {
            setAudioPlayingState(true)
            audioContext.setIsAudioPlaying(true)
            // شروع پخش
            if (audioPlayerRef.current) {
              audioPlayerRef.current.play().catch((e: Error) => console.error('Audio play error:', e))
            }
          }
        }, 100)
      })
    }
  }, [audioContext.currentTrack?.id, audioContext, activePlayer, volume, isMuted, playbackRate])

  // Video Track changes
  useEffect(() => {
    const videoTrack = videoContext.currentTrack
    if (!videoTrack) return

    if (videoTrack.videoSrc && lastVideoTrackIdRef.current !== videoTrack.id) {
      lastVideoTrackIdRef.current = videoTrack.id
      
      queueMicrotask(() => {
        setVideoPlayed(0)
        setVideoLoaded(0)
        setVideoDuration(0)
        
        // تنظیم playbackRate
        if (videoPlayerRef.current) {
          videoPlayerRef.current.playbackRate = playbackRate
        }
        
        setTimeout(() => {
          if (activePlayer === 'video') {
            setVideoPlayingState(true)
            videoContext.setIsVideoPlaying(true)
          }
        }, 100)
      })
    }
  }, [videoContext.currentTrack?.id, videoContext, activePlayer, playbackRate])

  // ===== AUDIO HANDLERS =====
  const handleAudioPlay = useCallback(() => {
    setAudioPlayingState(true)
    audioContext.setIsAudioPlaying(true)
    
    // تنظیم volume
    if (audioPlayerRef.current) {
      audioPlayerRef.current.volume = isMuted ? 0 : volume
      audioPlayerRef.current.muted = isMuted
    }
  }, [audioContext, volume, isMuted])

  const handleAudioPause = useCallback(() => {
    setAudioPlayingState(false)
    audioContext.setIsAudioPlaying(false)
  }, [audioContext])

  const handleAudioProgress = useCallback(() => {
    if (!audioPlayerRef.current || audioState.seeking || !audioPlayerRef.current.buffered?.length) return
    
    const player = audioPlayerRef.current
    const bufferedEnd = player.buffered.end(player.buffered.length - 1)
    const duration = player.duration || 0
    
    if (duration > 0) {
      setAudioLoaded(bufferedEnd / duration)
    }
  }, [audioState.seeking])

  const handleAudioTimeUpdate = useCallback(() => {
    if (!audioPlayerRef.current || !audioPlayerRef.current.duration) return
    
    const player = audioPlayerRef.current
    const currentTime = player.currentTime || 0
    const duration = player.duration || 0
    
    if (duration > 0) {
      setAudioPlayed(currentTime / duration)
    }
  }, [])

  const handleAudioDurationChange = useCallback(() => {
    if (!audioPlayerRef.current) return
    
    const dur = audioPlayerRef.current.duration
    if (dur && !isNaN(dur) && isFinite(dur)) {
      setAudioDuration(dur)
    }
  }, [])

  // ===== VIDEO HANDLERS =====
  const handleVideoPlay = useCallback(() => {
    setVideoPlayingState(true)
    videoContext.setIsVideoPlaying(true)
  }, [videoContext])

  const handleVideoPause = useCallback(() => {
    setVideoPlayingState(false)
    videoContext.setIsVideoPlaying(false)
  }, [videoContext])

  const handleVideoProgress = useCallback((state: { played: number; loaded: number; playedSeconds: number; loadedSeconds: number }) => {
    if (videoState.seeking) return
    
    setVideoPlayed(state.played)
    setVideoLoaded(state.loaded)
  }, [videoState.seeking])

  const handleVideoDurationChange = useCallback((duration: number) => {
    if (duration && !isNaN(duration) && isFinite(duration)) {
      setVideoDuration(duration)
    }
  }, [])

  const handleAudioEnded = useCallback(() => {
    const currentIndex = audioContext.playlist.findIndex((t) => t.id === audioContext.currentTrack?.id)
    const nextTrack = currentIndex !== -1 && currentIndex < audioContext.playlist.length - 1 
      ? audioContext.playlist[currentIndex + 1] 
      : null

    if (nextTrack) {
      // اگر ترک بعدی وجود داره، پخش کن
      audioContext.setCurrentTrack(nextTrack)
    }
    // اگر ترک بعدی نداریم، فقط پخش متوقف می‌شه (پلیر بسته نمی‌شه)
  }, [audioContext])

  const handleVideoEnded = useCallback(() => {
    const currentIndex = videoContext.playlist.findIndex((t) => t.id === videoContext.currentTrack?.id)
    const nextTrack = currentIndex !== -1 && currentIndex < videoContext.playlist.length - 1 
      ? videoContext.playlist[currentIndex + 1] 
      : null

    if (nextTrack) {
      // اگر ترک بعدی وجود داره، پخش کن
      videoContext.setCurrentTrack(nextTrack)
    }
    // اگر ترک بعدی نداریم، فقط پخش متوقف می‌شه (پلیر بسته نمی‌شه)
  }, [videoContext])

  // تشخیص target container برای video و محاسبه موقعیت با CSS positioning
  useEffect(() => {
    if (!videoContext.isPlayerVisible || !videoContext.currentTrack) {
      queueMicrotask(() => {
        setVideoPlayerPosition(null)
        lastVideoContainerRef.current = null
      })
      return
    }

    const updatePosition = () => {
      let targetContainerId: string | null = null
      let isInlineMode = false
      let zIndex = 50

      if (videoContext.isExpanded) {
        targetContainerId = 'expanded-video-container'
        zIndex = 10001 // زیر controls که z-20 دارند
        isInlineMode = true // استفاده از absolute position مثل inline
      } else if (videoContext.inlinePlayerId && videoContext.currentTrack?.id === videoContext.inlinePlayerId && videoContext.isInlineInView) {
        targetContainerId = `inline-video-container-${videoContext.inlinePlayerId}`
        isInlineMode = true
        zIndex = 1
      } else {
        targetContainerId = 'mini-video-container'
        zIndex = 9999 // mini player باید بالای همه چیز باشد
      }

      const targetContainer = document.getElementById(targetContainerId)
      if (targetContainer) {
        lastVideoContainerRef.current = targetContainerId
        
        const rect = targetContainer.getBoundingClientRect()
        
        // اگر mini player collapsed است، ویدیو را مخفی کن (اما position را حفظ کن)
        let isCollapsed = false
        if (targetContainerId === 'mini-video-container') {
          isCollapsed = targetContainer.getAttribute('data-collapsed') === 'true'
        }
        
        // برای fixed position از rect مستقیم استفاده می‌کنیم (بدون scrollY/scrollX)
        // برای absolute position باید scrollY/scrollX اضافه کنیم
        const position = {
          top: isInlineMode ? rect.top + window.scrollY : rect.top,
          left: isInlineMode ? rect.left + window.scrollX : rect.left,
          width: rect.width,
          height: rect.height,
          zIndex,
          isInline: isInlineMode,
          isCollapsed, // اضافه کردن وضعیت collapsed
        }
        
        setVideoPlayerPosition(position)
      }
    }

    updatePosition()
    
    // چک مجدد بعد از تاخیر کوچک
    const timeout = setTimeout(updatePosition, 100)
    
    // فقط در حالت mini و expanded به scroll و resize گوش بده
    // در حالت inline نباید با scroll حرکت کند
    const isInlineMode = videoContext.inlinePlayerId && videoContext.currentTrack?.id === videoContext.inlinePlayerId && videoContext.isInlineInView
    
    if (!isInlineMode) {
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
    } else {
      // در حالت inline فقط به resize گوش بده
      window.addEventListener('resize', updatePosition)
    }

    // MutationObserver برای تشخیص تغییر data-collapsed
    let observer: MutationObserver | null = null
    const miniContainer = document.getElementById('mini-video-container')
    if (miniContainer) {
      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-collapsed') {
            updatePosition()
          }
        })
      })
      observer.observe(miniContainer, { attributes: true })
    }

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
      if (observer) {
        observer.disconnect()
      }
    }
  }, [videoContext.isPlayerVisible, videoContext.currentTrack, videoContext.isExpanded, videoContext.inlinePlayerId, videoContext.isInlineInView, pathname])

  // Cleanup effect
  useEffect(() => {
    const currentAudioPlayer = audioPlayerRef.current
    const currentVideoPlayer = videoPlayerRef.current
    
    return () => {
      if (currentAudioPlayer) {
        try {
          if (currentAudioPlayer.pause) {
            currentAudioPlayer.pause()
          }
        } catch (error) {
          console.debug('Audio player unmount cleanup error:', error)
        }
      }
      if (currentVideoPlayer) {
        try {
          if (currentVideoPlayer.pause) {
            currentVideoPlayer.pause()
          }
        } catch (error) {
          console.debug('Video player unmount cleanup error:', error)
        }
      }
    }
  }, [])

  // Audio element - همیشه در DOM است
  const audioPlayerElement = (
    <div
      className="fixed top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1 }}>
      <audio
        ref={audioPlayerRef}
        src={audioContext.currentTrack?.audioSrc || undefined}
        controls={false}
        loop={false}
        style={{ display: 'none' }}
        onPlay={handleAudioPlay}
        onPause={handleAudioPause}
        onTimeUpdate={handleAudioTimeUpdate}
        onProgress={handleAudioProgress}
        onDurationChange={handleAudioDurationChange}
        onEnded={handleAudioEnded}
        onError={(e) => console.error('Audio player error:', e)}
      />
    </div>
  )

  // اعمال volume و muted به audio element
  useEffect(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.volume = volume
      audioPlayerRef.current.muted = isMuted
      audioPlayerRef.current.playbackRate = playbackRate
    }
  }, [volume, isMuted, playbackRate])

  // اعمال playback rate به video element
  useEffect(() => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.playbackRate = playbackRate
    }
  }, [playbackRate])

  // Video ReactPlayer - با CSS positioning به جای Portal
  const videoPlayerElement = videoPlayerPosition && videoContext.currentTrack?.videoSrc && (
    <div
      className={clsx(
        'bg-theme-black transition-all duration-300 ease-in-out overflow-hidden',
        videoPlayerPosition.isInline ? 'rounded-[10px]' : 'rounded-lg md:rounded-xl'
      )}
      style={{
        position: videoPlayerPosition.isInline ? 'absolute' : 'fixed',
        top: `${videoPlayerPosition.top}px`,
        left: `${videoPlayerPosition.left}px`,
        width: `${videoPlayerPosition.width}px`,
        height: `${videoPlayerPosition.height}px`,
        zIndex: videoPlayerPosition.zIndex,
        pointerEvents: 'auto',
        opacity: videoPlayerPosition.isCollapsed ? 0 : 1,
        visibility: videoPlayerPosition.isCollapsed ? 'hidden' : 'visible',
      }}>

        <CustomVideoControls
          ref={videoPlayerRef}
          videoSrc={videoContext.currentTrack.videoSrc}
          playing={videoPlaying}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          onProgress={handleVideoProgress}
          onDurationChange={handleVideoDurationChange}
          onEnded={handleVideoEnded}
          volume={volume}
          muted={isMuted}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
          controls={videoPlayerPosition.isInline || videoContext.isFullscreen}
        />      
    </div>
  )
  
  if (videoPlayerElement) {
    // Video player rendering
  }

  return (
    <SharedReactPlayerContext.Provider
      value={{
        playerRef,
        playing: isPlayerVisible && currentTrack ? playing : false,
        setPlaying,
        setPlayingByUser,
        played: isPlayerVisible && currentTrack ? played : 0,
        loaded: isPlayerVisible && currentTrack ? loaded : 0,
        duration: isPlayerVisible && currentTrack ? duration : 0,
        seek,
        setPlaybackRate,
        audioElementRef: audioPlayerRef,
      }}
    >
      {/* Audio Player - همیشه در DOM */}
      {audioPlayerElement}
      
      {/* Video Player - با CSS positioning */}
      {videoPlayerElement}
      
      {children}
      <UnifiedAudioPlayer />
      <UnifiedVideoPlayer />
    </SharedReactPlayerContext.Provider>
  )
}
