'use client';

import {Card, Typography, Image, Button} from 'antd';
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
      styles={{
        body: {
          padding: '16px'
        }
      }}
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        height: '100%',
      }}
      cover={
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: '100%',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex'
            }}
          >
            <Image
              src={staticUrl(album.picture)}
              alt={album.name}
              preview={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'flex',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }}
              className="album-overlay"
            >
              <Button
                type="primary"
                shape="circle"
                size="large"
                icon={<PlayCircleOutlined style={{fontSize: '32px'}} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayAlbum(album);
                }}
                style={{
                  width: '64px',
                  height: '64px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
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
            style={{fontSize: '16px'}}
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