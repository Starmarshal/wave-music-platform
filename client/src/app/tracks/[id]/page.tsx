'use client';

import Header from '@/src/components/Header/Header';
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
        style={{
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: '30px',
          padding: '0 20px'
        }}
      >
        {/* Левая колонка: изображение и комментарии */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: '0 0 auto'
          }}
        >
          <TrackImage
            picture={track.picture}
            name={track.name}
          />

          <div style={{marginTop: '20px'}}>
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
