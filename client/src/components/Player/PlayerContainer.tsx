'use client';

import React from 'react';

type PlayerContainerProps = {
  children: React.ReactNode;
};

export default function PlayerContainer({children}: PlayerContainerProps) {
  return (
    <div
      className="!fixed !bottom-0 !left-0 !right-0 !bg-white !border-0 !border-t !border-gray-200 !p-3 !px-5 !shadow-lg !z-[1000] !flex !items-center !gap-3.5 !h-24"
    >
      {children}
    </div>
  );
}