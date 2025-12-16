'use client';

import {Typography, Button} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import {useRouter} from 'next/navigation';

type TracksHeaderProps = {
  title?: string;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  onButtonClick?: () => void;
  buttonHref?: string;
};

export default function TracksHeader({
                                       title = 'Список треков',
                                       buttonText = 'Загрузить трек',
                                       buttonIcon = <UploadOutlined />,
                                       onButtonClick,
                                       buttonHref = '/tracks/create'
                                     }: TracksHeaderProps) {
  const router = useRouter();

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      router.push(buttonHref);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
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
      <Button
        onClick={handleButtonClick}
        type="primary"
        size="large"
        icon={buttonIcon}
        style={{
          borderRadius: '8px',
          height: '45px',
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        {buttonText}
      </Button>
    </div>
  );
}