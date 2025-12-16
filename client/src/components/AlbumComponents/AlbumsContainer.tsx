'use client';

import {Card} from 'antd';

type AlbumsContainerProps = {
  children: React.ReactNode;
};

export default function AlbumsContainer({children}: AlbumsContainerProps) {
  return (
    <Card
      style={{
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        border: 'none',
      }}
    >
      {children}
    </Card>
  );
}