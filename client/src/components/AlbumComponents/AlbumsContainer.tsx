'use client';

import {Card} from 'antd';

type AlbumsContainerProps = {
  children: React.ReactNode;
};

export default function AlbumsContainer({children}: AlbumsContainerProps) {
  return (
    <Card
      className="!p-3 sm:!p-5 md:!p-7 !rounded-xl md:!rounded-2xl !shadow-xl !border-none !bg-white/20 dark:!bg-gray-500/20 !border !border-white/30 dark:!border-gray-700/20"
    >
      {children}
    </Card>
  );
}