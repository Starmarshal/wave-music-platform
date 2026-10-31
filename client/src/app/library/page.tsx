'use client';

import {useEffect, useState} from 'react';
import {Button, Col, Empty, Row, Tabs, Typography} from 'antd';
import {PlayCircleOutlined} from '@ant-design/icons';
import Header from '@/src/components/Header';
import Loader from '@/src/components/Loader';
import TrackList from '@/src/components/TrackComponents/TrackList';
import AlbumsGrid from '@/src/components/AlbumComponents/AlbumsGrid';
import ArtistCard from '@/src/components/ArtistComponents/ArtistCard';
import PlaylistCard from '@/src/components/PlaylistComponents/PlaylistCard';
import useRequireUser from '@/src/hooks/useRequireUser';
import usePlayQueue from '@/src/hooks/usePlayQueue';
import {useAuth} from '@/src/shared/auth/AuthProvider';
import {api} from '@/src/shared/api';
import {ITrack} from '@/src/types/track';
import {IAlbum, IPlaylist} from '@/src/types/album';
import {IArtist} from '@/src/types/user';

type Library = {
  tracks: ITrack[];
  albums: IAlbum[];
  artists: IArtist[];
  playlists: IPlaylist[];
};

// «Моя музыка»: всё, что пользователь лайкнул
export default function LibraryPage() {
  const {user, ready} = useRequireUser();
  const {likes} = useAuth();
  const playQueue = usePlayQueue();
  const [library, setLibrary] = useState<Library | null>(null);

  useEffect(() => {
    if (!ready || !user?.emailVerified) return;
    api.get('/likes').then(({data}) => setLibrary(data));
  }, [ready, user?.emailVerified]);

  if (!ready) return (<><Header /><Loader /></>);

  // Убранное сердечко сразу пропадает из списка, без перезагрузки
  const tracks = library?.tracks.filter((t) => likes.tracks.has(t._id)) ?? [];
  const albums = library?.albums.filter((a) => likes.albums.has(a._id)) ?? [];
  const artists = library?.artists.filter((a) => likes.artists.has(a._id)) ?? [];
  const playlists = library?.playlists.filter((p) => likes.playlists.has(p._id)) ?? [];

  return (
    <>
      <Header />
      <div className="!max-w-[1200px] !mx-auto !px-3 sm:!px-5 !py-6 !mb-10">
        <Typography.Title
          level={2}
          className="!text-[#32c2ce] dark:!text-cyan-400 !font-bold !text-xl sm:!text-2xl md:!text-3xl"
        >
          Моя музыка
        </Typography.Title>
        {!user?.emailVerified ? (
          <Empty description="Подтвердите почту, чтобы собирать свою музыку" />
        ) : !library ? <Loader /> : (
          <Tabs
            items={[
              {
                key: 'tracks',
                label: `Треки (${tracks.length})`,
                children: tracks.length ? (
                  <>
                    <Button icon={<PlayCircleOutlined />} type="primary" className="!mb-3"
                      onClick={() => playQueue(tracks, 'Любимые треки')}>
                      Слушать всё
                    </Button>
                    <TrackList tracks={tracks} />
                  </>
                ) : <Empty description="Нажмите ♡ у трека, чтобы он появился здесь" />,
              },
              {
                key: 'albums',
                label: `Альбомы (${albums.length})`,
                children: albums.length
                  ? <AlbumsGrid albums={albums} onPlayAlbum={(album) => playQueue(album.tracks, album.name, {queueId: `album:${album._id}`})} />
                  : <Empty description="Пока нет любимых альбомов" />,
              },
              {
                key: 'artists',
                label: `Артисты (${artists.length})`,
                children: artists.length ? (
                  <Row gutter={[16, 16]}>
                    {artists.map((artist) => (
                      <Col key={artist._id} xs={12} sm={8} md={6} lg={4}><ArtistCard artist={artist} /></Col>
                    ))}
                  </Row>
                ) : <Empty description="Пока нет любимых артистов" />,
              },
              {
                key: 'playlists',
                label: `Плейлисты (${playlists.length})`,
                children: playlists.length ? (
                  <Row gutter={[16, 16]}>
                    {playlists.map((playlist) => (
                      <Col key={playlist._id} xs={12} sm={8} md={6} lg={4}><PlaylistCard playlist={playlist} /></Col>
                    ))}
                  </Row>
                ) : <Empty description="Лайкайте чужие публичные плейлисты, чтобы сохранить их здесь" />,
              },
            ]}
          />
        )}
      </div>
    </>
  );
}
