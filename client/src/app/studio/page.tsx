'use client';

import {useCallback, useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tabs,
  Typography,
  Upload,
} from 'antd';
import {BarChartOutlined, DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined} from '@ant-design/icons';
import Header from '@/src/components/Header';
import Loader from '@/src/components/Loader';
import DailyBarChart from '@/src/components/DailyBarChart';
import PlaylistFormModal from '@/src/components/PlaylistComponents/PlaylistFormModal';
import useRequireUser from '@/src/hooks/useRequireUser';
import {useAuth} from '@/src/shared/auth/AuthProvider';
import {api, apiError} from '@/src/shared/api';
import {staticUrl} from '@/src/shared/config';
import {IArtist} from '@/src/types/user';
import {ITrack} from '@/src/types/track';
import {IAlbum, IPlaylist} from '@/src/types/album';

type Overview = {
  label: { _id: string; name: string; description: string; logo: string } | null;
  artists: IArtist[];
  tracks: ITrack[];
  albums: IAlbum[];
  playlists: IPlaylist[];
};

type LabelOption = { _id: string; name: string };

// Поле выбора файла без автозагрузки: файл уходит вместе с формой
function FilePicker({onChange, accept = 'image/*'}: { onChange: (file: File | null) => void; accept?: string }) {
  return (
    <Upload accept={accept} maxCount={1} beforeUpload={(file) => {
      onChange(file);
      return false;
    }} onRemove={() => onChange(null)}>
      <Button icon={<UploadOutlined />}>Выбрать файл</Button>
    </Upload>
  );
}

const submitForm = async (request: () => Promise<unknown>, onDone: () => void, success: string) => {
  try {
    await request();
    message.success(success);
    onDone();
  } catch (error) {
    message.error(apiError(error));
  }
};

function ArtistModal({artist, open, labels, isAdmin, onClose, onSaved}: {
  artist: IArtist | null; open: boolean; labels: LabelOption[]; isAdmin: boolean;
  onClose: () => void; onSaved: () => void;
}) {
  const [form] = Form.useForm();
  const [photo, setPhoto] = useState<File | null>(null);

  useEffect(() => {
    if (!open) return;
    setPhoto(null);
    form.setFieldsValue({name: artist?.name ?? '', bio: artist?.bio ?? '', labelId: artist?.label?._id ?? ''});
  }, [open, artist, form]);

  const save = async () => {
    const values = await form.validateFields();
    const data = new FormData();
    data.append('name', values.name);
    data.append('bio', values.bio ?? '');
    if (isAdmin) data.append('labelId', values.labelId ?? '');
    if (photo) data.append('photo', photo);
    await submitForm(
      () => artist ? api.patch(`/artists/${artist._id}`, data) : api.post('/artists', data),
      () => {
        onClose();
        onSaved();
      },
      artist ? 'Артист сохранён' : 'Артист добавлен',
    );
  };

  return (
    <Modal open={open} title={artist ? 'Редактировать артиста' : 'Новый артист'} okText="Сохранить" cancelText="Отмена"
      onOk={save} onCancel={onClose} destroyOnHidden>
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item name="name" label="Имя" rules={[{required: true, message: 'Укажите имя'}]}><Input maxLength={128} /></Form.Item>
        <Form.Item name="bio" label="Описание"><Input.TextArea rows={4} /></Form.Item>
        {isAdmin && (
          <Form.Item name="labelId" label="Лейбл">
            <Select options={[{value: '', label: 'Без лейбла'}, ...labels.map((l) => ({value: l._id, label: l.name}))]} />
          </Form.Item>
        )}
        <Form.Item label="Фото"><FilePicker onChange={setPhoto} /></Form.Item>
      </Form>
    </Modal>
  );
}

function TrackModal({track, artists, onClose, onSaved}: {
  track: ITrack | null; artists: IArtist[]; onClose: () => void; onSaved: () => void;
}) {
  const [form] = Form.useForm();
  const [picture, setPicture] = useState<File | null>(null);

  useEffect(() => {
    if (!track) return;
    setPicture(null);
    form.setFieldsValue({name: track.name, text: track.text, artistIds: track.artists?.map((a) => a._id) ?? []});
  }, [track, form]);

  const save = async () => {
    const values = await form.validateFields();
    const data = new FormData();
    data.append('name', values.name);
    data.append('text', values.text ?? '');
    values.artistIds.forEach((id: string) => data.append('artistIds', id));
    if (picture) data.append('picture', picture);
    await submitForm(() => api.patch(`/tracks/${track!._id}`, data), () => {
      onClose();
      onSaved();
    }, 'Трек сохранён');
  };

  return (
    <Modal open={!!track} title="Редактировать трек" okText="Сохранить" cancelText="Отмена" onOk={save} onCancel={onClose} destroyOnHidden>
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item name="name" label="Название" rules={[{required: true, message: 'Укажите название'}]}><Input /></Form.Item>
        <Form.Item name="artistIds" label="Исполнители (первый — основной)" rules={[{required: true, message: 'Выберите исполнителей'}]}>
          <Select mode="multiple" optionFilterProp="label" options={artists.map((a) => ({value: a._id, label: a.name}))} />
        </Form.Item>
        <Form.Item name="text" label="Текст"><Input.TextArea rows={6} /></Form.Item>
        <Form.Item label="Новая обложка"><FilePicker onChange={setPicture} /></Form.Item>
      </Form>
    </Modal>
  );
}

function AlbumModal({album, artists, tracks, onClose, onSaved}: {
  album: IAlbum | null; artists: IArtist[]; tracks: ITrack[]; onClose: () => void; onSaved: () => void;
}) {
  const [form] = Form.useForm();
  const [picture, setPicture] = useState<File | null>(null);

  useEffect(() => {
    if (!album) return;
    setPicture(null);
    form.setFieldsValue({
      name: album.name,
      artistIds: album.artists?.map((a) => a._id) ?? [],
      tracks: album.tracks.map((t) => t._id),
    });
  }, [album, form]);

  const save = async () => {
    const values = await form.validateFields();
    const data = new FormData();
    data.append('name', values.name);
    values.artistIds.forEach((id: string) => data.append('artistIds', id));
    values.tracks.forEach((id: string) => data.append('tracks', id));
    if (picture) data.append('picture', picture);
    await submitForm(() => api.patch(`/albums/${album!._id}`, data), () => {
      onClose();
      onSaved();
    }, 'Альбом сохранён');
  };

  return (
    <Modal open={!!album} title="Редактировать альбом" okText="Сохранить" cancelText="Отмена" onOk={save} onCancel={onClose} destroyOnHidden>
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item name="name" label="Название" rules={[{required: true, message: 'Укажите название'}]}><Input /></Form.Item>
        <Form.Item name="artistIds" label="Исполнители" rules={[{required: true, message: 'Выберите исполнителей'}]}>
          <Select mode="multiple" optionFilterProp="label" options={artists.map((a) => ({value: a._id, label: a.name}))} />
        </Form.Item>
        <Form.Item name="tracks" label="Треки (в порядке выбора)">
          <Select mode="multiple" optionFilterProp="label" options={tracks.map((t) => ({value: t._id, label: `${t.name} — ${t.artist}`}))} />
        </Form.Item>
        <Form.Item label="Новая обложка"><FilePicker onChange={setPicture} /></Form.Item>
      </Form>
    </Modal>
  );
}

function StatsModal({artist, onClose}: { artist: IArtist | null; onClose: () => void }) {
  const [data, setData] = useState<{ day: string; listens: number; listeners: number }[] | null>(null);

  useEffect(() => {
    if (!artist) return;
    setData(null);
    api.get(`/artists/${artist._id}/stats`, {params: {days: 30}}).then((r) => setData(r.data));
  }, [artist]);

  return (
    <Modal open={!!artist} title={`Статистика: ${artist?.name ?? ''}`} footer={null} onCancel={onClose} width={640}>
      {!data ? <Loader /> : (
        <Space direction="vertical" size="large" className="!w-full">
          <DailyBarChart title="Прослушивания по дням, 30 дней" data={data.map((d) => ({day: d.day, value: d.listens}))} />
          <DailyBarChart title="Слушатели по дням, 30 дней" data={data.map((d) => ({day: d.day, value: d.listeners}))} />
        </Space>
      )}
    </Modal>
  );
}

function LabelModal({label, open, onClose, onSaved}: {
  label: Overview['label']; open: boolean; onClose: () => void; onSaved: () => void;
}) {
  const [form] = Form.useForm();
  const [logo, setLogo] = useState<File | null>(null);

  useEffect(() => {
    if (open && label) form.setFieldsValue({name: label.name, description: label.description});
  }, [open, label, form]);

  const save = async () => {
    const values = await form.validateFields();
    const data = new FormData();
    data.append('name', values.name);
    data.append('description', values.description ?? '');
    if (logo) data.append('logo', logo);
    await submitForm(() => api.patch('/studio/label', data), () => {
      onClose();
      onSaved();
    }, 'Лейбл сохранён');
  };

  return (
    <Modal open={open} title="Лейбл" okText="Сохранить" cancelText="Отмена" onOk={save} onCancel={onClose} destroyOnHidden>
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item name="name" label="Название" rules={[{required: true, message: 'Укажите название'}]}><Input maxLength={128} /></Form.Item>
        <Form.Item name="description" label="Описание"><Input.TextArea rows={3} /></Form.Item>
        <Form.Item label="Логотип"><FilePicker onChange={setLogo} /></Form.Item>
      </Form>
    </Modal>
  );
}

export default function StudioPage() {
  const {ready} = useRequireUser('label');
  const {user, hasRole} = useAuth();
  const router = useRouter();
  const isAdmin = hasRole('admin');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [labels, setLabels] = useState<LabelOption[]>([]);
  const [artistModal, setArtistModal] = useState<{ open: boolean; artist: IArtist | null }>({open: false, artist: null});
  const [statsArtist, setStatsArtist] = useState<IArtist | null>(null);
  const [editTrack, setEditTrack] = useState<ITrack | null>(null);
  const [editAlbum, setEditAlbum] = useState<IAlbum | null>(null);
  const [playlistModal, setPlaylistModal] = useState(false);
  const [labelModal, setLabelModal] = useState(false);

  const load = useCallback(() => {
    api.get('/studio')
      .then(({data}) => {
        setOverview(data);
        setError(null);
      })
      .catch((e) => setError(apiError(e, 'Не удалось загрузить студию')));
  }, []);

  useEffect(() => {
    if (!ready) return;
    load();
    if (isAdmin) api.get('/admin/labels').then(({data}) => setLabels(data)).catch(() => undefined);
  }, [ready, isAdmin, load]);

  if (!ready) return (<><Header /><Loader /></>);

  if (error) {
    return (
      <>
        <Header />
        <div className="!max-w-[700px] !mx-auto !p-6">
          <Alert type="error" showIcon message={error}
            action={<Button onClick={() => router.push('/profile')}>Профиль</Button>} />
        </div>
      </>
    );
  }
  if (!overview) return (<><Header /><Loader /></>);

  const remove = (url: string, success: string) => submitForm(() => api.delete(url), load, success);
  const actions = (onEdit: () => void, deleteUrl: string, what: string) => (
    <Space>
      <Button size="small" icon={<EditOutlined />} onClick={onEdit} />
      <Popconfirm title={`Удалить ${what}?`} description="Это действие нельзя отменить" okText="Удалить" cancelText="Отмена"
        onConfirm={() => remove(deleteUrl, 'Удалено')}>
        <Button size="small" danger icon={<DeleteOutlined />} />
      </Popconfirm>
    </Space>
  );

  return (
    <>
      <Header />
      <div className="!max-w-[1200px] !mx-auto !px-3 sm:!px-5 !py-6 !mb-10">
        <div className="!flex !flex-col sm:!flex-row !justify-between !gap-3 !mb-4">
          <div>
            <Typography.Title level={2} className="!mb-0 !text-[#32c2ce] dark:!text-cyan-400">Студия</Typography.Title>
            <Typography.Text type="secondary" className="dark:!text-gray-400">
              {overview.label ? `Лейбл «${overview.label.name}»` : isAdmin ? 'Весь каталог (администратор)' : user?.displayName}
            </Typography.Text>
          </div>
          <Space wrap>
            {overview.label && <Button onClick={() => setLabelModal(true)}>Настройки лейбла</Button>}
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setArtistModal({open: true, artist: null})}>Артист</Button>
            <Button icon={<UploadOutlined />} onClick={() => router.push('/tracks/create')} disabled={!overview.artists.length}>Трек</Button>
            <Button icon={<PlusOutlined />} onClick={() => router.push('/albums/create')} disabled={!overview.tracks.length}>Альбом</Button>
          </Space>
        </div>

        {!overview.artists.length && (
          <Alert className="!mb-4" type="info" showIcon message="Начните с артиста"
            description="Добавьте артиста лейбла — после этого можно загружать его треки и собирать альбомы." />
        )}

        <Card className="!rounded-xl !shadow-lg dark:!bg-gray-800 dark:!border-gray-700">
          <Tabs items={[
            {
              key: 'artists',
              label: `Артисты (${overview.artists.length})`,
              children: (
                <Table rowKey="_id" dataSource={overview.artists} pagination={{pageSize: 20}} scroll={{x: true}} columns={[
                  {
                    title: 'Артист', render: (_, a: IArtist) => (
                      <Space>
                        <Avatar src={a.photo ? staticUrl(a.photo) : undefined}>{a.name[0]}</Avatar>
                        <Link href={`/artists/${a.slug}`}>{a.name}</Link>
                      </Space>
                    ),
                  },
                  ...(isAdmin ? [{title: 'Лейбл', render: (_: unknown, a: IArtist) => a.label?.name ?? '—'}] : []),
                  {title: 'Слушатели / мес', dataIndex: 'monthlyListeners', sorter: (a: IArtist, b: IArtist) => (a.monthlyListeners ?? 0) - (b.monthlyListeners ?? 0)},
                  {title: 'Прослушивания / мес', dataIndex: 'monthlyListens'},
                  {
                    title: '', render: (_, a: IArtist) => (
                      <Space>
                        <Button size="small" icon={<BarChartOutlined />} onClick={() => setStatsArtist(a)} />
                        {actions(() => setArtistModal({open: true, artist: a}), `/artists/${a._id}`, 'артиста вместе со связями')}
                      </Space>
                    ),
                  },
                ]} />
              ),
            },
            {
              key: 'tracks',
              label: `Треки (${overview.tracks.length})`,
              children: (
                <Table rowKey="_id" dataSource={overview.tracks} pagination={{pageSize: 20}} scroll={{x: true}} columns={[
                  {title: 'Название', render: (_, t: ITrack) => <Link href={`/tracks/${t._id}`}>{t.name}</Link>},
                  {title: 'Исполнители', dataIndex: 'artist'},
                  {title: 'Прослушивания', dataIndex: 'listens', sorter: (a: ITrack, b: ITrack) => a.listens - b.listens},
                  {title: '', render: (_, t: ITrack) => actions(() => setEditTrack(t), `/tracks/${t._id}`, 'трек')},
                ]} />
              ),
            },
            {
              key: 'albums',
              label: `Альбомы (${overview.albums.length})`,
              children: (
                <Table rowKey="_id" dataSource={overview.albums} pagination={{pageSize: 20}} scroll={{x: true}} columns={[
                  {title: 'Название', render: (_, a: IAlbum) => <Link href={`/albums/${a._id}`}>{a.name}</Link>},
                  {title: 'Исполнители', dataIndex: 'author'},
                  {title: 'Треков', render: (_, a: IAlbum) => a.tracks.length},
                  {title: '', render: (_, a: IAlbum) => actions(() => setEditAlbum(a), `/albums/${a._id}`, 'альбом')},
                ]} />
              ),
            },
            {
              key: 'playlists',
              label: `Плейлисты артистов (${overview.playlists.length})`,
              children: (
                <>
                  <Button icon={<PlusOutlined />} className="!mb-3" onClick={() => setPlaylistModal(true)} disabled={!overview.artists.length}>
                    Плейлист артиста
                  </Button>
                  <Table rowKey="_id" dataSource={overview.playlists} pagination={false} columns={[
                    {title: 'Название', render: (_, p: IPlaylist) => <Link href={`/playlists/${p._id}`}>{p.name}</Link>},
                    {title: 'Артист', render: (_, p: IPlaylist) => p.artist?.name},
                    {title: 'Треков', dataIndex: 'tracksCount'},
                    {title: 'Доступ', render: (_, p: IPlaylist) => p.isPublic ? 'публичный' : 'приватный'},
                    {
                      title: '', render: (_, p: IPlaylist) => (
                        <Popconfirm title="Удалить плейлист?" okText="Удалить" cancelText="Отмена" onConfirm={() => remove(`/playlists/${p._id}`, 'Удалено')}>
                          <Button size="small" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                      ),
                    },
                  ]} />
                </>
              ),
            },
          ]} />
        </Card>
      </div>

      <ArtistModal {...artistModal} labels={labels} isAdmin={isAdmin}
        onClose={() => setArtistModal({open: false, artist: null})} onSaved={load} />
      <TrackModal track={editTrack} artists={overview.artists} onClose={() => setEditTrack(null)} onSaved={load} />
      <AlbumModal album={editAlbum} artists={overview.artists} tracks={overview.tracks} onClose={() => setEditAlbum(null)} onSaved={load} />
      <StatsModal artist={statsArtist} onClose={() => setStatsArtist(null)} />
      <LabelModal label={overview.label} open={labelModal} onClose={() => setLabelModal(false)} onSaved={load} />
      <PlaylistFormModal open={playlistModal} artists={overview.artists} onClose={() => setPlaylistModal(false)}
        onSaved={(p) => router.push(`/playlists/${p._id}`)} />
    </>
  );
}
