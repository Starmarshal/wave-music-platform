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
      className="!flex !justify-between !gap-3 !mt-6 sm:!mt-8"
    >
      <Button
        disabled={backDisabled || activeStep === 0}
        className="!text-base sm:!text-lg md:!text-xl !h-[40px] sm:!h-[45px] !flex-1  dark:!text-gray-100"
        onClick={onBack}
        color="danger"
        variant="solid"
        loading={loading}
      >
        {backText}
      </Button>
      <Button
        className="!text-base sm:!text-lg md:!text-xl !h-[40px] sm:!h-[45px] !flex-1 dark:!bg-blue-600 dark:!border-blue-600"
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