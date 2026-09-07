import { Suspense } from 'react'
import { contentService } from '@/shared/services'
import { VideoDetailContent } from './components'
import { VideoDetailSkeleton } from './components'
import { defaultLocale } from '@/shared/lib/i18n'
import type { VideoDetailResponse } from '@/shared/services'

/**
 * Video Detail Props
 */
interface VideoDetailProps {
  videoId: string
  locale?: string
}

/**
 * Video Data Fetcher - کامپوننت داخلی برای fetch داده
 */
async function VideoDetailDataFetcher({ videoId, locale = defaultLocale }: VideoDetailProps) {
  // Fetch video data - errors will be caught by error.tsx
  let videoData: VideoDetailResponse | null = null
  try {
    videoData = await contentService.getVideoDetail(videoId, locale)
  } catch (error) {
    console.error('Error fetching video detail:', error)
    throw error // Re-throw to be caught by error.tsx
  }

  if (!videoData) {
    throw new Error('Video not found')
  }

  return <VideoDetailContent videoData={videoData} />
}

/**
 * VideoDetail Feature Component با Suspense
 * صفحه جزئیات ویدیو - Server Component با fetch مستقیم از API
 * خطاها توسط error.tsx مدیریت می‌شوند
 */
const VideoDetail = ({ videoId, locale = defaultLocale }: VideoDetailProps) => {
  return (
    <Suspense fallback={<VideoDetailSkeleton />}>
      <VideoDetailDataFetcher videoId={videoId} locale={locale} />
    </Suspense>
  )
}

export default VideoDetail
