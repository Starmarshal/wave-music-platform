'use client';

import {Button, Typography} from 'antd';
import {useRouter} from 'next/navigation';

type AlbumNotFoundProps = {
  backHref: string;
};

export default function AlbumNotFound({backHref}: AlbumNotFoundProps) {
  const router = useRouter();

  return (
    <div className="text-center !mt-10">
      <Typography.Title level={3}>Альбом не найден</Typography.Title>
      <Button onClick={() => router.push(backHref)}>
        Вернуться к альбомам
      </Button>
    </div>
  );
}