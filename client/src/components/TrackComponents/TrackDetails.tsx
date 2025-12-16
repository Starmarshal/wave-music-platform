'use client';

import {Card, Typography, Button, Flex} from 'antd';
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
          style={{fontWeight: 'bold'}}
        >{line}</p>;
      }
      return <p key={index}>{line}</p>;
    });
  };

  return (
    <div style={{maxWidth: '600px'}}>
      <Card
        style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'}}
        title="Детали трека"
        variant={'borderless'}
      >
        <Typography.Title level={2}>{track.name}</Typography.Title>
        <p><strong>Исполнитель:</strong> {track.artist}</p>
        <p><strong>Прослушиваний:</strong> {track.listens}</p>
      </Card>

      <Card
        style={{
          width: '100%',
          minWidth: '490px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          marginTop: '1rem'
        }}
        variant={'borderless'}
      >
        <Typography.Title
          onClick={() => setShowText(prev => !prev)}
          style={{cursor: 'pointer'}}
          level={4}
        >
          {showText ? 'Скрыть текст трека' : 'Показать текст трека'}
        </Typography.Title>

        {showText && (
          <div style={{marginTop: '20px'}}>
            {formatLyrics(track.text)}
          </div>
        )}
      </Card>
    </div>
  );
}