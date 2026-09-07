/**
 * Search Not Found Page
 * صفحه یافت نشد جستجو
 */

import { MediaNotFound } from '@/shared';

export default function SearchNotFound() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1140px] mx-auto px-4 py-8">
      <MediaNotFound type="content" />
    </div>
  );
}
