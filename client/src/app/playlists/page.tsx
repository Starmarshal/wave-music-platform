'use client';

import {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Button, Col, Empty, Row, Tabs, Typography} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import Header from '@/src/components/Header';
import Loader from '@/src/components/Loader';
import DebouncedSearch from '@/src/components/DebouncedSearch';
import PlaylistCard from '@/src/components/PlaylistComponents/PlaylistCard';
import PlaylistFormModal from '@/src/components/PlaylistComponents/PlaylistFormModal';
import usePlaybackGuard from '@/src/hooks/usePlaybackGuard';
import {useAuth} from '@/src/shared/auth/AuthProvider';
import {api} from '@/src/shared/api';
import {IPlaylist} from '@/src/types/album';

function PlaylistGrid({playlists, empty}: { playlists: IPlaylist[]; empty: string }) {
  if (!playlists.length) return <Empty description={empty} />;
  return (
    <Row gutter={[16, 16]}>
      {playlists.map((playlist) => (
        <Col key={playlist._id} xs={12} sm={8} md={6} lg={4}>
          <PlaylistCard playlist={playlist} />
        </Col>
      ))}
    </Row>
  );
}

export default function PlaylistsPage() {
  const {user} = useAuth();
  const router = useRouter();
  const guard = usePlaybackGuard();
  const [mine, setMine] = useState<IPlaylist[]>([]);
  const [publicList, setPublicList] = useState<IPlaylist[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadMine = useCallback(() => {
    if (!user?.emailVerified) return;
    api.get('/playlists/my').then(({data}) => setMine(data));
  }, [user?.emailVerified]);

  useEffect(loadMine, [loadMine]);

  useEffect(() => {
    setLoading(true);
    api.get('/playlists', {params: query ? {query} : {}})
      .then(({data}) => setPublicList(data))
      .finally(() => setLoading(false));
  }, [query]);

  const publicTab = (
    <>
      <div className="!mb-5"><DebouncedSearch onSearch={setQuery} placeholder="Поиск плейлистов..." /></div>
      {loading ? <Loader /> : <PlaylistGrid playlists={publicList} empty="Публичных плейлистов пока нет" />}
    </>
  );

  return (
    <>
      <Header />
      <div className="!max-w-[1200px] !mx-auto !px-3 sm:!px-5 !py-6 !mb-10">
        <div className="!flex !flex-col sm:!flex-row !justify-between !items-start sm:!items-center !gap-3 !mb-4">
          <Typography.Title
            level={2}
            className="!mb-0 !text-[#32c2ce] dark:!text-cyan-400 !font-bold !text-xl sm:!text-2xl md:!text-3xl"
          >
            Плейлисты
          </Typography.Title>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => guard('создавать плейлисты') && setCreating(true)}
            className="!rounded-lg !w-full sm:!w-auto"
          >
            Создать плейлист
          </Button>
        </div>

        {user?.emailVerified ? (
          <Tabs
            items={[
              {key: 'mine', label: 'Мои', children: <PlaylistGrid playlists={mine} empty="У вас пока нет плейлистов" />},
              {key: 'public', label: 'Публичные', children: publicTab},
            ]}
          />
        ) : publicTab}
      </div>
      <PlaylistFormModal
        open={creating}
        onClose={() => setCreating(false)}
        onSaved={(playlist) => router.push(`/playlists/${playlist._id}`)}
      />
    </>
  );
}
