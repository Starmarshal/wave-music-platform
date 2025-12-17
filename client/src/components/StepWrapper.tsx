'use client';

import React from 'react';
import {Card, Steps} from 'antd';

interface StepWrapperProps {
  activeStep: number;
  children: React.ReactNode;
}

const items = [
  {
    title: 'Информация о треке',
    description: '',
  },
  {
    title: 'Загрузите обложку',
    description: '',
  },
  {
    title: 'Загрузите сам трек',
    description: '',
  },
];

const StepWrapper: React.FC<StepWrapperProps> = ({activeStep, children}) => {
  return (
    <div className="!flex !flex-col !items-center !w-full !mt-4 md:!mt-8 !px-2 sm:!px-4">
      <Steps
        current={activeStep}
        items={items}
        className="
          !max-w-full md:!max-w-[800px] !w-full
          dark:[&_.ant-steps-item-icon]:!text-gray-100
          dark:[&_.ant-steps-item-icon-finish]:!text-blue-800
          dark:[&_.ant-steps-item-title]:!text-gray-100
          dark:[&_.ant-steps-icon]:!text-gray-300
          dark:[&_.ant-steps-item-description]:!text-gray-400
          dark:[&_.ant-steps-item-wait>.ant-steps-item-container>.ant-steps-item-content>.ant-steps-item-title]:!text-gray-500
          dark:[&_.ant-steps-item-finish>.ant-steps-item-container>.ant-steps-item-content>.ant-steps-item-title]:!text-gray-300
        "
        size="small"
        responsive
      />

      <div className="!w-full !max-w-full md:!max-w-[600px]">
        <Card
          className="
            !w-full !mt-6 md:!mt-10
            !shadow-xl !rounded-lg !p-4 sm:!p-6
            !bg-white/10 dark:!bg-gray-500/10 !border !border-white/30 dark:!border-gray-700/20
            dark:!text-gray-100
          "
        >
          {children}
        </Card>
      </div>
    </div>
  );
};

export default StepWrapper;