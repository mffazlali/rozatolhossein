import Image from 'next/image';
import { linkPageData } from '../data';
import { LinkItem } from './LinkItem';

export function LinkContent() {
  const data = linkPageData;

  return (
    <div className="flex flex-col items-center w-full max-w-[500px] mx-auto py-12 px-4">
      {/* پروفایل */}
      <div className="flex flex-col items-center gap-4 w-full">
        {/* تصویر */}
        <div className="w-[150px] h-[150px] rounded-lg overflow-hidden">
          <Image
            src={data.image}
            alt={data.name}
            width={150}
            height={150}
            className="w-full h-full object-cover"
          />
        </div>

        {/* نام و توضیحات */}
        <div className="flex flex-col items-center gap-1 w-full">
          <h1 className="text-theme-white text-xl font-bold text-center">
            {data.name}
          </h1>
          <p className="text-theme-gray text-sm text-center">
            {data.description}
          </p>
        </div>
      </div>

      {/* لینک‌ها */}
      <div className="flex flex-col gap-2 w-full mt-6">
        {data.links.map((link) => (
          <LinkItem key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
}
