'use client';

import {Empty, Typography} from 'antd';

type AlbumsEmptyStateProps = {
  message?: string;
};

export default function AlbumsEmptyState({message = 'Пока нет альбомов'}: AlbumsEmptyStateProps) {
  return (
    <Empty
      description={
        <Typography.Text style={{color: '#fff', fontSize: '16px'}}>
          {message}
        </Typography.Text>
      }
      style={{margin: '60px 0'}}
    />
  );
}