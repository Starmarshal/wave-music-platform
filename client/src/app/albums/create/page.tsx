'use client';

import {useRouter} from 'next/navigation';
import CreateAlbumForm from '@/src/components/AlbumComponents/CreateAlbumForm';
import useCreateAlbum from '@/src/hooks/useCreateAlbum';
import Header from '@/src/components/Header';

export default function CreateAlbumPage() {
  const router = useRouter();
  const {
    name,
    author,
    picture,
    selectedTracks,
    tracks,
    loading,
    setName,
    setAuthor,
    setPicture,
    setSelectedTracks,
    submitForm
  } = useCreateAlbum();

  const handleSubmit = async () => {
    const success = await submitForm();
    if (success) {
      router.push('/albums');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div>
      <Header />

      <CreateAlbumForm
        name={name}
        author={author}
        picture={picture}
        selectedTracks={selectedTracks}
        tracks={tracks}
        onNameChange={setName}
        onAuthorChange={setAuthor}
        onPictureChange={setPicture}
        onTracksChange={setSelectedTracks}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}