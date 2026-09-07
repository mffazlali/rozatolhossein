/**
 * Content Service
 * سرویس دریافت جزئیات محتوا - API روضة الحسین
 *
 * @endpoint GET /page/content_view?lang={lang}&content_id={id}
 * @updated January 2025
 */

import { apiClient } from '@/shared/lib/apiClient';
import { type ContentViewResponse, type ContentDetail, type ContentFile, type ContentVideoFile, getContentHref } from '@/shared/types/content';
import type { AudioItem, VideoItem, SessionItem } from '@/shared/types/media';
import { defaultLocale } from '@/shared/lib/i18n';

// ============================================
// Types
// ============================================

/**
 * Gallery Image Type
 * تایپ تصویر گالری
 */
export interface GalleryImage {
  id: string;
  src: string;
  href: string;
  alt?: string;
}

/**
 * Video Audio Data Type
 * اطلاعات صوت مرتبط با ویدیو
 */
export interface VideoAudioData {
  id: string;
  title: string;
  artist?: string;
  duration: string;
  image?: string;
  audioUrl: string;
  href?: string;
}

/**
 * Audio Detail Response Type
 * تایپ پاسخ جزئیات صوت
 */
export interface AudioDetailResponse {
  id: string;
  title: string;
  artist: string;
  artistHref: string;
  image: string;
  audioUrl: string;
  duration: string;
  downloadUrl: string;
  year: string;
  occasion: string;
  style: string;
  views: number;
  description?: string;
  lyrics?: string;
  videoThumbnail?: string;
  videoUrl?: string;
  videoHref?: string;
  relatedAudios?: AudioItem[];
  sameOccasionAudios?: AudioItem[];
  rawContent?: ContentDetail;
  audioFiles?: ContentFile[];
  // اطلاعات اضافی
  persons?: Array<{ id: string; title: string; href: string }>;
  occasions?: Array<{ id: string; title: string; href: string }>;
  places?: Array<{ id: string; title: string; href: string }>;
  heyats?: Array<{ id: string; title: string; href: string }>;
  tags?: Array<{ id: string; title: string; href: string }>;
  styles?: Array<{ id: string; title: string; href: string }>;
  marasemType?: string;
}

/**
 * Video Detail Response Type
 * تایپ پاسخ جزئیات ویدیو
 */
export interface VideoDetailResponse {
  id: string;
  title: string;
  speaker: string;
  speakerHref: string;
  image: string;
  videoUrl: string;
  duration: string;
  downloadUrl: string;
  year: string;
  occasion: string;
  category: string;
  views: number;
  likes: number;
  description?: string;
  relatedVideos?: VideoItem[];
  sameOccasionVideos?: VideoItem[];
  audioData?: VideoAudioData;
  rawContent?: ContentDetail;
  videoFiles?: ContentVideoFile[];
  resolutions?: { [key: string]: string };
  // اطلاعات اضافی
  persons?: Array<{ id: string; title: string; href: string }>;
  occasions?: Array<{ id: string; title: string; href: string }>;
  places?: Array<{ id: string; title: string; href: string }>;
  heyats?: Array<{ id: string; title: string; href: string }>;
  tags?: Array<{ id: string; title: string; href: string }>;
  styles?: Array<{ id: string; title: string; href: string }>;
  marasemType?: string;
}

/**
 * Session Detail Response Type
 * تایپ پاسخ جزئیات جلسه
 */
export interface SessionDetailResponse {
  id: string;
  title: string;
  date: string;
  year: string;
  image: string;
  heyatName: string;
  heyatHref: string;
  description?: string;
  hasImages: boolean;
  hasAudios: boolean;
  hasVideos: boolean;
  images?: GalleryImage[];
  audios?: AudioItem[];
  videos?: VideoItem[];
  relatedSessions?: SessionItem[];
  rawContent?: ContentDetail;
  // اطلاعات اضافی
  persons?: Array<{ id: string; title: string; href: string }>;
  occasions?: Array<{ id: string; title: string; href: string }>;
  places?: Array<{ id: string; title: string; href: string }>;
  heyats?: Array<{ id: string; title: string; href: string }>;
  tags?: Array<{ id: string; title: string; href: string }>;
  styles?: Array<{ id: string; title: string; href: string }>;
  marasemType?: string;
}

// ============================================
// Mappers
// ============================================

/**
 * ترکیب summary و body برای نمایش
 * اگر summary وجود داشت، آن را به عنوان لید در ابتدای body قرار می‌دهد
 */
function combineDescriptionContent(summary?: string, body?: string): string {
  // اگر هیچکدام نبود، خالی برگردان
  if (!summary && !body) return '';
  
  // اگر فقط body بود
  if (!summary) return body || '';
  
  // اگر فقط summary بود
  if (!body) return summary;
  
  // اگر هر دو بودند، summary را به عنوان لید در ابتدا قرار بده
  return `<div class="text-theme-white font-bold mb-4">${summary}</div>${body}`;
}

/**
 * تبدیل ContentDetail به AudioDetailResponse
 */
function mapContentToAudioDetail(content: ContentDetail, locale: string): AudioDetailResponse {
  const audioFiles = content.files?.sounds || [];
  const videoFiles = content.files?.videos || [];
  const firstAudio = audioFiles[0];
  const firstVideo = videoFiles[0];

  return {
    id: content.id,
    title: content.title,
    artist: content.persons?.[0]?.title || '',
    artistHref: content.persons?.[0]?.id ? `/${locale}/person/${content.persons[0].id}` : '',
    image: content.thumb_path || content.image_path,
    audioUrl: firstAudio?.url || '',
    duration: '',
    downloadUrl: firstAudio?.url || '',
    year: content.fields?.data?.text || '',
    occasion: content.occasions?.[0]?.title || '',
    style: content.style?.[0]?.title || '',
    views: 0,
    description: combineDescriptionContent(content.summary, content.body),
    lyrics: combineDescriptionContent(content.summary, content.body),
    videoThumbnail: firstVideo ? content.thumb_path : undefined,
    videoUrl: firstVideo?.file?.url,
    videoHref: firstVideo ? getContentHref(locale, content.id) : undefined,
    rawContent: content,
    audioFiles,
    // اطلاعات اضافی
    persons: content.persons?.map(p => ({
      id: p.id,
      title: p.title,
      href: `/${locale}/person/${p.id}`
    })),
    occasions: content.occasions?.map(o => ({
      id: o.id,
      title: o.title,
      href: `/${locale}/occasion/${o.id}`
    })),
    places: content.place?.map(p => ({
      id: p.id,
      title: p.title,
      href: `/${locale}/place/${p.id}`
    })),
    heyats: content.heyat?.map(h => ({
      id: h.id,
      title: h.title,
      href: `/${locale}/heyat/${h.id}`
    })),
    tags: content.tags?.map(t => ({
      id: t.id,
      title: t.title,
      href: `/${locale}/tag/${t.id}`
    })),
    styles: content.style?.map(s => ({
      id: s.id,
      title: s.title,
      href: `/${locale}/style/${s.id}`
    })),
    marasemType: content.marasem_type,
  };
}

/**
 * تبدیل ContentDetail به VideoDetailResponse
 */
function mapContentToVideoDetail(content: ContentDetail, locale: string): VideoDetailResponse {
  const videoFiles = content.files?.videos || [];
  const audioFiles = content.files?.sounds || [];
  const firstVideo = videoFiles[0];
  const firstAudio = audioFiles[0];

  const resolutions = firstVideo?.resolution || {};
  const bestQualityUrl = resolutions['720'] || resolutions['480'] || firstVideo?.file?.url || '';

  return {
    id: content.id,
    title: content.title,
    speaker: content.persons?.[0]?.title || '',
    speakerHref: content.persons?.[0]?.id ? `/${locale}/person/${content.persons[0].id}` : '',
    image: content.thumb_path || content.image_path,
    videoUrl: bestQualityUrl,
    duration: '',
    downloadUrl: firstVideo?.file?.url || bestQualityUrl,
    year: content.fields?.data?.text || '',
    occasion: content.occasions?.[0]?.title || '',
    category: content.categories?.[0]?.title || '',
    views: 0,
    likes: 0,
    description: combineDescriptionContent(content.summary, content.body),
    audioData: firstAudio
      ? {
          id: firstAudio.id,
          title: content.title,
          artist: content.persons?.[0]?.title,
          duration: '',
          image: content.thumb_path,
          audioUrl: firstAudio.url || '',
          href: getContentHref(locale, content.id),
        }
      : undefined,
    rawContent: content,
    videoFiles,
    resolutions,
    // اطلاعات اضافی
    persons: content.persons?.map(p => ({
      id: p.id,
      title: p.title,
      href: `/${locale}/person/${p.id}`
    })),
    occasions: content.occasions?.map(o => ({
      id: o.id,
      title: o.title,
      href: `/${locale}/occasion/${o.id}`
    })),
    places: content.place?.map(p => ({
      id: p.id,
      title: p.title,
      href: `/${locale}/place/${p.id}`
    })),
    heyats: content.heyat?.map(h => ({
      id: h.id,
      title: h.title,
      href: `/${locale}/heyat/${h.id}`
    })),
    tags: content.tags?.map(t => ({
      id: t.id,
      title: t.title,
      href: `/${locale}/tag/${t.id}`
    })),
    styles: content.style?.map(s => ({
      id: s.id,
      title: s.title,
      href: `/${locale}/style/${s.id}`
    })),
    marasemType: content.marasem_type,
  };
}

/**
 * تبدیل ContentFile به GalleryImage
 */
function mapToGalleryImage(file: ContentFile): GalleryImage {
  return {
    id: file.id,
    src: file.thumb_path || file.file_path || '',
    href: file.file_path || '',
    alt: file.file_name,
  };
}

/**
 * تبدیل ContentFile به AudioItem
 */
function mapToAudioItem(file: ContentFile, content: ContentDetail, locale: string, index: number): AudioItem {
  const title = file.file_name.replace(/\.[^/.]+$/, '');
  
  return {
    id: file.id,
    title: title || `صوت ${index + 1}`,
    category: content.categories?.[0]?.title || '',
    image: content.thumb_path || content.image_path,
    href: getContentHref(locale, content.id),
    audioUrl: file.url || '',
    duration: '',
  };
}

/**
 * تبدیل ContentVideoFile به VideoItem
 */
function mapToVideoItem(file: ContentVideoFile, content: ContentDetail, locale: string, index: number): VideoItem {
  const title = file.file?.file_name?.replace(/\.[^/.]+$/, '') || `ویدیو ${index + 1}`;
  
  return {
    id: file.file?.id || `video-${index}`,
    title: title,
    category: content.categories?.[0]?.title || '',
    speaker: content.persons?.[0]?.title,
    image: content.thumb_path || content.image_path,
    videoUrl: file.resolution?.['720'] || file.resolution?.['480'] || file.file?.url,
    href: getContentHref(locale, content.id),
    duration: '',
  };
}

/**
 * تبدیل ContentDetail به SessionDetailResponse
 */
function mapContentToSessionDetail(content: ContentDetail, locale: string): SessionDetailResponse {
  const imageFiles = content.files?.pics || [];
  const audioFiles = content.files?.sounds || [];
  const videoFiles = content.files?.videos || [];

  return {
    id: content.id,
    title: content.title,
    date: content.fields?.data?.text || '',
    year: content.rel_date?.text || content.fields?.data?.text || '',
    image: content.thumb_path || content.image_path,
    heyatName: content.heyat?.[0]?.title || '',
    heyatHref: content.heyat?.[0]?.id ? `/${locale}/heyat/${content.heyat[0].id}` : '',
    description: combineDescriptionContent(content.summary, content.body),
    hasImages: imageFiles.length > 0,
    hasAudios: audioFiles.length > 0,
    hasVideos: videoFiles.length > 0,
    images: imageFiles.map(mapToGalleryImage),
    audios: audioFiles.map((f, index) => mapToAudioItem(f, content, locale, index)),
    videos: videoFiles.map((f, index) => mapToVideoItem(f, content, locale, index)),
    rawContent: content,
    // اطلاعات اضافی
    persons: content.persons?.map(p => ({
      id: p.id,
      title: p.title,
      href: `/${locale}/person/${p.id}`
    })),
    occasions: content.occasions?.map(o => ({
      id: o.id,
      title: o.title,
      href: `/${locale}/occasion/${o.id}`
    })),
    places: content.place?.map(p => ({
      id: p.id,
      title: p.title,
      href: `/${locale}/place/${p.id}`
    })),
    heyats: content.heyat?.map(h => ({
      id: h.id,
      title: h.title,
      href: `/${locale}/heyat/${h.id}`
    })),
    tags: content.tags?.map(t => ({
      id: t.id,
      title: t.title,
      href: `/${locale}/tag/${t.id}`
    })),
    styles: content.style?.map(s => ({
      id: s.id,
      title: s.title,
      href: `/${locale}/style/${s.id}`
    })),
    marasemType: content.marasem_type,
  };
}

// ============================================
// Service
// ============================================

export const contentService = {
  /**
   * دریافت جزئیات محتوا با ID
   * @endpoint GET /page/content_view?lang={lang}&content_id={id}
   */
  async getContentDetail(contentId: string, lang: string = defaultLocale): Promise<ContentDetail> {
    const response = await apiClient.get<ContentViewResponse>('page/content_view', {
      lang,
      content_id: contentId,
    });

    if (!response?.content) {
      throw new Error(`محتوا با شناسه ${contentId} یافت نشد`);
    }

    return response.content;
  },

  /**
   * دریافت جزئیات صوت
   * @endpoint GET /page/content_view?lang={lang}&content_id={id}
   */
  async getAudioDetail(audioId: string, lang: string = defaultLocale): Promise<AudioDetailResponse> {
    const content = await this.getContentDetail(audioId, lang);
    return mapContentToAudioDetail(content, lang);
  },

  /**
   * دریافت جزئیات ویدیو
   * @endpoint GET /page/content_view?lang={lang}&content_id={id}
   */
  async getVideoDetail(videoId: string, lang: string = defaultLocale): Promise<VideoDetailResponse> {
    const content = await this.getContentDetail(videoId, lang);
    return mapContentToVideoDetail(content, lang);
  },

  /**
   * دریافت جزئیات جلسه
   * @endpoint GET /page/content_view?lang={lang}&content_id={id}
   */
  async getSessionDetail(sessionId: string, lang: string = defaultLocale): Promise<SessionDetailResponse> {
    const content = await this.getContentDetail(sessionId, lang);
    return mapContentToSessionDetail(content, lang);
  },
};
