'use client';

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
        className="!mb-5 !flex !items-start !justify-center !gap-7 !px-5"
      >
        {/* Левая колонка: изображение и комментарии */}
        <div
          className="!flex !flex-col !items-center !flex-none"
        >
          <TrackImage
            picture={track.picture}
            name={track.name}
          />

          <div className="!mt-5">
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
        <TrackDetails track={track} />
      </div>
    </>
  );
}