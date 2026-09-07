'use client'

import { useCallback, useEffect, useSyncExternalStore } from 'react'

const VOLUME_KEY = 'player-volume'
const MUTED_KEY = 'player-muted'

interface UsePlayerVolumeReturn {
  volume: number
  isMuted: boolean
  setVolume: (volume: number) => void
  toggleMute: () => void
  setMuted: (muted: boolean) => void
}

// Global state برای sync بین همه instances
let globalVolume = typeof window !== 'undefined' 
  ? parseFloat(localStorage.getItem(VOLUME_KEY) || '1') 
  : 1
let globalMuted = typeof window !== 'undefined' 
  ? localStorage.getItem(MUTED_KEY) === 'true' 
  : false
const listeners: Set<() => void> = new Set()

function notifyListeners() {
  listeners.forEach(listener => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Cache برای جلوگیری از infinite loop
let cachedSnapshot = { volume: globalVolume, isMuted: globalMuted }
const serverSnapshot = { volume: 1, isMuted: false }

function getSnapshot() {
  // فقط وقتی مقادیر تغییر کردن، object جدید بساز
  if (cachedSnapshot.volume !== globalVolume || cachedSnapshot.isMuted !== globalMuted) {
    cachedSnapshot = { volume: globalVolume, isMuted: globalMuted }
  }
  return cachedSnapshot
}

function getServerSnapshot() {
  return serverSnapshot
}

/**
 * usePlayerVolume Hook
 * هوک مشترک برای مدیریت صدا در تمام پلیرها (video و audio)
 * مقادیر در localStorage ذخیره می‌شوند و بین تمام پلیرها sync هستند
 */
export function usePlayerVolume(): UsePlayerVolumeReturn {
  // استفاده از useSyncExternalStore برای sync بین instances
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  // Sync با تغییرات localStorage از تب‌های دیگر
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === VOLUME_KEY && e.newValue) {
        globalVolume = parseFloat(e.newValue)
        notifyListeners()
      }
      if (e.key === MUTED_KEY) {
        globalMuted = e.newValue === 'true'
        notifyListeners()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    const newMuted = clampedVolume > 0 ? false : globalMuted
    
    globalVolume = clampedVolume
    globalMuted = newMuted
    localStorage.setItem(VOLUME_KEY, clampedVolume.toString())
    localStorage.setItem(MUTED_KEY, newMuted.toString())
    
    notifyListeners()
  }, [])

  const setMuted = useCallback((muted: boolean) => {
    globalMuted = muted
    localStorage.setItem(MUTED_KEY, muted.toString())
    notifyListeners()
  }, [])

  const toggleMute = useCallback(() => {
    globalMuted = !globalMuted
    localStorage.setItem(MUTED_KEY, globalMuted.toString())
    notifyListeners()
  }, [])

  return {
    volume: state.volume,
    isMuted: state.isMuted,
    setVolume,
    toggleMute,
    setMuted,
  }
}
