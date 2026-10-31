'use client';

import {Card, Typography} from 'antd';
import ArtistLinks from '@/src/components/ArtistLinks';
import LikeButton from '@/src/components/LikeButton';
import {IArtistRef} from '@/src/types/user';

type CommentType = {
  username: string;
  text: string;
  _id?: string;
};

type AlbumType = {
  _id: string;
  name: string;
  author: string;
  artists?: IArtistRef[];
  description?: string;
  releaseDate?: string;
  tracks: any[];
  comments?: CommentType[];
};

type AlbumDetailsProps = {
  album: AlbumType;
};

export default function AlbumDetails({album}: AlbumDetailsProps) {
  return (
    <div className="!max-w-full md:!max-w-[600px] !w-full">
      <Card
        className="!shadow-lg !rounded-xl !mt-0 md:!mt-0 dark:!bg-gray-800 dark:!border-gray-700"
        title={
          <span className="!text-base sm:!text-lg dark:!text-gray-200">Детали альбома</span>}
        variant={'borderless'}
      >
        <Typography.Title
          level={2}
          className="!text-xl sm:!text-2xl md:!text-3xl dark:!text-gray-200"
        >{album.name}</Typography.Title>
        <div className="!-mt-2 !mb-3 !-ml-2">
          <LikeButton type="albums" id={album._id} withText />
        </div>

        <p className="!mb-2 !text-sm sm:!text-base dark:!text-gray-300">
          <strong className="dark:!text-gray-200">Исполнитель:</strong> <ArtistLinks artists={album.artists} fallback={album.author} />
        </p>

        {album.description && (
          <p className="mt-2.5 !text-sm sm:!text-base dark:!text-gray-300">
            <strong className="dark:!text-gray-200">Описание:</strong> {album.description}
          </p>
        )}

        {album.releaseDate && (
          <p className="mt-2.5 !text-sm sm:!text-base dark:!text-gray-300">
            <strong className="dark:!text-gray-200">Дата выпуска:</strong> {new Date(album.releaseDate).toLocaleDateString()}
          </p>
        )}

        <p className="mt-2.5 !text-sm sm:!text-base dark:!text-gray-300">
          <strong className="dark:!text-gray-200">Треков:</strong> {album.tracks.length}
        </p>

        <p className="mt-2.5 !text-sm sm:!text-base dark:!text-gray-300">
          <strong className="dark:!text-gray-200">Комментариев:</strong> {album.comments?.length || 0}
        </p>
      </Card>
    </div>
  );
}