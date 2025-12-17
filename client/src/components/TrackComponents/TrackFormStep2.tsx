'use client';

import FileUpload from '@/src/components/FileUpload';
import { Button, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

type TrackFormStep2Props = {
  picture: File | null;
  onPictureChange: React.Dispatch<React.SetStateAction<File | null>>
  title?: string;
  accept?: string;
};

export default function TrackFormStep2({
                                         picture,
                                         onPictureChange,
                                         title = 'Загрузите изображение',
                                         accept = 'image/*'
                                       }: TrackFormStep2Props) {
  return (
    <FileUpload
      file={picture}
      setFile={onPictureChange}
      accept={accept}
    >
      <div
        className="!flex !flex-col !items-center"
      >
        <Typography.Title level={2} className="!text-xl sm:!text-2xl md:!text-3xl dark:!text-gray-200">
          {title}
        </Typography.Title>

        <Button
          className="
            !text-[40px] sm:!text-[50px] md:!text-[60px]
            !my-8 sm:!my-12 md:!my-16
            !border-none !outline-none !shadow-none
            [&_.ant-btn]:!border-none
            [&_.ant-btn]:!outline-none
            [&_.ant-btn]:!shadow-none
            :focus:!border-none :focus:!outline-none
            :hover:!border-none :active:!border-none
          "
          type="link"
          icon={<UploadOutlined />}
        />
      </div>
    </FileUpload>
  );
}