'use client';

import FileUpload from '@/src/components/FileUpload';
import {Typography, Button} from 'antd';
import {UploadOutlined} from '@ant-design/icons';

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
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography.Title level={2}>{title}</Typography.Title>
        <Button
          style={{fontSize: 60, margin: '4rem'}}
          type="link"
          icon={<UploadOutlined />}
        />
      </div>
    </FileUpload>
  );
}