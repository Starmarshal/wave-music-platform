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
      <Typography.Title level={3}>Трек не найден</Typography.Title>
      <Button onClick={() => router.push(backHref)}>
        Вернуться к трекам
      </Button>
    </div>
  );
}