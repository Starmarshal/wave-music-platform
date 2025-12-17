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
    <div className="!flex !justify-center !py-6 sm:!py-10 !px-2 sm:!px-4 md:!px-5 !min-h-[calc(100vh-200px)]">
      <Card
        className="!w-full !max-w-[600px] !rounded-xl md:!rounded-2xl !shadow-xl !p-4 sm:!p-6 dark:!bg-gray-800 dark:!border-gray-700"
      >
        <Typography.Title
          level={2}
          className="!mb-5 sm:!mb-7 !text-center !text-xl sm:!text-2xl md:!text-3xl dark:!text-gray-200"
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