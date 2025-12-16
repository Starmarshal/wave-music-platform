'use client';

import {Empty, Typography} from 'antd';

type AlbumsEmptyStateProps = {
  message?: string;
};

export default function AlbumsEmptyState({message = 'Пока нет альбомов'}: AlbumsEmptyStateProps) {
  return (
    <Empty
      description={
        <Typography.Text className="text-white !text-base">
          {message}
        </Typography.Text>
      }
      className="my-15"
    />
  );
}