'use client';

import {Button} from 'antd';

type TrackFormNavigationProps = {
  activeStep: number;
  totalSteps?: number;
  onBack: () => void;
  onNext: () => void;
  backText?: string;
  nextText?: string;
  submitText?: string;
  loading?: boolean;
  backDisabled?: boolean;
  nextDisabled?: boolean;
};

export default function TrackFormNavigation({
                                              activeStep,
                                              totalSteps = 3,
                                              onBack,
                                              onNext,
                                              backText = 'Назад',
                                              nextText = 'Далее',
                                              submitText = 'Отправить',
                                              loading = false,
                                              backDisabled = false,
                                              nextDisabled = false
                                            }: TrackFormNavigationProps) {
  const isLastStep = activeStep === totalSteps - 1;

  return (
    <div
      className="!flex !justify-between !mt-8"
    >
      <Button
        disabled={backDisabled || activeStep === 0}
        className="!text-xl"
        onClick={onBack}
        color="danger"
        variant="solid"
        loading={loading}
      >
        {backText}
      </Button>
      <Button
        className="!text-xl"
        onClick={onNext}
        color="primary"
        variant="solid"
        loading={loading}
        disabled={nextDisabled}
      >
        {isLastStep ? submitText : nextText}
      </Button>
    </div>
  );
}