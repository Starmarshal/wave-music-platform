'use client';

import {Typography, Button} from 'antd';
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

      {showCreateButton && (
        <Button
          onClick={handleCreateClick}
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
          {createButtonText}
        </Button>
      )}
    </div>
  );
}