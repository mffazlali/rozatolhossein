/**
 * API Configuration
 * تنظیمات API از متغیرهای محیطی
 * 
 * @collection asrepayesh / asrepayesh-rozatolhossein
 * @updated January 2026
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ,
  VERSION: process.env.NEXT_PUBLIC_API_VERSION,
} as const;

/**
 * Generate full API URL for an endpoint
 * @param endpoint - API endpoint path
 * @returns Full API URL
 */
export const getApiUrl = (endpoint: string) => {
  const url = `${API_CONFIG.BASE_URL}/${API_CONFIG.VERSION}/${endpoint}`;

  return url;
};