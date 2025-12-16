'use client';

import {Card, Typography} from 'antd';
import AlbumFormActions
  from '@/src/components/AlbumComponents/AlbumFormActions';
import AlbumFormFields from '@/src/components/AlbumComponents/AlbumFormFields';
import {ITrack} from '@/src/types/track';

type CreateAlbumFormProps = {
  name: string;
  author: string;
  picture: File | null;
  selectedTracks: string[];
  tracks: ITrack[];
  onNameChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onPictureChange: (file: File) => void;
  onTracksChange: (trackIds: string[]) => void;
  onSubmit: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export default function CreateAlbumForm({
                                          name,
                                          author,
                                          picture,
                                          selectedTracks,
                                          tracks,
                                          onNameChange,
                                          onAuthorChange,
                                          onPictureChange,
                                          onTracksChange,
                                          onSubmit,
                                          onCancel,
                                          loading = false
                                        }: CreateAlbumFormProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 20px',
        minHeight: 'calc(100vh - 200px)',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '600px',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <Typography.Title
          level={2}
          style={{marginBottom: '30px', textAlign: 'center'}}
        >
          Создать альбом
        </Typography.Title>

        <AlbumFormFields
          name={name}
          author={author}
          picture={picture}
          selectedTracks={selectedTracks}
          tracks={tracks}
          onNameChange={onNameChange}
          onAuthorChange={onAuthorChange}
          onPictureChange={onPictureChange}
          onTracksChange={onTracksChange}
        />

        <AlbumFormActions
          onCancel={onCancel}
          onSubmit={onSubmit}
          submitText="Создать"
          cancelText="Отмена"
          loading={loading}
          submitDisabled={loading}
        />
      </Card>
    </div>
  );
}