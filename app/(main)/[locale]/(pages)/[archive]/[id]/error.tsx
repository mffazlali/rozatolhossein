'use client'

import { useRouter } from 'next/navigation'
import { startTransition, useCallback } from 'react'
import { FeatureErrorFallback } from '@/shared'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ArchiveError({ error, reset }: ErrorProps) {
  const router = useRouter()

  const handleRetry = useCallback(() => {
    startTransition(() => {
      reset()
      router.refresh()
    })
  }, [router, reset])

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1140px] mx-auto px-4 py-8">
      <FeatureErrorFallback error={error} retry={handleRetry} featureName="آرشیو" />
    </div>
  )
}
