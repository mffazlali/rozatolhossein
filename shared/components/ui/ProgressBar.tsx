/**
 * ProgressBar Component
 * کامپوننت نوار پیشرفت برای استوری‌ها
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import type { StoryProgressBarProps } from '@/shared/types';

export function ProgressBar({ 
  active, 
  completed, 
  duration,
  paused = false 
}: StoryProgressBarProps) {
  const [width, setWidth] = useState(completed ? 100 : 0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      setWidth(completed ? 100 : 0);
      return;
    }

    if (paused) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    // Reset or resume
    if (!startRef.current) {
      startRef.current = performance.now();
      if (pausedAtRef.current > 0) {
        startRef.current -= pausedAtRef.current;
      }
    }

    const animate = (timestamp: number) => {
      if (!startRef.current) return;
      
      const elapsed = timestamp - startRef.current;
      const progress = Math.min((elapsed / duration) * 100, 100);
      
      setWidth(progress);
      pausedAtRef.current = elapsed;

      if (progress < 100) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [active, completed, duration, paused]);

  return (
    <div className="flex-1 h-[3px] rounded-sm bg-theme-white/35 overflow-hidden">
      <div 
        className="h-full bg-theme-white rounded-sm"
        style={{ 
          width: `${width}%`,
          transition: active && !paused ? 'none' : 'width 0.1s ease'
        }} 
      />
    </div>
  );
}
