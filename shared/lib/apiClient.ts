import { ApiError } from '../types/api';
import { getApiUrl } from './apiConfig';

/**
 * Next.js fetch options interface
 * گزینه‌های fetch برای Next.js caching و revalidation
 */
export interface NextFetchOptions {
  /**
   * Cache behavior
   * - 'force-cache': Cache forever (default)
   * - 'no-store': No cache
   * - 'no-cache': Revalidate on every request
   */
  cache?: RequestCache;
  
  /**
   * Next.js specific options
   */
  next?: {
    /**
     * Revalidate time in seconds
     * مدت زمان revalidate به ثانیه
     */
    revalidate?: number | false;
    
    /**
     * Cache tags for on-demand revalidation
     * تگ‌های cache برای revalidation دستی
     */
    tags?: string[];
  };
}

/**
 * Extended RequestInit with Next.js options
 */
export interface ApiRequestOptions extends RequestInit {
  next?: NextFetchOptions['next'];
}

export class ApiClient {
  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const url = getApiUrl(endpoint);
    
    // Validate URL
    if (!url || url.includes('undefined')) {
      throw new ApiError({
        message: 'API configuration error: Invalid URL',
        status: 0,
      });
    }
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new ApiError({
          message: `HTTP error! status: ${response.status}`,
          status: response.status,
        });
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new ApiError({
        message: `fetch failed: ${errorMessage}`,
        status: 0,
      });
    }
  }

  /**
   * GET request with optional Next.js caching
   * درخواست GET با امکان cache در Next.js
   * 
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @param options - Next.js fetch options (cache, revalidate, tags)
   */
  async get<T>(
    endpoint: string, 
    params?: Record<string, string>,
    options?: NextFetchOptions
  ): Promise<T> {
    let finalEndpoint = endpoint;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, value);
      });
      finalEndpoint = `${endpoint}?${searchParams.toString()}`;
    }

    return this.request<T>(finalEndpoint, {
      method: 'GET',
      cache: options?.cache,
      next: options?.next,
    });
  }
}

export const apiClient = new ApiClient();