'use client';

import React from 'react';

type PlayerContainerProps = {
  children: React.ReactNode;
};

export default function PlayerContainer({children}: PlayerContainerProps) {
  return (
    <div
      className="!fixed !bottom-0 !left-0 !right-0 !bg-white dark:!bg-gray-900 !border-0 !border-t !border-gray-200 dark:!border-gray-700 !p-2 sm:!p-3 md:!p-4 !shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:!shadow-[0_-4px_20px_rgba(0,0,0,0.3)] !z-[1000] !flex !flex-col sm:!flex-row !items-center !gap-2 sm:!gap-3 md:!gap-4 !min-h-[80px] sm:!h-20 md:!h-24 !bg-gradient-to-t !from-white !to-white/95 dark:!from-gray-900 dark:!to-gray-900/95 !backdrop-blur-[10px]"
    >
      {children}
    </div>
  );
}