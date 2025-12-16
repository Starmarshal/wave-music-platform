'use client';

import {Button, Card, Flex, Typography} from 'antd';
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
      className="!shadow-lg !mt-4"
      title={`Треки альбома (${tracks.length})`}
      variant={'borderless'}
    >
      <Flex
        vertical
        gap="small"
      >
        {tracks.map((track, index) => (
          <div
            key={track._id}
            className="!px-4 !py-3 border-0 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
            onClick={() => router.push(`/tracks/${track._id}`)}
          >
            <div className="flex justify-between w-full">
              <div className="flex items-center gap-4">
                <Typography.Text
                  strong
                  className="w-7 text-center"
                >
                  {index + 1}
                </Typography.Text>
                <div>
                  <Typography.Text
                    strong
                    className="block pr-3"
                  >
                    {track.name}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    {track.artist}
                  </Typography.Text>
                </div>
              </div>

              <div className="flex items-center gap-6">
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