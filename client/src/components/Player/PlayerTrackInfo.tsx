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
};

export default function PlayerTrackInfo({
                                          track,
                                          albumTracks = [],
                                          currentAlbumIndex = -1
                                        }: PlayerTrackInfoProps) {
  const router = useRouter();

  return (
    <>
      <Image
        src={staticUrl(track.picture)}
        preview={false}
        width={56}
        height={56}
        className="!rounded-lg !cursor-pointer !transition-transform !duration-200 !ease-in-out"
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onClick={() => router.push(`/tracks/${track._id}`)}
      />

      <div className="!flex-1 !min-w-0">
        <Typography.Text
          strong
          className="!block !cursor-pointer !text-[#32c4d0] !transition-colors !duration-200 !ease-in-out"
          onClick={() => router.push(`/tracks/${track._id}`)}
          onMouseEnter={(e) => e.currentTarget.style.color = '#28a5b0'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#32c4d0'}
        >
          {track.name}
        </Typography.Text>
        <Typography.Text
          type="secondary"
          className="!text-xs"
        >
          {track.artist}
          {albumTracks.length > 0 && currentAlbumIndex >= 0 && (
            <span className="!ml-2 !text-gray-400">
              {currentAlbumIndex + 1} / {albumTracks.length}
            </span>
          )}
        </Typography.Text>
      </div>
    </>
  );
}