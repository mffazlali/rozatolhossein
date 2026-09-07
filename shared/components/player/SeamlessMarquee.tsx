'use client'

import { useRef, useEffect, useCallback, useState, ReactNode, CSSProperties } from 'react'

/**
 * SeamlessMarquee — نوار چرخان واقعی بدون جهش
 *
 * Props:
 *  children       – محتوا (string یا JSX)
 *  speed          – سرعت به pixel/second (پیش‌فرض 80)
 *  gap            – فاصله بین تکرارها به px — به عنوان padding-right کار می‌کند (پیش‌فرض 60)
 *  direction      – "left" | "right" (پیش‌فرض "left")
 *  pauseOnHover   – توقف موقع hover (پیش‌فرض true)
 *  className      – کلاس اضافه برای wrapper
 *  style          – style اضافه برای wrapper
 */

interface SeamlessMarqueeProps {
  children: ReactNode
  speed?: number
  gap?: number
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  className?: string
  style?: CSSProperties
}

export default function SeamlessMarquee({
  children,
  speed = 80,
  gap = 60,
  direction = 'left',
  pauseOnHover = true,
  className = '',
  style = {},
}: SeamlessMarqueeProps) {
  const outerRef = useRef<HTMLDivElement>(null)
  const firstRef = useRef<HTMLDivElement>(null)
  const [copies, setCopies] = useState(2)
  const [itemWidth, setItemWidth] = useState(0)
  const [paused, setPaused] = useState(false)

  const init = useCallback(() => {
    const outer = outerRef.current
    const first = firstRef.current
    if (!outer || !first) return

    const tileW = first.getBoundingClientRect().width // شامل padding-right (gap)
    const outerW = outer.getBoundingClientRect().width

    if (tileW === 0 || outerW === 0) return

    // تعداد کپی: پر کردن container + یک تایل اضافه برای seamless
    const needed = Math.ceil(outerW / tileW) + 2
    setCopies(Math.max(needed, 4))
    setItemWidth(tileW)
  }, [gap])

  useEffect(() => {
    init()
    const ro = new ResizeObserver(init)
    if (outerRef.current) ro.observe(outerRef.current)
    return () => ro.disconnect()
  }, [init])

  // Duration of one full "item width" scroll
  const duration = itemWidth > 0 ? itemWidth / speed : 2

  return (
    <>
      <style>{`
        @keyframes smq-left {
          from { transform: translateX(0px); }
          to   { transform: translateX(calc(-1 * var(--mq-tile))); }
        }
        @keyframes smq-right {
          from { transform: translateX(calc(-1 * var(--mq-tile))); }
          to   { transform: translateX(0px); }
        }
        .smq-track {
          display: flex;
          flex-wrap: nowrap;
          width: max-content;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-play-state: running;
        }
        .smq-track-paused {
          animation-play-state: paused !important;
        }
        .smq-track[data-dir="left"] {
          animation-name: smq-left;
        }
        .smq-track[data-dir="right"] {
          animation-name: smq-right;
        }
      `}</style>
      {/*
        direction: ltr روی outer — کلید اصلی!
        بدون این، در صفحات RTL مرورگر overflow را از سمت اشتباه کلیپ می‌کند
        و محتوا به جای حرف‌به‌حرف، یک‌دفعه ناپدید می‌شود.
      */}
      <div
        ref={outerRef}
        className={className}
        style={{
          direction: 'ltr',
          width: '100%',
          overflow: 'hidden',
          ...style,
        }}
        onMouseEnter={() => pauseOnHover && setPaused(true)}
        onMouseLeave={() => pauseOnHover && setPaused(false)}>
        <div
          className={`smq-track ${paused ? 'smq-track-paused' : ''}`}
          data-dir={direction}
          style={
            {
              '--mq-tile': `${itemWidth}px`,
              animationDuration: `${duration}s`,
            } as React.CSSProperties & { '--mq-tile': string }
          }>
          {Array.from({ length: copies }).map((_, i) => (
            <div
              key={i}
              ref={i === 0 ? firstRef : null}
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                paddingRight: `${gap}px`,
              }}>
              {children}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
