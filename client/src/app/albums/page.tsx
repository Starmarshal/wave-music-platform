'use client';

import Header from '@/src/components/Header/Header';
import Loader from '@/src/components/Loader';
import useAlbums from '@/src/hooks/useAlbums';
import {useDispatch} from 'react-redux';
import {
  setCurrentTrack,
  setCurrentTrackData,
  playTrack,
  setAlbumTracks
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
      dispatch(setAlbumTracks(album.tracks));

      const firstTrack = album.tracks[0];
      dispatch(setCurrentTrack(firstTrack._id));
      dispatch(setCurrentTrackData(firstTrack));
      dispatch(playTrack());
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
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '2rem',
          padding: '0 20px',
          minHeight: 'calc(100vh - 200px)',
        }}
      >
        <div style={{width: '100%', maxWidth: '1400px'}}>
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