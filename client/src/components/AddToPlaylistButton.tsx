'use client';

import {useState} from 'react';
import {Button, Dropdown, Input, message, Modal, Tooltip} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {api, apiError} from '@/src/shared/api';
import usePlaybackGuard from '@/src/hooks/usePlaybackGuard';
import {IPlaylist} from '@/src/types/album';

type AddToPlaylistButtonProps = {
  trackId: string;
  size?: 'small' | 'middle' | 'large';
};

// Список своих плейлистов подгружается при открытии меню
export default function AddToPlaylistButton({trackId, size = 'middle'}: AddToPlaylistButtonProps) {
  const guard = usePlaybackGuard();
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const loadPlaylists = async () => {
    const {data} = await api.get('/playlists/my');
    setPlaylists(data.filter((playlist: IPlaylist) => !playlist.artist));
  };

  const add = async (playlistId: string, name: string) => {
    try {
      await api.post(`/playlists/${playlistId}/tracks`, {trackId});
      message.success(`Добавлено в «${name}»`);
    } catch (error) {
      message.error(apiError(error, 'Не удалось добавить трек'));
    }
  };

  const createAndAdd = async () => {
    if (!newName.trim()) return;
    try {
      const form = new FormData();
      form.append('name', newName.trim());
      const {data} = await api.post('/playlists', form);
      await add(data._id, data.name);
      setCreating(false);
      setNewName('');
    } catch (error) {
      message.error(apiError(error, 'Не удалось создать плейлист'));
    }
  };

  const items = [
    ...playlists.map((playlist) => ({
      key: playlist._id,
      label: playlist.name,
      onClick: () => add(playlist._id, playlist.name),
    })),
    ...(playlists.length ? [{type: 'divider' as const}] : []),
    {key: 'new', label: 'Новый плейлист…', icon: <PlusOutlined />, onClick: () => setCreating(true)},
  ];

  return (
    <>
      <Dropdown
        menu={{items}}
        trigger={['click']}
        open={open}
        onOpenChange={async (next) => {
          if (next) {
            if (!guard('создавать плейлисты')) return;
            await loadPlaylists();
          }
          setOpen(next);
        }}
      >
        <Tooltip title="Добавить в плейлист">
          <Button
            type="text"
            size={size}
            icon={<PlusOutlined className="!text-gray-500 dark:!text-gray-400" />}
            onClick={(e) => e.stopPropagation()}
            aria-label="Добавить в плейлист"
            className="!border-none !shadow-none"
          />
        </Tooltip>
      </Dropdown>
      <Modal
        open={creating}
        title="Новый плейлист"
        okText="Создать и добавить"
        cancelText="Отмена"
        onOk={createAndAdd}
        onCancel={() => setCreating(false)}
      >
        <Input
          autoFocus
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Название"
          onPressEnter={createAndAdd}
          maxLength={128}
        />
      </Modal>
    </>
  );
}
