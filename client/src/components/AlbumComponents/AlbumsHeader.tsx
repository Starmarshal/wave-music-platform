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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 !mb-4 md:!mb-7">
      <Typography.Title
        level={2}
        className="!mb-0 !text-[#32c2ce] dark:!text-cyan-400 !font-bold !text-xl sm:!text-2xl md:!text-3xl !drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] dark:!drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
      >
        {title}
      </Typography.Title>
      <Button
        onClick={() => router.push('/albums/create')}
        type="primary"
        size="large"
        icon={<UploadOutlined />}
        className="!rounded-lg !h-[40px] sm:!h-[45px] !font-semibold !shadow-lg !w-full sm:!w-auto dark:!bg-blue-600 dark:!border-blue-600"
      >
        Создать альбом
      </Button>
    </div>
  );
}