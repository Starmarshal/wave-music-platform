'use client';

import {Typography, Button} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import {useRouter} from 'next/navigation';

type AlbumsHeaderProps = {
  title?: string;
};

export default function AlbumsHeader({title = 'Альбомы'}: AlbumsHeaderProps) {
  const router = useRouter();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
      }}
    >
      <Typography.Title
        level={2}
        style={{
          marginBottom: 0,
          color: '#32c2ce',
          fontWeight: 700,
          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        {title}
      </Typography.Title>
      <Button
        onClick={() => router.push('/albums/create')}
        type="primary"
        size="large"
        icon={<UploadOutlined />}
        style={{
          borderRadius: '8px',
          height: '45px',
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        Создать альбом
      </Button>
    </div>
  );
}