import { Suspense } from 'react'
import { contentService } from '@/shared/services'
import { AudioDetailContent } from './components'
import { AudioDetailSkeleton } from './components'
import { defaultLocale } from '@/shared/lib/i18n'
import type { AudioDetailResponse } from '@/shared/services'

/**
 * Audio Detail Props
 */
interface AudioDetailProps {
  audioId: string
  locale?: string
}

/**
 * Audio Data Fetcher - کامپوننت داخلی برای fetch داده
 */
async function AudioDetailDataFetcher({ audioId, locale = defaultLocale }: AudioDetailProps) {
  // Fetch audio data - errors will be caught by error.tsx
  let audioData: AudioDetailResponse | null = null
  try {
    audioData = await contentService.getAudioDetail(audioId, locale)
  } catch (error) {
    console.error('Error fetching audio detail:', error)
    throw error // Re-throw to be caught by error.tsx
  }

  if (!audioData) {
    throw new Error('Audio not found')
  }

  return <AudioDetailContent audioData={audioData} />
}

/**
 * AudioDetail Feature Component با Suspense
 * صفحه جزئیات صوت - Server Component با fetch مستقیم از API
 * خطاها توسط error.tsx مدیریت می‌شوند
 */
const AudioDetail = ({ audioId, locale = defaultLocale }: AudioDetailProps) => {
  return (
    <Suspense fallback={<AudioDetailSkeleton />}>
      <AudioDetailDataFetcher audioId={audioId} locale={locale} />
    </Suspense>
  )
}

export default AudioDetail
