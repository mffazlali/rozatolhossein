/**
 * Search Page
 * صفحه جستجو
 */

import { Search } from '@/features/search';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'جستجو - روضة الحسین',
  description: 'جستجو در محتوای روضة الحسین',
};

interface SearchPageProps {
  searchParams: Promise<{
    phrase?: string;
    service?: string;
    place?: string;
    heyat?: string;
    style?: string;
    people?: string;
    occasion?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // در Next.js 15، searchParams یک Promise است
  const params = await searchParams;
  
  return <Search searchParams={params} />;
}
