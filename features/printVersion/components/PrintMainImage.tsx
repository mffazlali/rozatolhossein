/**
 * PrintMainImage Component
 * تصویر اصلی خبر در نسخه چاپی
 * 
 * @param image - آدرس تصویر
 * @param title - عنوان برای alt text
 */

'use client';

// Next.js imports
import Image from 'next/image';
import Link from 'next/link';

export interface PrintMainImageProps {
  image: string;
  title: string;
}

// Component
export const PrintMainImage = ({
  image,
  title,
}: PrintMainImageProps) => {
  return (
    <section className="flex flex-col items-end w-full py-4">
      <Link
        href={image}
        className="flex items-start justify-end p-0 w-full"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="relative w-full">
          <Image
            src={image}
            alt={title}
            width={1296}
            height={729}
            className="w-full h-auto object-contain rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1296px"
            priority={false}
          />
        </div>
      </Link>
    </section>
  );
};