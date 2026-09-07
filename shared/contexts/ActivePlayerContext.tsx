'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type ActivePlayerType = 'audio' | 'video' | null

interface ActivePlayerContextType {
  activePlayer: ActivePlayerType
  setActivePlayer: (player: ActivePlayerType) => void
}

const ActivePlayerContext = createContext<ActivePlayerContextType | undefined>(undefined)

interface ActivePlayerProviderProps {
  children: ReactNode
}

/**
 * ActivePlayerProvider
 * مدیریت پلیر فعال - فقط یک پلیر می‌تواند همزمان فعال باشد
 */
export function ActivePlayerProvider({ children }: ActivePlayerProviderProps) {
  const [activePlayer, setActivePlayer] = useState<ActivePlayerType>(null)

  const handleSetActivePlayer = useCallback((player: ActivePlayerType) => {
    setActivePlayer(player)
  }, [])

  return (
    <ActivePlayerContext.Provider
      value={{
        activePlayer,
        setActivePlayer: handleSetActivePlayer,
      }}
    >
      {children}
    </ActivePlayerContext.Provider>
  )
}

/**
 * useActivePlayer Hook
 */
export function useActivePlayer() {
  const context = useContext(ActivePlayerContext)
  if (context === undefined) {
    throw new Error('useActivePlayer must be used within an ActivePlayerProvider')
  }
  return context
}
