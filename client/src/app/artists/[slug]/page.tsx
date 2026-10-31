'use client';

import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import {Avatar, Button, Card, Col, Result, Row, Statistic, Typography} from 'antd';
import {PlayCircleOutlined} from '@ant-design/icons';
import Header from '@/src/components/Header';
import Loader from '@/src/components/Loader';
import BackButton from '@/src/components/BackButton';
import LikeButton from '@/src/components/LikeButton';
import TrackList from '@/src/components/TrackComponents/TrackList';
import AlbumsGrid from '@/src/components/AlbumComponents/AlbumsGrid';
import PlaylistCard from '@/src/components/PlaylistComponents/PlaylistCard';
import usePlayQueue from '@/src/hooks/usePlayQueue';
import {api} from '@/src/shared/api';
import {staticUrl} from '@/src/shared/config';
import {IArtist} from '@/src/types/user';
import {ITrack} from '@/src/types/track';
import {IAlbum, IPlaylist} from '@/src/types/album';

type ArtistCardData = IArtist & {
  monthlyListeners: number;
  monthlyListens: number;
  totalListens: number;
  likesCount: number;
  tracks: ITrack[];
  featTracks: ITrack[];
  albums: IAlbum[];
  playlists: IPlaylist[];
};

const sectionTitle = '!text-lg sm:!text-xl !mt-8 !mb-3 dark:!text-gray-200';
const number = (value: number) => value.toLocaleString('ru-RU');

export default function ArtistPage() {
  const {slug} = useParams<{ slug: string }>();
  const [artist, setArtist] = useState<ArtistCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const playQueue = usePlayQueue();

  useEffect(() => {
    api.get(`/artists/${slug}`)
      .then(({data}) => setArtist(data))
      .catch(() => setArtist(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (<><Header /><Loader /></>);
  if (!artist) {
    return (<><Header /><Result status="404" title="Артист не найден" /></>);
  }

  return (
    <>
      <Header />
      <BackButton href="/artists" text="К списку артистов" />
      <div className="!max-w-[1100px] !mx-auto !px-3 sm:!px-5 !pb-12">
        <Card className="!rounded-2xl !shadow-lg !overflow-hidden dark:!bg-gray-800 dark:!border-gray-700">
          <div className="!flex !flex-col sm:!flex-row !items-center sm:!items-end !gap-5">
            <Avatar
              shape="square"
              size={160}
              src={artist.photo ? staticUrl(artist.photo) : undefined}
              className="!flex-shrink-0 !rounded-3xl !shadow-lg !bg-gradient-to-br !from-[#32c4d0] !to-blue-500 !text-6xl"
            >
              {artist.name.slice(0, 1).toUpperCase()}
            </Avatar>
            <div className="!flex-1 !text-center sm:!text-left">
              <Typography.Text type="secondary" className="dark:!text-gray-400">
                {artist.label ? `Лейбл ${artist.label.name}` : 'Артист'}
              </Typography.Text>
              <Typography.Title level={1} className="!mt-1 !mb-3 !text-3xl sm:!text-5xl dark:!text-gray-100">
                {artist.name}
              </Typography.Title>
              <div className="!flex !flex-wrap !gap-2 !justify-center sm:!justify-start !items-center">
                <Button
                  type="primary"
                  size="large"
                  icon={<PlayCircleOutlined />}
                  onClick={() => playQueue([...artist.tracks, ...artist.featTracks], artist.name)}
                  className="!bg-[#32c4d0] !border-[#32c4d0]"
                >
                  Слушать
                </Button>
                <LikeButton type="artists" id={artist._id} size="large" withText />
              </div>
            </div>
          </div>
          <Row gutter={16} className="!mt-6">
            <Col xs={12} md={6}><Statistic title="Слушателей за месяц" value={number(artist.monthlyListeners)} /></Col>
            <Col xs={12} md={6}><Statistic title="Прослушиваний за месяц" value={number(artist.monthlyListens)} /></Col>
            <Col xs={12} md={6}><Statistic title="Всего прослушиваний" value={number(artist.totalListens)} /></Col>
            <Col xs={12} md={6}><Statistic title="В избранном" value={number(artist.likesCount)} /></Col>
          </Row>
          {artist.bio && (
            <Typography.Paragraph className="!mt-5 !whitespace-pre-line dark:!text-gray-300">
              {artist.bio}
            </Typography.Paragraph>
          )}
        </Card>

        {artist.tracks.length > 0 && (
          <>
            <Typography.Title level={3} className={sectionTitle}>Популярные треки</Typography.Title>
            <TrackList tracks={artist.tracks} />
          </>
        )}

        {artist.albums.length > 0 && (
          <>
            <Typography.Title level={3} className={sectionTitle}>Альбомы</Typography.Title>
            <AlbumsGrid albums={artist.albums} onPlayAlbum={(album) => playQueue(album.tracks, album.name)} />
          </>
        )}

        {artist.featTracks.length > 0 && (
          <>
            <Typography.Title level={3} className={sectionTitle}>Совместные треки</Typography.Title>
            <TrackList tracks={artist.featTracks} />
          </>
        )}

        {artist.playlists.length > 0 && (
          <>
            <Typography.Title level={3} className={sectionTitle}>Плейлисты артиста</Typography.Title>
            <Row gutter={[16, 16]}>
              {artist.playlists.map((playlist) => (
                <Col key={playlist._id} xs={12} sm={8} md={6}>
                  <PlaylistCard playlist={playlist} />
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>
    </>
  );
}
