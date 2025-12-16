'use client';

import {Button, Typography} from 'antd';
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
      className="!flex !justify-between !items-center !mb-7"
    >
      <Typography.Title
        level={2}
        className="!mb-0 !text-[#32c2ce] !font-bold"
        style={{textShadow: '0 2px 4px rgba(0,0,0,0.2)'}}
      >
        {title}
      </Typography.Title>
      <Button
        onClick={handleButtonClick}
        type="primary"
        size="large"
        icon={buttonIcon}
        className="!rounded-lg !h-[45px] !font-semibold !shadow-lg"
      >
        {buttonText}
      </Button>
    </div>
  );
}