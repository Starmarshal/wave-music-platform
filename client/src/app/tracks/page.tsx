'use client';

import Header from '@/src/components/Header';
import useTracksPage from '@/src/hooks/useTracksPage';
import TracksContainer from '@/src/components/TrackComponents/TracksContainer';
import TracksError from '@/src/components/TrackComponents/TracksError';
import TracksHeader from '@/src/components/TrackComponents/TracksHeader';
import TracksContent from '@/src/components/TrackComponents/TracksContent';
import TracksSearch from '@/src/components/TrackComponents/TracksSearch';

export default function TracksPage() {
  const {
    error,
    handleSearch,
  } = useTracksPage();

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
          placeholder="Поиск треков..."
          debounceDelay={100}
        />

        <TracksContent />
      </TracksContainer>
    </>
  );
}