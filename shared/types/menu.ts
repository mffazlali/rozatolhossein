/**
 * Menu Types
 * Types for Main Page API - Header & Footer menus
 *
 * @endpoint GET /page/main?lang=fa
 * @collection asrepayesh / asrepayesh-rozatolhossein / Main Page (Header & Footer)
 * @updated January 2026
 */

/**
 * آیتم زیرمنو
 */
export interface SubMenuItem {
  id: string;
  title: string;
  parent_id: string;
  link: string;
  active: number;
  sub_menus: SubMenuItem[];
}

/**
 * آیتم منوی اصلی
 */
export interface MenuItem {
  id: string;
  title: string;
  parent_id: number;
  link: string;
  active: number;
  sub_menus: SubMenuItem[];
}

/**
 * گروه منو
 */
export interface MenuGroup {
  id: number;
  title: string;
  parent_id: number;
  site_id: number;
  active: number;
  image_path?: string;
  all_active_menus: MenuItem[];
}

/**
 * ساختار منوی عمومی
 */
export interface PublicMenu {
  menu: MenuGroup[];
}

/**
 * تنظیمات صفحه (تم و غیره)
 */
export interface PageOptions {
  theme_is_dark: string;
}

/**
 * Response کامل API Main Page
 */
export interface MainPageResponse {
  status: number;
  message: string;
  site: unknown[];
  data: {
    public_language: PublicMenu;
    public_menu: PublicMenu;
    public_footer: PublicMenu;
    page_options: PageOptions;
    request: string;
  };
}

/**
 * آیتم منو برای استفاده در کامپوننت‌ها
 */
export interface NavItem {
  id: string;
  title: string;
  href: string;
  children?: NavItem[];
}
