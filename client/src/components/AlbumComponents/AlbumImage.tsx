'use client';

import {Image} from 'antd';
import {staticUrl} from '@/src/shared/config';

type AlbumImageProps = {
  picture: string;
  name: string;
  width?: number;
  height?: number;
};

export default function AlbumImage({
                                     picture,
                                     name,
                                     width = 500,
                                     height = 500
                                   }: AlbumImageProps) {
  return (
    <Image
      className="rounded-2xl border border-[#293A52]"
      preview={false}
      width={width}
      height={height}
      src={staticUrl(picture)}
      alt={name}
    />
  );
}