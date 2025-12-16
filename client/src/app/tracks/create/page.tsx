'use client';

import Header from '@/src/components/Header';
import useTrackForm from '@/src/hooks/useTrackForm';
import {useRouter} from 'next/navigation';
import TrackFormStepper
  from '@/src/components/TrackComponents/TrackFormStepper';

export default function CreateTrackPage() {
  const router = useRouter();
  const {
    activeStep,
    name,
    artist,
    text,
    picture,
    audio,
    loading,
    setName,
    setArtist,
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
      router.push('/tracks');
    }
  };

  return (
    <div>
      <Header />

      <TrackFormStepper
        activeStep={activeStep}
        name={name}
        artist={artist}
        text={text}
        picture={picture}
        audio={audio}
        loading={loading}
        onNameChange={setName}
        onArtistChange={setArtist}
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