'use client';

export const revalidate = 60;

import Header from '@/src/components/Header';
import CommentsSection from '@/src/components/CommentsSection';
import TrackDetails from '@/src/components/TrackComponents/TrackDetails';
import TrackImage from '@/src/components/TrackComponents/TrackImage';
import BackButton from '@/src/components/BackButton';
import TrackNotFound from '@/src/components/TrackComponents/TrackNotFound';
import Loader from '@/src/components/Loader';
import useTrack from '@/src/hooks/useTrack';
import {useParams} from 'next/navigation';

export default function TrackDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const {track, loading, comments, addComment} = useTrack(id);

  if (loading) {
    return (
      <>
        <Header />
        <Loader />
      </>
    );
  }

  if (!track) {
    return (
      <>
        <Header />
        <TrackNotFound backHref="/tracks" />
      </>
    );
  }

  return (
    <>
      <Header />

      <BackButton
        href="/tracks"
        text="К списку треков"
      />

      <div
        className="!mb-5 !flex !flex-col !items-center !gap-1 lg:!gap-6 !px-2 sm:!px-4 lg:!px-5"
      >
        {/* Мобильная и планшетная версия: картинка сверху, центрированная */}
        <div className="!w-full !flex !flex-col !items-center lg:!hidden !mb-4">
          <TrackImage
            picture={track.picture}
            name={track.name}
          />
        </div>

        {/* Десктопная версия: две колонки */}
        <div className="!hidden lg:!flex !flex-row !items-start !justify-center !gap-7 !w-full">
          {/* Левая колонка: изображение и комментарии */}
          <div
            className="!flex !flex-col !items-center !flex-none"
          >
            <TrackImage
              picture={track.picture}
              name={track.name}
            />

            <div className="!mt-5 !w-full">
              <CommentsSection
                comments={comments}
                onAddComment={addComment}
                title="Комментарии"
                placeholder="Напишите ваш комментарий о треке..."
                loading={loading}
              />
            </div>
          </div>

          {/* Правая колонка: информация о треке */}
          <div className="!flex-1 !max-w-[600px]">
            <TrackDetails track={track} />
          </div>
        </div>

        {/* Мобильная и планшетная версия: информация и текст трека */}
        <div className="!w-full !flex !flex-col !items-center lg:!hidden !max-w-full !-mt-2">
          <TrackDetails track={track} />
        </div>

        {/* Мобильная и планшетная версия: комментарии внизу */}
        <div className="!w-full !flex !flex-col !items-center lg:!hidden !max-w-[600px]">
          <CommentsSection
            comments={comments}
            onAddComment={addComment}
            title="Комментарии"
            placeholder="Напишите ваш комментарий о треке..."
            loading={loading}
          />
        </div>
      </div>
    </>
  );
}