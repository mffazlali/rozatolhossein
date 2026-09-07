/**
 * PrintHeader Component
 * هدر نسخه چاپی شامل QR Code، URL و لوگو
 *
 * @param url - آدرس صفحه خبر
 * @param newsId - شناسه خبر
 */

'use client'

// 1. React imports (removed unused React import)

// 2. Next.js imports
import Image from 'next/image'

// 3. Internal imports - Assets
import qrCodeImage from '@/public/images/qr-code-placeholder.svg'
import logoImage from '@/public/images/logo-red.svg'

export interface PrintHeaderProps {
  url: string;
  contentId: string;
}

// Component
export const PrintHeader = ({ url }: PrintHeaderProps) => {
  return (
    <header className="flex flex-col md:flex-row items-center md:items-start justify-between w-full min-h-[196px] gap-6 md:gap-4 py-4 md:py-0">
      {/* Logo Section - Right side */}
      <div className="flex flex-col items-center md:items-start w-full md:w-auto px-3 py-0">
        <div className="w-full max-w-[140px] sm:max-w-[160px] md:max-w-[196px] h-auto aspect-square">
          <Image
            src={logoImage}
            alt="لوگو شبکه آوینی"
            width={196}
            height={196}
            className="w-full h-full object-contain"
            priority={true}
          />
        </div>
      </div>

      {/* QR Code + URL Section - Left side */}
      <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto px-3 py-0">
        {/* QR Code */}
        <div className="w-full max-w-[140px] sm:max-w-[160px] md:max-w-[196px] h-auto aspect-square">
          <Image
            src={qrCodeImage}
            alt="QR Code برای دسترسی سریع به خبر"
            width={196}
            height={196}
            className="w-full h-full object-contain"
            priority={true}
          />
        </div>
        
        {/* URL below QR Code */}
        <div className="w-full max-w-[140px] sm:max-w-[160px] md:max-w-[196px]">
          <p className="text-xs sm:text-sm font-normal text-black text-center md:text-left leading-5 sm:leading-6 break-all">
            {url}
          </p>
        </div>
      </div>
    </header>
  )
}
