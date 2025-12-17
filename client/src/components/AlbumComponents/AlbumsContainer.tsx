'use client';

import {Card} from 'antd';

type AlbumsContainerProps = {
  children: React.ReactNode;
};

export default function AlbumsContainer({children}: AlbumsContainerProps) {
  return (
    <Card
      className="!p-3 sm:!p-5 md:!p-7 !rounded-xl md:!rounded-2xl !shadow-xl !border-none dark:!bg-gray-800 dark:!border-gray-700"
    >
      {children}
    </Card>
  );
}