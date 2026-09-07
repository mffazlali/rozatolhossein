import { Suspense } from 'react'
import { searchService } from '@/shared/services'
import { SessionContent } from './components'
import { SessionGeneralSkeleton } from './components'
import { getContentHref, type SessionItem } from '@/shared/types'
import type { SearchContentItem, SearchResult } from '@/shared/types/search'

interface SessionProps {
  locale?: string
  serviceId?: string
  peopleId?: string
  occasionId?: string
  placeId?: string
  heyatId?: string
  tagId?: string
  styleId?: string
  searchResults?: SearchResult
}

/**
 * تبدیل SearchContentItem به SessionItem
 */
function mapToSessionItem(item: SearchContentItem): SessionItem {
  return {
    id: item.id,
    title: item.title,
    date: item.fields?.data?.text || '',
    image: item.thumb_path || item.image_path,
    href: getContentHref('fa', item.id),
  }
}

/**
 * Session Data Fetcher - کامپوننت داخلی برای fetch داده
 */
async function SessionDataFetcher({
  serviceId,
  peopleId,
  occasionId,
  placeId,
  heyatId,
  tagId,
  styleId,
  searchResults
}: SessionProps) {
  // Fetch session data بر اساس نوع پارامتر
  let searchResult = searchResults ? searchResults : null
  if (!searchResult) {
    try {
      if (serviceId) {
        searchResult = await searchService.searchByService(serviceId)
      } else if (peopleId) {
        searchResult = await searchService.searchByPeople(peopleId)
      } else if (occasionId) {
        searchResult = await searchService.searchByOccasion(occasionId)
      } else if (placeId) {
        searchResult = await searchService.searchByPlace(placeId)
      } else if (heyatId) {
        searchResult = await searchService.searchByHeyat(heyatId)
      } else if (tagId) {
        searchResult = await searchService.searchByTag(tagId)
      } else if (styleId) {
        searchResult = await searchService.searchByStyle(styleId)
      }
    } catch (error) {
      console.error('Error fetching audio list:', error)
    }
  }

  // تبدیل داده‌ها به فرمت SessionItem
  const sessionItems: SessionItem[] = searchResult?.items
    ? searchResult.items.map(mapToSessionItem)
    : []

  const filterId =
    serviceId ||
    peopleId ||
    occasionId ||
    placeId ||
    heyatId ||
    tagId ||
    styleId ||
    ''

  return <SessionContent sessionItems={sessionItems} serviceId={filterId} />
}

/**
 * Session Page Server Component با Suspense
 * صفحه لیست جلسات با fetch مستقیم از API
 */
const Session = ({
  locale,
  serviceId,
  peopleId,
  occasionId,
  placeId,
  heyatId,
  tagId,
  styleId,
  searchResults
}: SessionProps) => {
  return (
    <Suspense fallback={<SessionGeneralSkeleton />}>
      <SessionDataFetcher
        locale={locale}
        serviceId={serviceId}
        peopleId={peopleId}
        occasionId={occasionId}
        placeId={placeId}
        heyatId={heyatId}
        tagId={tagId}
        styleId={styleId}
        searchResults={searchResults}
      />
    </Suspense>
  )
}

export default Session
