'use client';

import {Button, Typography} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import {useRouter} from 'next/navigation';

type AlbumsHeaderProps = {
  title?: string;
  showCreateButton?: boolean;
  createButtonText?: string;
  createButtonHref?: string;
  onCreateClick?: () => void;
};

export default function AlbumsHeader({
                                       title = 'Альбомы',
                                       showCreateButton = true,
                                       createButtonText = 'Создать альбом',
                                       createButtonHref = '/albums/create',
                                       onCreateClick
                                     }: AlbumsHeaderProps) {
  const router = useRouter();

  const handleCreateClick = () => {
    if (onCreateClick) {
      onCreateClick();
    } else {
      router.push(createButtonHref);
    }
  };

  return (
    <div className="flex justify-between items-center !mb-7">
      <Typography.Title
        level={2}
        className="mb-0 text-[#32c2ce] font-bold shadow-text"
        style={{textShadow: '0 2px 4px rgba(0,0,0,0.2)'}}
      >
        {title}
      </Typography.Title>

      {showCreateButton && (
        <Button
          onClick={handleCreateClick}
          type="primary"
          size="large"
          icon={<UploadOutlined />}
          className="rounded-lg h-[45px] font-semibold shadow-lg"
        >
          {createButtonText}
        </Button>
      )}
    </div>
  );
}