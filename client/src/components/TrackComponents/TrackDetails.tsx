'use client';

import {Card, Typography} from 'antd';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

type TrackType = {
  _id: string;
  name: string;
  artist: string;
  listens: number;
  text: string;
};

type TrackDetailsProps = {
  track: TrackType;
};

export default function TrackDetails({track}: TrackDetailsProps) {
  const router = useRouter();
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
    <div className="!max-w-[600px]">
      <Card
        className="!shadow-lg"
        title="Детали трека"
        variant={'borderless'}
      >
        <Typography.Title level={2}>{track.name}</Typography.Title>
        <p className="!mb-2"><strong>Исполнитель:</strong> {track.artist}</p>
        <p><strong>Прослушиваний:</strong> {track.listens}</p>
      </Card>

      <Card
        className="!w-full !min-w-[490px] !shadow-lg !mt-4"
        variant={'borderless'}
      >
        <Typography.Title
          onClick={() => setShowText(prev => !prev)}
          className="!cursor-pointer"
          level={4}
        >
          {showText ? 'Скрыть текст трека' : 'Показать текст трека'}
        </Typography.Title>

        {showText && (
          <div className="!mt-5">
            {formatLyrics(track.text)}
          </div>
        )}
      </Card>
    </div>
  );
}