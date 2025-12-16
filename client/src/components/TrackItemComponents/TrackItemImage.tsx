'use client';

import {Image} from 'antd';
import {staticUrl} from '@/src/shared/config';

type TrackItemImageProps = {
  picture: string;
  isCurrentTrack: boolean;
  onClick?: () => void;
  width?: number;
  height?: number;
};

export default function TrackItemImage({
                                         picture,
                                         isCurrentTrack,
                                         onClick,
                                         width = 70,
                                         height = 70
                                       }: TrackItemImageProps) {
  return (
    <Image
      className={`!rounded-2xl !border !border-[#293A52] !transition-transform !duration-300 !ease-in-out ${
        isCurrentTrack ? '!scale-105' : '!scale-100'
      }`}
      preview={false}
      width={width}
      height={height}
      src={staticUrl(picture)}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        width: `${width}px`,
        height: `${height}px`
      }}
    />
  );
}