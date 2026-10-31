'use client';

import {Button, Card, Typography} from 'antd';
import {PauseCircleOutlined, PlayCircleOutlined} from '@ant-design/icons';
import useTrackItem from '@/src/hooks/useTrackItem';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import ArtistLinks from '@/src/components/ArtistLinks';
import LikeButton from '@/src/components/LikeButton';
import AddToPlaylistButton from '@/src/components/AddToPlaylistButton';
import {IArtistRef} from '@/src/types/user';

type TrackType = {
  _id: string;
  name: string;
  artist: string;
  artists?: IArtistRef[];
  listens: number;
  text: string;
  comments: any[];
};

type TrackDetailsProps = {
  track: TrackType;
};

export default function TrackDetails({track}: TrackDetailsProps) {
  const router = useRouter();
  // Тот же запуск, что и в списке треков: проверка входа, плеер внизу, волна после трека
  const {isPlaying, handlePlayPause} = useTrackItem(track);
  const [showText, setShowText] = useState(true);

  const formatLyrics = (text: string) => {
    return text.split('\n').map((line, index) => {
      const regex = /\[([^\]]+)\]/;
      if (regex.test(line)) {
        return <p
          key={index}
          className="!font-bold"
        >{line}</p>;
      }
      return <p key={index}>{line}</p>;
    });
  };

  return (
    <div className="!max-w-full md:!max-w-[600px] !w-full">
      <Card
        className="!shadow-lg !rounded-xl !mt-0 md:!mt-0 dark:!bg-gray-800 dark:!border-gray-700"
        title={
          <span className="!text-base sm:!text-lg dark:!text-gray-200">Детали трека</span>}
        variant={'borderless'}
      >
        <Typography.Title
          level={2}
          className="!text-xl sm:!text-2xl md:!text-3xl dark:!text-gray-200"
        >{track.name}</Typography.Title>
        <div className="!-mt-2 !mb-3 !-ml-2">
          <Button
            type="primary"
            icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={handlePlayPause}
            className="!ml-2 !mr-1 !bg-[#32c4d0] !border-[#32c4d0]"
          >
            {isPlaying ? 'Пауза' : 'Слушать'}
          </Button>
          <LikeButton type="tracks" id={track._id} withText />
          <AddToPlaylistButton trackId={track._id} />
        </div>
        <p className="!mb-2 !text-sm sm:!text-base dark:!text-gray-300">
          <strong className="dark:!text-gray-200">Исполнитель:</strong> <ArtistLinks artists={track.artists} fallback={track.artist} />
        </p>
        <p className="!text-sm sm:!text-base dark:!text-gray-300">
          <strong className="dark:!text-gray-200">Прослушиваний:</strong> {track.listens}
        </p>
        <p className="mt-2.5 !text-sm sm:!text-base dark:!text-gray-300">
          <strong className="dark:!text-gray-200">Комментариев:</strong> {track.comments.length}
        </p>
      </Card>

      <Card
        className="!w-full !shadow-lg !mt-4 !rounded-xl dark:!bg-gray-800 dark:!border-gray-700"
        variant={'borderless'}
      >
        <Typography.Title
          onClick={() => setShowText(prev => !prev)}
          className="!cursor-pointer !text-base sm:!text-lg md:!text-xl dark:!text-gray-200 hover:!text-[#32c4d0] dark:hover:!text-cyan-400"
          level={4}
        >
          {showText ? 'Скрыть текст трека' : 'Показать текст трека'}
        </Typography.Title>

        {showText && (
          <div className="!mt-4 sm:!mt-5 !text-sm sm:!text-base dark:!text-gray-300">
            {formatLyrics(track.text)}
          </div>
        )}
      </Card>
    </div>
  );
}