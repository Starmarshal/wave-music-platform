'use client';

import {useRouter} from 'next/navigation';
import CreateAlbumForm from '@/src/components/AlbumComponents/CreateAlbumForm';
import useCreateAlbum from '@/src/hooks/useCreateAlbum';
import Header from '@/src/components/Header';
import useRequireUser from '@/src/hooks/useRequireUser';
import Loader from '@/src/components/Loader';

export default function CreateAlbumPage() {
  const router = useRouter();
  const {ready} = useRequireUser('label');
  const {
    name,
    artistIds,
    artists,
    picture,
    selectedTracks,
    tracks,
    loading,
    setName,
    setArtistIds,
    setPicture,
    setSelectedTracks,
    submitForm
  } = useCreateAlbum();

  const handleSubmit = async () => {
    const success = await submitForm();
    if (success) {
      router.push('/studio');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!ready) return (<><Header /><Loader /></>);

  return (
    <div>
      <Header />

      <CreateAlbumForm
        name={name}
        artistIds={artistIds}
        artists={artists}
        picture={picture}
        selectedTracks={selectedTracks}
        tracks={tracks}
        onNameChange={setName}
        onArtistIdsChange={setArtistIds}
        onPictureChange={setPicture}
        onTracksChange={setSelectedTracks}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}