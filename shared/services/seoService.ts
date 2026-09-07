/**
 * SEO Service
 * سرویس تولید متادیتا برای صفحات - API روضة الحسین
 *
 * @updated December 2024
 */

import type { Metadata } from 'next';
import { contentService } from './contentService';
import { defaultLocale } from '@/shared/lib/i18n';

/**
 * Parse شده از seo_markup
 */
interface ParsedSeoMarkup {
  ogType?: string;
  ogSiteName?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterDescription?: string;
  twitterImage?: string;
  description?: string;
  robots?: string;
  imageLink?: string;
}

/**
 * استخراج مقدار content از meta tag
 */
function extractMetaContent(markup: string, property: string): string | undefined {
  // برای property="og:xxx" یا name="xxx"
  const propertyRegex = new RegExp(
    `<meta\\s+(?:property|name)=["']${property}["']\\s+content=["']([^"']*)["']`,
    'i'
  );
  const contentFirstRegex = new RegExp(
    `<meta\\s+content=["']([^"']*)["']\\s+(?:property|name)=["']${property}["']`,
    'i'
  );

  const match = markup.match(propertyRegex) || markup.match(contentFirstRegex);
  return match?.[1];
}

/**
 * استخراج href از link tag
 */
function extractLinkHref(markup: string, rel: string): string | undefined {
  const regex = new RegExp(`<link\\s+rel=["']${rel}["']\\s+href=["']([^"']*)["']`, 'i');
  const match = markup.match(regex);
  return match?.[1];
}

/**
 * Parse کردن seo_markup از API
 */
function parseSeoMarkup(markup: string): ParsedSeoMarkup {
  return {
    ogType: extractMetaContent(markup, 'og:type'),
    ogSiteName: extractMetaContent(markup, 'og:site_name'),
    ogTitle: extractMetaContent(markup, 'og:title'),
    ogDescription: extractMetaContent(markup, 'og:description'),
    ogImage: extractMetaContent(markup, 'og:image'),
    twitterCard: extractMetaContent(markup, 'twitter:card'),
    twitterDescription: extractMetaContent(markup, 'twitter:description'),
    twitterImage: extractMetaContent(markup, 'twitter:image'),
    description: extractMetaContent(markup, 'description'),
    robots: extractMetaContent(markup, 'robots'),
    imageLink: extractLinkHref(markup, 'image_src'),
  };
}

/**
 * تبدیل ParsedSeoMarkup به Next.js Metadata
 */
function toNextMetadata(
  parsed: ParsedSeoMarkup,
  fallbackTitle: string,
  siteName: string = 'روضة الحسین'
): Metadata {
  const title = parsed.ogTitle || fallbackTitle;
  const description = parsed.description || parsed.ogDescription || '';
  const image = parsed.ogImage || parsed.twitterImage || parsed.imageLink;

  // تعیین نوع OpenGraph
  let ogType: 'website' | 'article' | 'video.other' = 'article';
  if (parsed.ogType === 'website') ogType = 'website';
  else if (parsed.ogType?.includes('video')) ogType = 'video.other';

  // تعیین نوع Twitter Card
  const twitterCard = (parsed.twitterCard as 'summary' | 'summary_large_image') || 'summary_large_image';

  return {
    title: `${title} | ${siteName}`,
    description,
    robots: parsed.robots || 'index, follow',
    openGraph: {
      title,
      description: parsed.ogDescription || description,
      type: ogType,
      siteName: parsed.ogSiteName || siteName,
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: twitterCard,
      title,
      description: parsed.twitterDescription || description,
      images: image ? [image] : [],
    },
  };
}

/**
 * Fallback metadata وقتی seo_markup خالی باشد
 */
function createFallbackMetadata(
  title: string,
  description: string,
  image?: string,
  siteName: string = 'روضة الحسین'
): Metadata {
  return {
    title: `${title} | ${siteName}`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      siteName,
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export const seoService = {
  /**
   * دریافت متادیتا برای صفحه صوت
   * @param audioId - شناسه صوت
   * @param lang - زبان (پیش‌فرض: fa)
   */
  async getAudioMetadata(audioId: string, lang: string = defaultLocale): Promise<Metadata> {
    const content = await contentService.getContentDetail(audioId, lang);

    if (!content) {
      return {
        title: 'صوت یافت نشد | روضة الحسین',
        description: 'صوت مورد نظر یافت نشد',
      };
    }

    // اگر seo_markup موجود باشد، از آن استفاده کن
    if (content.seo_markup) {
      const parsed = parseSeoMarkup(content.seo_markup);
      return toNextMetadata(parsed, content.title);
    }

    // Fallback
    return createFallbackMetadata(
      content.title,
      content.summary || `${content.title} - روضة الحسین`,
      content.thumb_path || content.image_path
    );
  },

  /**
   * دریافت متادیتا برای صفحه ویدیو
   * @param videoId - شناسه ویدیو
   * @param lang - زبان (پیش‌فرض: fa)
   */
  async getVideoMetadata(videoId: string, lang: string = defaultLocale): Promise<Metadata> {
    const content = await contentService.getContentDetail(videoId, lang);

    if (!content) {
      return {
        title: 'ویدیو یافت نشد | روضة الحسین',
        description: 'ویدیو مورد نظر یافت نشد',
      };
    }

    if (content.seo_markup) {
      const parsed = parseSeoMarkup(content.seo_markup);
      return toNextMetadata(parsed, content.title);
    }

    return createFallbackMetadata(
      content.title,
      content.summary || `${content.title} - روضة الحسین`,
      content.thumb_path || content.image_path
    );
  },

  /**
   * دریافت متادیتا برای صفحه جلسه
   * @param sessionId - شناسه جلسه
   * @param lang - زبان (پیش‌فرض: fa)
   */
  async getSessionMetadata(sessionId: string, lang: string = defaultLocale): Promise<Metadata> {
    const content = await contentService.getContentDetail(sessionId, lang);

    if (!content) {
      return {
        title: 'جلسه یافت نشد | روضة الحسین',
        description: 'جلسه مورد نظر یافت نشد',
      };
    }

    if (content.seo_markup) {
      const parsed = parseSeoMarkup(content.seo_markup);
      return toNextMetadata(parsed, content.title);
    }

    return createFallbackMetadata(
      content.title,
      content.summary || `گزارش جلسه ${content.title} - روضة الحسین`,
      content.thumb_path || content.image_path
    );
  },

  /**
   * دریافت متادیتا عمومی برای هر محتوا
   * @param contentId - شناسه محتوا
   * @param lang - زبان (پیش‌فرض: fa)
   */
  async getContentMetadata(contentId: string, lang: string = defaultLocale): Promise<Metadata> {
    const content = await contentService.getContentDetail(contentId, lang);

    if (!content) {
      return {
        title: 'محتوا یافت نشد | روضة الحسین',
        description: 'محتوای مورد نظر یافت نشد',
      };
    }

    if (content.seo_markup) {
      const parsed = parseSeoMarkup(content.seo_markup);
      return toNextMetadata(parsed, content.title);
    }

    return createFallbackMetadata(
      content.title,
      content.summary || `${content.title} - روضة الحسین`,
      content.thumb_path || content.image_path
    );
  },

  /**
   * دریافت raw SEO markup از API
   * @param contentId - شناسه محتوا
   * @param lang - زبان (پیش‌فرض: fa)
   */
  async getRawSeoMarkup(contentId: string, lang: string = defaultLocale): Promise<string | null> {
    const content = await contentService.getContentDetail(contentId, lang);
    return content?.seo_markup || null;
  },
};
