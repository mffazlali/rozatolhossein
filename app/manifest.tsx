import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'روضة الحسین',
    short_name: 'روضة الحسین',
    description: 'پایگاه جامع فرهنگی روضة الحسین علیه السلام',
    start_url: '/',
    scope: '.',
    display: 'standalone',
    background_color: '#181818',
    theme_color: '#129197',
    orientation: 'portrait-primary',
    dir: 'rtl',
    lang: 'fa-IR',
    icons: [
      {
        src: '/images/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any'
      },
    ],
  }
}
