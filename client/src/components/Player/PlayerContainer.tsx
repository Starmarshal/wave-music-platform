'use client';

import React from 'react';

type PlayerContainerProps = {
  children: React.ReactNode;
};

export default function PlayerContainer({children}: PlayerContainerProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTop: '1px solid #e8e8e8',
        padding: '12px 20px',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        height: '95px',
      }}
    >
      {children}
    </div>
  );
}