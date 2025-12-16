'use client';

import {Button, Card, Image, Typography} from 'antd';
import {PlayCircleOutlined} from '@ant-design/icons';
import {staticUrl} from '@/src/shared/config';
import {IAlbum} from '@/src/types/album';
import {useRouter} from 'next/navigation';

type AlbumCardProps = {
  album: IAlbum;
  onPlayAlbum: (album: IAlbum) => void;
};

export default function AlbumCard({album, onPlayAlbum}: AlbumCardProps) {
  const router = useRouter();

  return (
    <Card
      hoverable
      className="rounded-xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl h-full"
      cover={
        <div
          className="relative w-full aspect-square overflow-hidden"
        >
          <div className="absolute inset-0 flex">
            <Image
              src={staticUrl(album.picture)}
              alt={album.name}
              preview={false}
              className="!w-full !h-full object-cover flex"
            />
            <div className="album-overlay absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
              <Button
                type="primary"
                shape="circle"
                size="large"
                icon={<PlayCircleOutlined className="!text-3xl" />}
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayAlbum(album);
                }}
                className="!w-16 !h-16 border-none !shadow-lg"
              />
            </div>
          </div>
        </div>
      }
      onClick={() => router.push(`/albums/${album._id}`)}
    >
      <Card.Meta
        title={
          <Typography.Text
            strong
            className="text-base"
          >
            {album.name}
          </Typography.Text>
        }
        description={
          <Typography.Text type="secondary">
            {album.author}
          </Typography.Text>
        }
      />
    </Card>
  );
}