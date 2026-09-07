'use client'

import { UIProvider } from './UIProvider'
import { AudioPlayerProvider } from './AudioPlayerProvider'
import { VideoPlayerProvider } from './VideoPlayerProvider'
import { ThemeProvider, ActivePlayerProvider } from '@/shared/contexts'
import { SharedReactPlayerProvider } from '@/shared/components/player/SharedReactPlayerProvider'

interface ProvidersProps {
  children: React.ReactNode
  defaultTheme?: 'dark' | 'light'
}

/**
 * Providers
 * ترکیب تمام ارائه‌دهنده‌های برنامه
 * 
 * @param defaultTheme - تم پیش‌فرض از API
 */
export function Providers({ children, defaultTheme = 'light' }: ProvidersProps) {
  return (
    <ThemeProvider defaultTheme={defaultTheme}>
      <UIProvider>
        <ActivePlayerProvider>
          <AudioPlayerProvider>
            <VideoPlayerProvider>
              <SharedReactPlayerProvider>
                {children}
              </SharedReactPlayerProvider>
            </VideoPlayerProvider>
          </AudioPlayerProvider>
        </ActivePlayerProvider>
      </UIProvider>
    </ThemeProvider>
  )
}
