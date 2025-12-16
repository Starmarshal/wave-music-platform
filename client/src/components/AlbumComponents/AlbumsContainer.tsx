'use client';

import {Card} from 'antd';

type AlbumsContainerProps = {
  children: React.ReactNode;
};

export default function AlbumsContainer({children}: AlbumsContainerProps) {
  return (
    <Card
      className="!p-7 rounded-2xl shadow-xl border-none"
    >
      {children}
    </Card>
  );
}