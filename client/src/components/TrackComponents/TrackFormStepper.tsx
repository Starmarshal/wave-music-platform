'use client';

import StepWrapper from '@/src/components/StepWrapper';
import TrackFormStep1 from '@/src/components/TrackComponents/TrackFormStep1';
import TrackFormStep2 from '@/src/components/TrackComponents/TrackFormStep2';
import TrackFormStep3 from '@/src/components/TrackComponents/TrackFormStep3';
import TrackFormNavigation
  from '@/src/components/TrackComponents/TrackFormNavigation';

type TrackFormStepperProps = {
  activeStep: number;
  name: string;
  artist: string;
  text: string;
  picture: File | null;
  audio: File | null;
  loading: boolean;
  onNameChange: (value: string) => void;
  onArtistChange: (value: string) => void;
  onTextChange: (value: string) => void;
  onPictureChange: React.Dispatch<React.SetStateAction<File | null>>
  onAudioChange: React.Dispatch<React.SetStateAction<File | null>>
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
};

export default function TrackFormStepper({
                                           activeStep,
                                           name,
                                           artist,
                                           text,
                                           picture,
                                           audio,
                                           loading,
                                           onNameChange,
                                           onArtistChange,
                                           onTextChange,
                                           onPictureChange,
                                           onAudioChange,
                                           onBack,
                                           onNext,
                                           onSubmit
                                         }: TrackFormStepperProps) {
  const handleNavigation = () => {
    if (activeStep === 2) {
      onSubmit();
    } else {
      onNext();
    }
  };

  return (
    <StepWrapper activeStep={activeStep}>
      {/* Шаг 1: Информация о треке */}
      {activeStep === 0 && (
        <TrackFormStep1
          name={name}
          artist={artist}
          text={text}
          onNameChange={onNameChange}
          onArtistChange={onArtistChange}
          onTextChange={onTextChange}
        />
      )}

      {/* Шаг 2: Загрузка изображения */}
      {activeStep === 1 && (
        <TrackFormStep2
          picture={picture}
          onPictureChange={onPictureChange}
        />
      )}

      {/* Шаг 3: Загрузка аудио */}
      {activeStep === 2 && (
        <TrackFormStep3
          audio={audio}
          onAudioChange={onAudioChange}
        />
      )}

      {/* Навигация */}
      <TrackFormNavigation
        activeStep={activeStep}
        onBack={onBack}
        onNext={handleNavigation}
        loading={loading}
        backDisabled={loading}
        nextDisabled={loading}
      />
    </StepWrapper>
  );
}