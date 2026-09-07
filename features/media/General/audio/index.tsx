import { Suspense } from 'react'
import { searchService } from '@/shared/services'
import { AudioContent } from './components'
import { AudioGeneralSkeleton } from './components'
import { getContentHref, type AudioItem } from '@/shared/types'
import type { SearchContentItem, SearchResult } from '@/shared/types/search'

interface AudioProps {
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
 * تبدیل SearchContentItem به AudioItem
 */
function mapToAudioItem(item: SearchContentItem): AudioItem {
  return {
    id: item.id,
    title: item.title,
    category: item.service,
    image: item.thumb_path || item.image_path,
    href: getContentHref('fa', item.id),
    audioUrl: '',
    duration: item.fields?.data?.text || '',
  }
}

/**
 * Audio Data Fetcher - کامپوننت داخلی برای fetch داده
 */
async function AudioDataFetcher({
  serviceId,
  peopleId,
  occasionId,
  placeId,
  heyatId,
  tagId,
  styleId,
  searchResults,
}: AudioProps) {
  // Fetch audio data بر اساس نوع پارامتر
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

  // تبدیل داده‌ها به فرمت AudioItem
  const audioItems: AudioItem[] = searchResult?.items
    ? searchResult.items.map(mapToAudioItem)
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

  return <AudioContent audioItems={audioItems} serviceId={filterId} />
}

/**
 * Audio Page Server Component با Suspense
 * صفحه لیست صوت‌ها با fetch مستقیم از API
 */
const Audio = ({
  locale,
  serviceId,
  peopleId,
  occasionId,
  placeId,
  heyatId,
  tagId,
  styleId,
  searchResults,
}: AudioProps) => {
  return (
    <Suspense fallback={<AudioGeneralSkeleton />}>
      <AudioDataFetcher
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

export default Audio
