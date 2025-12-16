'use client';

import {Image} from 'antd';
import {staticUrl} from '@/src/shared/config';

type TrackImageProps = {
  picture: string;
  name: string;
  width?: number;
  height?: number;
};

export default function TrackImage({picture, name, width = 500, height = 500}: TrackImageProps) {
  return (
    <Image
      style={{borderRadius: '1rem', border: '1px solid #293A52'}}
      preview={false}
      width={width}
      height={height}
      src={staticUrl(picture)}
      alt={name}
    />
  );
}