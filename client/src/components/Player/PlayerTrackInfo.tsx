'use client';

import {Image, Typography} from 'antd';
import {staticUrl} from '@/src/shared/config';
import {useRouter} from 'next/navigation';

type Track = {
  _id: string;
  name: string;
  artist: string;
  picture: string;
};

type PlayerTrackInfoProps = {
  track: Track;
  albumTracks?: Track[];
  currentAlbumIndex?: number;
  isAlbumMode?: boolean;
};

export default function PlayerTrackInfo({
                                          track,
                                          albumTracks = [],
                                          currentAlbumIndex = -1,
                                          isAlbumMode = false
                                        }: PlayerTrackInfoProps) {
  const router = useRouter();

  const showAlbumInfo = isAlbumMode && albumTracks.length > 0 && currentAlbumIndex >= 0;

  return (
    <div className="!flex !items-center !gap-2 sm:!gap-2 md:!gap-3 !min-w-[100px] sm:!min-w-[140px] md:!min-w-[200px] !flex-shrink-0 !w-full sm:!w-auto !justify-center sm:!justify-start">
      <div className="!relative !flex-shrink-0">
        <Image
          src={staticUrl(track.picture)}
          preview={false}
          width={40}
          height={40}
          className="!rounded-lg !cursor-pointer !transition-all !duration-300 !ease-in-out !shadow-sm !w-10 !h-10 sm:!w-12 sm:!h-12 md:!w-14 md:!h-14 hover:!shadow-md hover:!scale-105 !max-w-[45px] !max-h-[45px] dark:!border dark:!border-gray-700"
          onClick={() => router.push(`/tracks/${track._id}`)}
        />

      </div>

      <div className="!flex-1 !min-w-0 !text-left">
        <Typography.Text
          strong
          className="!block !cursor-pointer !text-[#32c4d0] dark:!text-cyan-400 !transition-colors !duration-200 !ease-in-out !text-xs sm:!text-sm md:!text-base !font-semibold !truncate hover:!text-[#28a5b0] dark:hover:!text-cyan-300"
          onClick={() => router.push(`/tracks/${track._id}`)}
        >
          {track.name}
        </Typography.Text>

        <Typography.Text
          type="secondary"
          className="!text-[10px] sm:!text-xs md:!text-sm !truncate !block !mt-0.5 dark:!text-gray-400"
        >
          {track.artist}

          {showAlbumInfo && (
            <span className="!ml-2 !text-gray-500 dark:!text-gray-400 !font-medium">
              {currentAlbumIndex + 1} / {albumTracks.length}
            </span>
          )}
        </Typography.Text>
      </div>
    </div>
  );
}