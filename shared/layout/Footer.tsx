'use client'

import Link from 'next/link'

/**
 * Footer Component
 * کامپوننت فوتر اصلی سایت مطابق با طرح Figma
 */
export function Footer() {
  return (
    <footer className="w-full pt-12 sm:pt-16 lg:pt-[70px] pb-5 px-4 sm:px-6 lg:px-0">
      <div className="flex flex-col gap-[10px] items-center justify-center w-full max-w-[1140px] mx-auto">
        {/* Main Footer Content */}
        <div className="w-full bg-theme-black border border-theme-border rounded-[10px] p-4 sm:p-6 transition-colors">
          <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4">
            {/* Right Side - Main Title */}
            <div className="flex-1 w-full sm:w-auto">
              <p className="text-theme-gray text-sm sm:text-base lg:text-[17.3px] leading-[18px] text-center sm:text-right">
                هیئت روضة الحسین علیه السلام
              </p>
            </div>

            {/* Left Side - Social Media Icons */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
              {/* Instagram */}
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-theme-gray-dark rounded hover:bg-theme-gray-dark/80 transition-colors"
                aria-label="اینستاگرام">
                <i className="fa-light fa-brands fa-instagram text-theme-gray text-lg" />
              </a>

              {/* Telegram */}
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-theme-gray-dark rounded hover:bg-theme-gray-dark/80 transition-colors"
                aria-label="تلگرام">
                <i className="fa-light fa-brands fa-telegram text-theme-gray text-lg" />
              </a>

              {/* YouTube */}
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-theme-gray-dark rounded hover:bg-theme-gray-dark/80 transition-colors"
                aria-label="یوتیوب">
                <i className="fa-light fa-brands fa-youtube text-theme-gray text-lg" />
              </a>

              {/* WhatsApp */}
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-theme-gray-dark rounded hover:bg-theme-gray-dark/80 transition-colors"
                aria-label="واتساپ">
                <i className="fa-light fa-brands fa-whatsapp text-theme-gray text-lg" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Credit */}
        <div className="w-full flex items-center justify-center">
          <div className="flex items-center justify-center h-[21px]">
            <div className="flex items-center flex-wrap justify-center gap-1">
              <span className="text-theme-gray text-xs sm:text-[13.5px] leading-[21px] font-light">
                طراحی و توسعه توسط
              </span>
              <Link
                href="https://asrepayesh.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-gray text-xs sm:text-[14px] leading-[21px] hover:text-theme-white transition-colors">
                عصرپایش
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
