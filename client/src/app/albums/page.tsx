'use client';

import Header from '@/src/components/Header';
import Loader from '@/src/components/Loader';
import useAlbums from '@/src/hooks/useAlbums';
import { useDispatch } from 'react-redux';
import {
  playTrack,
  setAlbumMode,
  setAlbumTracks,
  setCurrentTrack,
  setCurrentTrackData,
} from '@/src/store/action-creators/player';
import { message } from 'antd';
import { IAlbum } from '@/src/types/album';
import AlbumsContainer from '@/src/components/AlbumComponents/AlbumsContainer';
import AlbumsHeader from '@/src/components/AlbumComponents/AlbumsHeader';
import AlbumsEmptyState from '@/src/components/AlbumComponents/AlbumsEmptyState';
import AlbumsGrid from '@/src/components/AlbumComponents/AlbumsGrid';
import AlbumSearch from '@/src/components/AlbumComponents/AlbumSearch';
import { useState, useMemo } from 'react';

export default function AlbumsPage() {
  const dispatch = useDispatch();
  const { albums, loading } = useAlbums();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase().trim());
  };

  const filteredAlbums = useMemo(() => {
    if (!searchQuery) return albums;

    return albums.filter((album: IAlbum) => {
      const query = searchQuery.toLowerCase();

      if (album.name?.toLowerCase().includes(query)) {
        return true;
      }

      if (album.author?.toLowerCase().includes(query)) {
        return true;
      }

      if (album.tracks?.some(track =>
        track.name?.toLowerCase().includes(query) ||
        track.artist?.toLowerCase().includes(query)
      )) {
        return true;
      }

      return false;
    });
  }, [albums, searchQuery]);

  const handlePlayAlbum = (album: IAlbum) => {
    if (album.tracks && album.tracks.length > 0) {
      dispatch(setAlbumTracks(album.tracks));
      dispatch(setAlbumMode(true));

      const firstTrack = album.tracks[0];
      dispatch(setCurrentTrack(firstTrack._id));
      dispatch(setCurrentTrackData(firstTrack));
      dispatch(playTrack());

      message.success(`Начинаем воспроизведение альбома "${album.name}"`);
    } else {
      message.warning('В альбоме нет треков');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <Loader />
      </>
    );
  }

  const emptyStateMessage = searchQuery
    ? `Альбомы по запросу "${searchQuery}" не найдены`
    : 'Пока нет альбомов';

  return (
    <>
      <Header />
      <div className="!flex !justify-center !mt-4 md:!mt-8 !px-2 sm:!px-4 md:!px-5 !min-h-[calc(100vh-200px)]">
        <div className="!w-full !max-w-full md:!max-w-[90%] lg:!max-w-[75%]">
          <AlbumsContainer>
            <AlbumsHeader />

            {/* Компонент поиска по альбомам */}
            <AlbumSearch
              onSearch={handleSearch}
              placeholder="Поиск альбомов, артистов или треков..."
              debounceDelay={300}
            />

            {filteredAlbums.length === 0 ? (
              <AlbumsEmptyState message={emptyStateMessage} />
            ) : (
              <AlbumsGrid
                albums={filteredAlbums}
                onPlayAlbum={handlePlayAlbum}
              />
            )}
          </AlbumsContainer>
        </div>
      </div>
    </>
  );
}