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
      {/* Название альбома */}
      <div className="mb-5">
        <Typography.Text strong>Название альбома</Typography.Text>
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={namePlaceholder}
          size="large"
          className="!mt-2 h-[50px]"
        />
      </div>

      {/* Автор */}
      <div className="!mb-5">
        <Typography.Text strong>Автор</Typography.Text>
        <Input
          value={author}
          onChange={(e) => onAuthorChange(e.target.value)}
          placeholder={authorPlaceholder}
          size="large"
          className="!mt-2 h-[50px]"
        />
      </div>

      {/* Выбор треков */}
      <div className="!mb-5">
        <Typography.Text strong>Выберите треки</Typography.Text>
        <Select
          mode="multiple"
          value={selectedTracks}
          onChange={onTracksChange}
          placeholder="Выберите треки для альбома"
          size="large"
          className="w-full !mt-2"
          maxTagCount="responsive"
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
            className="text-xs block !mt-2"
          >
            Выбрано треков: {selectedTracks.length}
          </Typography.Text>
        )}
      </div>

      {/* Загрузка обложки */}
      <div className="!mb-7">
        <Typography.Text strong>Обложка альбома</Typography.Text>
        <FileUpload
          file={picture}
          setFile={onPictureChange}
          accept={pictureAccept}
        >
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg !p-25 !mt-2 cursor-pointer transition-all duration-300 hover:border-[#32c4d0] hover:bg-[#f0f9fa]"
          >
            {picture ? (
              <Typography.Text>{picture.name}</Typography.Text>
            ) : (
              <>
                <UploadOutlined
                  className="text-5xl text-gray-400 !mb-4"
                />
                <Typography.Text type="secondary">Нажмите для загрузки обложки</Typography.Text>
              </>
            )}
          </div>
        </FileUpload>
      </div>
    </>
  );
}