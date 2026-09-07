'use client'

import { useState } from 'react'
import type { AudioTrack } from '@/shared/contexts/AudioPlayerContext'
import { AudioTimeline } from './AudioTimeline'
import { PeaksTimeline } from './PeaksTimeline'

interface TimelineComparisonProps {
  track: AudioTrack
  progress: number
  bufferedProgress: number
  isActive: boolean
  onSeek: (percentage: number) => void
}

/**
 * TimelineComparison
 * کامپوننت تست برای مقایسه WaveSurfer و Peaks.js
 * 
 * این کامپوننت هر دو timeline را کنار هم نمایش می‌دهد تا بتوانیم:
 * - سرعت load را مقایسه کنیم
 * - کیفیت waveform را مقایسه کنیم
 * - مصرف منابع را مقایسه کنیم
 */
export function TimelineComparison({
  track,
  progress,
  bufferedProgress,
  isActive,
  onSeek,
}: TimelineComparisonProps) {
  const [showComparison, setShowComparison] = useState(false)

  if (!showComparison) {
    return (
      <div className="flex flex-col gap-2 p-4 bg-figma-gray-dark rounded-lg">
        <button
          type="button"
          onClick={() => setShowComparison(true)}
          className="px-4 py-2 bg-figma-primary-teal text-white rounded-lg hover:opacity-80 transition-opacity"
        >
          <i className="fa-light fa-flask ml-2" />
          نمایش مقایسه WaveSurfer vs Peaks.js
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-figma-gray-dark rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-figma-white text-lg">
          <i className="fa-light fa-flask ml-2" />
          مقایسه Timeline ها
        </h3>
        <button
          type="button"
          onClick={() => setShowComparison(false)}
          className="text-figma-gray hover:text-figma-white transition-colors"
        >
          <i className="fa-light fa-times" />
        </button>
      </div>

      {/* WaveSurfer */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-figma-primary-teal text-sm font-medium">WaveSurfer.js</span>
          <span className="text-figma-gray text-xs">(روش فعلی)</span>
        </div>
        <div className="bg-figma-black rounded-lg p-3">
          <AudioTimeline
            type="waveform"
            isActive={isActive}
            progress={progress}
            bufferedProgress={bufferedProgress}
            audioSrc={track.audioSrc}
            onSeek={onSeek}
            lazyLoad={false}
          />
        </div>
        <div className="text-figma-gray text-xs">
          ✅ کتابخانه محبوب و پایدار
          <br />
          ✅ مستندات عالی
          <br />
          ❌ باید کل فایل را دانلود کند
        </div>
      </div>

      {/* Peaks.js */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-figma-primary-gold text-sm font-medium">Peaks.js</span>
          <span className="text-figma-gray text-xs">(روش جدید - تست)</span>
        </div>
        <div className="bg-figma-black rounded-lg p-3">
          <PeaksTimeline
            type="waveform"
            isActive={isActive}
            progress={progress}
            bufferedProgress={bufferedProgress}
            audioSrc={track.audioSrc}
            onSeek={onSeek}
            lazyLoad={false}
          />
        </div>
        <div className="text-figma-gray text-xs">
          ✅ Progressive loading
          <br />
          ✅ سریع‌تر برای فایل‌های بزرگ
          <br />
          ❌ Setup پیچیده‌تر
        </div>
      </div>

      {/* نکات تست */}
      <div className="flex flex-col gap-2 p-3 bg-figma-black rounded-lg border border-figma-border-light">
        <div className="text-figma-white text-sm font-medium">
          <i className="fa-light fa-lightbulb ml-2" />
          نکات تست:
        </div>
        <ul className="text-figma-gray text-xs space-y-1 pr-4">
          <li>• سرعت load را با DevTools Network مقایسه کنید</li>
          <li>• مصرف CPU و Memory را با Performance Monitor بررسی کنید</li>
          <li>• با فایل‌های مختلف (کوتاه و طولانی) تست کنید</li>
          <li>• scroll سریع در لیست را امتحان کنید</li>
        </ul>
      </div>
    </div>
  )
}
