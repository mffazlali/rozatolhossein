import { notFound } from 'next/navigation'
import { searchService, termService } from '@/shared/services'
import { CONTENT_TYPE_MAP, ContentTypeId } from '@/shared/types'
import { PageWrapper } from '@/shared'
import Audio from '@/features/media/General/audio'
import Video from '@/features/media/General/video'
import Session from '@/features/media/General/session'

interface ArchivePageProps {
  params: Promise<{
    archive: 'heyat' | 'occasion' | 'person' | 'place' | 'style' | 'tag'
    id: string
    locale: string
  }>
}

/**
 * دریافت نتایج جستجو بر اساس نوع archive
 */
async function getSearchResults(type: string, id: string) {
  switch (type) {
    case 'heyat':
      return await searchService.searchByHeyat(id)
    case 'occasion':
      return await searchService.searchByOccasion(id)
    case 'person':
      return await searchService.searchByPeople(id)
    case 'place':
      return await searchService.searchByPlace(id)
    case 'style':
      return await searchService.searchByStyle(id)
    case 'tag':
      return await searchService.searchByTag(id)
    default:
      return null
  }
}

/**
 * تعیین prop name مناسب برای فیچرها
 */
function getPropName(type: string): string {
  switch (type) {
    case 'person':
      return 'peopleId'
    case 'occasion':
      return 'occasionId'
    case 'place':
      return 'placeId'
    case 'heyat':
      return 'heyatId'
    case 'tag':
      return 'tagId'
    case 'style':
      return 'styleId'
    default:
      return 'serviceId'
  }
}

/**
 * Archive Page
 * صفحه یکپارچه برای تمام انواع archive
 */
export default async function ArchivePage({ params }: ArchivePageProps) {
  const { archive, id, locale } = await params

  // بررسی نوع معتبر
  const validTypes = ['heyat', 'occasion', 'person', 'place', 'style', 'tag']
  if (!validTypes.includes(archive)) {
    notFound()
  }

  // دریافت عنوان از termService
  const term = await termService.getTermById(id)

  // دریافت اطلاعات از API
  const searchResult = await getSearchResults(archive, id)

  if (!searchResult) {
    notFound()
  }

  const contentTypeId =
    searchResult.items.length && searchResult.items[0].content_type_id

  if (!contentTypeId) {
    notFound()
  }

  // تشخیص نوع محتوا
  const serviceType = CONTENT_TYPE_MAP[contentTypeId as ContentTypeId]

  if (!serviceType) {
    notFound()
  }

  // تعیین prop name
  const propName = getPropName(archive)
  const props = { locale, [propName]: id }

  // رندر شرطی بر اساس نوع محتوا با PageWrapper
  switch (serviceType) {
    case 'audio':
      return (
        <PageWrapper title={term?.title}>
          <Audio {...props} searchResults={searchResult} />
        </PageWrapper>
      )
    case 'video':
      return (
        <PageWrapper title={term?.title}>
          <Video {...props} searchResults={searchResult} />
        </PageWrapper>
      )
    case 'session':
      return (
        <PageWrapper title={term?.title}>
          <Session {...props} searchResults={searchResult} />
        </PageWrapper>
      )
    case 'photo':
      return (
        <PageWrapper title={term?.title}>
          <Session {...props} searchResults={searchResult} />
        </PageWrapper>
      )
    default:
      notFound()
  }
}

/**
 * Generate Metadata
 */
export async function generateMetadata({ params }: ArchivePageProps) {
  const { id, archive } = await params

  const term = await termService.getTermById(id)

  if (!term) {
    return {
      title: 'صفحه یافت نشد - روضة الحسین',
    }
  }

  // تعیین توضیحات بر اساس نوع
  const descriptions: Record<string, string> = {
    heyat: `مجموعه آثار ${term.title} در روضة الحسین`,
    occasion: `مجموعه آثار ${term.title} در روضة الحسین`,
    person: `مجموعه آثار ${term.title} در روضة الحسین`,
    place: `مجموعه آثار ${term.title} در روضة الحسین`,
    style: `مجموعه آثار با سبک ${term.title} در روضة الحسین`,
    tag: `مجموعه آثار با کلیدواژه ${term.title} در روضة الحسین`,
  }

  return {
    title: term.title
      ? `${term.title} - روضة الحسین`
      : 'صفحه یافت نشد - روضة الحسین',
    description:
      descriptions[archive] || `مجموعه آثار ${term.title} در روضة الحسین`,
  }
}
