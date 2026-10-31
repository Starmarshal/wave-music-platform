'use client';

import Header from '@/src/components/Header';
import useTrackForm from '@/src/hooks/useTrackForm';
import {useRouter} from 'next/navigation';
import TrackFormStepper
  from '@/src/components/TrackComponents/TrackFormStepper';
import useRequireUser from '@/src/hooks/useRequireUser';
import Loader from '@/src/components/Loader';

export default function CreateTrackPage() {
  const router = useRouter();
  const {ready} = useRequireUser('label');
  const {
    activeStep,
    name,
    artistIds,
    artists,
    text,
    picture,
    audio,
    loading,
    setName,
    setArtistIds,
    setText,
    setPicture,
    setAudio,
    nextStep,
    prevStep,
    submitForm
  } = useTrackForm();

  const handleSubmit = async () => {
    const success = await submitForm();
    if (success) {
      router.push('/studio');
    }
  };

  if (!ready) return (<><Header /><Loader /></>);

  return (
    <div>
      <Header />

      <TrackFormStepper
        activeStep={activeStep}
        name={name}
        artistIds={artistIds}
        artists={artists}
        text={text}
        picture={picture}
        audio={audio}
        loading={loading}
        onNameChange={setName}
        onArtistIdsChange={setArtistIds}
        onTextChange={setText}
        onPictureChange={setPicture}
        onAudioChange={setAudio}
        onBack={prevStep}
        onNext={nextStep}
        onSubmit={handleSubmit}
      />
    </div>
  );
}