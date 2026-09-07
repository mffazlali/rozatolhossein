/**
 * Story Feature - Server Component
 * فیچر استوری با data fetching
 */

import { Suspense } from 'react';
import { storyService } from '@/shared/services';
import type { StoryItem } from '@/shared/types';
import { StoryFeedContent, StoryFeedSkeleton } from './components';

interface StoryProps {
  locale?: string;
}

/**
 * Story Data Fetcher - کامپوننت داخلی برای fetch داده
 */
async function StoryDataFetcher({ locale }: StoryProps) {
  let stories: StoryItem[] = [];
  
  try {
    stories = await storyService.getStories(locale);
  } catch (error) {
    console.error('Error fetching stories:', error);
  }

  return <StoryFeedContent stories={stories} />;
}

/**
 * Story Feature Server Component با Suspense
 */
const Story = ({ locale }: StoryProps) => {
  return (
    <Suspense fallback={<StoryFeedSkeleton />}>
      <StoryDataFetcher locale={locale} />
    </Suspense>
  );
};

export default Story;
