'use client';

import {Card, Typography} from 'antd';

type AlbumType = {
  _id: string;
  name: string;
  author: string;
  description?: string;
  releaseDate?: string;
  tracks: any[];
  comments: any[];
};

type AlbumDetailsProps = {
  album: AlbumType;
};

export default function AlbumDetails({album}: AlbumDetailsProps) {
  return (
    <Card
      style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'}}
      title="Детали альбома"
      variant={'borderless'}
    >
      <Typography.Title level={2}>{album.name}</Typography.Title>
      <p><strong>Исполнитель:</strong> {album.author}</p>

      {album.description && (
        <p style={{marginTop: 10}}>
          <strong>Описание:</strong> {album.description}
        </p>
      )}

      {album.releaseDate && (
        <p>
          <strong>Дата выпуска:</strong> {new Date(album.releaseDate).toLocaleDateString()}
        </p>
      )}

      <p><strong>Треков:</strong> {album.tracks.length}</p>
      <p><strong>Комментариев:</strong> {album.comments.length}</p>
    </Card>
  );
}