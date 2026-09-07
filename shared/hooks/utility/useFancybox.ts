/**
 * useFancybox Hook - روضة الحسین
 * هوک قابل استفاده مجدد برای Fancybox
 */

'use client'

import { useEffect, useRef, RefObject } from 'react'
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

interface UseFancyboxOptions {
  selector?: string
  dependencies?: unknown[]
}

export function useFancybox<T extends HTMLElement = HTMLDivElement>(
  options: UseFancyboxOptions = {}
): RefObject<T | null> {
  const { selector = '[data-fancybox]', dependencies = [] } = options
  const containerRef = useRef<T>(null)
  const depsKey = JSON.stringify(dependencies)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    Fancybox.bind(container, selector, {
      Carousel: {
        Thumbs: false,
      }
    })

    return () => {
      Fancybox.unbind(container)
      Fancybox.close()
    }
  }, [selector, depsKey])

  return containerRef
}
