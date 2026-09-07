import { Suspense } from 'react'
import { searchService } from '@/shared/services'
import { VideoContent } from './components'
import { VideoGeneralSkeleton } from './components'
import { getContentHref, type VideoItem } from '@/shared/types'
import type { SearchContentItem, SearchResult } from '@/shared/types/search'

interface VideoProps {
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
 * تبدیل SearchContentItem به VideoItem
 */
function mapToVideoItem(item: SearchContentItem): VideoItem {
  return {
    id: item.id,
    title: item.title,
    category: item.service,
    image: item.thumb_path || item.image_path,
    href: getContentHref('fa', item.id),
    duration: item.fields?.data?.text || '',
  }
}

/**
 * Video Data Fetcher - کامپوننت داخلی برای fetch داده
 */
async function VideoDataFetcher({
  serviceId,
  peopleId,
  occasionId,
  placeId,
  heyatId,
  tagId,
  styleId,
  searchResults
}: VideoProps) {
  // Fetch video data بر اساس نوع پارامتر
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

  // تبدیل داده‌ها به فرمت VideoItem
  const videoItems: VideoItem[] = searchResult?.items
    ? searchResult.items.map(mapToVideoItem)
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

  return <VideoContent videoItems={videoItems} serviceId={filterId} />
}

/**
 * Video Page Server Component با Suspense
 * صفحه لیست ویدیوها با fetch مستقیم از API
 */
const Video = ({
  locale,
  serviceId,
  peopleId,
  occasionId,
  placeId,
  heyatId,
  tagId,
  styleId,
  searchResults
}: VideoProps) => {
  return (
    <Suspense fallback={<VideoGeneralSkeleton />}>
      <VideoDataFetcher
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

export default Video
