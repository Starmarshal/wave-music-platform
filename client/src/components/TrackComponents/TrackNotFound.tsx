'use client';

import {Typography, Button} from 'antd';
import {useRouter} from 'next/navigation';

type TrackNotFoundProps = {
  backHref: string;
};

export default function TrackNotFound({backHref}: TrackNotFoundProps) {
  const router = useRouter();

  return (
    <div style={{textAlign: 'center', marginTop: '50px'}}>
      <Typography.Title level={3}>Трек не найден</Typography.Title>
      <Button onClick={() => router.push(backHref)}>
        Вернуться к трекам
      </Button>
    </div>
  );
}