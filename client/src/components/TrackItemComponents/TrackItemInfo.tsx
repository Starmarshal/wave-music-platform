'use client';

import {Typography} from 'antd';
import {useRouter} from 'next/navigation';
import ArtistLinks from '@/src/components/ArtistLinks';
import {IArtistRef} from '@/src/types/user';

type TrackItemInfoProps = {
  trackId: string;
  name: string;
  artist: string;
  artists?: IArtistRef[];
  isCurrentTrack: boolean;
  listens?: number;
  duration?: number;
};

export default function TrackItemInfo({
                                        trackId,
                                        name,
                                        artist,
                                        artists,
                                        isCurrentTrack,
                                        listens,
                                        duration
                                      }: TrackItemInfoProps) {
  const router = useRouter();

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="!flex-1 !min-w-0 !w-full !overflow-hidden">
      <Typography.Title
        level={5}
        className={`!m-0 !mb-1 !cursor-pointer !transition-colors !duration-300 !ease-in-out !break-words !w-full !whitespace-normal !overflow-wrap-anywhere !text-[15px] !leading-[1.4] !font-semibold ${
          isCurrentTrack ? '!text-[#32c4d0] dark:!text-cyan-400' : '!text-gray-800 dark:!text-gray-200'
        }`}
        onClick={() => router.push(`/tracks/${trackId}`)}
      >
        {name}
      </Typography.Title>
      <Typography.Text
        type="secondary"
        className="!block !text-[13px] !leading-[1.4] !break-words !w-full !whitespace-normal dark:!text-gray-400"
      >
        <ArtistLinks artists={artists} fallback={artist} />
      </Typography.Text>
      {(listens || duration) && (
        <Typography.Text
          type="secondary"
          className="!text-[11px] !block !mt-0.5 !hidden sm:!block dark:!text-gray-500"
        >
          {listens && `Прослушиваний: ${listens}`}
          {duration && ` • Длительность: ${formatDuration(duration)}`}
        </Typography.Text>
      )}
    </div>
  );
}