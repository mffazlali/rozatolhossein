import { notFound } from 'next/navigation'
import { searchService, termService } from '@/shared/services'
import { CONTENT_TYPE_MAP, ContentTypeId } from '@/shared/types'
import { PageWrapper } from '@/shared'
import Audio from '@/features/media/General/audio'
import Video from '@/features/media/General/video'
import Session from '@/features/media/General/session'

interface ServicePageProps {
  params: Promise<{ id: string; locale: string }>
}

/**
 * Service Page
 * صفحه یکپارچه سرویس‌ها (صوت، ویدیو، جلسات)
 */
export default async function ServicePage({ params }: ServicePageProps) {
  const { id, locale } = await params

  // دریافت عنوان از termService
  const term = await termService.getTermById(id)

  // دریافت اطلاعات سرویس از API
  const searchResult = await searchService.searchByService(id)
  const contentTypeId = searchResult.items.length && searchResult.items[0].content_type_id

  if (!contentTypeId) {
    notFound()
  }

  // تشخیص نوع سرویس
  const serviceType = CONTENT_TYPE_MAP[contentTypeId  as ContentTypeId]

  if (!serviceType) {
    notFound()
  }

  // رندر شرطی بر اساس نوع سرویس با PageWrapper
  switch (serviceType) {
    case 'audio':
      return (
        <PageWrapper title={term?.title}>
          <Audio locale={locale} serviceId={id} />
        </PageWrapper>
      )
    case 'video':
      return (
        <PageWrapper title={term?.title}>
          <Video locale={locale} serviceId={id} />
        </PageWrapper>
      )
    case 'session':
      return (
        <PageWrapper title={term?.title}>
          <Session locale={locale} serviceId={id} />
        </PageWrapper>
      )
    case 'photo':
      return (
        <PageWrapper title={term?.title}>
          <Session locale={locale} serviceId={id}/>
        </PageWrapper>
      )
    default:
      notFound()
  }
}

/**
 * Generate Metadata
 * تولید متادیتا بر اساس نوع سرویس
 */
export async function generateMetadata({ params }: ServicePageProps) {
  const { id } = await params

  const term = await termService.getTermById(id)

  if (!term) {
    return {
      title: 'صفحه یافت نشد - روضة الحسین',
    }
  }

  return {
    title: `${term.title} - روضة الحسین`,
    description: `مجموعه ${term.title} روضة الحسین`,
  }
}
