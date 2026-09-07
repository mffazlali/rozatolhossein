/**
 * StoryViewer Component
 * کامپوننت نمایش full-screen استوری
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ProgressBar } from '@/shared/components/ui';
import type { StoryViewerProps, StoryItem } from '@/shared/types';

const STORY_DURATION = 5000; // 5 seconds per slide

export function StoryViewer({ 
  stories, 
  startIndex, 
  onClose,
  onStoryChange,
  onComplete 
}: StoryViewerProps) {
  const [storyIdx, setStoryIdx] = useState(startIndex);
  const [slideIdx, setSlideIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const story = stories[storyIdx];
  const slide = story?.slides[slideIdx];

  // Navigation functions
  const goNext = useCallback(() => {
    if (!story) return;

    if (slideIdx < story.slides.length - 1) {
      setSlideIdx(s => s + 1);
    } else if (storyIdx < stories.length - 1) {
      setStoryIdx(s => s + 1);
      setSlideIdx(0);
    } else {
      onComplete?.();
      onClose();
    }
  }, [slideIdx, storyIdx, story, stories.length, onClose, onComplete]);

  const goPrev = useCallback(() => {
    if (slideIdx > 0) {
      setSlideIdx(s => s - 1);
    } else if (storyIdx > 0) {
      setStoryIdx(s => s - 1);
      setSlideIdx(0);
    }
  }, [slideIdx, storyIdx]);

  // Auto-advance timer
  useEffect(() => {
    if (paused) return;

    timerRef.current = setTimeout(goNext, STORY_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [slideIdx, storyIdx, paused, goNext]);

  // Notify parent of story change
  useEffect(() => {
    onStoryChange?.(storyIdx, slideIdx);
  }, [storyIdx, slideIdx, onStoryChange]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        setPaused(p => !p);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, onClose]);

  // Touch handlers for pause
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    pressTimer.current = setTimeout(() => setPaused(true), 150);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;
    
    // Swipe detection (horizontal swipe با threshold بیشتر از vertical)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe left - next story
        if (storyIdx < stories.length - 1) {
          setStoryIdx(s => s + 1);
          setSlideIdx(0);
        }
      } else {
        // Swipe right - previous story
        if (storyIdx > 0) {
          setStoryIdx(s => s - 1);
          setSlideIdx(0);
        }
      }
    }
    
    setPaused(false);
  };

  // Click navigation (left 1/3 = prev, right 2/3 = next)
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX;
    const w = e.currentTarget.offsetWidth;
    
    if (x < w / 3) {
      goPrev();
    } else {
      goNext();
    }
  };

  if (!story || !slide) return null;

  // استخراج اطلاعات کاربر
  const username = typeof story.user === 'string' 
    ? story.user 
    : story.user.username || story.username || 'user';
  
  const avatar = typeof story.user === 'string'
    ? story.avatar || ''
    : story.user.avatar || story.avatar || '';

  const verified = typeof story.user === 'string'
    ? story.verified || false
    : story.user.verified || story.verified || false;

  return (
    <div className="fixed inset-0 bg-theme-black z-1000 flex items-center justify-center">
      {/* Story Card */}
      <div
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-[420px] h-full max-h-[745px] rounded-none md:rounded-[20px] overflow-hidden cursor-pointer select-none shrink-0"
        style={{ background: slide.bg }}
      >
        {/* Background */}
        <div 
          className="absolute inset-0" 
          style={{ background: slide.bg }}
        />

        {/* Noise Overlay */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`
          }}
        />

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 pt-3.5 px-3 pb-0 z-10">
          {/* Progress Bars */}
          <div className="flex gap-1 mb-2.5">
            {story.slides.map((_, i) => (
              <ProgressBar
                key={i}
                active={i === slideIdx && !paused}
                completed={i < slideIdx}
                duration={STORY_DURATION}
                paused={paused}
              />
            ))}
          </div>

          {/* User Info */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full border-2 border-theme-white/90 overflow-hidden shrink-0 bg-theme-gray">
              {avatar ? (
                <Image 
                  src={avatar} 
                  alt={username}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg">
                  👤
                </div>
              )}
            </div>

            <div>
              <div className="text-theme-white font-bold text-sm flex items-center gap-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
                {username}
                {verified && <span className="text-xs">✔️</span>}
              </div>
              <div className="text-theme-white/75 text-[11px] drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
                همین الان
              </div>
            </div>

            <div className="mr-auto flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPaused(p => !p);
                }}
                className="bg-transparent border-none text-theme-white text-lg cursor-pointer opacity-90 hover:opacity-100"
              >
                {paused ? '▶' : '⏸'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="bg-transparent border-none text-theme-white text-xl cursor-pointer opacity-90 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
          {slide.emoji && (
            <div 
              className="text-7xl mb-5 animate-[floatEmoji_3s_ease-in-out_infinite]"
              style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))' }}
            >
              {slide.emoji}
            </div>
          )}

          {slide.text && (
            <div className="text-theme-white font-extrabold text-2xl md:text-3xl leading-tight mb-3 drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)] direction-rtl">
              {slide.text}
            </div>
          )}

          {slide.subtext && (
            <div className="text-theme-white/85 text-[15px] drop-shadow-[0_1px_10px_rgba(0,0,0,0.3)] direction-rtl">
              {slide.subtext}
            </div>
          )}
        </div>

        {/* Bottom Reply Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-5 bg-linear-to-t from-theme-black/40 to-transparent">
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-3 bg-theme-white/15 backdrop-blur-[10px] rounded-[30px] py-2.5 px-4 border border-theme-white/25"
          >
            <input
              placeholder="پاسخ بده..."
              className="flex-1 bg-transparent border-none outline-none text-theme-white text-sm direction-rtl placeholder:text-theme-white/60"
            />
            <span className="text-xl cursor-pointer">😍</span>
            <span className="text-xl cursor-pointer">❤️</span>
            <span className="text-xl cursor-pointer">👏</span>
          </div>
        </div>
      </div>

      {/* Side Navigation Arrows (Desktop) */}
      {storyIdx > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setStoryIdx(s => Math.max(0, s - 1));
            setSlideIdx(0);
          }}
          className="fixed left-5 top-1/2 -translate-y-1/2 bg-theme-white/15 backdrop-blur-sm border border-theme-white/20 rounded-full w-11 h-11 text-theme-white text-xl cursor-pointer hidden md:flex items-center justify-center hover:bg-theme-white/25 transition-colors"
        >
          ‹
        </button>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (storyIdx < stories.length - 1) {
            setStoryIdx(s => s + 1);
            setSlideIdx(0);
          } else {
            onClose();
          }
        }}
        className="fixed right-5 top-1/2 -translate-y-1/2 bg-theme-white/15 backdrop-blur-sm border border-theme-white/20 rounded-full w-11 h-11 text-theme-white text-xl cursor-pointer flex items-center justify-center hover:bg-theme-white/25 transition-colors"
      >
        ›
      </button>
    </div>
  );
}
