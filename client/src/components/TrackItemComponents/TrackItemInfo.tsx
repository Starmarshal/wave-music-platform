'use client';

import {Typography} from 'antd';
import {useRouter} from 'next/navigation';

type TrackItemInfoProps = {
  trackId: string;
  name: string;
  artist: string;
  isCurrentTrack: boolean;
  listens?: number;
  duration?: number;
};

export default function TrackItemInfo({
                                        trackId,
                                        name,
                                        artist,
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
    <div className="!flex-1 !ml-2.5">
      <Typography.Title
        level={5}
        className={`!m-0 !cursor-pointer !transition-colors !duration-300 !ease-in-out ${
          isCurrentTrack ? '!text-[#32c4d0]' : ''
        }`}
        onClick={() => router.push(`/tracks/${trackId}`)}
        style={{
          marginBottom: '4px',
          fontSize: '16px',
          lineHeight: '1.3'
        }}
      >
        {name}
      </Typography.Title>
      <Typography.Text type="secondary" style={{display: 'block'}}>
        {artist}
      </Typography.Text>
      {(listens || duration) && (
        <Typography.Text type="secondary" style={{fontSize: '12px', display: 'block'}}>
          {listens && `Прослушиваний: ${listens}`}
          {duration && ` • Длительность: ${formatDuration(duration)}`}
        </Typography.Text>
      )}
    </div>
  );
}