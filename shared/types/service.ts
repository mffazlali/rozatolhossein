/**
 * Service Types
 * تایپ‌ها و enum های سرویس‌ها
 *
 * @updated January 2025
 */

/**
 * Service IDs Enum
 * شناسه‌های سرویس‌ها
 */
export enum ServiceId {
  AUDIO = '4266',
  SESSION = '4267',
  PHOTO = '4268',
  VIDEO = '4265',
}

/**
 * Content Type IDs Enum
 * شناسه‌های نوع محتوا
 */
export enum ContentTypeId {
  SESSION = '1',
  PHOTO = '2',
  VIDEO = '3',
  AUDIO = '4',
}

/**
 * Service Type
 * نوع سرویس
 */
export type ServiceType = 'audio' | 'video' | 'session' | 'photo';

/**
 * نگاشت ServiceId به ServiceType
 */
export const SERVICE_TYPE_MAP: Record<ContentTypeId, ServiceType> = {
  [ContentTypeId.AUDIO]: 'audio',
  [ContentTypeId.SESSION]: 'session',
  [ContentTypeId.VIDEO]: 'video',
  [ContentTypeId.PHOTO]: 'photo',
};

/**
 * نگاشت ContentTypeId به ServiceType
 */
export const CONTENT_TYPE_MAP: Record<ContentTypeId, ServiceType> = {
  [ContentTypeId.AUDIO]: 'audio',
  [ContentTypeId.SESSION]: 'session',
  [ContentTypeId.VIDEO]: 'video',
  [ContentTypeId.PHOTO]: 'photo',
  
};

/**
 * Helper function برای ساخت href سرویس
 */
export function getServiceHref(locale: string, serviceId: ServiceId): string {
  return `/${locale}/service/${serviceId}`;
}

/**
 * Helper function برای ساخت href لیست سرویس
 */
export function getServiceListHref(locale: string, serviceId: ServiceId): string {
  return `/${locale}/service/${serviceId}`;
}
