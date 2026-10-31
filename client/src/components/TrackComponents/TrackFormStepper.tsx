'use client';

import StepWrapper from '@/src/components/StepWrapper';
import TrackFormStep1 from '@/src/components/TrackComponents/TrackFormStep1';
import TrackFormStep2 from '@/src/components/TrackComponents/TrackFormStep2';
import TrackFormStep3 from '@/src/components/TrackComponents/TrackFormStep3';
import TrackFormNavigation
  from '@/src/components/TrackComponents/TrackFormNavigation';
import {IArtist} from '@/src/types/user';

type TrackFormStepperProps = {
  activeStep: number;
  name: string;
  artistIds: string[];
  artists: IArtist[];
  text: string;
  picture: File | null;
  audio: File | null;
  loading: boolean;
  onNameChange: (value: string) => void;
  onArtistIdsChange: (value: string[]) => void;
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
                                           artistIds,
                                           artists,
                                           text,
                                           picture,
                                           audio,
                                           loading,
                                           onNameChange,
                                           onArtistIdsChange,
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
      {activeStep === 0 && (
        <TrackFormStep1
          name={name}
          artistIds={artistIds}
          artists={artists}
          text={text}
          onNameChange={onNameChange}
          onArtistIdsChange={onArtistIdsChange}
          onTextChange={onTextChange}
        />
      )}

      {activeStep === 1 && (
        <TrackFormStep2
          picture={picture}
          onPictureChange={onPictureChange}
        />
      )}

      {activeStep === 2 && (
        <TrackFormStep3
          audio={audio}
          onAudioChange={onAudioChange}
        />
      )}

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