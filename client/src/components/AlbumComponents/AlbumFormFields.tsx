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
      <div style={{marginBottom: '20px'}}>
        <Typography.Text strong>Название альбома</Typography.Text>
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={namePlaceholder}
          size="large"
          style={{marginTop: '8px', height: '50px'}}
        />
      </div>

      {/* Автор */}
      <div style={{marginBottom: '20px'}}>
        <Typography.Text strong>Автор</Typography.Text>
        <Input
          value={author}
          onChange={(e) => onAuthorChange(e.target.value)}
          placeholder={authorPlaceholder}
          size="large"
          style={{marginTop: '8px', height: '50px'}}
        />
      </div>

      {/* Выбор треков */}
      <div style={{marginBottom: '20px'}}>
        <Typography.Text strong>Выберите треки</Typography.Text>
        <Select
          mode="multiple"
          value={selectedTracks}
          onChange={onTracksChange}
          placeholder="Выберите треки для альбома"
          size="large"
          style={{width: '100%', marginTop: '8px'}}
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
            style={{
              fontSize: '12px',
              display: 'block',
              marginTop: '8px'
            }}
          >
            Выбрано треков: {selectedTracks.length}
          </Typography.Text>
        )}
      </div>

      {/* Загрузка обложки */}
      <div style={{marginBottom: '30px'}}>
        <Typography.Text strong>Обложка альбома</Typography.Text>
        <FileUpload
          file={picture}
          setFile={onPictureChange}
          accept={pictureAccept}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed #d9d9d9',
              borderRadius: '8px',
              padding: '40px',
              marginTop: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#32c4d0';
              e.currentTarget.style.backgroundColor = '#f0f9fa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#d9d9d9';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {picture ? (
              <Typography.Text>{picture.name}</Typography.Text>
            ) : (
              <>
                <UploadOutlined
                  style={{
                    fontSize: '48px',
                    color: '#999',
                    marginBottom: '16px'
                  }}
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