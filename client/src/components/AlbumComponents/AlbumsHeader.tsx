'use client';

import {Button, Typography} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import {useRouter} from 'next/navigation';

type AlbumsHeaderProps = {
  title?: string;
};

export default function AlbumsHeader({title = 'Альбомы'}: AlbumsHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center !mb-7">
      <Typography.Title
        level={2}
        className="!mb-0 text-[#32c2ce] !font-bold"
        style={{textShadow: '0 2px 4px rgba(0,0,0,0.2)'}}
      >
        {title}
      </Typography.Title>
      <Button
        onClick={() => router.push('/albums/create')}
        type="primary"
        size="large"
        icon={<UploadOutlined />}
        className="rounded-lg !h-[45px] !font-semibold !shadow-lg"
      >
        Создать альбом
      </Button>
    </div>
  );
}