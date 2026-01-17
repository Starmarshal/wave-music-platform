'use client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import Header from '@/src/components/Header';
import useTracksPage from '@/src/hooks/useTracksPage';
import TracksContainer from '@/src/components/TrackComponents/TracksContainer';
import TracksError from '@/src/components/TrackComponents/TracksError';
import TracksHeader from '@/src/components/TrackComponents/TracksHeader';
import TracksContent from '@/src/components/TrackComponents/TracksContent';
import TracksSearch from '@/src/components/TrackComponents/TracksSearch';
import TrackList from '@/src/components/TrackComponents/TrackList';
import Loader from '@/src/components/Loader';
import {useAppDispatch} from '@/src/hooks/useAppDispatch';
import {fetchTracks} from '@/src/store/action-creators/track';

export default function TracksPage() {
  const {
    tracks,
    error,
    loading,
    handleSearch,
  } = useTracksPage();

  const dispatch = useAppDispatch();

  const handleTrackDelete = () => {
    dispatch(fetchTracks());
  };

  if (error) {
    return (
      <>
        <Header />
        <TracksContainer>
          <TracksError error={error} />
        </TracksContainer>
      </>
    );
  }

  return (
    <>
      <Header />

      <TracksContainer maxWidth="100%">
        <TracksHeader
          title="Список треков"
          buttonText="Загрузить трек"
          buttonHref="/tracks/create"
        />

        <TracksSearch
          onSearch={handleSearch}
          placeholder="Поиск треков или исполнителей..."
          debounceDelay={300}
        />

        <TracksContent>
          {loading ? (
            <Loader />
          ) : (
            <TrackList
              tracks={tracks}
              onDelete={handleTrackDelete}
            />
          )}
        </TracksContent>
      </TracksContainer>
    </>
  );
}
