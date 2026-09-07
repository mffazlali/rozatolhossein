/**
 * Story Feed Component
 * کامپوننت اصلی نمایش فید استوری‌ها
 */

'use client';

import { useState, useCallback } from 'react';
import { ErrorBoundary, FeatureErrorFallback, StoryThumbnail } from '@/shared';
import { StoryViewer } from './StoryViewer';
import type { StoryItem, StorySeenState } from '@/shared/types';

interface StoryFeedProps {
  stories: StoryItem[];
  locale?: string;
}

/**
 * Story Feed Skeleton
 */
export function StoryFeedSkeleton() {
  return (
    <div className="flex flex-col gap-3 w-full max-w-[600px] mx-auto px-2 py-5">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="h-7 w-24 bg-theme-gray/20 animate-pulse rounded" />
        <div className="flex gap-4">
          <div className="h-6 w-6 bg-theme-gray/20 animate-pulse rounded" />
          <div className="h-6 w-6 bg-theme-gray/20 animate-pulse rounded" />
        </div>
      </div>

      {/* Stories Strip Skeleton */}
      <div className="bg-theme-black rounded-xl p-4">
        <div className="flex gap-4 overflow-x-auto pb-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="w-[68px] h-[68px] rounded-full bg-theme-gray/20 animate-pulse" />
              <div className="h-3 w-14 bg-theme-gray/20 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Story Feed Content
 */
export function StoryFeedContent({ stories }: StoryFeedProps) {
  const [viewing, setViewing] = useState<number | null>(null);
  const [seen, setSeen] = useState<StorySeenState>({});

  const openStory = useCallback((idx: number) => {
    const story = stories[idx];
    setSeen(s => ({ ...s, [story.id]: true }));
    setViewing(idx);
  }, [stories]);

  const closeStory = useCallback(() => {
    setViewing(null);
  }, []);

  const handleStoryChange = useCallback((storyIdx: number, slideIdx: number) => {
    // می‌توان اینجا analytics یا mark as seen را فراخوانی کرد
    console.log('Story changed:', storyIdx, slideIdx);
  }, []);

  return (
    <div className="flex flex-col gap-3 w-full max-w-[600px] mx-auto px-2 py-5">
      <ErrorBoundary
        fallback={({ error, retry }) => (
          <FeatureErrorFallback
            error={error}
            retry={retry}
            featureName="استوری‌ها"
          />
        )}
        resetOnPropsChange
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-2xl font-extrabold tracking-tight text-theme-gray-light">
            📸 استوری
          </span>
          <div className="flex gap-4 text-xl">
            <span className="cursor-pointer hover:opacity-80 transition-opacity">💬</span>
            <span className="cursor-pointer hover:opacity-80 transition-opacity">❤️</span>
          </div>
        </div>

        {/* Stories Strip */}
        <div className="bg-theme-black rounded-xl p-4">
          <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
            {/* Add Your Story Button */}
            <div className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0">
              <div className="w-[68px] h-[68px] rounded-full bg-linear-to-br from-theme-gray-light/20 to-theme-gray/20 flex items-center justify-center text-3xl border-[3px] border-theme-white shadow-[0_0_0_1px] shadow-theme-border-light relative">
                👤
                <div className="absolute bottom-0 right-0 w-[22px] h-[22px] rounded-full bg-theme-primary-teal text-theme-white flex items-center justify-center text-base font-bold border-2 border-theme-white">
                  +
                </div>
              </div>
              <span className="text-[11px] text-theme-gray-light">استوری شما</span>
            </div>

            {/* Story Thumbnails */}
            {stories.map((story, i) => (
              <StoryThumbnail
                key={story.id}
                story={story}
                seen={!!seen[story.id]}
                onClick={() => openStory(i)}
              />
            ))}
          </div>
        </div>

        {/* Dummy Posts (برای نمایش فید کامل) */}
        {[1, 2].map(n => (
          <div 
            key={n}
            className="bg-theme-black rounded-xl overflow-hidden"
          >
            {/* Post Header */}
            <div className="flex items-center gap-2.5 p-3">
              <div className="w-9 h-9 rounded-full bg-theme-gray-light/20 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-lg">
                  👤
                </div>
              </div>
              <div>
                <div className="font-bold text-[13px] text-theme-gray-light">کاربر_{n}</div>
                <div className="text-[11px] text-theme-gray">تهران</div>
              </div>
              <div className="mr-auto text-theme-gray text-lg">•••</div>
            </div>

            {/* Post Image */}
            <div 
              className="h-60 flex items-center justify-center text-6xl"
              style={{
                background: n === 1 
                  ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                  : 'linear-gradient(135deg, #f093fb, #f5576c)'
              }}
            >
              {n === 1 ? '🌅' : '🌸'}
            </div>

            {/* Post Actions */}
            <div className="p-2.5 px-3.5">
              <div className="flex gap-3.5 mb-2 text-xl">
                <span className="cursor-pointer hover:opacity-80 transition-opacity">🤍</span>
                <span className="cursor-pointer hover:opacity-80 transition-opacity">💬</span>
                <span className="cursor-pointer hover:opacity-80 transition-opacity">↗️</span>
                <span className="mr-auto cursor-pointer hover:opacity-80 transition-opacity">🔖</span>
              </div>
              <div className="text-[13px] font-bold mb-0.5 text-theme-gray-light">
                ۱,{n}۳۴ پسندیدن
              </div>
              <div className="text-[13px] direction-rtl text-theme-gray-light">
                <b>کاربر_{n}</b> یه روز قشنگ دیگه‌ای بود 🌟 #ایران #عکاسی
              </div>
            </div>
          </div>
        ))}
      </ErrorBoundary>

      {/* Story Viewer Modal */}
      {viewing !== null && (
        <StoryViewer
          stories={stories}
          startIndex={viewing}
          onClose={closeStory}
          onStoryChange={handleStoryChange}
        />
      )}
    </div>
  );
}
