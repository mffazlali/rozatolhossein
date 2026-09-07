/**
 * Menu Service
 * سرویس دریافت منوها از API - روضة الحسین
 *
 * @endpoint GET /page/main?lang={lang}
 * @collection asrepayesh / asrepayesh-rozatolhossein / Main Page (Header & Footer)
 * @updated January 2026
 */

import { apiClient } from '@/shared/lib/apiClient';
import type { MainPageResponse, NavItem, MenuItem, SubMenuItem, PageOptions } from '@/shared/types/menu';
import { defaultLocale } from '@/shared/lib/i18n';

/**
 * تبدیل SubMenuItem به NavItem
 */
function mapSubMenuItem(item: SubMenuItem): NavItem {
  return {
    id: item.id,
    title: item.title,
    href: item.link,
    children: item.sub_menus?.length > 0 
      ? item.sub_menus.map((subItem) => mapSubMenuItem(subItem)) 
      : undefined,
  };
}

/**
 * تبدیل MenuItem به NavItem
 */
function mapMenuItem(item: MenuItem): NavItem {
  return {
    id: item.id,
    title: item.title,
    href: item.link,
    children: item.sub_menus?.length > 0 
      ? item.sub_menus.map((subItem) => mapSubMenuItem(subItem)) 
      : undefined,
  };
}

export const menuService = {
  /**
   * دریافت داده‌های صفحه اصلی (منوها)
   */
  async getMainPageData(lang: string = defaultLocale): Promise<MainPageResponse | null> {
    try {
      return await apiClient.get<MainPageResponse>('page/main', { lang });
    } catch (error) {
      console.error('Error fetching main page data:', error);
      return null;
    }
  },

  /**
   * دریافت آیتم‌های منوی هدر
   */
  async getHeaderMenu(lang: string = defaultLocale): Promise<NavItem[]> {
    try {
      const response = await apiClient.get<MainPageResponse>('page/main', { lang });
      
      if (!response?.data?.public_menu?.menu?.[0]?.all_active_menus) {
        return [];
      }

      const menuItems = response.data.public_menu.menu[0].all_active_menus;
      return menuItems
        .filter(item => item.active === 1)
        .map((item) => mapMenuItem(item));
    } catch (error) {
      console.error('Error fetching header menu:', error);
      return [];
    }
  },

  /**
   * دریافت آیتم‌های منوی فوتر
   */
  async getFooterMenu(lang: string = defaultLocale): Promise<NavItem[]> {
    try {
      const response = await apiClient.get<MainPageResponse>('page/main', { lang });
      
      if (!response?.data?.public_footer?.menu?.[0]?.all_active_menus) {
        return [];
      }

      const menuItems = response.data.public_footer.menu[0].all_active_menus;
      return menuItems
        .filter(item => item.active === 1)
        .map((item) => mapMenuItem(item));
    } catch (error) {
      console.error('Error fetching footer menu:', error);
      return [];
    }
  },

  /**
   * دریافت تنظیمات صفحه (تم پیش‌فرض و غیره)
   */
  async getPageOptions(lang: string = defaultLocale): Promise<PageOptions | null> {
    try {
      const response = await apiClient.get<MainPageResponse>('page/main', { lang });
      return response?.data?.page_options || null;
    } catch (error) {
      console.error('Error fetching page options:', error);
      return null;
    }
  },

  /**
   * بررسی تم پیش‌فرض (دارک یا لایت)
   */
  async getDefaultTheme(lang: string = defaultLocale): Promise<'dark' | 'light'> {
    try {
      const pageOptions = await this.getPageOptions(lang);
      return pageOptions?.theme_is_dark === 'true' ? 'dark' : 'light';
    } catch (error) {
      console.error('Error fetching default theme:', error);
      return 'light';
    }
  },
};
