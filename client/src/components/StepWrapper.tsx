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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        marginTop: '2rem'
      }}
    >
      <Steps
        current={activeStep}
        titlePlacement="horizontal"
        items={items}
        style={{maxWidth: '800px'}}
      />
      <div>
        <Card
          style={{
            width: 600,
            marginTop: '40px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
        >
          {children}
        </Card>
      </div>
    </div>
  );
};

export default StepWrapper;
