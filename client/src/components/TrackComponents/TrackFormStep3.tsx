'use client';

import FileUpload from '@/src/components/FileUpload';
import {Button, Typography} from 'antd';
import {UploadOutlined} from '@ant-design/icons';

type TrackFormStep3Props = {
  audio: File | null;
  onAudioChange: React.Dispatch<React.SetStateAction<File | null>>
  title?: string;
  accept?: string;
};

export default function TrackFormStep3({
                                         audio,
                                         onAudioChange,
                                         title = 'Загрузите трек',
                                         accept = 'audio/*'
                                       }: TrackFormStep3Props) {
  return (
    <FileUpload
      file={audio}
      setFile={onAudioChange}
      accept={accept}
    >
      <div
        className="!flex !flex-col !items-center"
      >
        <Typography.Title level={2}>{title}</Typography.Title>
        <Button
          className="!text-[60px] !my-16"
          type="link"
          icon={<UploadOutlined />}
        />
      </div>
    </FileUpload>
  );
}