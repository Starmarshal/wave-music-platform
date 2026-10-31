'use client';

import {useCallback, useEffect, useState} from 'react';
import Link from 'next/link';
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  List,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import Header from '@/src/components/Header';
import Loader from '@/src/components/Loader';
import DailyBarChart from '@/src/components/DailyBarChart';
import DebouncedSearch from '@/src/components/DebouncedSearch';
import useRequireUser from '@/src/hooks/useRequireUser';
import {useAuth} from '@/src/shared/auth/AuthProvider';
import {api, apiError} from '@/src/shared/api';
import {Role, ROLE_NAMES} from '@/src/types/user';
import {IComment} from '@/src/types/track';

type AdminUser = {
  _id: string;
  email: string;
  displayName: string;
  role: Role;
  emailVerified: boolean;
  totpEnabled: boolean;
  banned: boolean;
  createdAt: string;
  label: { _id: string; name: string } | null;
};

type AdminLabel = {
  _id: string;
  name: string;
  description: string;
  artistsCount: number;
  owner: { _id: string; email: string; displayName: string } | null;
};

type Stats = {
  totals: Record<string, number>;
  daily: { day: string; listens: number; newUsers: number }[];
  topTracks: { _id: string; name: string; artist: string; listens: number }[];
};

type AuditEntry = {
  _id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  details: Record<string, unknown>;
  createdAt: string;
  user: { displayName: string; email: string } | null;
};

const ACTIONS: Record<string, string> = {
  create: 'создал', update: 'изменил', delete: 'удалил', change_role: 'сменил роль',
  ban: 'заблокировал', unban: 'разблокировал', reset_2fa: 'сбросил 2FA',
};
const ENTITIES: Record<string, string> = {
  track: 'трек', album: 'альбом', artist: 'артиста', label: 'лейбл',
  user: 'пользователя', comment: 'комментарий', playlist: 'плейлист',
};

const run = async (request: () => Promise<unknown>, onDone: () => void, success = 'Сохранено') => {
  try {
    await request();
    message.success(success);
    onDone();
  } catch (error) {
    message.error(apiError(error));
  }
};

function Overview() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get('/admin/stats').then(({data}) => setStats(data));
  }, []);

  if (!stats) return <Loader />;
  const t = stats.totals;
  const tiles: [string, number][] = [
    ['Пользователи', t.users], ['Слушатели за 30 дней', t.listeners30d], ['Прослушивания за 30 дней', t.listens30d],
    ['Треки', t.tracks], ['Альбомы', t.albums], ['Артисты', t.artists], ['Лейблы', t.labels], ['Плейлисты', t.playlists],
  ];

  return (
    <>
      <Row gutter={[16, 16]}>
        {tiles.map(([title, value]) => (
          <Col key={title} xs={12} md={6}><Card size="small" className="dark:!bg-gray-800"><Statistic title={title} value={value} /></Card></Col>
        ))}
      </Row>
      <Row gutter={[24, 24]} className="!mt-6">
        <Col xs={24} lg={12}>
          <DailyBarChart title="Прослушивания по дням" data={stats.daily.map((d) => ({day: d.day, value: d.listens}))} />
        </Col>
        <Col xs={24} lg={12}>
          <DailyBarChart title="Новые пользователи по дням" data={stats.daily.map((d) => ({day: d.day, value: d.newUsers}))} />
        </Col>
      </Row>
      <Typography.Title level={5} className="!mt-6 dark:!text-gray-200">Топ треков за 30 дней</Typography.Title>
      <List
        size="small"
        dataSource={stats.topTracks}
        locale={{emptyText: 'Пока нет прослушиваний'}}
        renderItem={(track, index) => (
          <List.Item extra={<span className="dark:!text-gray-300">{track.listens}</span>}>
            <span className="dark:!text-gray-200">{index + 1}. <Link href={`/tracks/${track._id}`}>{track.name}</Link> — {track.artist}</span>
          </List.Item>
        )}
      />
    </>
  );
}

function Users() {
  const {user: me} = useAuth();
  const [query, setQuery] = useState('');
  const [data, setData] = useState<{ users: AdminUser[]; total: number }>({users: [], total: 0});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api.get('/admin/users', {params: {query, offset: (page - 1) * 50}})
      .then(({data}) => setData(data))
      .finally(() => setLoading(false));
  }, [query, page]);

  useEffect(load, [load]);

  const patch = (id: string, body: Record<string, unknown>, success?: string) =>
    run(() => api.patch(`/admin/users/${id}`, body), load, success);

  return (
    <>
      <div className="!mb-4"><DebouncedSearch onSearch={(q) => {
        setPage(1);
        setQuery(q);
      }} placeholder="Почта или имя" /></div>
      <Table
        rowKey="_id"
        loading={loading}
        dataSource={data.users}
        scroll={{x: true}}
        pagination={{current: page, pageSize: 50, total: data.total, onChange: setPage}}
        columns={[
          {
            title: 'Пользователь', render: (_, u: AdminUser) => (
              <div>
                <div>{u.displayName} {u.banned && <Tag color="red">заблокирован</Tag>}</div>
                <Typography.Text type="secondary" className="!text-xs">{u.email}</Typography.Text>
              </div>
            ),
          },
          {
            title: 'Роль', render: (_, u: AdminUser) => (
              <Space direction="vertical" size={2}>
                <Select
                  size="small"
                  value={u.role}
                  disabled={u._id === me?._id}
                  className="!w-[150px]"
                  options={(['user', 'label', 'admin'] as Role[]).map((r) => ({value: r, label: ROLE_NAMES[r]}))}
                  onChange={(role) => Modal.confirm({
                    title: `Сменить роль на «${ROLE_NAMES[role]}»?`,
                    content: role === 'label'
                      ? 'Для пользователя будет создан лейбл (если его нет). Для управления каталогом ему понадобится включить 2FA.'
                      : role === 'admin' ? 'Администратор получит полный доступ ко всему.' : undefined,
                    okText: 'Сменить',
                    cancelText: 'Отмена',
                    onOk: () => patch(u._id, {role}, 'Роль изменена'),
                  })}
                />
                {u.label && <Typography.Text type="secondary" className="!text-xs">{u.label.name}</Typography.Text>}
              </Space>
            ),
          },
          {
            title: 'Почта', render: (_, u: AdminUser) => (
              <Switch size="small" checked={u.emailVerified} checkedChildren="подтв." unCheckedChildren="нет"
                onChange={(emailVerified) => patch(u._id, {emailVerified})} />
            ),
          },
          {
            title: '2FA', render: (_, u: AdminUser) => u.totpEnabled ? (
              <Popconfirm title="Сбросить 2FA?" description="Нужно, если пользователь потерял телефон и резервные коды"
                okText="Сбросить" cancelText="Отмена" onConfirm={() => patch(u._id, {resetTotp: true}, '2FA сброшена')}>
                <Tag color="green" className="!cursor-pointer">вкл · сбросить</Tag>
              </Popconfirm>
            ) : <Tag>выкл</Tag>,
          },
          {title: 'Создан', render: (_, u: AdminUser) => new Date(u.createdAt).toLocaleDateString('ru-RU')},
          {
            title: '', render: (_, u: AdminUser) => u._id === me?._id ? null : (
              <Popconfirm title={u.banned ? 'Разблокировать?' : 'Заблокировать? Все его сессии завершатся'}
                okText="Да" cancelText="Отмена" onConfirm={() => patch(u._id, {banned: !u.banned})}>
                <Button size="small" danger={!u.banned}>{u.banned ? 'Разблокировать' : 'Заблокировать'}</Button>
              </Popconfirm>
            ),
          },
        ]}
      />
    </>
  );
}

function Labels() {
  const [labels, setLabels] = useState<AdminLabel[]>([]);
  const [editing, setEditing] = useState<{ open: boolean; label: AdminLabel | null }>({open: false, label: null});
  const [userOptions, setUserOptions] = useState<{ value: string; label: string }[]>([]);
  const [form] = Form.useForm();

  const load = useCallback(() => {
    api.get('/admin/labels').then(({data}) => setLabels(data));
  }, []);

  useEffect(load, [load]);

  const searchUsers = (query: string) => {
    api.get('/admin/users', {params: {query}}).then(({data}) => setUserOptions(
      data.users.filter((u: AdminUser) => u.role !== 'admin')
        .map((u: AdminUser) => ({value: u._id, label: `${u.displayName} · ${u.email}`})),
    ));
  };

  const open = (label: AdminLabel | null) => {
    setEditing({open: true, label});
    setUserOptions(label?.owner ? [{value: label.owner._id, label: `${label.owner.displayName} · ${label.owner.email}`}] : []);
    form.setFieldsValue({name: label?.name ?? '', description: label?.description ?? '', ownerId: label?.owner?._id});
  };

  const save = async () => {
    const values = await form.validateFields();
    const body = {...values, ownerId: values.ownerId ?? ''};
    await run(
      () => editing.label ? api.patch(`/admin/labels/${editing.label._id}`, body) : api.post('/admin/labels', body),
      () => {
        setEditing({open: false, label: null});
        load();
      },
    );
  };

  return (
    <>
      <Alert className="!mb-4" type="info" showIcon
        message="Владелец лейбла получает роль «Лейбл» и управляет артистами лейбла в студии. Прежний владелец становится обычным пользователем." />
      <Button type="primary" icon={<PlusOutlined />} className="!mb-3" onClick={() => open(null)}>Новый лейбл</Button>
      <Table rowKey="_id" dataSource={labels} pagination={false} scroll={{x: true}} columns={[
        {title: 'Лейбл', dataIndex: 'name'},
        {title: 'Владелец', render: (_, l: AdminLabel) => l.owner ? `${l.owner.displayName} · ${l.owner.email}` : <Tag>нет</Tag>},
        {title: 'Артистов', dataIndex: 'artistsCount'},
        {
          title: '', render: (_, l: AdminLabel) => (
            <Space>
              <Button size="small" icon={<EditOutlined />} onClick={() => open(l)} />
              <Popconfirm title="Удалить лейбл?" description="Артисты останутся, но без лейбла; владелец станет обычным пользователем"
                okText="Удалить" cancelText="Отмена" onConfirm={() => run(() => api.delete(`/admin/labels/${l._id}`), load, 'Удалено')}>
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          ),
        },
      ]} />
      <Modal open={editing.open} title={editing.label ? 'Лейбл' : 'Новый лейбл'} okText="Сохранить" cancelText="Отмена"
        onOk={save} onCancel={() => setEditing({open: false, label: null})}>
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item name="name" label="Название" rules={[{required: true, message: 'Укажите название'}]}><Input maxLength={128} /></Form.Item>
          <Form.Item name="description" label="Описание"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="ownerId" label="Владелец" extra="Начните вводить почту или имя">
            <Select showSearch allowClear filterOption={false} onSearch={searchUsers} options={userOptions}
              placeholder="Без владельца" notFoundContent="Никого не нашли" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

type AdminComment = IComment & { track: { _id: string; name: string } | null; album: { _id: string; name: string } | null };

function Comments() {
  const [comments, setComments] = useState<AdminComment[]>([]);
  const load = useCallback(() => {
    api.get('/comments').then(({data}) => setComments(data));
  }, []);
  useEffect(load, [load]);

  return (
    <List
      dataSource={comments}
      locale={{emptyText: 'Комментариев нет'}}
      renderItem={(c) => (
        <List.Item actions={[
          <Popconfirm key="d" title="Удалить комментарий?" okText="Удалить" cancelText="Отмена"
            onConfirm={() => run(() => api.delete(`/comments/${c._id}`), load, 'Удалено')}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>,
        ]}>
          <List.Item.Meta
            title={<span className="dark:!text-gray-200">{c.username} {c.guest && <Tag>гость</Tag>}
              <Typography.Text type="secondary" className="!text-xs !ml-2">
                {c.track && <>к треку <Link href={`/tracks/${c.track._id}`}>{c.track.name}</Link></>}
                {c.album && <>к альбому <Link href={`/albums/${c.album._id}`}>{c.album.name}</Link></>}
                {c.createdAt && ` · ${new Date(c.createdAt).toLocaleString('ru-RU')}`}
              </Typography.Text>
            </span>}
            description={<span className="dark:!text-gray-300">{c.text}</span>}
          />
        </List.Item>
      )}
    />
  );
}

function Audit() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  useEffect(() => {
    api.get('/admin/audit').then(({data}) => setEntries(data));
  }, []);

  const describe = (e: AuditEntry) => {
    const name = (e.details.name ?? e.details.email ?? e.details.text ?? '') as string;
    const roles = e.action === 'change_role' ? ` (${ROLE_NAMES[e.details.from as Role]} → ${ROLE_NAMES[e.details.to as Role]})` : '';
    return `${ACTIONS[e.action] ?? e.action} ${ENTITIES[e.entityType] ?? e.entityType}${name ? ` «${name}»` : ''}${roles}`;
  };

  return (
    <Table rowKey="_id" dataSource={entries} pagination={{pageSize: 50}} scroll={{x: true}} columns={[
      {title: 'Когда', render: (_, e: AuditEntry) => new Date(e.createdAt).toLocaleString('ru-RU')},
      {title: 'Кто', render: (_, e: AuditEntry) => e.user ? e.user.displayName : '—'},
      {title: 'Что', render: (_, e: AuditEntry) => describe(e)},
    ]} />
  );
}

export default function AdminPage() {
  const {user, ready} = useRequireUser('admin');

  if (!ready) return (<><Header /><Loader /></>);

  return (
    <>
      <Header />
      <div className="!max-w-[1200px] !mx-auto !px-3 sm:!px-5 !py-6 !mb-10">
        <Typography.Title level={2} className="!text-[#32c2ce] dark:!text-cyan-400">Админка</Typography.Title>
        {!user?.totpEnabled ? (
          <Alert type="error" showIcon message="Включите двухфакторную аутентификацию в профиле — без неё админка недоступна"
            action={<Link href="/profile">Профиль</Link>} />
        ) : (
          <Card className="!rounded-xl !shadow-lg dark:!bg-gray-800 dark:!border-gray-700">
            <Typography.Paragraph type="secondary" className="dark:!text-gray-400">
              Треки, альбомы и артисты всего каталога редактируются в <Link href="/studio">студии</Link>.
            </Typography.Paragraph>
            <Tabs destroyOnHidden items={[
              {key: 'overview', label: 'Обзор', children: <Overview />},
              {key: 'users', label: 'Пользователи', children: <Users />},
              {key: 'labels', label: 'Лейблы', children: <Labels />},
              {key: 'comments', label: 'Комментарии', children: <Comments />},
              {key: 'audit', label: 'Журнал', children: <Audit />},
            ]} />
          </Card>
        )}
      </div>
    </>
  );
}
