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
      className={`!rounded-lg !border !border-gray-200 dark:!border-gray-700 !transition-transform !duration-300 !ease-in-out !w-14 !h-14 sm:!w-16 sm:!h-16 !flex-shrink-0 !object-cover ${
        isCurrentTrack ? '!scale-105 !border-[#32c4d0] dark:!border-cyan-400 !shadow-md' : '!scale-100'
      } ${onClick ? '!cursor-pointer' : '!cursor-default'}`}
      preview={false}
      width={width}
      height={height}
      src={staticUrl(picture)}
      onClick={onClick}
    />
  );
}