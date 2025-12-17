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
      className="!flex !flex-col sm:!flex-row !justify-between !items-start sm:!items-center !gap-3 sm:!gap-0 !mb-4 md:!mb-7"
    >
      <Typography.Title
        level={2}
        className="!mb-0 !text-[#32c2ce] dark:!text-cyan-400 !font-bold !text-xl sm:!text-2xl md:!text-3xl !drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] dark:!drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
      >
        {title}
      </Typography.Title>
      <Button
        onClick={handleButtonClick}
        type="primary"
        size="large"
        icon={buttonIcon}
        className="!rounded-lg !h-[40px] sm:!h-[45px] !font-semibold !shadow-lg !w-full sm:!w-auto dark:!bg-blue-600 dark:!border-blue-600"
      >
        {buttonText}
      </Button>
    </div>
  );
}