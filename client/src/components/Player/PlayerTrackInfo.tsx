'use client';

import {Image, Typography, Badge} from 'antd';
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
  isAlbumMode?: boolean; // Добавляем пропс
};

export default function PlayerTrackInfo({
                                          track,
                                          albumTracks = [],
                                          currentAlbumIndex = -1,
                                          isAlbumMode = false // Значение по умолчанию
                                        }: PlayerTrackInfoProps) {
  const router = useRouter();

  // Показываем информацию о позиции в альбоме только в режиме альбома
  const showAlbumInfo = isAlbumMode && albumTracks.length > 0 && currentAlbumIndex >= 0;

  return (
    <div className="!flex !items-center !gap-3 !min-w-[200px]">
      {/* Обложка с бейджем режима альбома */}
      <div className="!relative">
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

        {/* Бейдж режима альбома */}
        {isAlbumMode && (
          <Badge
            count="Альбом"
            size="small"
            style={{
              backgroundColor: '#1890ff',
              fontSize: '8px',
              padding: '0 4px',
              transform: 'scale(0.8)'
            }}
            className="!absolute -top-1 -right-1"
          />
        )}
      </div>

      {/* Информация о треке */}
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

          {/* Показываем позицию в альбоме только в режиме альбома */}
          {showAlbumInfo && (
            <span className="!ml-2 !text-gray-400">
              {currentAlbumIndex + 1} / {albumTracks.length}
            </span>
          )}
        </Typography.Text>

        {/* Дополнительная информация для режима альбома */}
        {isAlbumMode && albumTracks.length > 0 && (
          <div className="!flex !items-center !gap-1 !mt-1">
            <Typography.Text
              type="secondary"
              className="!text-[10px] !text-gray-400"
            >
              Альбомный режим
            </Typography.Text>
          </div>
        )}
      </div>
    </div>
  );
}