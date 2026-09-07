import type { LinkPageResponse } from '@/shared/types/link';

export const linkPageData: LinkPageResponse = {
  id: '1',
  name: 'هیئت روضة الحسین علیه السلام',
  description: 'آدرس رسانه های رسمی',
  image: '/images/hoseinsotoodeh.jpg',
  links: [
    {
      id: '1',
      title: 'وبسایت',
      url: 'https://rozatolhosein.com/',
      icon: 'fa-light fa-globe',
    },
    {
      id: '2',
      title: 'اینستاگرام',
      url: 'https://instagram.com/rozatolhosein',
      icon: 'fa-brands fa-instagram',
    },
    {
      id: '3',
      title: 'تلگرام',
      url: 'https://t.me/rozatolhosein',
      icon: 'fa-brands fa-telegram',
    },
    {
      id: '4',
      title: 'یوتیوب',
      url: 'https://www.youtube.com/@rozatolhosein',
      icon: 'fa-brands fa-youtube',
    },
  ],
};
