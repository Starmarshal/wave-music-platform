'use client';

import Header from '@/src/components/Header';
import Loader from '@/src/components/Loader';
import useAlbums from '@/src/hooks/useAlbums';
import {useDispatch} from 'react-redux';
import {
  playTrack,
  setAlbumTracks,
  setCurrentTrack,
  setCurrentTrackData,
  setAlbumMode // Добавляем импорт
} from '@/src/store/action-creators/player';
import {message} from 'antd';
import {IAlbum} from '@/src/types/album';
import AlbumsContainer from '@/src/components/AlbumComponents/AlbumsContainer';
import AlbumsHeader from '@/src/components/AlbumComponents/AlbumsHeader';
import AlbumsEmptyState
  from '@/src/components/AlbumComponents/AlbumsEmptyState';
import AlbumsGrid from '@/src/components/AlbumComponents/AlbumsGrid';

export default function AlbumsPage() {
  const dispatch = useDispatch();
  const {albums, loading} = useAlbums();

  const handlePlayAlbum = (album: IAlbum) => {
    if (album.tracks && album.tracks.length > 0) {
      // Устанавливаем треки альбома и включаем режим альбома
      dispatch(setAlbumTracks(album.tracks));
      dispatch(setAlbumMode(true)); // Явно включаем режим альбома

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

  return (
    <>
      <Header />
      <div
        className="!flex !justify-center !mt-8 !px-5 !min-h-[calc(100vh-200px)]"
      >
        <div className="!w-full !max-w-[75%]">
          <AlbumsContainer>
            <AlbumsHeader />

            {albums.length === 0 ? (
              <AlbumsEmptyState />
            ) : (
              <AlbumsGrid
                albums={albums}
                onPlayAlbum={handlePlayAlbum}
              />
            )}
          </AlbumsContainer>
        </div>
      </div>
    </>
  );
}