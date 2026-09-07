'use client'
/**
 * useZoom Hook
 * هوک مدیریت زوم قابل استفاده مجدد
 * 
 * برای کنترل سایز فونت و محتوا در کامپوننت‌های مختلف
 */

import { useState, useCallback } from 'react';

interface UseZoomOptions {
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
}

interface UseZoomReturn {
  zoomLevel: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  resetZoom: () => void;
  setZoomLevel: (level: number) => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
  zoomPercentage: number;
}

/**
 * useZoom Hook
 * هوک مدیریت زوم با قابلیت‌های کامل
 * 
 * @param options - تنظیمات زوم
 * @param options.initialZoom - سطح زوم اولیه (پیش‌فرض: 1)
 * @param options.minZoom - حداقل زوم (پیش‌فرض: 0.6)
 * @param options.maxZoom - حداکثر زوم (پیش‌فرض: 2.0)
 * @param options.zoomStep - گام زوم (پیش‌فرض: 0.2)
 * 
 * @returns {UseZoomReturn} آبجکت شامل state و handlers زوم
 * 
 * @example
 * // استفاده ساده
 * const { zoomLevel, handleZoomIn, handleZoomOut } = useZoom();
 * 
 * @example
 * // با تنظیمات سفارشی
 * const zoom = useZoom({
 *   initialZoom: 1.2,
 *   minZoom: 0.8,
 *   maxZoom: 3.0,
 *   zoomStep: 0.1
 * });
 * 
 * @example
 * // استفاده در کامپوننت
 * const MyComponent = () => {
 *   const { zoomLevel, handleZoomIn, handleZoomOut, canZoomIn, canZoomOut } = useZoom();
 *   
 *   return (
 *     <div>
 *       <button onClick={handleZoomIn} disabled={!canZoomIn}>زوم بزرگ</button>
 *       <button onClick={handleZoomOut} disabled={!canZoomOut}>زوم کوچک</button>
 *       <div style={{ fontSize: `${14 * zoomLevel}px` }}>محتوا</div>
 *     </div>
 *   );
 * };
 */
export const useZoom = ({
  initialZoom = 1,
  minZoom = 0.6,
  maxZoom = 2.0,
  zoomStep = 0.2,
}: UseZoomOptions = {}): UseZoomReturn => {
  const [zoomLevel, setZoomLevelState] = useState(initialZoom);

  // Zoom in handler
  const handleZoomIn = useCallback(() => {
    setZoomLevelState(prev => Math.min(prev + zoomStep, maxZoom));
  }, [zoomStep, maxZoom]);

  // Zoom out handler
  const handleZoomOut = useCallback(() => {
    setZoomLevelState(prev => Math.max(prev - zoomStep, minZoom));
  }, [zoomStep, minZoom]);

  // Reset zoom to initial level
  const resetZoom = useCallback(() => {
    setZoomLevelState(initialZoom);
  }, [initialZoom]);

  // Set specific zoom level (with bounds checking)
  const setZoomLevel = useCallback((level: number) => {
    const boundedLevel = Math.max(minZoom, Math.min(level, maxZoom));
    setZoomLevelState(boundedLevel);
  }, [minZoom, maxZoom]);

  // Check if can zoom in/out
  const canZoomIn = zoomLevel < maxZoom;
  const canZoomOut = zoomLevel > minZoom;

  // Calculate zoom percentage
  const zoomPercentage = Math.round(zoomLevel * 100);

  return {
    zoomLevel,
    handleZoomIn,
    handleZoomOut,
    resetZoom,
    setZoomLevel,
    canZoomIn,
    canZoomOut,
    zoomPercentage,
  };
};