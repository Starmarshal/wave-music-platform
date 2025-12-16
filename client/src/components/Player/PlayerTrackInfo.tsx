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
        style={{
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'transform 0.2s ease-in-out',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onClick={() => router.push(`/tracks/${track._id}`)}
      />

      <div style={{flex: 1, minWidth: 0}}>
        <Typography.Text
          strong
          style={{
            display: 'block',
            cursor: 'pointer',
            color: '#32c4d0',
            transition: 'color 0.2s ease-in-out',
          }}
          onClick={() => router.push(`/tracks/${track._id}`)}
          onMouseEnter={(e) => e.currentTarget.style.color = '#28a5b0'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#32c4d0'}
        >
          {track.name}
        </Typography.Text>
        <Typography.Text
          type="secondary"
          style={{fontSize: '12px'}}
        >
          {track.artist}
          {albumTracks.length > 0 && currentAlbumIndex >= 0 && (
            <span style={{marginLeft: '8px', color: '#999'}}>
              {currentAlbumIndex + 1} / {albumTracks.length}
            </span>
          )}
        </Typography.Text>
      </div>
    </>
  );
}