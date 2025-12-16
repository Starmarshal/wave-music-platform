'use client';

import {Typography, Button} from 'antd';
import {useRouter} from 'next/navigation';

type AlbumNotFoundProps = {
  backHref: string;
};

export default function AlbumNotFound({backHref}: AlbumNotFoundProps) {
  const router = useRouter();

  return (
    <div style={{textAlign: 'center', marginTop: '50px'}}>
      <Typography.Title level={3}>Альбом не найден</Typography.Title>
      <Button onClick={() => router.push(backHref)}>
        Вернуться к альбомам
      </Button>
    </div>
  );
}