import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AudioDetail from '@/features/media/details/audio'
import VideoDetail from '@/features/media/details/video'
import SessionDetail from '@/features/media/details/session'
import { contentService, seoService } from '@/shared/services'

/**
 * Content Type IDs mapping
 * نگاشت شناسه نوع محتوا
 */
const CONTENT_TYPES = {
  1: 'session',
  2: 'photo',
  3: 'video',
  4: 'audio',
} as const

type ContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES]

interface ServiceContentPageProps {
  params: Promise<{ id: string; contentId: string; locale: string }>
}

/**
 * Service Content Detail Page
 * صفحه جزئیات محتوا با تشخیص خودکار نوع
 */
export default async function ServiceContentPage({
  params,
}: ServiceContentPageProps) {
  const { contentId, locale } = await params

  // دریافت اطلاعات محتوا برای تشخیص نوع
  let contentTypeId: number

  try {
    const content = await contentService.getContentDetail(contentId, locale)
    contentTypeId = content.content_type_id
  } catch {
    notFound()
  }

  // تشخیص نوع محتوا
  const contentType: ContentType | undefined =
    CONTENT_TYPES[contentTypeId as keyof typeof CONTENT_TYPES]

  if (!contentType) {
    notFound()
  }

  // رندر شرطی بر اساس نوع محتوا
  switch (contentType) {
    case 'audio':
      return <AudioDetail audioId={contentId} locale={locale} />
    case 'video':
      return <VideoDetail videoId={contentId} locale={locale} />
    case 'session':
      return <SessionDetail sessionId={contentId} locale={locale} />
    case 'photo':
      return (
        <SessionDetail sessionId={contentId} locale={locale} viewMode="photo" />
      )
    default:
      notFound()
  }
}

/**
 * Generate Metadata
 * تولید متادیتا بر اساس نوع محتوا
 */
export async function generateMetadata({
  params,
}: ServiceContentPageProps): Promise<Metadata> {
  const { contentId, locale } = await params

  try {
    const content = await contentService.getContentDetail(contentId, locale)
    const contentTypeId = content.content_type_id
    const contentType =
      CONTENT_TYPES[contentTypeId as keyof typeof CONTENT_TYPES]

    switch (contentType) {
      case 'audio':
        return seoService.getAudioMetadata(contentId, locale)
      case 'video':
        return seoService.getVideoMetadata(contentId, locale)
      case 'session':
        return seoService.getSessionMetadata(contentId, locale)
      default:
        return {
          title: content.title,
          description: content.summary || content.body?.slice(0, 160),
        }
    }
  } catch {
    return {
      title: 'محتوا یافت نشد - روضة الحسین',
    }
  }
}
