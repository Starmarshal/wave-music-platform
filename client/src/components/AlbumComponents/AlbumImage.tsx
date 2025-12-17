'use client';

import {Image} from 'antd';
import {staticUrl} from '@/src/shared/config';

type AlbumImageProps = {
  picture: string;
  name: string;
};

export default function AlbumImage({
                                     picture,
                                     name,
                                   }: AlbumImageProps) {
  return (
    <Image
      className="!rounded-xl md:!rounded-2xl !border !border-[#293A52] dark:!border-gray-600 !w-[500px] !max-w-[280px] sm:!max-w-[350px] md:!max-w-[500px] !h-auto !mx-auto"
      preview={false}
      src={staticUrl(picture)}
      alt={name}
    />
  );
}