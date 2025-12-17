'use client';

import {Input, Select, Typography} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import {ITrack} from '@/src/types/track';
import FileUpload from '@/src/components/FileUpload';

const {Option} = Select;

type AlbumFormFieldsProps = {
  name: string;
  author: string;
  picture: File | null;
  selectedTracks: string[];
  tracks: ITrack[];
  onNameChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onPictureChange: React.Dispatch<React.SetStateAction<File | null>>
  onTracksChange: (trackIds: string[]) => void;
  namePlaceholder?: string;
  authorPlaceholder?: string;
  pictureAccept?: string;
};

export default function AlbumFormFields({
                                          name,
                                          author,
                                          picture,
                                          selectedTracks,
                                          tracks,
                                          onNameChange,
                                          onAuthorChange,
                                          onPictureChange,
                                          onTracksChange,
                                          namePlaceholder = 'Введите название альбома',
                                          authorPlaceholder = 'Введите имя автора',
                                          pictureAccept = 'image/*'
                                        }: AlbumFormFieldsProps) {
  return (
    <>
      <div className="!mb-4 sm:!mb-5">
        <Typography.Text strong className="!text-sm sm:!text-base dark:!text-gray-200">Название альбома</Typography.Text>
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={namePlaceholder}
          size="large"
          className="!mt-2 !h-[45px] sm:!h-[50px] dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-200"
        />
      </div>

      <div className="!mb-4 sm:!mb-5">
        <Typography.Text strong className="!text-sm sm:!text-base dark:!text-gray-200">Автор</Typography.Text>
        <Input
          value={author}
          onChange={(e) => onAuthorChange(e.target.value)}
          placeholder={authorPlaceholder}
          size="large"
          className="!mt-2 !h-[45px] sm:!h-[50px] dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-200"
        />
      </div>

      <div className="!mb-4 sm:!mb-5">
        <Typography.Text strong className="!text-sm sm:!text-base dark:!text-gray-200">Выберите треки</Typography.Text>
        <Select
          mode="multiple"
          value={selectedTracks}
          onChange={onTracksChange}
          placeholder="Выберите треки для альбома"
          size="large"
          className="!w-full !mt-2 dark:!bg-gray-700 dark:!text-gray-200"
        >
          {tracks.map((track) => (
            <Option
              key={track._id}
              value={track._id}
            >
              {track.name} - {track.artist}
            </Option>
          ))}
        </Select>
        {selectedTracks.length > 0 && (
          <Typography.Text
            type="secondary"
            className="!text-xs !block !mt-2 dark:!text-gray-400"
          >
            Выбрано треков: {selectedTracks.length}
          </Typography.Text>
        )}
      </div>

      <div className="!mb-5 sm:!mb-7">
        <Typography.Text strong className="!text-sm sm:!text-base dark:!text-gray-200">Обложка альбома</Typography.Text>
        <FileUpload
          file={picture}
          setFile={onPictureChange}
          accept={pictureAccept}
        >
          <div
            className="!flex !flex-col !items-center !justify-center !border-2 !border-dashed !border-gray-300 dark:!border-gray-600 !rounded-lg !p-8 sm:!p-16 md:!p-25 !mt-2 !cursor-pointer !transition-all !duration-300 hover:!border-[#32c4d0] dark:hover:!border-cyan-400 hover:!bg-[#f0f9fa] dark:hover:!bg-gray-700"
          >
            {picture ? (
              <Typography.Text className="!text-xs sm:!text-sm dark:!text-gray-300">{picture.name}</Typography.Text>
            ) : (
              <>
                <UploadOutlined
                  className="!text-3xl sm:!text-4xl md:!text-5xl !text-gray-400 dark:!text-gray-500 !mb-2 sm:!mb-4"
                />
                <Typography.Text type="secondary" className="!text-xs sm:!text-sm !text-center !px-2 dark:!text-gray-400">Нажмите для загрузки обложки</Typography.Text>
              </>
            )}
          </div>
        </FileUpload>
      </div>
    </>
  );
}