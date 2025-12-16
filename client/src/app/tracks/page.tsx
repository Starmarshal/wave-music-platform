'use client';

import Header from '@/src/components/Header/Header';
import Loader from '@/src/components/Loader';
import useTracksPage from '@/src/hooks/useTracksPage';
import TracksContainer from '@/src/components/TrackComponents/TracksContainer';
import TracksError from '@/src/components/TrackComponents/TracksError';
import TracksHeader from '@/src/components/TrackComponents/TracksHeader';
import TracksContent from '@/src/components/TrackComponents/TracksContent';
import TracksSearch from '@/src/components/TrackComponents/TracksSearch';

export default function TracksPage() {
  const {
    error,
    loading,
    handleSearch,
    handleQueryChange,
    refetchTracks
  } = useTracksPage();

  if (loading) {
    return (
      <>
        <Header />
        <Loader />
      </>
    );
  }

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

      <TracksContainer maxWidth="1200px">
        <TracksHeader
          title="Список треков"
          buttonText="Загрузить трек"
          buttonHref="/tracks/create"
        />

        <TracksSearch
          onSearch={handleSearch}
          placeholder="Поиск треков..."
          debounceDelay={100}
        />

        <TracksContent />
      </TracksContainer>
    </>
  );
}