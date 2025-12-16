'use client';

import {Card, Typography, Button, Flex} from 'antd';
import {useRouter} from 'next/navigation';

type TrackType = {
  _id: string;
  name: string;
  artist: string;
  listens: number;
};

type AlbumTracksListProps = {
  tracks: TrackType[];
};

export default function AlbumTracksList({tracks}: AlbumTracksListProps) {
  const router = useRouter();

  return (
    <Card
      style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        marginTop: '1rem'
      }}
      title={`Треки альбома (${tracks.length})`}
      variant={'borderless'}
    >
      <Flex vertical gap="small">
        {tracks.map((track, index) => (
          <div
            key={track._id}
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #f0f0f0',
              cursor: 'pointer',
            }}
            className="hover:bg-[#fafafa] transition-colors duration-200"
            onClick={() => router.push(`/tracks/${track._id}`)}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16
                }}
              >
                <Typography.Text
                  strong
                  style={{
                    width: 30,
                    textAlign: 'center'
                  }}
                >
                  {index + 1}
                </Typography.Text>
                <div>
                  <Typography.Text
                    strong
                    style={{display: 'block', paddingRight: 15}}
                  >
                    {track.name}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    {track.artist}
                  </Typography.Text>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24
                }}
              >
                <Typography.Text type="secondary">
                  Прослушиваний: {track.listens}
                </Typography.Text>
                <Button
                  type="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/tracks/${track._id}`);
                  }}
                >
                  Подробнее →
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Flex>
    </Card>
  );
}