'use client';

import {Button, Typography} from 'antd';
import {useRouter} from 'next/navigation';

type TrackNotFoundProps = {
  backHref: string;
};

export default function TrackNotFound({backHref}: TrackNotFoundProps) {
  const router = useRouter();

  return (
    <div className="!text-center !mt-12">
      <Typography.Title
        level={3}
        className="dark:!text-gray-200"
      >Трек не найден</Typography.Title>
      <Button
        onClick={() => router.push(backHref)}
        className="dark:!bg-blue-600 dark:!border-blue-600"
      >
        Вернуться к трекам
      </Button>
    </div>
  );
}