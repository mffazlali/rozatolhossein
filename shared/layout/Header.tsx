import { menuService } from '@/shared/services'
import { HeaderContent } from './HeaderContent'

/**
 * Header Component - روضة الحسین (Server Component)
 * کامپوننت هدر اصلی سایت با fetch منو از API
 *
 * Layout: Logo (راست) - Navigation (وسط) - Media Button (چپ)
 */
export async function Header() {
  // Fetch menu data در سرور
  let menuData = null
  try {
    menuData = await menuService.getHeaderMenu('fa')
  } catch (error) {
    console.error('Error fetching header menu:', error)
  }

  return <HeaderContent menuData={menuData} />
}
