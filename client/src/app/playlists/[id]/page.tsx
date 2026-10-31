'use client';

import {useCallback, useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import Link from 'next/link';
import {Button, Card, Empty, List, message, Popconfirm, Result, Switch, Tag, Tooltip, Typography} from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CustomerServiceOutlined,
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import Header from '@/src/components/Header';
import Loader from '@/src/components/Loader';
import BackButton from '@/src/components/BackButton';
import LikeButton from '@/src/components/LikeButton';
import ArtistLinks from '@/src/components/ArtistLinks';
import PlaylistFormModal from '@/src/components/PlaylistComponents/PlaylistFormModal';
import usePlayQueue from '@/src/hooks/usePlayQueue';
import {useAuth} from '@/src/shared/auth/AuthProvider';
import {api, apiError} from '@/src/shared/api';
import {staticUrl} from '@/src/shared/config';
import {IPlaylist} from '@/src/types/album';

export default function PlaylistPage() {
  const {id} = useParams<{ id: string }>();
  const router = useRouter();
  const {user} = useAuth();
  const playQueue = usePlayQueue();
  const [playlist, setPlaylist] = useState<IPlaylist | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const load = useCallback(() => {
    api.get(`/playlists/${id}`)
      .then(({data}) => setPlaylist(data))
      .catch(() => setPlaylist(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Перезагружаем после входа: приватный плейлист владельцу виден только с сессией
  useEffect(load, [load, user?._id]);

  if (loading) return (<><Header /><Loader /></>);
  if (!playlist) {
    return (<><Header /><Result status="404" title="Плейлист не найден" subTitle="Возможно, он приватный или был удалён" /></>);
  }

  const tracks = playlist.tracks ?? [];
  const canEdit = !!playlist.canEdit;
  const isOwn = playlist.owner._id === user?._id;

  const update = async (request: Promise<{ data: IPlaylist }>) => {
    try {
      const {data} = await request;
      setPlaylist(data);
    } catch (error) {
      message.error(apiError(error));
    }
  };

  const move = (index: number, delta: number) => {
    const ids = tracks.map((track) => track._id);
    const [moved] = ids.splice(index, 1);
    ids.splice(index + delta, 0, moved);
    update(api.put(`/playlists/${playlist._id}/order`, {trackIds: ids}));
  };

  const togglePublic = (isPublic: boolean) => {
    const data = new FormData();
    data.append('isPublic', String(isPublic));
    update(api.patch(`/playlists/${playlist._id}`, data));
  };

  const share = async () => {
    await navigator.clipboard.writeText(window.location.href);
    message.success('Ссылка скопирована');
  };

  return (
    <>
      <Header />
      <BackButton href="/playlists" text="К плейлистам" />
      <div className="!max-w-[900px] !mx-auto !px-3 sm:!px-5 !pb-12">
        <Card className="!rounded-2xl !shadow-lg dark:!bg-gray-800 dark:!border-gray-700">
          <div className="!flex !flex-col sm:!flex-row !gap-5 !items-center sm:!items-end">
            <div className="!w-44 !h-44 !rounded-xl !overflow-hidden !flex-shrink-0 !bg-gradient-to-br !from-[#32c4d0] !to-indigo-500 !flex !items-center !justify-center">
              {playlist.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={staticUrl(playlist.cover)} alt={playlist.name} className="!w-full !h-full !object-cover" />
              ) : <CustomerServiceOutlined className="!text-6xl !text-white/90" />}
            </div>
            <div className="!flex-1 !min-w-0 !text-center sm:!text-left">
              <Typography.Text type="secondary" className="dark:!text-gray-400">
                {playlist.artist ? <>Плейлист артиста <Link href={`/artists/${playlist.artist.slug}`}>{playlist.artist.name}</Link></> : `Плейлист · ${playlist.owner.displayName ?? ''}`}
                {!playlist.isPublic && <Tag className="!ml-2">приватный</Tag>}
              </Typography.Text>
              <Typography.Title level={2} className="!mt-1 !mb-2 dark:!text-gray-100">{playlist.name}</Typography.Title>
              {playlist.description && (
                <Typography.Paragraph type="secondary" className="!whitespace-pre-line dark:!text-gray-400">
                  {playlist.description}
                </Typography.Paragraph>
              )}
              <div className="!flex !flex-wrap !gap-2 !justify-center sm:!justify-start !items-center">
                <Button type="primary" icon={<PlayCircleOutlined />} onClick={() => playQueue(tracks, playlist.name)}
                  className="!bg-[#32c4d0] !border-[#32c4d0]">
                  Слушать
                </Button>
                {!isOwn && playlist.isPublic && <LikeButton type="playlists" id={playlist._id} withText />}
                {playlist.isPublic && <Button icon={<LinkOutlined />} onClick={share}>Поделиться</Button>}
                {canEdit && <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>Изменить</Button>}
                {canEdit && (
                  <Tooltip title="Публичный плейлист видят все и могут открыть по ссылке">
                    <span className="!flex !items-center !gap-2 !ml-1 dark:!text-gray-300">
                      <Switch size="small" checked={playlist.isPublic} onChange={togglePublic} /> Публичный
                    </span>
                  </Tooltip>
                )}
                {canEdit && (
                  <Popconfirm
                    title="Удалить плейлист?"
                    okText="Удалить"
                    cancelText="Отмена"
                    onConfirm={async () => {
                      await api.delete(`/playlists/${playlist._id}`);
                      router.push('/playlists');
                    }}
                  >
                    <Button danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="!rounded-2xl !shadow-lg !mt-5 dark:!bg-gray-800 dark:!border-gray-700"
          title={<span className="dark:!text-gray-200">Треки ({tracks.length})</span>}>
          {tracks.length === 0 ? (
            <Empty description={canEdit ? 'Добавляйте треки кнопкой «+» в списке треков' : 'В плейлисте пока нет треков'} />
          ) : (
            <List
              dataSource={tracks}
              renderItem={(track, index) => (
                <List.Item
                  actions={[
                    <LikeButton key="like" type="tracks" id={track._id} size="small" />,
                    ...(canEdit ? [
                      <Button key="up" size="small" type="text" icon={<ArrowUpOutlined />} disabled={index === 0} onClick={() => move(index, -1)} />,
                      <Button key="down" size="small" type="text" icon={<ArrowDownOutlined />} disabled={index === tracks.length - 1} onClick={() => move(index, 1)} />,
                      <Button key="remove" size="small" type="text" danger icon={<DeleteOutlined />}
                        onClick={() => update(api.delete(`/playlists/${playlist._id}/tracks/${track._id}`))} />,
                    ] : []),
                  ]}
                >
                  <List.Item.Meta
                    avatar={<span className="!inline-block !w-6 !text-center !text-gray-400">{index + 1}</span>}
                    title={<Link href={`/tracks/${track._id}`} className="dark:!text-gray-200">{track.name}</Link>}
                    description={<span className="dark:!text-gray-400"><ArtistLinks artists={track.artists} fallback={track.artist} /></span>}
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>
      <PlaylistFormModal
        open={editing}
        playlist={playlist}
        onClose={() => setEditing(false)}
        onSaved={(saved) => setPlaylist({...playlist, ...saved})}
      />
    </>
  );
}
