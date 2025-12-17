'use client';

import {Button, Typography} from 'antd';
import {useRouter} from 'next/navigation';

type AlbumNotFoundProps = {
  backHref: string;
};

export default function AlbumNotFound({backHref}: AlbumNotFoundProps) {
  const router = useRouter();

  return (
    <div className="!text-center !mt-10">
      <Typography.Title level={3} className="dark:!text-gray-200">Альбом не найден</Typography.Title>
      <Button onClick={() => router.push(backHref)} className="dark:!bg-blue-600 dark:!border-blue-600">
        Вернуться к альбомам
      </Button>
    </div>
  );
}