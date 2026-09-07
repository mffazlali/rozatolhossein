import { SVGProps } from 'react';

/**
 * IconSvgProps
 * Props مشترک برای تمام کامپوننت‌های آیکون
 */
export type IconSvgProps = SVGProps<SVGSVGElement> & {
  className?: string;
  size?: number | string;
  color?: string;
};
