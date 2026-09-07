'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useAudioPlayer } from '@/shared/contexts/AudioPlayerContext'

/**
 * useScrollToTrack Hook
 * اسکرول خودکار به کارت در حال پخش
 *
 * @returns registerCard - تابع ثبت ref کارت
 */
export function useScrollToTrack() {
  const { currentTrack } = useAudioPlayer()
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map())

  // Scroll to current track when it changes
  useEffect(() => {
    if (currentTrack?.id) {
      const cardElement = cardRefs.current.get(currentTrack.id)
      if (cardElement) {
        cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentTrack?.id])

  // Register card element
  const registerCard = useCallback((id: string, element: HTMLElement | null) => {
    if (element) {
      cardRefs.current.set(id, element)
    } else {
      cardRefs.current.delete(id)
    }
  }, [])

  return { registerCard }
}
