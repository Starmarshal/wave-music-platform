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
    <div className="!flex !flex-col !items-center !w-full !mt-8">
      <Steps
        current={activeStep}
        titlePlacement="horizontal"
        items={items}
        className="!max-w-[800px]"
      />
      <div>
        <Card
          className="!w-[600px] !mt-10 !shadow-xl !rounded-lg"
        >
          {children}
        </Card>
      </div>
    </div>
  );
};

export default StepWrapper;