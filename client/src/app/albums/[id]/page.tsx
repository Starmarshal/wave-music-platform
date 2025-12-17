'use client';

import Header from '@/src/components/Header';
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
        className="!mb-5 !flex !flex-col !items-center !gap-1 lg:!gap-6 !px-2 sm:!px-4 lg:!px-5"
      >
        {/* Мобильная и планшетная версия: картинка сверху, центрированная */}
        <div className="!w-full !flex !flex-col !items-center lg:!hidden !mb-1">
          <AlbumImage
            picture={album.picture}
            name={album.name}
          />
        </div>

        {/* Десктопная версия: две колонки */}
        <div className="!hidden lg:!flex !flex-row !items-start !justify-center !gap-7 !w-full">
          {/* Левая колонка: изображение и комментарии */}
          <div
            className="!flex !flex-col !items-center !flex-none"
          >
            <AlbumImage
              picture={album.picture}
              name={album.name}
            />

            <div className="!mt-5 !w-full">
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
            className="!flex-1 !max-w-[600px]"
          >
            <AlbumDetails album={album} />
            <AlbumTracksList tracks={album.tracks} />
          </div>
        </div>

        {/* Мобильная и планшетная версия: информация об альбоме */}
        <div className="!w-full !flex !flex-col !items-center lg:!hidden !max-w-[600px] !-mt-2">
          <AlbumDetails album={album}/>
          <AlbumTracksList tracks={album.tracks} />
        </div>

        {/* Мобильная и планшетная версия: комментарии внизу */}
        <div className="!w-full !flex !flex-col !items-center lg:!hidden !max-w-full">
          <CommentsSection
            comments={comments}
            onAddComment={addComment}
            title="Комментарии"
            placeholder="Напишите ваш комментарий об альбоме..."
            loading={loading}
          />
        </div>
      </div>
    </>
  );
}