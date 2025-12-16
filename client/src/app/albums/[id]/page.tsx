'use client';

import Header from '@/src/components/Header/Header';
import CommentsSection from '@/src/components/CommentsSection';
import AlbumDetails from '@/src/components/AlbumComponents/AlbumDetails';
import AlbumTracksList from '@/src/components/AlbumComponents/AlbumTracksList';
import AlbumImage from '@/src/components/AlbumComponents/AlbumImage';
import BackButton from '@/src/components/BackButton';
import AlbumNotFound from '@/src/components/AlbumComponents/AlbumNotFound';
import Loader from '@/src/components/Loader';
import useAlbum from '@/src/hooks/useAlbum';
import {useParams} from 'next/navigation';

export default function AlbumDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const {album, loading, comments, addComment} = useAlbum(id);

  if (loading) {
    return (
      <>
        <Header />
        <Loader />
      </>
    );
  }

  if (!album) {
    return (
      <>
        <Header />
        <AlbumNotFound backHref="/albums" />
      </>
    );
  }

  return (
    <>
      <Header />

      <BackButton
        href="/albums"
        text="К списку альбомов"
      />

      <div
        className="mb-5 flex items-start justify-center gap-7 px-5 md:gap-8"
      >
        {/* Левая колонка: изображение и комментарии */}
        <div
          className="flex flex-col items-center flex-none"
        >
          <AlbumImage
            picture={album.picture}
            name={album.name}
          />

          <div className="mt-5">
            <CommentsSection
              comments={comments}
              onAddComment={addComment}
              title="Комментарии"
              placeholder="Напишите ваш комментарий об альбоме..."
              loading={loading}
            />
          </div>
        </div>

        {/* Правая колонка: информация об альбоме */}
        <div
          className="flex-1 max-w-[700px]"
        >
          <AlbumDetails album={album} />
          <AlbumTracksList tracks={album.tracks} />
        </div>
      </div>
    </>
  );
}