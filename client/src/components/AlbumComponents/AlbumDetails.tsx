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
      className="!shadow-lg"
      title="Детали альбома"
      variant={'borderless'}
    >
      <Typography.Title level={2}>{album.name}</Typography.Title>

      <p className="!mb-2">
        <strong>Исполнитель:</strong> {album.author}
      </p>

      {album.description && (
        <p className="mt-2.5">
          <strong>Описание:</strong> {album.description}
        </p>
      )}

      {album.releaseDate && (
        <p className="mt-2.5">
          <strong>Дата выпуска:</strong> {new Date(album.releaseDate).toLocaleDateString()}
        </p>
      )}

      <p className="mt-2.5">
        <strong>Треков:</strong> {album.tracks.length}
      </p>

      <p className="mt-2.5">
        <strong>Комментариев:</strong> {album.comments.length}
      </p>
    </Card>
  );
}