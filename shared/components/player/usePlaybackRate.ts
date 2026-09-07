'use client'

import { useCallback, useEffect, useSyncExternalStore } from 'react'

const PLAYBACK_RATE_KEY = 'player-playback-rate'

interface UsePlaybackRateReturn {
  playbackRate: number
  setPlaybackRate: (rate: number) => void
}

// Global state برای sync بین همه instances
let globalPlaybackRate = typeof window !== 'undefined' 
  ? parseFloat(localStorage.getItem(PLAYBACK_RATE_KEY) || '1') 
  : 1
const listeners: Set<() => void> = new Set()

function notifyListeners() {
  listeners.forEach(listener => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Cache برای جلوگیری از infinite loop
let cachedSnapshot = { playbackRate: globalPlaybackRate }
const serverSnapshot = { playbackRate: 1 }

function getSnapshot() {
  // فقط وقتی مقادیر تغییر کردن، object جدید بساز
  if (cachedSnapshot.playbackRate !== globalPlaybackRate) {
    cachedSnapshot = { playbackRate: globalPlaybackRate }
  }
  return cachedSnapshot
}

function getServerSnapshot() {
  return serverSnapshot
}

/**
 * usePlaybackRate Hook
 * هوک مشترک برای مدیریت سرعت پخش در تمام پلیرها (video و audio)
 * مقادیر در localStorage ذخیره می‌شوند و بین تمام پلیرها sync هستند
 */
export function usePlaybackRate(): UsePlaybackRateReturn {
  // استفاده از useSyncExternalStore برای sync بین instances
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  // Sync با تغییرات localStorage از تب‌های دیگر
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PLAYBACK_RATE_KEY && e.newValue) {
        globalPlaybackRate = parseFloat(e.newValue)
        notifyListeners()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const setPlaybackRate = useCallback((newRate: number) => {
    const clampedRate = Math.max(0.25, Math.min(2, newRate))
    
    globalPlaybackRate = clampedRate
    localStorage.setItem(PLAYBACK_RATE_KEY, clampedRate.toString())
    
    notifyListeners()
  }, [])

  return {
    playbackRate: state.playbackRate,
    setPlaybackRate,
  }
}
