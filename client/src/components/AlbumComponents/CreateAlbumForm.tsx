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
  onPictureChange: React.Dispatch<React.SetStateAction<File | null>>;
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
    <div className="flex justify-center !py-10 !px-5 min-h-[calc(100vh-200px)]">
      <Card
        className="w-full max-w-[600px] rounded-2xl shadow-xl"
      >
        <Typography.Title
          level={2}
          className="!mb-7 text-center"
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